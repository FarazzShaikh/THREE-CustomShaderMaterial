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
  PlaneGeometry,
} from "three";
import CSM from "three-custom-shader-material";
import { useShader } from "../../pages/Root";

export function Scene() {
  const map = useTexture(import.meta.env.BASE_URL + "Shadows/react.png");

  const { vs, fs } = useShader();

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
                intensity={2}
                shadow-mapSize-width={4098}
                shadow-mapSize-height={4098}
              />
            );

          default:
            return null;
        }
      })()}

      <Plane rotation-x={-Math.PI / 2} args={[5, 5, 5]} receiveShadow>
        <meshStandardMaterial color="white" />
      </Plane>

      <instancedMesh
        position={[0, 0.5, 0]}
        castShadow
        args={[new PlaneGeometry(), undefined, 1]}
      >
        <CSM
          baseMaterial={MeshStandardMaterial}
          vertexShader={vs}
          fragmentShader={fs}
          uniforms={uniforms}
          side={DoubleSide}
          transparent
        />
        <CSM
          attach="customDistanceMaterial"
          baseMaterial={MeshDistanceMaterial}
          vertexShader={vs}
          fragmentShader={fs}
          uniforms={uniforms}
        />
        <CSM
          attach="customDepthMaterial"
          baseMaterial={MeshDepthMaterial}
          vertexShader={vs}
          fragmentShader={fs}
          uniforms={uniforms}
        />
      </instancedMesh>

      <axesHelper />
    </>
  );
}
