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
export default class CustomShaderMaterial extends Material {
  uniforms: { [key: string]: IUniform<any> }
  private customPatchMap: CSMPatchMap

  constructor({ baseMaterial, fragmentShader, vertexShader, uniforms, patchMap, cacheKey, ...opts }: iCSMParams) {
    const base = isConstructor(baseMaterial) ? new baseMaterial(opts) : baseMaterial
    super()
    this.uniforms = uniforms || {}
    this.customPatchMap = patchMap || {}

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

  update({ fragmentShader, vertexShader, uniforms, cacheKey }: iCSMUpdateParams) {
    const serializedUniforms = Object.values(uniforms || {}).forEach(({ value }) => {
      return JSON.stringify(value)
    })

    this.uuid = cacheKey?.() || hash([fragmentShader, vertexShader, serializedUniforms])
    this.generateMaterial({ fragmentShader, vertexShader, uniforms })
  }

  private generateMaterial({ fragmentShader, vertexShader, uniforms }: iCSMUpdateParams) {
    const parsedFragmentShdaer = this.parseShader(fragmentShader)
    const parsedVertexShdaer = this.parseShader(vertexShader)

    this.uniforms = uniforms || {}
    this.customProgramCacheKey = () => {
      return this.uuid
    }

    this.onBeforeCompile = (shader) => {
      if (parsedFragmentShdaer) {
        const patchedFragmentShdaer = this.patchShader(parsedFragmentShdaer, shader.fragmentShader)
        shader.fragmentShader = patchedFragmentShdaer
      }
      if (parsedVertexShdaer) {
        const patchedVertexShdaer = this.patchShader(parsedVertexShdaer, shader.vertexShader)

        shader.vertexShader = '#define IS_VERTEX;\n' + patchedVertexShdaer
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
      ...this.customPatchMap,
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
            vec3 csm_Position;
            vec4 csm_PositionRaw;
            vec3 csm_Normal;
            vec3 csm_Emissive;

            #ifdef IS_VERTEX
              csm_Position = position;
              csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(position, 1.);
            #endif

            #ifdef IS_VERTEX
              csm_Normal = normal;
            #endif
            
            #ifndef IS_VERTEX
              #ifdef STANDARD
                csm_Emissive = emissive;
              #endif
            #endif

            vec4 csm_DiffuseColor = vec4(1., 0., 0., 1.);
            vec4 csm_FragColor = vec4(1., 0., 0., 1.);
            float csm_PointSize = 1.;

            ${customShader.main}
          `
    )

    patchedShader = customShader.defines + patchedShader
    return patchedShader
  }

  private parseShader(shader?: string): iCSMShader | undefined {
    if (!shader) return

    const s = shader.replace(/\/\*\*(.*?)\*\/|\/\/(.*?);/gm, '')
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
