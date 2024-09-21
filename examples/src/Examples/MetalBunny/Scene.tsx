import {
  AccumulativeShadows,
  Caustics,
  Environment,
  Grid,
  OrbitControls,
  PerspectiveCamera,
  RandomizedLight,
  useGLTF,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef, useState } from "react";
import { Color } from "three";

import { patchShaders } from "gl-noise/build/glNoise.m";
import CSM from "../../../../package/src/React";
import { useShader } from "../../pages/Root";
import { MeshTransmissionMaterial } from "./MeshTransmissionMaterial";

function Thing() {
  const { vs, fs } = useShader();

  const { nodes } = useGLTF(
    "https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/bunny/model.gltf"
  ) as any;

  const uniforms = useMemo(
    () => ({
      colorMap: {
        value: [
          new Color("#b7dfa5"),
          new Color("#decf8d"),
          new Color("#bdb281"),
          new Color("#547561"),
          new Color("#0e1d18"),
        ].map((col) => {
          const hsl = {
            h: 0,
            s: 0,
            l: 0,
          };
          col.getHSL(hsl);
          col.setHSL(
            hsl.h, //
            hsl.s * 2,
            hsl.l * 0.75
          );

          return col;
        }),
      },
      uTime: {
        value: 0,
      },
    }),
    []
  );

  const gridRef = useRef();

  useFrame((state, dt) => {
    // uniforms.uTime.value += dt;
  });

  const [mtmRef, setMtmRef] = useState();

  return (
    <>
      <Caustics
        causticsOnly={false}
        color={"#b7dfa5"}
        backside
        lightSource={[3, 3, -5]}
        frames={100}
        worldRadius={0.05}
        intensity={0.008}
        resolution={1024}
      >
        <mesh castShadow geometry={nodes.bunny.geometry} position-y={-0.04}>
          <MeshTransmissionMaterial
            ref={(r) => void (r && setMtmRef(r as any))}
          />

          {mtmRef && (
            <CSM
              attach="material"
              // ref={csmRef}
              baseMaterial={mtmRef}
              uniforms={uniforms}
              vertexShader={vs}
              fragmentShader={patchShaders(fs)}
              resolution={128}
              thickness={0.5}
              attenuationDistance={1}
              attenuationColor={new Color("#ffffff")}
              envMapIntensity={2}
            />
          )}
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
        cellColor={"#0e1d18"}
        sectionColor={"#b7dfa5"}
      />
    </>
  );
}

export function Scene() {
  return (
    <>
      <>
        <color attach="background" args={["#E0E7BF"]} />
        <fog attach="fog" args={["#E0E7BF", 0, 100]} />

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
      </>
    </>
  );
}
