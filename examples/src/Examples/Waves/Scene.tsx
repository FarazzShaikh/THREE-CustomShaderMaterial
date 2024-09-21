// @ts-ignore
import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { patchShaders } from "gl-noise/build/glNoise.m";
import { useControls } from "leva";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import CSMType from "../../../../package/src";
import CSM from "../../../../package/src/React";
import { useShader } from "../../pages/Root";
import Lights from "./Lights";

const BASE_MATERIALS = {
  MeshStandardMaterial: THREE.MeshStandardMaterial,
  MeshPhysicalMaterial: THREE.MeshPhysicalMaterial,
  MeshBasicMaterial: THREE.MeshBasicMaterial,
  MeshLambertMaterial: THREE.MeshLambertMaterial,
  MeshPhongMaterial: THREE.MeshPhongMaterial,
};

function FrameUpdate({ materialRef }) {
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = -clock.elapsedTime / 5;
    }
  });

  return null!;
}

export function Scene() {
  const { vs, fs } = useShader();
  const materialRef = useRef<CSMType>(null!);

  //   useWaterControls(materialRef);

  const {
    Base: baseKey,
    visible,
    flatShading,
  } = useControls(
    "Material",
    {
      Base: {
        options: Object.keys(BASE_MATERIALS),
        value: "MeshPhysicalMaterial",
        label: "Base Material",
      },
      visible: {
        value: true,
      },
      flatShading: {
        value: false,
        label: "Flat Shading",
      },
    },

    []
  );

  const baseMaterial = BASE_MATERIALS[baseKey];

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      waterColor: {
        value: new THREE.Color("#52a7f7").convertLinearToSRGB(),
      },
      waterHighlight: {
        value: new THREE.Color("#b3ffff").convertLinearToSRGB(),
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
        value: 0.2,
      },
    }),
    []
  );

  return (
    <>
      <color attach="background" args={[235, 235, 235]} />
      <Suspense fallback={null}>
        {["MeshPhysicalMaterial", "MeshStanderedMaterial"].includes(baseKey) ? (
          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr" />
        ) : (
          <Lights />
        )}
      </Suspense>

      <mesh
        visible={visible}
        castShadow
        receiveShadow
        rotation-x={-Math.PI / 2}
      >
        <boxGeometry args={[5, 5, 0.2, 64, 64, 1]} />
        <CSM
          ref={materialRef}
          baseMaterial={baseMaterial}
          vertexShader={patchShaders(vs)}
          fragmentShader={fs}
          side={THREE.DoubleSide}
          color={"blue"}
          roughness={0.2}
          metalness={0.1}
          flatShading={flatShading}
          uniforms={uniforms}
        />
      </mesh>
      <FrameUpdate materialRef={materialRef} />

      <ContactShadows
        position={[0, -0.2, 0]}
        width={10}
        height={10}
        far={20}
        opacity={0.5}
        rotation={[Math.PI / 2, 0, 0]}
      />

      <PerspectiveCamera makeDefault position={[5, 5, 5]} />
      <OrbitControls makeDefault />
    </>
  );
}
