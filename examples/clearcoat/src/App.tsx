import { OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import { useLayoutEffect, useMemo } from 'react'
import * as THREE from 'three'
import CSM from 'three-custom-shader-material'
import Lights from './Lights'
import perlin from './noise/perlin'
import voronoise from './noise/voronoise'

function Thing() {
  const { nodes } = useGLTF('/paint_tester.glb') as any

  const uniforms = useMemo(
    () => ({
      cameraNearFar: { value: new THREE.Vector2() },
      uFleckColor: { value: new THREE.Color('#cf4141') },
    }),
    []
  )

  const camera = useThree((s) => s.camera)
  useLayoutEffect(() => {
    uniforms.cameraNearFar.value.set(camera.near, camera.far)
  }, [camera])

  return (
    <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry}>
      <CSM
        baseMaterial={THREE.MeshPhysicalMaterial}
        metalness={1}
        roughness={1}
        clearcoat={1}
        color={'#650000'}
        vertexShader={
          /* glsl */ `
          varying vec3 csm_vPosition;
          varying vec3 csm_vWorldNormal;
          varying vec3 csm_vWorldViewDirection;
          varying vec4 csm_vGlPosition;

          void main() {
              csm_vWorldNormal = normalize((modelMatrix * vec4(normal.xyz, 0.0)).xyz);
              csm_vWorldViewDirection = normalize(cameraPosition - (modelMatrix * vec4(position.xyz, 0.0)).xyz) ;

              csm_vGlPosition = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              csm_vPosition = position;
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          ${voronoise}
          ${perlin}

          varying vec3 csm_vPosition;
          varying vec3 csm_vWorldNormal;
          varying vec3 csm_vWorldViewDirection;
          varying vec4 csm_vGlPosition;

          uniform vec3 uFleckColor;

          const float fresnel_Power = 1.0;

          float fresnel() {
              return pow(1.0 - dot(csm_vWorldNormal, csm_vWorldViewDirection), fresnel_Power);
          }

          float mapLinear(float x, float a1, float a2, float b1, float b2) {
              return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
          }


          void main() {
              // Fresnel 
              float fresnelFactor = fresnel();

              // Fleck
              float fleckFactor = voronoi3d(csm_vPosition * 2000.0).y;
              float fleckFactorY = voronoi3d(csm_vPosition * 2000.0 + 100.0).y;
              float fleckFactorZ = voronoi3d(csm_vPosition * 2000.0 + 200.0).y;

              // Distance from camera
              float normalizedDist = csm_vGlPosition.z / csm_vGlPosition.w;
              normalizedDist = smoothstep(0.6, 1.0, normalizedDist);
              // normalizedDist *= fresnelFactor;

              // Fade out flecks as we get further away
              float nonDistanceFleckFactor = fleckFactor;
              fleckFactor *= 1.0 - normalizedDist;

              // Diffuse
              float diffuseFactor = csm_DiffuseColor.g;
              float roughnessFactor = fleckFactor;

              roughnessFactor = mapLinear(roughnessFactor, 0.0, 1.0, 0.4, 0.8);
              csm_Roughness = roughnessFactor;
              // csm_FragColor.rgb = vec3(fresnelFactor);

              // Color
              float fresnelColorFactor = smoothstep(0.0, 1.0, clamp(fresnelFactor, 0.0, 0.4));
              vec3 fresnelColor = mix(csm_DiffuseColor.rgb, uFleckColor, fresnelColorFactor);  
              csm_DiffuseColor = vec4(fresnelColor, 1.0);

              float fleckColorFactor = smoothstep(0.99, 0.992, fleckFactor);
              // csm_DiffuseColor = vec4(mix(csm_DiffuseColor.rgb, uFleckColor, fleckColorFactor), 1.0);
              // csm_DiffuseColor = vec4(uFleckColor, 1.0);

              // csm_FragColor = vec4(vec3(fresnelColorFactor), 1.0);


              // Orange peel
              float orangePeelFactorX = pnoise(csm_vPosition * 1000.0);
              float orangePeelFactorY = pnoise(csm_vPosition * 1000.0 + 100.0);
              float orangePeelFactorZ = pnoise(csm_vPosition * 1000.0 + 200.0);
              vec3 orangePeelFactor = vec3(orangePeelFactorX, orangePeelFactorY, orangePeelFactorZ);
              
              csm_ClearcoatNormal = orangePeelFactor * 0.01 * (1.0 - normalizedDist);
              csm_Clearcoat = 1.0;
              csm_ClearcoatRoughness = 0.0;

              csm_Bump = vec3(fleckFactor, fleckFactorY, fleckFactorZ) * 1.0 * (1.0 - normalizedDist);

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
      <Thing />

      <Lights />
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>

      <Perf position="top-left" />

      <axesHelper />
    </Canvas>
  )
}
