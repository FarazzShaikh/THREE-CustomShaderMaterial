import objectHash from 'object-hash'
import * as THREE from 'three'
import { defaultPatchMap, shaderMaterial_PatchMap } from './patchMaps'
// @ts-ignore
import tokenize from 'glsl-tokenizer'
// @ts-ignore
import stringify from 'glsl-token-string'
// @ts-ignore
import tokenFunctions from 'glsl-token-functions'

import { defaultDefinitions } from './shaders'
import {
  iCSMPatchMap,
  iCSMInternals,
  iCSMParams,
  iCSMShader,
  iCSMUpdateParams,
  MaterialConstructor,
  Uniform,
} from './types'

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

function copyObject(target: any, source: any) {
  Object.assign(target, source)

  const proto = Object.getPrototypeOf(source)
  Object.entries(Object.getOwnPropertyDescriptors(proto))
    .filter((e: any) => typeof e[1].get === 'function' && e[0] !== '__proto__')
    .forEach((val) => {
      Object.defineProperty(target, val[0], val[1])
    })
}

function isFunctionEmpty(fn: Function) {
  const fnString = fn.toString().trim()
  const fnBody = fnString.substring(fnString.indexOf('{') + 1, fnString.lastIndexOf('}'))
  return fnBody.trim().length === 0
}

function stripSpaces(str: string) {
  return str.replace(/\s/g, '')
}

export default class CustomShaderMaterial<
  T extends MaterialConstructor = typeof THREE.Material
> extends THREE.Material {
  uniforms: Uniform
  private __csm: iCSMInternals<T>

  constructor({
    baseMaterial, //
    fragmentShader,
    vertexShader,
    uniforms,
    patchMap,
    cacheKey,
    ...opts
  }: iCSMParams<T>) {
    let base: THREE.Material
    if (isConstructor(baseMaterial)) {
      base = new baseMaterial(opts)
    } else {
      base = baseMaterial
      Object.assign(base, opts)
    }

    if (base.type === 'RawShaderMaterial') {
      throw new Error('CustomShaderMaterial does not support RawShaderMaterial')
    }

    super()
    copyObject(this, base)

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
    }
    this.uniforms = {
      // @ts-ignore
      ...(this.uniforms || {}),
      ...(uniforms || {}),
    }

    {
      const { fragmentShader, vertexShader, instanceID } = this.__csm
      const uniforms = this.uniforms

      this.__csm.cacheHash = this.getCacheHash()
      this.generateMaterial(fragmentShader, vertexShader, uniforms)
    }
  }

  private getCacheHash() {
    const { fragmentShader, vertexShader, instanceID } = this.__csm
    const uniforms = this.uniforms

    const serializedUniforms = Object.values(uniforms).reduce((prev, { value }) => {
      return prev + JSON.stringify(value)
    }, '')

    return objectHash(stripSpaces(fragmentShader) + stripSpaces(vertexShader) + serializedUniforms)
  }

  update(opts: iCSMUpdateParams<T> = {}) {
    this.uniforms = opts.uniforms || this.uniforms
    copyObject(this.__csm, opts)

    const { fragmentShader, vertexShader } = this.__csm
    const uniforms = this.uniforms

    this.__csm.cacheHash = this.getCacheHash()
    this.generateMaterial(fragmentShader, vertexShader, uniforms)
  }

  clone() {
    const opts = {
      baseMaterial: this.__csm.baseMaterial,
      fragmentShader: this.__csm.fragmentShader,
      vertexShader: this.__csm.vertexShader,
      uniforms: this.uniforms,
      patchMap: this.__csm.patchMap,
      cacheKey: this.__csm.cacheKey,
    }

    const clone = new (this.constructor as new (opts: iCSMParams<T>) => this)(opts)
    Object.assign(this, clone)
    return clone
  }

  private generateMaterial(fragmentShader: string, vertexShader: string, uniforms: Uniform) {
    const parsedFragmentShader = this.parseShader(fragmentShader)
    const parsedVertexShader = this.parseShader(vertexShader)

    this.uniforms = uniforms || {}
    this.customProgramCacheKey = () => {
      return this.__csm.cacheHash
    }

    const customOnBeforeCompile = (shader: THREE.Shader) => {
      if (parsedFragmentShader) {
        const patchedFragmentShader = this.patchShader(parsedFragmentShader, shader.fragmentShader)
        shader.fragmentShader = this.getMaterialDefine() + patchedFragmentShader
      }
      if (parsedVertexShader) {
        const patchedVertexShader = this.patchShader(parsedVertexShader, shader.vertexShader)

        shader.vertexShader = '#define IS_VERTEX;\n' + patchedVertexShader
        shader.vertexShader = this.getMaterialDefine() + shader.vertexShader
      }

      shader.uniforms = { ...shader.uniforms, ...this.uniforms }
      this.uniforms = shader.uniforms
    }

    if (this.__csm.isAlreadyExtended) {
      const prevOnBeforeCompile = this.onBeforeCompile
      this.onBeforeCompile = (shader: THREE.Shader, renderer) => {
        prevOnBeforeCompile(shader, renderer)
        customOnBeforeCompile(shader)
      }
    } else {
      this.onBeforeCompile = customOnBeforeCompile
    }

    this.needsUpdate = true
  }

  private getMaterialDefine() {
    const type = this.__csm.type
    return type ? `#define IS_${type.toUpperCase()};\n` : `#define IS_UNKNOWN;\n`
  }

  private getPatchMapForMaterial() {
    switch (this.__csm.type) {
      case 'ShaderMaterial':
        return shaderMaterial_PatchMap

      default:
        return defaultPatchMap
    }
  }

  private patchShader(customShader: iCSMShader, shader: string): string {
    let patchedShader = shader
    const patchMap: iCSMPatchMap = {
      ...this.getPatchMapForMaterial(),
      ...this.__csm.patchMap,
    }

    Object.keys(patchMap).forEach((name: string) => {
      Object.keys(patchMap[name]).forEach((key) => {
        if (name === '*' || isExactMatch(customShader.main, name)) {
          patchedShader = replaceAll(patchedShader, key, patchMap[name][key])
        }
      })
    })

    patchedShader = patchedShader.replace(
      'void main() {',
      `
          ${customShader.header}
          void main() {
            ${defaultDefinitions}
            ${customShader.main}
          `
    )

    patchedShader = customShader.defines + patchedShader

    return patchedShader
  }

  private parseShader(shader?: string): iCSMShader | undefined {
    if (!shader) return

    // Strip comments
    const s = shader.replace(/\/\*\*(.*?)\*\/|\/\/(.*?)\n/gm, '')

    const tokens = tokenize(s)
    const funcs = tokenFunctions(tokens)
    const mainIndex = funcs
      .map((e: any) => {
        return e.name
      })
      .indexOf('main')
    const variables = stringify(tokens.slice(0, mainIndex >= 0 ? funcs[mainIndex].outer[0] : undefined))
    const mainBody = mainIndex >= 0 ? this.getShaderFromIndex(tokens, funcs[mainIndex].body) : ''

    return {
      defines: '',
      header: variables,
      main: mainBody,
    }
  }

  private getShaderFromIndex(tokens: any, index: number[]) {
    return stringify(tokens.slice(index[0], index[1]))
  }
}

export * from './types'
