import React, { forwardRef } from 'react'
import { extend, MaterialProps, ReactThreeFiber, MeshStandardMaterialProps } from '@react-three/fiber'
import CSM from './vanilla'
import { iCSMProps } from './types'

extend({ CustomShaderMaterial: CSM })

type iCSMAllProps = iCSMProps & MaterialProps & MeshStandardMaterialProps

declare global {
  namespace JSX {
    interface IntrinsicElements {
      customShaderMaterial: ReactThreeFiber.Object3DNode<CSM, typeof CSM>
    }
  }
}

const CustomShaderMaterial = forwardRef<CSM, iCSMAllProps>(
  ({ baseMaterial, fragmentShader, vertexShader, uniforms, ...rest }, ref) => {
    return <customShaderMaterial ref={ref} args={[baseMaterial, fragmentShader, vertexShader, uniforms, { ...rest }]} />
  }
)

export default CustomShaderMaterial
