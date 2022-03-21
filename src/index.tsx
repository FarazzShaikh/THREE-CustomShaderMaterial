import React, { forwardRef, useMemo } from 'react'
import {
  MaterialProps,
  MeshStandardMaterialProps,
  MeshPhysicalMaterialProps,
  MeshPhongMaterialProps,
  PointsMaterialProps,
  LineBasicMaterialProps,
} from '@react-three/fiber'
import CustomShaderMaterial from './vanilla'
import { AllMaterialProps, iCSMProps } from './types'

export default forwardRef<CustomShaderMaterial, iCSMProps>(
  ({ baseMaterial, fragmentShader, vertexShader, uniforms, ...rest }, ref) => {
    const material = useMemo(
      () => new CustomShaderMaterial(baseMaterial, fragmentShader, vertexShader, uniforms),
      [baseMaterial, fragmentShader, vertexShader, uniforms]
    )
    return <primitive dispose={undefined} object={material} ref={ref} attach="material" {...rest} />
  }
)
