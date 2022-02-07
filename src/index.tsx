import React, { forwardRef } from 'react'
import {
  extend,
  MaterialProps,
  ReactThreeFiber,
  MeshStandardMaterialProps,
  MeshPhysicalMaterialProps,
  MeshPhongMaterialProps,
} from '@react-three/fiber'
import CSM from './vanilla'
import { iCSMProps } from './types'

extend({ CustomShaderMaterial: CSM })

type iCSMAllProps = iCSMProps &
  MaterialProps &
  MeshPhysicalMaterialProps &
  MeshStandardMaterialProps &
  MeshPhongMaterialProps & {
    alphaWrite?: unknown
  }

declare global {
  namespace JSX {
    interface IntrinsicElements {
      customShaderMaterial: ReactThreeFiber.Object3DNode<CSM, typeof CSM>
    }
  }
}

export default forwardRef<CSM, iCSMAllProps>(
  ({ baseMaterial, fragmentShader, vertexShader, uniforms, ...rest }, ref) => {
    return <customShaderMaterial ref={ref} args={[baseMaterial, fragmentShader, vertexShader, uniforms, { ...rest }]} />
  }
)
