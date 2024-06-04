import { OrbitControls, Sphere } from "@react-three/drei";

import { useControls } from "leva";
import { useMemo } from "react";
import { MeshPhysicalMaterial } from "three";
import CSM from "three-custom-shader-material/vanilla";
import { useShader } from "../../pages/Root";
import { Stage } from "./Stage";

class PreviousCSM extends CSM {
  constructor() {
    super({
      baseMaterial: MeshPhysicalMaterial,
      vertexShader: /* glsl */ `
        varying vec2 vUv1;

        void main() {
          vUv1 = uv;
        }`,
      fragmentShader: /* glsl */ `
        varying vec2 vUv1;

        void main() {
          csm_DiffuseColor = vec4(vUv1, 0.0, 1.0);
        }`,
    });
  }
}

class CustomMaterial extends CSM {
  constructor() {
    super({
      baseMaterial: PreviousCSM,
      vertexShader: /* glsl */ `
        varying vec2 vUv;

        void main() {
          vUv = uv;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;

        void func1() {
          csm_DiffuseColor *= 2.0;
        }

        void main() {
          func1();
        }
      `,
    });
  }
}

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

  const mat = useMemo(() => new CustomMaterial(), []);

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
        <Sphere castShadow args={[1, 32, 32]} material={mat}></Sphere>
      </Stage>
    </>
  );
}
