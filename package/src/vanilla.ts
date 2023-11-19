import objectHash from 'object-hash'
import * as THREE from 'three'

import { defaultAvailabilityMap, defaultPatchMap, expansionMaps, keywordMap, shaderMaterial_PatchMap } from './maps'
import {
  defaultCsmDefinitions,
  defaultCsmMainDefinitions,
  defaultFragDefinitions,
  defaultFragMain,
  defaultVertDefinitions,
  defaultVertMain,
} from './shaders'
import { MaterialConstructor, Uniform, iCSMInternals, iCSMParams, iCSMPatchMap, iCSMUpdateParams } from './types'

const hash = (obj: any) =>
  objectHash(obj, {
    excludeValues: true,
  })

const replaceAll = (str: string, find: string, rep: string) => str.split(find).join(rep)
const escapeRegExpMatch = function (s: string) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
const isExactMatch = (str: string, match: string) => {
  return new RegExp(`\\b${escapeRegExpMatch(match)}\\b`).test(str)
}

// Hacky, yikes!
function isConstructor<T extends MaterialConstructor>(f: T | InstanceType<T>): f is T {
  try {
    // @ts-ignore
    new f()
  } catch (err) {
    if ((err as any).message.indexOf('is not a constructor') >= 0) {
      return false
    }
  }
  return true
}

function copyObject(target: any, source: any, silent = false) {
  Object.assign(target, source)

  const proto = Object.getPrototypeOf(source)
  Object.entries(Object.getOwnPropertyDescriptors(proto))
    .filter((e: any) => {
      const isGetter = typeof e[1].get === 'function'
      const isSetter = typeof e[1].set === 'function'
      const isFunction = typeof e[1].value === 'function'
      const isConstructor = e[0] === 'constructor'

      return (isGetter || isSetter || isFunction) && !isConstructor
    })
    .forEach((val) => {
      // If function exists on target, rename it with "base_" prefix
      if (typeof target[val[0]] === 'function') {
        if (!silent) {
          console.warn(`Function ${val[0]} already exists on CSM. Overriding.`)
        }
        return
      }

      Object.defineProperty(target, val[0], val[1])
    })
}

function isFunctionEmpty(fn: Function) {
  const fnString = fn.toString().trim()
  const fnBody = fnString.substring(fnString.indexOf('{') + 1, fnString.lastIndexOf('}'))
  return fnBody.trim().length === 0
}

function stripSpaces(str?: string) {
  return str ? str.replace(/\s/g, '') : undefined
}

function replaceLastOccurrence(str: string, find: string, rep: string) {
  const index = str.lastIndexOf(find)
  if (index === -1) {
    return str
  }

  return str.substring(0, index) + rep + str.substring(index + find.length)
}

export default class CustomShaderMaterial<T extends MaterialConstructor> extends THREE.Material {
  uniforms: Uniform
  private __csm: iCSMInternals<T>

  constructor({
    baseMaterial, //
    fragmentShader,
    vertexShader,
    uniforms,
    patchMap,
    cacheKey,
    silent,
    ...opts
  }: iCSMParams<T>) {
    // Find if the shader includes clearcoatKeywords
    // if it does we need to set clearcoat to 0
    // as that makes Three append the USE_CLEARCOAT define
    const clearcoatKeywords = [keywordMap.clearcoat, keywordMap.clearcoatNormal, keywordMap.clearcoatRoughness]
    const hasClearcoatKeywords =
      clearcoatKeywords.some((keyword) => {
        return (
          (fragmentShader && isExactMatch(fragmentShader, keyword)) ||
          (vertexShader && isExactMatch(vertexShader, keyword))
        )
      }) &&
      // @ts-ignore
      opts.clearcoat === undefined

    if (hasClearcoatKeywords) {
      Object.assign(opts, {
        clearcoat: 0.00001,
      })
    }

    let base: THREE.Material
    if (isConstructor(baseMaterial)) {
      // If base material is a constructor, instantiate it
      base = new baseMaterial(opts)
    } else {
      // Else, copy options onto base material and use the already create
      // instance as the base material
      base = baseMaterial
      Object.assign(base, opts)
    }

    // Supporting RawShaderMaterial is redundant as there is nothing
    // to patch, extend or override
    if (base.type === 'RawShaderMaterial') {
      throw new Error('CustomShaderMaterial does not support RawShaderMaterial')
    }

    // Copy all properties from base material onto this material
    // Rename any functions that already exist on this material with "base_" prefix
    super()
    copyObject(this, base, silent)

    // Set up private internals
    this.__csm = {
      patchMap: patchMap || {},
      fragmentShader: fragmentShader || '',
      vertexShader: vertexShader || '',
      cacheKey: cacheKey,
      baseMaterial: baseMaterial,
      instanceID: THREE.MathUtils.generateUUID(),
      type: base.type,
      isAlreadyExtended: !isFunctionEmpty(base.onBeforeCompile),
      cacheHash: ``,
      silent: silent,
    }

    this.uniforms = {
      // ThreeJS types don't expose uniforms for internal materials however,
      // they still seem to be accessible. This is also important for extending
      // ShaderMaterial
      // @ts-expect-error
      ...(this.uniforms || {}),
      ...(uniforms || {}),
    }

    // Scoped to avoid name collisions
    {
      // Generate material and assign cache key
      const { fragmentShader, vertexShader } = this.__csm
      const uniforms = this.uniforms

      this.__csm.cacheHash = this._getCacheHash()
      this._generateMaterial(fragmentShader, vertexShader, uniforms)
    }
  }

  /**
   *
   * Update the material with new arguments.
   * TODO: Fix memory leak.
   *
   * @param opts Options to update the material with.
   *
   * @deprecated This method leaks memory.
   */
  update(opts: iCSMUpdateParams<T> = {}) {
    // Basically just re-run the last bit of the constructor
    this.uniforms = opts.uniforms || this.uniforms
    Object.assign(this.__csm, opts)

    const { fragmentShader, vertexShader } = this.__csm
    const uniforms = this.uniforms

    const newHash = this._getCacheHash()

    this.__csm.cacheHash = newHash
    this._generateMaterial(fragmentShader, vertexShader, uniforms)
  }

  /**
   * Returns a new instance of this material with the same options.
   *
   * @returns A clone of this material.
   */
  clone() {
    const opts = {
      baseMaterial: this.__csm.baseMaterial,
      fragmentShader: this.__csm.fragmentShader,
      vertexShader: this.__csm.vertexShader,
      uniforms: this.uniforms,
      silent: this.__csm.silent,
      patchMap: this.__csm.patchMap,
      cacheKey: this.__csm.cacheKey,
    }

    const clone = new (this.constructor as new (opts: iCSMParams<T>) => this)(opts)
    Object.assign(this, clone)
    return clone
  }

  /**
   * Internally calculates the cache key for this instance of CSM.
   * If no specific CSM inputs are provided, the cache key is the same as the default
   * cache key, i.e. `baseMaterial.onBeforeCompile.toString()`. Not meant to be called directly.
   *
   * This method is quite expensive owing to the hashing function and string manip.
   *
   * TODO:
   * - Optimize string manip.
   * - Find faster hash function
   *
   * @returns {string} A cache key for this instance of CSM.
   */
  private _getCacheHash() {
    // The cache key is a hash of the fragment shader, vertex shader, and uniforms
    const { fragmentShader, vertexShader } = this.__csm
    const uniforms = this.uniforms

    // We strip spaces because whitespace is not significant in GLSL
    // and we want `blah` and `     blah ` to be the same.
    const hashInp = [stripSpaces(fragmentShader), stripSpaces(vertexShader), uniforms].filter(
      (inp) => inp !== undefined
    )

    // If CSM inputs are empty, use default cache key
    // This means that `<baseMaterial />` and <CSM baseMaterial={baseMaterial} />`
    // are the same shader program, i.e they share the same cache key
    return hashInp.length > 0 ? hash(hashInp) : this.customProgramCacheKey()
  }

  /**
   * Does the internal shader generation. Not meant to be called directly.
   *
   * @param fragmentShader
   * @param vertexShader
   * @param uniforms
   */
  private _generateMaterial(fragmentShader: string, vertexShader: string, uniforms: Uniform) {
    // Get parsed shaders. A Parsed shader is a shader with
    // it's `#define`s, function and var definitions and main separated.
    this.uniforms = uniforms || {}

    // Set material cache key
    this.customProgramCacheKey = () => {
      return this.__csm.cacheHash
    }

    // Set onBeforeCompile
    const customOnBeforeCompile = (shader: THREE.Shader) => {
      try {
        const materialDefine = this._getMaterialDefine()

        // If Fragment shader is not empty, patch it
        if (fragmentShader) {
          const patchedFragmentShader = this._patchShader(fragmentShader, shader.fragmentShader, true)
          shader.fragmentShader = materialDefine + patchedFragmentShader
        }

        // If Vertex shader is not empty, patch it
        if (vertexShader) {
          const patchedVertexShader = this._patchShader(vertexShader, shader.vertexShader)

          shader.vertexShader = '#define IS_VERTEX;\n' + patchedVertexShader
          shader.vertexShader = materialDefine + shader.vertexShader
        }

        // Patch uniforms
        shader.uniforms = { ...shader.uniforms, ...this.uniforms }
        this.uniforms = shader.uniforms
      } catch (error) {
        console.error(error)
      }
    }

    if (this.__csm.isAlreadyExtended) {
      // If the material has already been extending via onBeforeCompile has a
      // then chain the new onBeforeCompile after the old one.
      const prevOnBeforeCompile = this.onBeforeCompile
      this.onBeforeCompile = (shader: THREE.Shader, renderer) => {
        prevOnBeforeCompile(shader, renderer)
        customOnBeforeCompile(shader)
      }
    } else {
      // Else just set the onBeforeCompile
      this.onBeforeCompile = customOnBeforeCompile
    }

    this.needsUpdate = true
  }

  /**
   * Patches input shader with custom shader. Not meant to be called directly.
   * @param customShader
   * @param shader
   * @param isFrag
   * @returns
   */
  private _patchShader(customShader: string, currentShader: string, isFrag?: boolean): string {
    let patchedShader = currentShader

    // Get the patch map, its a combination of the default patch map and the
    // user defined patch map. The user defined map takes precedence.
    const patchMap: iCSMPatchMap = {
      ...this._getPatchMapForMaterial(),
      ...this.__csm.patchMap,
    }

    // Apply expansion maps as some substitutions require 2 replacements within
    // one include, which is not possible without expanding the includes.
    Object.entries(expansionMaps).forEach(([key, value]) => {
      patchedShader = replaceAll(patchedShader, key, value)
    })

    // Replace all entries in the patch map
    Object.keys(patchMap).forEach((name: string) => {
      Object.keys(patchMap[name]).forEach((key) => {
        const availableIn = defaultAvailabilityMap[name]
        const type = this.__csm.type

        // Only inject keywords that appear in the shader.
        // If the keyword is '*', then inject the patch regardless.
        if (name === '*' || isExactMatch(customShader, name)) {
          if (!availableIn || (Array.isArray(availableIn) && availableIn.includes(type)) || availableIn === '*') {
            patchedShader = replaceAll(patchedShader, key, patchMap[name][key])
          } else {
            throw new Error(`CSM: ${name} is not available in ${type}. Shader cannot compile.`)
          }
        }
      })
    })

    // Rename main in customShader to csm__main
    const csmMainFunctionName = '_csm_main_' + this.__csm.instanceID.replace(/-/g, '_')
    const renamedCustomShader = customShader.replace(/void\s+main\s*\(\s*\)/g, `void ${csmMainFunctionName}()`)

    const isAlreadyExtendedByCSM = patchedShader.includes('// #_CSM_#')

    if (isAlreadyExtendedByCSM && this.__csm.isAlreadyExtended) {
      // Inject defaults
      // If the shader has already been extended by CSM
      // then we don't need to inject the defaults again.
      patchedShader = patchedShader.replace(
        'void main() {',
        `
          ${renamedCustomShader}
          
          void main() {
        `
      )

      // Find the end of the previously injected main call
      // and add the new main call after it.
      patchedShader = replaceLastOccurrence(
        patchedShader,
        '// #_CSM_#',
        `
          ${csmMainFunctionName}();
          // #_CSM_#
        `
      )
    } else {
      // If this is the first time the shader is being extended by CSM
      // Add the default definitions and main call
      patchedShader = patchedShader.replace(
        'void main() {',
        `
          #ifndef CSM_IS_HEAD_DEFAULTS_DEFINED
            ${isFrag ? defaultFragDefinitions : defaultVertDefinitions}
            #define CSM_IS_HEAD_DEFAULTS_DEFINED 1
          #endif
  
          ${defaultCsmDefinitions}
  
          ${renamedCustomShader}
          
          void main() {
            #ifndef CSM_IS_DEFAULTS_DEFINED
              ${defaultCsmMainDefinitions}
              #define CSM_IS_DEFAULTS_DEFINED 1
            #endif
            
            #ifndef CSM_IS_MAIN_DEFAULTS_DEFINED
              ${isFrag ? defaultFragMain : defaultVertMain}
              #define CSM_IS_MAIN_DEFAULTS_DEFINED 1
            #endif

            ${csmMainFunctionName}();
            // #_CSM_#
        `
      )
    }

    return patchedShader
  }

  /**
   * Gets the material type as a string. Not meant to be called directly.
   * @returns
   */
  private _getMaterialDefine() {
    const type = this.__csm.type
    return type ? `#define IS_${type.toUpperCase()};\n` : `#define IS_UNKNOWN;\n`
  }

  /**
   * Gets the right patch map for the material. Not meant to be called directly.
   * @returns
   */
  private _getPatchMapForMaterial() {
    switch (this.__csm.type) {
      case 'ShaderMaterial':
        return shaderMaterial_PatchMap

      default:
        return defaultPatchMap
    }
  }
}

export * from './types'
