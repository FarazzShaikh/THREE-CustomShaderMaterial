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

const CustomShaderMaterial = React.forwardRef(<T extends MaterialConstructor>(props: iCSMParams<T>, ref: unknown) => {
  const material = React.useMemo<CustomShaderMaterialType<T>>(
    () => new CustomShaderMaterialType<T>(props),
    [props.baseMaterial, props.fragmentShader, props.vertexShader, props.uniforms, props.cacheKey]
  )

  // TODO: Use .update when it stop leaking memory
  // useDidUpdateEffect(
  //   () => material.update(props),
  //   [props.fragmentShader, props.vertexShader, props.uniforms, props.cacheKey]
  // )

  React.useEffect(() => () => material.dispose(), [material])

  return <primitive object={material} attach="material" ref={ref as CustomShaderMaterialType<T>} {...props} />
})

export default CustomShaderMaterial as <T extends MaterialConstructor>(
  props: iCSMParams<T> & { ref?: unknown }
) => JSX.Element

export * from './types'
