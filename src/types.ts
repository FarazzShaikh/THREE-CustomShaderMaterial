import * as THREE from 'three'
import * as FIBER from '@react-three/fiber'

export type AllMaterialParams = THREE.MeshPhongMaterialParameters &
  THREE.MeshPhysicalMaterialParameters &
  THREE.MeshToonMaterialParameters &
  THREE.MeshBasicMaterialParameters &
  THREE.MeshLambertMaterialParameters &
  THREE.MeshStandardMaterialParameters &
  THREE.PointsMaterialParameters

export type AllMaterialProps = FIBER.MeshPhongMaterialProps & //
  FIBER.MeshPhysicalMaterialProps &
  FIBER.MeshToonMaterialProps &
  FIBER.MeshBasicMaterialProps &
  FIBER.MeshLambertMaterialProps &
  FIBER.MeshStandardMaterialProps &
  FIBER.PointsMaterialProps

export interface iCSMShader {
  defines: string
  header: string
  main: string
}

interface CSMParam {
  baseMaterial: new (opts: { [key: string]: any }) => THREE.Material
  vertexShader?: string
  fragmentShader?: string
  cacheKey?: () => string
  uniforms?: { [key: string]: THREE.IUniform<any> }
}

export type iCSMProps = CSMParam & AllMaterialProps
export type iCSMParams = CSMParam & AllMaterialParams

export type iCSMUpdateParams = {
  vertexShader?: string
  fragmentShader?: string
  uniforms?: { [key: string]: THREE.IUniform<any> }
  cacheKey?: () => string
}
