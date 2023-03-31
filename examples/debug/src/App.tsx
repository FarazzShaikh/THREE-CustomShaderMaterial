import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sphere, Environment, useTexture } from '@react-three/drei'
import Lights from './components/Lights'
import { Perf } from 'r3f-perf'
import CSM from 'three-custom-shader-material'
import { MeshStandardMaterial } from 'three'
import { useMemo } from 'react'

function Thing() {
  const tex = useTexture('/UV_checker_Map_byValle.jpg')
  // @ts-ignore
  const mat = useMemo(() => new MeshStandardMaterial({ map: tex }), [tex])

  return (
    <mesh>
      <sphereGeometry />
      <CSM
        baseMaterial={mat} //
        fragmentShader={
          /* glsl */ `
          void main() {
            csm_DiffuseColor = vec4(1.0, 0.0, 0.0, 1.0);
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
      <Environment preset="warehouse" />
      <Thing />
      {/* <CacheTest /> */}

      <Perf />

      {/* <Lights /> */}
    </Canvas>
  )
}
