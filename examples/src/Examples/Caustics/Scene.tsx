import suzanne from "@gsimone/suzanne";
import {
  OrbitControls,
  PerspectiveCamera,
  TransformControls,
  useGLTF,
} from "@react-three/drei";
import { Suspense } from "react";
import { MathUtils } from "three";
import Caustics from "./Caustics";
import { Floor } from "./components/Floor";

function Thing() {
  const size = 5;
  const { nodes } = useGLTF(suzanne);

  return (
    <>
      <Caustics>
        <Floor size={size} rotation-x={-Math.PI / 2} />
        <Floor size={size} position={[0, size / 2, -size / 2]} />
        <Floor
          size={size}
          position={[size / 2, size / 2, 0]}
          rotation-y={-Math.PI / 2}
        />

        <TransformControls>
          <group position-y={0.5} rotation-y={-Math.PI / 4}>
            <mesh
              castShadow
              rotation={[MathUtils.degToRad(-35), 0, 0]}
              geometry={nodes.Suzanne.geometry}
            >
              <meshPhysicalMaterial color="tomato" roughness={0.2} />
            </mesh>
          </group>
        </TransformControls>
      </Caustics>
    </>
  );
}

export function Scene() {
  return (
    <>
      <fog attach="fog" args={["#3b9ed1", 0.1, 15]} />
      <color attach="background" args={["#3b9ed1"]} />

      <OrbitControls makeDefault target={[0, 1, 0]} />
      <PerspectiveCamera fov={40} position={[-4, 4, 4]} makeDefault />

      <Suspense>
        <Thing />
      </Suspense>
    </>
  );
}
