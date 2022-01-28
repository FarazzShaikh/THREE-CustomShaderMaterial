import React, { useMemo, useRef } from "react";
import CustomShaderMaterial, { CSM } from "three-custom-shader-material";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import * as oceanShader from "../shaders/ocean";
// @ts-ignore
import { patchShaders } from "gl-noise/build/glNoise.m";

import useWaterControls from "./useWaterControls";

export default function Water({ base }: { base: any }) {
  const thickness = 0.2;
  const material = useRef<CSM | null>(null);

  useFrame((state) => {
    if (material?.current) {
      material.current.uniforms.uTime.value = -state.clock.elapsedTime / 5;
    }
  });

  useWaterControls(material);

  return (
    <group>
      <mesh castShadow receiveShadow rotation-x={-Math.PI / 2}>
        <boxGeometry args={[5, 5, thickness, 64, 64, 1]} />
        <CustomShaderMaterial
          ref={material}
          baseMaterial={base}
          vertexShader={patchShaders(oceanShader.vert)}
          fragmentShader={patchShaders(oceanShader.frag)}
          side={THREE.DoubleSide}
          color={0x68c3c0}
          roughness={0}
          metalness={0}
          flatShading
          vertexColors
          uniforms={{
            uTime: { value: 0 },
            waterColor: {
              value: new THREE.Color("#52a7f7"),
            },
            waterHighlight: {
              value: new THREE.Color("#b3ffff"),
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
  );
}
