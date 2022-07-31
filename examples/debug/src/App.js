import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Sphere, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import { Perf } from 'r3f-perf'
import CustomShaderMaterial from 'three-custom-shader-material'
import { MeshPhysicalMaterial, MeshStandardMaterial, ShaderMaterial } from 'three'
import { patchShaders } from 'gl-noise/build/glNoise.m'
import { MeshPhongMaterial } from 'three'

function Thing() {
  return (
    <>
      <Sphere args={[1, 128, 128]}>
        <CustomShaderMaterial
          baseMaterial={MeshPhysicalMaterial} //
          color="red"
          transparent
          vertexShader={
            /* glsl */ `
          varying vec3 vPos;

          void main() {
            vPos = position;
          }
          `
          }
          fragmentShader={patchShaders(/* glsl */ `
         varying vec3 vPos;
          
          void main() {

            gln_tFBMOpts fbmOpts = gln_tFBMOpts(1.0, 0.4, 2.3, 0.4, 1.0, 5, false, false);
            float noise = gln_normalize(gln_pfbm(vPos * 10., fbmOpts));
            csm_Roughness = pow(noise, 1.) * 0.5;
            csm_Metalness = pow(noise, 1.) * 1.2;

            // csm_DiffuseColor = vec4(vPos, 1);
          }
          `)}
        />
      </Sphere>
    </>
  )
}

export default function App() {
  return (
    <Canvas shadows>
      <OrbitControls makeDefault />
      <PerspectiveCamera fov={40} position={[-4, 4, 4]} makeDefault />

      <Suspense>
        <Environment preset="sunset" background />
        <Thing />
      </Suspense>

      <Perf />
    </Canvas>
  )
}
