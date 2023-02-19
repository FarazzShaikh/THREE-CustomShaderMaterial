import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, MeshTransmissionMaterial, OrbitControls, PerspectiveCamera, Sphere } from '@react-three/drei'
import Lights from './components/Lights'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import CustomShaderMaterial from 'three-custom-shader-material'

// @ts-ignore
import { patchShaders } from 'gl-noise/build/glNoise.m'
import { Color, DoubleSide, MathUtils, MeshBasicMaterial, MeshPhysicalMaterial } from 'three'
import { Perf } from 'r3f-perf'

function Thing() {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color('red') },
    }),
    []
  )
  const uniforms2 = useMemo(
    () => ({
      uColor: { value: new Color('red') },
    }),
    []
  )

  const mat = useMemo(() => new MeshBasicMaterial({ color: 'purple' }), [])

  return (
    <>
      <Sphere
        castShadow
        args={[1, 128, 128]}
        onPointerEnter={() => (uniforms.uColor.value = new Color('blue'))}
        onPointerLeave={() => (uniforms.uColor.value = new Color('red'))}
      >
        <CustomShaderMaterial baseMaterial={mat} />
      </Sphere>
      <Sphere
        position={[2, 0, 0]}
        castShadow
        args={[1, 128, 128]}
        onPointerEnter={() => (uniforms.uColor.value = new Color('blue'))}
        onPointerLeave={() => (uniforms.uColor.value = new Color('red'))}
      >
        <CustomShaderMaterial baseMaterial={MeshBasicMaterial} />
      </Sphere>
    </>
  )
}

export default function App() {
  return (
    <Canvas shadows>
      <OrbitControls makeDefault />
      <PerspectiveCamera position={[-5, 5, 5]} makeDefault />

      <Thing />
      <Perf />
    </Canvas>
  )
}
