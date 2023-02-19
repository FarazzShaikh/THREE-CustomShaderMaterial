import * as React from 'react'
import '@react-three/fiber'
import CustomShaderMaterialType from './vanilla'
import { iCSMParams, MaterialConstructor } from './types'
import { Material } from 'three'

const CustomShaderMaterial = React.forwardRef(
  <T extends MaterialConstructor>(
    { baseMaterial, fragmentShader, vertexShader, uniforms, cacheKey, ...props }: iCSMParams<T>,
    ref: unknown
  ) => {
    const propToRebuild = React.useMemo(
      () => ({
        baseMaterial,
        fragmentShader,
        vertexShader,
        uniforms,
        cacheKey,
      }),
      [baseMaterial, fragmentShader, vertexShader, uniforms, cacheKey]
    )
    const material = React.useMemo<CustomShaderMaterialType<T>>(
      () => new CustomShaderMaterialType<T>(propToRebuild),
      [propToRebuild]
    )
    React.useEffect(() => () => material.dispose(), [material])

    return <primitive object={material} attach="material" ref={ref as CustomShaderMaterialType<T>} {...props} />
  }
)

export default CustomShaderMaterial as <T extends MaterialConstructor>(
  props: iCSMParams<T> & { ref?: unknown }
) => JSX.Element

export * from './types'
