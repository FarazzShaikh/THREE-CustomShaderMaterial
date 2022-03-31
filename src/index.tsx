import React, { forwardRef, useMemo } from 'react'
import CustomShaderMaterial from './vanilla'
import { iCSMProps } from './types'

export default forwardRef<CustomShaderMaterial, iCSMProps>(
  ({ baseMaterial, fragmentShader, vertexShader, uniforms, ...rest }, ref) => {
    const material = useMemo(
      () => new CustomShaderMaterial(baseMaterial, fragmentShader, vertexShader, uniforms),
      [baseMaterial, fragmentShader, vertexShader, uniforms]
    )
    return <primitive dispose={undefined} object={material} ref={ref} attach="material" {...rest} />
  }
)
