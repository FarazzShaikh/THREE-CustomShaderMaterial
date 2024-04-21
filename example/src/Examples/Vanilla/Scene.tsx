import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

import { useControls } from "leva";
import { useEffect, useMemo } from "react";
import CSM, { CSMProxy } from "three-custom-shader-material/vanilla";
import { useShader } from "../../pages/Root";
import { Stage } from "./Stage";

export function Scene() {
  const { vs, fs } = useShader();

  const material = useMemo(() => {
    const mat = new CSM({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: vs,
      fragmentShader: fs,
      transmission: 1,
      roughness: 0.2,
      thickness: 2,
    }) as CSMProxy<typeof THREE.MeshPhysicalMaterial>;

    return mat;
  }, [vs, fs]);

  useControls(
    {
      color: {
        value: "#ff0000",
        label: "Color",
        onChange: (color: string) => {
          material.color.set(color);
        },
      },
      flatShading: {
        value: false,
        label: "Flat Shading",
        onChange: (flatShading: boolean) => {
          material.flatShading = flatShading;
          material.needsUpdate = true;
        },
      },
    },
    [material]
  );

  useEffect(() => () => material.dispose(), [material]);

  return (
    <>
      <OrbitControls />

      <Stage
        adjustCamera={1.5}
        environment={{
          preset: "sunset",
          background: true,
          blur: 4,
        }}
        preset="upfront"
        shadows={{
          type: "accumulative",
          //   color: "#fac9ed",
          colorBlend: 2,
          alphaTest: 0.3,
          opacity: 0.6,
          radius: 3,
        }}
      >
        <Sphere castShadow args={[1, 32, 32]} material={material} />
      </Stage>
    </>
  );
}
