import {
  OrbitControls,
  PerspectiveCamera,
  Plane,
  useTexture,
} from "@react-three/drei";
import { useControls } from "leva";
import { useMemo } from "react";
import {
  DoubleSide,
  MeshDepthMaterial,
  MeshDistanceMaterial,
  MeshStandardMaterial,
} from "three";
import CSM from "three-custom-shader-material";

export function Scene() {
  const map = useTexture("/Shadows/react.png");

  const vertexShader = useMemo(
    () => /* glsl */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
    }
  `,
    []
  );
  const fragmentShader = useMemo(
    () => /* glsl */ `
    uniform sampler2D uMap;

    varying vec2 vUv;

    void main() {
      vec4 color = texture2D(uMap, vUv);
      csm_DiffuseColor = color;
      csm_DepthAlpha = 1.0 - color.a;
    }
  `,
    []
  );
  const uniforms = useMemo(
    () => ({
      uMap: { value: map },
    }),
    []
  );

  const { lightType } = useControls({
    lightType: {
      options: ["point", "directional"],
      value: "point",
      label: "Light Type",
    },
  });

  return (
    <>
      <OrbitControls />
      <PerspectiveCamera makeDefault position={[2, 2, 2]} />

      {(() => {
        switch (lightType) {
          case "point":
            return (
              <pointLight
                castShadow
                position={[0, 2, 2]}
                intensity={4}
                shadow-mapSize-width={2096}
                shadow-mapSize-height={2096}
              />
            );
          case "directional":
            return (
              <directionalLight
                castShadow
                position={[0, 2, 2]}
                intensity={4}
                shadow-mapSize-width={2096}
                shadow-mapSize-height={2096}
              />
            );

          default:
            return null;
        }
      })()}

      <Plane rotation-x={-Math.PI / 2} args={[5, 5, 5]} receiveShadow>
        <meshStandardMaterial color="white" />
      </Plane>

      <Plane position={[0, 0.5, 0]} castShadow>
        <CSM
          baseMaterial={MeshStandardMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={DoubleSide}
          transparent
        />
        <CSM
          attach="customDistanceMaterial"
          baseMaterial={MeshDistanceMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
        <CSM
          attach="customDepthMaterial"
          baseMaterial={MeshDepthMaterial}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </Plane>

      <axesHelper />
    </>
  );
}
