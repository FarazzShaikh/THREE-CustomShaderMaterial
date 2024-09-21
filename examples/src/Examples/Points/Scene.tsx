import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { IcosahedronGeometry, Points, PointsMaterial } from "three";

import { patchShaders } from "gl-noise/build/glNoise.m";
import CustomShaderMaterialType from "../../../../package/src";
import CustomShaderMaterial from "../../../../package/src/React";
import { useShader } from "../../pages/Root";

function Thing() {
  const { vs, fs } = useShader();

  const pointsRef = useRef<Points>(null!);
  const matRef = useRef<CustomShaderMaterialType<typeof PointsMaterial>>(null!);

  useEffect(() => {
    pointsRef.current.geometry = new IcosahedronGeometry(1, 32);
  }, []);

  useFrame(({ clock }) => {
    matRef.current.uniforms.uTime.value = clock.elapsedTime;
  });

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
    }),
    []
  );

  return (
    <group>
      <points ref={pointsRef}>
        <CustomShaderMaterial
          ref={matRef}
          baseMaterial={PointsMaterial}
          size={0.02}
          vertexShader={patchShaders(vs)}
          fragmentShader={patchShaders(fs)}
          uniforms={uniforms}
          transparent
        />
      </points>
    </group>
  );
}

export function Scene() {
  return (
    <>
      <color attach="background" args={["#121212"]} />

      <Suspense>
        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr" />
        <Thing />
      </Suspense>

      <PerspectiveCamera makeDefault position={[0, 0, 5]} />
      <OrbitControls makeDefault enablePan={false} />
    </>
  );
}
