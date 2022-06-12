import React, { useRef } from 'react'
import { DirectionalLight } from 'three'

export default function Lights() {
  const ref = useRef<DirectionalLight>(null!)

  // useHelper(ref, DirectionalLightHelper);

  return (
    <group>
      <hemisphereLight
        args={[
          'white', //
          'darkslategrey',
          0.4,
        ]}
      />
      <directionalLight
        ref={ref}
        castShadow //
        position={[-5, 3, -5]}
        intensity={3}
        shadow-Bias={-0.0002}
        color="orange"
      />
      <directionalLight
        position={[1, 1, 1]} //
        intensity={0.3}
      />
    </group>
  )
}
