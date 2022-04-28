import React, { forwardRef, useMemo } from 'react'
import CustomShaderMaterial from './vanilla'
import { iCSMProps } from './types'

export default forwardRef<CustomShaderMaterial, iCSMProps>(
  ({ baseMaterial, fragmentShader, vertexShader, uniforms, cacheKey, ...rest }, ref) => {
    const material = useMemo(
      () => new CustomShaderMaterial({ baseMaterial, fragmentShader, vertexShader, uniforms, cacheKey }),
      [baseMaterial, fragmentShader, vertexShader, uniforms, cacheKey]
    )
    return <primitive object={material} ref={ref} attach="material" {...rest} />
  }
)
