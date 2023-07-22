import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sphere, Environment, useTexture } from '@react-three/drei'
import Lights from './components/Lights'
import { Perf } from 'r3f-perf'
import CSM from 'three-custom-shader-material'
import { MeshBasicMaterial, MeshDepthMaterial, MeshPhysicalMaterial, MeshStandardMaterial } from 'three'
import { useMemo } from 'react'
import { Floor } from './components/Floor'
import * as THREE from 'three'
import { ContactShadows } from './ContactShadows'

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
            csm_Roughness = 0.;
            csm_DiffuseColor.a = 0.5;
          }
        `
        }
        transparent
      />
      <CSM
        attach="customDepthMaterial"
        baseMaterial={MeshDepthMaterial} //
        fragmentShader={
          /* glsl */ `
          void main() {
            csm_DepthAlpha = 1.;
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
