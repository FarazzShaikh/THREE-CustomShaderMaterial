import * as THREE from 'three'

export type MaterialConstructor = new (opts: { [key: string]: any }) => THREE.Material
type MaterialParams<T extends MaterialConstructor> = ConstructorParameters<T>[0]

export interface iCSMPatchMap {
  [keyword: string]: {
    [toReplace: string]: string
  }
}

export type iCSMParams<T extends MaterialConstructor> = {
  baseMaterial: T | InstanceType<T>
  vertexShader?: string
  fragmentShader?: string
  cacheKey?: () => string
  patchMap?: iCSMPatchMap
  silent?: boolean
  uniforms?: { [key: string]: THREE.IUniform<any> }
} & (MaterialParams<T> extends undefined ? any : MaterialParams<T>)

export type iCSMUpdateParams<T extends MaterialConstructor> = Partial<Omit<iCSMParams<T>, 'baseMaterial'>>

export interface iCSMInternals<T extends MaterialConstructor> {
  patchMap: iCSMPatchMap
  fragmentShader: string
  vertexShader: string
  cacheKey: (() => string) | undefined
  baseMaterial: T | InstanceType<T>
  instanceID: string
  type: string
  isAlreadyExtended: boolean
  cacheHash: string
  silent?: boolean
}

export type Uniform = { [key: string]: THREE.IUniform<any> }

export interface iCSMShader {
  defines: string
  header: string
  main: string
}
