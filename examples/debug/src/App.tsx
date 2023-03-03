import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sphere, Environment } from '@react-three/drei'
import Lights from './components/Lights'
import { useMemo, useState } from 'react'
import CustomShaderMaterial from 'three-custom-shader-material'

import {
  Color,
  MeshBasicMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
} from 'three'
import { Perf } from 'r3f-perf'

// @ts-ignore
import { patchShaders } from 'gl-noise/build/glNoise.m'
import common from './shaders/common'
import psrd from './shaders/psrd'

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
              common +
              psrd +
              /* glsl */ `
              varying vec2 csm_vUv;
              varying vec3 csm_vPosition;

              void main() {
                // Size of bump, .01 to .20 is sensible in this example
                float bumpSize = 0.1;
                // How much it perturbs the normals, looks best between 0 and 0.1
                float bumpStrength = 0.1;

                gln_PSRDOpts opts = gln_PSRDOpts(1., vec3(0.0), 1.);
                gln_psrd((1. / bumpSize) * csm_vPosition, opts, csm_Bump);

                // bump more visible with low roughness
                csm_Roughness = 0.1;
                csm_DiffuseColor = vec4(1.0, 0., 1., 0.);
              }
            `
            }
            vertexShader={
              /* glsl */ `
              varying vec2 csm_vUv;
              varying vec3 csm_vPosition;

              void main() {
                csm_vUv = uv;
                csm_vPosition = position;
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

function CacheTest() {
  return (
    <>
      <Sphere position={[2, 0, 0]}>
        <CustomShaderMaterial
          color="blue"
          baseMaterial={MeshBasicMaterial}
          fragmentShader={`
          
          void main() {
            csm_DiffuseColor = vec4(0., 1., 1., 1.);
          }
        `}
        />
      </Sphere>
      <Sphere>
        <CustomShaderMaterial
          color="hotpink"
          baseMaterial={MeshBasicMaterial}
          fragmentShader={`
          
          void main() {
            csm_DiffuseColor = vec4(0., 1., 1., 1.);
          }
        `}
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
      {/* <Environment preset="warehouse" /> */}
      {/* <Thing /> */}
      <CacheTest />

      <Perf />

      {/* <Lights /> */}
    </Canvas>
  )
}
