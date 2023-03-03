import { Canvas, useFrame } from '@react-three/fiber'
import {
  AccumulativeShadows,
  Caustics,
  Environment,
  OrbitControls,
  PerspectiveCamera,
  RandomizedLight,
  useGLTF,
  Grid,
} from '@react-three/drei'
import { Color } from 'three'
import { Suspense, useEffect, useMemo, useRef } from 'react'

import CSM from 'three-custom-shader-material'
import Frag from './shaders/Frag'
import { MeshTransmissionMaterial } from './MeshTransmissionMaterial'
import Vert from './shaders/Vert'
import common from './shaders/common'
import simplex from './shaders/simplex'
import FBM from './shaders/fbm'
import { Ui3D } from './Ui3D'
import tunnel from 'tunnel-rat'
import { Ui } from './Ui'
import { usePerf, PerfHeadless } from 'r3f-perf'

function Thing() {
  const { nodes } = useGLTF(
    'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/bunny/model.gltf'
  )

  const uniforms = useMemo(
    () => ({
      colorMap: {
        value: [
          new Color('#b7dfa5'),
          new Color('#decf8d'),
          new Color('#bdb281'),
          new Color('#547561'),
          new Color('#0e1d18'),
        ].map((col) => {
          const hsl = {
            h: 0,
            s: 0,
            l: 0,
          }
          col.getHSL(hsl)
          col.setHSL(
            hsl.h, //
            hsl.s * 2,
            hsl.l * 0.75
          )

          return col
        }),
      },
      uTime: {
        value: 0,
      },
    }),
    []
  )

  const csmRef = useRef()
  const gridRef = useRef()

  useFrame((state, dt) => {
    uniforms.uTime.value += dt

    gridRef.current.visible = false
    csmRef.current.base_update(state, csmRef.current.__r3f.parent)
    gridRef.current.visible = true
  })

  const frag = useMemo(
    () => `
      ${common}
      ${simplex}
      ${FBM('simplex')}
      ${Frag}
    `,
    [common, simplex, FBM, Frag]
  )

  return (
    <>
      <Caustics
        color={'#b7dfa5'}
        backside
        lightSource={[3, 3, -5]}
        frames={100}
        worldRadius={0.05}
        intensity={0.008}
        resolution={1024}
      >
        <mesh castShadow geometry={nodes.bunny.geometry} position-y={-0.04}>
          <CSM
            ref={csmRef}
            baseMaterial={MeshTransmissionMaterial}
            uniforms={uniforms}
            fragmentShader={frag}
            vertexShader={Vert}
            resolution={128}
            thickness={0.5}
            anisotropy={2}
            attenuationDistance={1}
            attenuationColor={new Color('#ffffff')}
          />
        </mesh>
      </Caustics>

      <Grid
        ref={gridRef}
        infiniteGrid
        position={[0, -0.001, 0]}
        args={[20, 20]}
        followCamera={false}
        fadeDistance={20}
        cellThickness={0.5}
        sectionThickness={2}
        sectionSize={2}
        cellSize={1}
        cellColor={'#0e1d18'}
        sectionColor={'#b7dfa5'}
      />
    </>
  )
}

const UiTunnel = tunnel()

function UIWrapper() {
  const fpsRef = useRef()

  const log = usePerf((s) => s.log)
  useFrame((state) => {
    fpsRef.current.innerText = `fps: ${Math.floor(log?.fps || 0)}`
  })

  return (
    <>
      <PerfHeadless />

      <Ui3D />
      <UiTunnel.In>
        <Ui ref={fpsRef} />
      </UiTunnel.In>
    </>
  )
}

export default function App() {
  return (
    <>
      <Canvas shadows>
        <color attach="background" args={['#E0E7BF']} />
        <fog attach="fog" args={['#E0E7BF', 0, 100]} />

        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/industrial_workshop_foundry_1k.hdr" />

        <PerspectiveCamera
          position={[-0.3, 4, 5]} //
          makeDefault
        />
        <OrbitControls
          makeDefault //
          target={[-0.3, 1, 0]}
          maxDistance={10}
          minDistance={1}
        />

        <Suspense>
          <Thing />

          <AccumulativeShadows opacity={0.5} temporal frames={100} scale={10}>
            <RandomizedLight amount={10} position={[3, 3, -5]} />
          </AccumulativeShadows>
        </Suspense>

        <UIWrapper />
      </Canvas>
      <UiTunnel.Out />
    </>
  )
}
