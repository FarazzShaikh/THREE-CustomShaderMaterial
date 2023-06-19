import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sphere, Environment, useTexture } from '@react-three/drei'
import Lights from './components/Lights'
import { Perf } from 'r3f-perf'
import CSM from 'three-custom-shader-material'
import { MeshBasicMaterial, MeshPhysicalMaterial, MeshStandardMaterial } from 'three'
import { useMemo } from 'react'

function Thing() {
  const tex = useTexture('/UV_checker_Map_byValle.jpg')

  return (
    <mesh>
      <sphereGeometry />
      <CSM
        baseMaterial={MeshPhysicalMaterial} //
        fragmentShader={
          /* glsl */ `
          void main() {
            csm_Roughness = 0.;
          }
        `
        }
      />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas shadows>
      <OrbitControls makeDefault />
      <PerspectiveCamera position={[-5, 5, 5]} makeDefault />
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/empty_warehouse_01_1k.hdr" />
      <Thing />
      {/* <CacheTest /> */}

      <Perf />

      {/* <Lights /> */}
    </Canvas>
  )
}
