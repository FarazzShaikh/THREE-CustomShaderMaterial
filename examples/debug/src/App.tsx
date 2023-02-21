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
  const [mat2, setMat2] = useState<any>()

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
      {mat2 && (
        <Sphere
          castShadow
          args={[1, 128, 128]}
          onPointerEnter={() => (uniforms.uColor.value = new Color('blue'))}
          onPointerLeave={() => (uniforms.uColor.value = new Color('red'))}
        >
          <CustomShaderMaterial
            baseMaterial={mat2}
            fragmentShader={
              /* glsl */ `
              void main() {
                csm_DiffuseColor = vec4(1., 1., 0., 1.0);
                csm_Roughness = 0.;
              }
            `
            }
          />
        </Sphere>
      )}

      <Sphere
        position={[2, 0, 0]}
        castShadow
        args={[1, 128, 128]}
        onPointerEnter={() => (uniforms.uColor.value = new Color('blue'))}
        onPointerLeave={() => (uniforms.uColor.value = new Color('red'))}
      >
        <CustomShaderMaterial
          ref={setMat2}
          baseMaterial={MeshPhysicalMaterial}
          roughness={1}
          uniforms={uniforms}
          fragmentShader={
            /* glsl */ `
            uniform vec3 uColor;
            void main() {
              csm_DiffuseColor = vec4(uColor, 1.);
            }
          `
          }
        />
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

      <Lights />
    </Canvas>
  )
}
