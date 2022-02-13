import React, { forwardRef, useMemo } from 'react'
import {
  MaterialProps,
  MeshStandardMaterialProps,
  MeshPhysicalMaterialProps,
  MeshPhongMaterialProps,
} from '@react-three/fiber'
import CustomShaderMaterial from './vanilla'
import { iCSMProps } from './types'

type iCSMAllProps = iCSMProps &
  MaterialProps &
  MeshPhysicalMaterialProps &
  MeshStandardMaterialProps &
  MeshPhongMaterialProps & {
    alphaWrite?: unknown
  }

export default forwardRef<CustomShaderMaterial, iCSMAllProps>(
  ({ baseMaterial, fragmentShader, vertexShader, uniforms, ...rest }, ref) => {
    const material = useMemo(
      () => new CustomShaderMaterial(baseMaterial, fragmentShader, vertexShader, uniforms),
      [baseMaterial, fragmentShader, vertexShader, uniforms]
    )
    return <primitive dispose={undefined} object={material} ref={ref} attach="material" {...rest} />
  }
)
