import { Box, OrbitControls, Sphere } from "@react-three/drei";

import { useEffect, useState } from "react";
import { MeshBasicMaterial } from "three";
import CSM from "three-custom-shader-material";

import { Perf } from "r3f-perf";

export const SceneTestX = ({ ...props }) => {
  const [fragmentShader, setFragmentShader] = useState(/*glsl*/ `
    void main() {
      csm_DiffuseColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `);

  useEffect(() => {
    setFragmentShader(/*glsl*/ `
      void main() {
        csm_DiffuseColor = vec4(0.0, 1.0, 0.0, 1.0);
      }
    `);
  }, []);

  return (
    <>
      <Sphere {...props}>
        <CSM baseMaterial={MeshBasicMaterial} fragmentShader={fragmentShader} />
      </Sphere>
    </>
  );
};

export function Scene() {
  const [visible, setVisible] = useState(true);
  const [fragmentShader, setFragmentShader] = useState(/*glsl*/ `
    void main() {
      csm_DiffuseColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `);

  useEffect(() => {
    setInterval(() => {
      setFragmentShader(/*glsl*/ `
        void main() {
          csm_DiffuseColor = vec4(${Math.random()}, ${Math.random()}, ${Math.random()}, 1.0);
        }
      `);
    }, 1000);
  }, []);

  return (
    <>
      <OrbitControls />

      <SceneTestX position={[-2, 0, 0]} />

      {visible && (
        <Sphere position={[2, 0, 0]}>
          <CSM
            baseMaterial={MeshBasicMaterial}
            fragmentShader={fragmentShader}
          />
        </Sphere>
      )}

      <Box onClick={() => setVisible(!visible)}>
        <meshBasicMaterial attach="material" color="hotpink" />
      </Box>

      <Perf />
    </>
  );
}
