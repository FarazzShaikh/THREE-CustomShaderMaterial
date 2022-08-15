import React, { forwardRef, useMemo } from 'react'
import * as FIBER from '@react-three/fiber'

import CustomShaderMaterial from './vanilla'
import { _CSMParam } from './types'

export * from './types'

export type iCSMProps = _CSMParam & AllMaterialProps
export type AllMaterialProps = FIBER.MeshPhongMaterialProps & //
  FIBER.MeshPhysicalMaterialProps &
  FIBER.MeshToonMaterialProps &
  FIBER.MeshBasicMaterialProps &
  FIBER.MeshLambertMaterialProps &
  FIBER.MeshStandardMaterialProps &
  FIBER.PointsMaterialProps

declare global {
  namespace JSX {
    interface IntrinsicElements {
      customShaderMaterial_: FIBER.Node<CustomShaderMaterial, typeof CustomShaderMaterial>
    }
  }
}

FIBER.extend({ CustomShaderMaterial_: CustomShaderMaterial })

export default forwardRef<CustomShaderMaterial, iCSMProps>(
  ({ baseMaterial, fragmentShader, vertexShader, uniforms, patchMap, cacheKey, ...rest }, ref) => {
    const args = useMemo(
      () => [{ baseMaterial, fragmentShader, vertexShader, patchMap, uniforms, cacheKey }],
      [baseMaterial, fragmentShader, vertexShader, uniforms, cacheKey]
    )

    // @ts-ignore
    return <customShaderMaterial_ args={args} attach="material" {...rest} ref={ref} />
  }
)
