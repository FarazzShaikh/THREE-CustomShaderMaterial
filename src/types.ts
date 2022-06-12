import * as THREE from 'three'

export type AllMaterialParams = THREE.MeshPhongMaterialParameters &
  THREE.MeshPhysicalMaterialParameters &
  THREE.MeshToonMaterialParameters &
  THREE.MeshBasicMaterialParameters &
  THREE.MeshLambertMaterialParameters &
  THREE.MeshStandardMaterialParameters &
  THREE.PointsMaterialParameters

export interface iCSMShader {
  defines: string
  header: string
  main: string
}

export interface CSMPatchMap {
  [keyword: string]: {
    [toReplace: string]: string
  }
}

export type CSMBaseMaterial = (new (opts: { [key: string]: any }) => THREE.Material) | THREE.Material

export interface _CSMParam {
  baseMaterial: CSMBaseMaterial
  vertexShader?: string
  fragmentShader?: string
  cacheKey?: () => string
  patchMap?: CSMPatchMap
  uniforms?: { [key: string]: THREE.IUniform<any> }
}

export type iCSMParams = _CSMParam & AllMaterialParams

export type iCSMUpdateParams = {
  vertexShader: string
  fragmentShader: string
  uniforms: { [key: string]: THREE.IUniform<any> }
  cacheKey: () => string
}
