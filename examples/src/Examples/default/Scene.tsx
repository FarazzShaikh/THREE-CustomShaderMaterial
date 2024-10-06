import { OrbitControls, Sphere } from "@react-three/drei";

import { MeshPhysicalMaterial } from "three";
import CSM from "three-custom-shader-material/vanilla";
import { Stage } from "./Stage";

class Mat extends CSM {
  constructor() {
    super({
      baseMaterial: MeshPhysicalMaterial,
      metalness: 1,
      roughness: 0,
      anisotropy: 1,
    });
  }
}

export function Scene() {
  const m = new Mat();

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
