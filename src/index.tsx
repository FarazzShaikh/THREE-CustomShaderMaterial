import React, { forwardRef } from 'react'
import { extend, MaterialProps, ReactThreeFiber, MeshStandardMaterialProps } from '@react-three/fiber'
import CSM from './vanilla'
import { iCSMProps } from './types'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      customShaderMaterial_: ReactThreeFiber.Node<CSM, typeof CSM>
    }
  }
}

extend({ CustomShaderMaterial_: CSM })

type iCSMAllProps = iCSMProps & MaterialProps & MeshStandardMaterialProps

const CustomShaderMaterial = forwardRef<CSM, iCSMAllProps>(
  ({ baseMaterial, fragmentShader, vertexShader, uniforms, ...rest }, ref) => {
    return (
      <customShaderMaterial_ ref={ref} args={[baseMaterial, fragmentShader, vertexShader, uniforms, { ...rest }]} />
    )
  }
)

export default CustomShaderMaterial
