import { Canvas } from '@react-three/fiber'
import {
  Box,
  Environment,
  MeshReflectorMaterial,
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  Reflector,
  softShadows,
  Sphere,
  SpotLight,
  TransformControls,
  useGLTF,
} from '@react-three/drei'
import { Floor } from './components/Floor'
import Lights from './components/Lights'
import Caustics from './Caustics'
import { useControls } from 'leva'
import { Suspense, useEffect, useRef, useState } from 'react'
import { BoxGeometry, Color, MathUtils, Mesh, MeshPhysicalMaterial } from 'three'
import { Perf } from 'r3f-perf'

import suzanne from '@gsimone/suzanne'
import { useMemo } from 'react'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

function Thing() {
  const [transform, setTransfrom] = useState()
  const size = 5
  const { nodes } = useGLTF(suzanne)

  return (
    <>
      <Lights ref={(r) => void (r && setTransfrom(r))} />

      <Caustics target={transform?.object}>
        <Floor size={size} rotation-x={-Math.PI / 2} />
        <Floor size={size} position={[0, size / 2, -size / 2]} />
        <Floor size={size} position={[size / 2, size / 2, 0]} rotation-y={-Math.PI / 2} />

        <TransformControls>
          <group position-y={0.5} rotation-y={-Math.PI / 4}>
            <mesh castShadow rotation={[MathUtils.degToRad(-35), 0, 0]} geometry={nodes.Suzanne.geometry}>
              <meshPhysicalMaterial color="tomato" roughness={0.2} />
            </mesh>
          </group>
        </TransformControls>
      </Caustics>

      <Perf />
    </>
  )
}

export default function App() {
  return (
    <Canvas shadows>
      <fog attach="fog" args={['#3b9ed1', 0.1, 15]} />
      <color attach="background" args={['#3b9ed1']} />

      <OrbitControls makeDefault target={[0, 1, 0]} />
      <PerspectiveCamera fov={40} position={[-4, 4, 4]} makeDefault />

      <Suspense>
        <Thing />
      </Suspense>

      <Perf />
    </Canvas>
  )
}
