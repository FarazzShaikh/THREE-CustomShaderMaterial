import * as React from 'react'
import '@react-three/fiber'
import CustomShaderMaterialType from './vanilla'
import { iCSMParams, MaterialConstructor } from './types'

const CustomShaderMaterial = React.forwardRef(<T extends MaterialConstructor>(props: iCSMParams<T>, ref: unknown) => {
  const material = React.useRef<CustomShaderMaterialType<T>>(new CustomShaderMaterialType<T>(props))

  React.useEffect(() => () => material.current.dispose(), [])

  return <primitive object={material.current} attach="material" ref={ref as CustomShaderMaterialType<T>} />
})

export default CustomShaderMaterial as <T extends MaterialConstructor>(
  props: iCSMParams<T> & { ref?: unknown }
) => JSX.Element

export * from './types'
