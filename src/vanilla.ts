import { IUniform, Material } from 'three'
import hash from 'object-hash'
import { iCSMUpdateParams, iCSMShader, iCSMParams, CSMPatchMap, CSMBaseMaterial } from './types'

import PATCH_MAP from './patchMaps'

// @ts-ignore
import tokenize from 'glsl-tokenizer'
// @ts-ignore
import stringify from 'glsl-token-string'
// @ts-ignore
import tokenFunctions from 'glsl-token-functions'

const replaceAll = (str: string, find: string, rep: string) => str.split(find).join(rep)
const escapeRegExpMatch = function (s: string) {
  return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
}
const isExactMatch = (str: string, match: string) => {
  return new RegExp(`\\b${escapeRegExpMatch(match)}\\b`).test(str)
}

function isConstructor(f: CSMBaseMaterial): f is new (opts: { [key: string]: any }) => THREE.Material {
  try {
    // @ts-ignore
    new f()
  } catch (err: any) {
    if (err.message.indexOf('is not a constructor') >= 0) {
      return false
    }
  }
  return true
}

export * from './types'
export default class CustomShaderMaterial extends Material {
  uniforms: { [key: string]: IUniform<any> }

  private _customPatchMap: CSMPatchMap
  private _fs: string
  private _vs: string
  private _base: CSMBaseMaterial

  constructor({ baseMaterial, fragmentShader, vertexShader, uniforms, patchMap, cacheKey, ...opts }: iCSMParams) {
    let base: THREE.Material
    if (isConstructor(baseMaterial)) {
      base = new baseMaterial(opts)
    } else {
      base = baseMaterial
      Object.assign(base, opts)
    }

    super()
    this.uniforms = uniforms || {}
    this._customPatchMap = patchMap || {}
    this._fs = fragmentShader || ''
    this._vs = vertexShader || ''
    this._base = baseMaterial

    for (const key in base) {
      let k = key
      if (key.startsWith('_')) {
        k = key.split('_')[1]
      }

      // @ts-ignore
      if (this[k] === undefined) this[k] = 0
      // @ts-ignore
      this[k] = base[k]
    }

    this.update({ fragmentShader, vertexShader, uniforms, cacheKey })
  }

  update(opts?: Partial<iCSMUpdateParams>) {
    const uniforms = opts?.uniforms || {}
    const fragmentShader = opts?.fragmentShader || this._fs
    const vertexShader = opts?.vertexShader || this._vs

    const serializedUniforms = Object.values(uniforms).reduce((prev, { value }) => {
      return prev + JSON.stringify(value)
    }, '')

    this.uuid = opts?.cacheKey?.() || hash([fragmentShader, vertexShader, serializedUniforms])
    this.generateMaterial({
      fragmentShader,
      vertexShader,
      uniforms,
    })
  }

  clone() {
    // @ts-ignore
    return new this.constructor({
      baseMaterial: this._base,
    }).copy(this)
  }

  private generateMaterial({ fragmentShader, vertexShader, uniforms }: Omit<iCSMUpdateParams, 'cacheKey'>) {
    const parsedFragmentShader = this.parseShader(fragmentShader)
    const parsedVertexShader = this.parseShader(vertexShader)

    this.uniforms = uniforms || {}
    this.customProgramCacheKey = () => {
      return this.uuid
    }

    this.onBeforeCompile = (shader) => {
      if (parsedFragmentShader) {
        const patchedFragmentShader = this.patchShader(parsedFragmentShader, shader.fragmentShader)
        shader.fragmentShader = patchedFragmentShader
      }
      if (parsedVertexShader) {
        const patchedVertexShader = this.patchShader(parsedVertexShader, shader.vertexShader)

        shader.vertexShader = '#define IS_VERTEX;\n' + patchedVertexShader
      }

      shader.uniforms = { ...shader.uniforms, ...this.uniforms }
      this.uniforms = shader.uniforms
    }
    this.needsUpdate = true
  }

  private patchShader(customShader: iCSMShader, shader: string): string {
    let patchedShader: string = shader

    const patchMap: CSMPatchMap = {
      ...PATCH_MAP,
      ...this._customPatchMap,
    }

    Object.keys(patchMap).forEach((name: string) => {
      Object.keys(patchMap[name]).forEach((key) => {
        if (isExactMatch(customShader.main, name)) {
          patchedShader = replaceAll(patchedShader, key, patchMap[name][key])
        }
      })
    })

    patchedShader = patchedShader.replace(
      'void main() {',
      `
          ${customShader.header}
          void main() {
            #ifdef IS_VERTEX
              vec3 csm_Position = position;
              vec4 csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(position, 1.);
              vec3 csm_Normal = normal;
              float csm_PointSize = 1.;
            #else 
              #ifdef STANDARD
                vec3 csm_Emissive = emissive;
              #endif
              
              vec4 csm_DiffuseColor = vec4(1., 0., 0., 1.);
              vec4 csm_FragColor = vec4(1., 0., 0., 1.);
            #endif

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
