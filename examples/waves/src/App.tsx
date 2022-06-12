import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import React, { Suspense } from 'react'

import Copy from './components/Copy'
import Lights from './components/Lights'
import Water from './components/Water'

import {
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshNormalMaterial,
  MeshToonMaterial,
  MeshStandardMaterial,
  MeshPhongMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshDepthMaterial,
} from 'three'
import { useControls } from 'leva'
import Tag from './Tag'

export default function App() {
  const { Base } = useControls(
    'Material',
    {
      Base: {
        options: {
          MeshPhysicalMaterial,
          MeshBasicMaterial,
          MeshMatcapMaterial,
          MeshNormalMaterial,
          MeshStandardMaterial,
          MeshPhongMaterial,
          MeshToonMaterial,
          MeshLambertMaterial,
          MeshDepthMaterial,
        },
        value: MeshPhysicalMaterial,
      },
    },
    []
  )

  return (
    <>
      <Leva />
      <Tag />
      <Canvas
        camera={{
          position: [4, 4, 4],
        }}
      >
        <color attach="background" args={['#ebebeb']} />
        <Suspense fallback={null}>
          {['MeshPhysicalMaterial', 'MeshStanderedMaterial'].includes(Base.name) ? (
            <Environment preset="sunset" />
          ) : (
            <Lights />
          )}
        </Suspense>

        <Water base={Base} />
        <ContactShadows
          position={[0, -0.2, 0]}
          width={10}
          height={10}
          far={20}
          opacity={0.5}
          rotation={[Math.PI / 2, 0, 0]}
        />

        <Copy base={Base} />
        <OrbitControls />
      </Canvas>
    </>
  )
}
