import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

import { useControls } from "leva";
import CSM from "three-custom-shader-material";
import { useShader } from "../../pages/Root";
import { Stage } from "./Stage";

export function Scene() {
  const { vs, fs } = useShader();

  const { color, flatShading } = useControls({
    color: {
      value: "#ff0000",
      label: "Color",
    },
    flatShading: {
      value: false,
      label: "Flat Shading",
    },
  });

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
        <Sphere castShadow args={[1, 32, 32]}>
          <CSM
            baseMaterial={THREE.MeshPhysicalMaterial}
            vertexShader={vs}
            fragmentShader={fs}
            transmission={1}
            roughness={0.2}
            color={color}
            flatShading={flatShading}
            thickness={2}
          />
        </Sphere>
      </Stage>
    </>
  );
}
