import { OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { MeshPhysicalMaterial } from 'three'
import CSM from 'three-custom-shader-material'
import { ContactShadows } from './ContactShadows'
import Lights from './components/Lights'
import React from 'react'

function Thing() {
  const tex = useTexture('/UV_checker_Map_byValle.jpg')

  return (
    <mesh castShadow position={[0, 2, 0]}>
      <sphereGeometry />
      <CSM
        baseMaterial={MeshPhysicalMaterial} //
        fragmentShader={
          /* glsl */ `
          void main() {
            csm_DiffuseColor.rgb = vec3(1.0, 0.0, 1.0);
            csm_Roughness = 0.0;
          }
        `
        }
        transparent
      />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas shadows>
      <OrbitControls makeDefault />
      <PerspectiveCamera position={[-5, 5, 5]} makeDefault />
      <Thing />

      {/* <Floor /> */}
      <Perf />

      <Lights />

      <ContactShadows />
    </Canvas>
  )
}
