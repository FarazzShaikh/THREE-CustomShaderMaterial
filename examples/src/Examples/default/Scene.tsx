import { OrbitControls, Sphere } from "@react-three/drei";

import { useEffect, useMemo } from "react";
import { MeshPhysicalMaterial } from "three";
import CSM from "three-custom-shader-material/vanilla";
import { useShader } from "../../pages/Root";
import { Stage } from "./Stage";

class Mat extends CSM {
  constructor(fs, vs) {
    super({
      baseMaterial: MeshPhysicalMaterial,
      metalness: 1,
      roughness: 0,
      anisotropy: 1,
      fragmentShader: fs,
      vertexShader: vs,
    });
  }
}

export function Scene() {
  const { fs, vs } = useShader();
  const m = useMemo(() => new Mat(fs, vs), [fs, vs]);

  useEffect(() => () => m.dispose(), [m]);

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
        <Sphere castShadow args={[1, 32, 32]} material={m}></Sphere>
      </Stage>
    </>
  );
}
