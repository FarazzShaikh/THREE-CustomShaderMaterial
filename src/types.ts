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

export type iCSMProps = {
  baseMaterial: new () => THREE.Material
  vertexShader?: string
  fragmentShader?: string
  uniforms?: { [key: string]: THREE.IUniform<any> }
} & AllMaterialProps
