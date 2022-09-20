import React, { useMemo, useRef } from 'react'
import CustomShaderMaterial, { MaterialConstructor } from 'three-custom-shader-material'
import CustomShaderMaterialType from 'three-custom-shader-material/vanilla'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

import * as oceanShader from './shaders'
// @ts-ignore
import { patchShaders } from 'gl-noise/build/glNoise.m'

import useWaterControls from './useWaterControls'
import { useControls } from 'leva'
import { MeshBasicMaterial, MeshPhysicalMaterial } from 'three'

export default function Water({ base }: { base: MaterialConstructor }) {
  const thickness = 0.2
  const material = useRef<CustomShaderMaterialType | null>(null)

  useFrame(state => {
    if (material?.current) {
      material.current.uniforms.uTime.value = -state.clock.elapsedTime / 5
    }
  })

  useWaterControls(material)

  const { Flatshading } = useControls({
    Flatshading: {
      value: false,
    },
  })

  return (
    <group>
      <mesh castShadow receiveShadow rotation-x={-Math.PI / 2}>
        <boxGeometry args={[5, 5, thickness, 64, 64, 1]} />
        <CustomShaderMaterial
          ref={material}
          baseMaterial={base}
          vertexShader={patchShaders(oceanShader.vert)}
          fragmentShader={oceanShader.frag}
          side={THREE.DoubleSide}
          color={'blue'}
          roughness={0.2}
          metalness={0.1}
          flatShading={Flatshading}
          uniforms={{
            uTime: { value: 0 },
            waterColor: {
              value: new THREE.Color('#52a7f7').convertLinearToSRGB(),
            },
            waterHighlight: {
              value: new THREE.Color('#b3ffff').convertLinearToSRGB(),
            },
            offset: {
              value: 0.4,
            },
            contrast: {
              value: 3.1,
            },
            brightness: {
              value: 1,
            },
            uHeight: {
              value: thickness,
            },
          }}
        />
      </mesh>
    </group>
  )
}
