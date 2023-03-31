import * as React from 'react'
import '@react-three/fiber'
import CustomShaderMaterialType from './vanilla'
import { iCSMParams, MaterialConstructor } from './types'
import { Material } from 'three'

function useDidUpdateEffect(fn: (...opts: any[]) => any, inputs: React.DependencyList) {
  const didMountRef = React.useRef(false)

  React.useEffect(() => {
    if (didMountRef.current) {
      return fn()
    }
    didMountRef.current = true
  }, inputs)
}

const CustomShaderMaterial = React.forwardRef(
  <T extends MaterialConstructor>(
    // Need to remove non getter-setter properties from props distributed into r3f
    // to avoid overriding props such as uniforms and other essential internal stuff
    { baseMaterial, fragmentShader, vertexShader, uniforms, cacheKey, ...props }: iCSMParams<T>,
    ref: unknown
  ) => {
    const updateProps = React.useMemo(
      () => ({
        fragmentShader,
        vertexShader,
        uniforms,
        cacheKey,
      }),
      [fragmentShader, vertexShader, uniforms, cacheKey]
    )

    const material = React.useMemo<CustomShaderMaterialType<T>>(
      () =>
        new CustomShaderMaterialType<T>({
          baseMaterial,
          ...updateProps,
          ...props,
        }),
      [updateProps]
    )

    React.useEffect(() => () => material.dispose(), [material])

    // TODO: Use .update when it stop leaking memory
    // useDidUpdateEffect(
    //   () => material.update(updateProps),
    //   [updateProps]
    // )

    return <primitive attach="material" object={material} ref={ref as CustomShaderMaterialType<T>} {...props} />
  }
)

export default CustomShaderMaterial as <T extends MaterialConstructor>(
  props: iCSMParams<T> & { ref?: unknown }
) => JSX.Element

export * from './types'
