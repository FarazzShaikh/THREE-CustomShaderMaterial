import { Environment, OrbitControls, PerspectiveCamera, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { MeshPhysicalMaterial } from 'three'
import CSM from 'three-custom-shader-material'
import { ContactShadows } from './ContactShadows'
import Lights from './components/Lights'
// @ts-ignore
import { patchShaders } from 'gl-noise/build/glNoise.m'

function Thing() {
  const tex = useTexture('/UV_checker_Map_byValle.jpg')

  return (
    <mesh castShadow position={[0, 2, 0]}>
      <sphereGeometry />
      <CSM
        metalness={1}
        roughness={1}
        // clearcoatRoughness={1}
        color={'#650000'}
        baseMaterial={MeshPhysicalMaterial} //
        vertexShader={
          /* glsl */ `
          varying vec3 csm_vPosition;

          void main() {
            csm_vPosition = position;
          }
        `
        }
        fragmentShader={patchShaders(/* glsl */ `
          varying vec3 csm_vPosition;

          void main() {
            // float orangePeelFactorX = gln_simplex(csm_vPosition * 1000.0);
            // float orangePeelFactorY = gln_simplex(csm_vPosition * 1000.0 + 100.0);
            // float orangePeelFactorZ = gln_simplex(csm_vPosition * 1000.0 + 200.0);
            // vec3 orangePeelFactor = vec3(orangePeelFactorX, orangePeelFactorY, orangePeelFactorZ);
            // csm_ClearcoatNormal = orangePeelFactor * 0.01;
          
            csm_Clearcoat = 1.0;
          }
        `)}
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
      <Environment preset="sunset" background />

      <ContactShadows />
    </Canvas>
  )
}
