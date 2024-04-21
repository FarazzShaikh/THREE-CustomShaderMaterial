import {
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import {
  BufferGeometry,
  InstancedMesh,
  MeshPhysicalMaterial,
  Object3D,
} from "three";

import { patchShaders } from "gl-noise/build/glNoise.m";
import CustomShaderMaterial from "three-custom-shader-material";
import CustomShaderMaterialType from "three-custom-shader-material/vanilla";
import { useShader } from "../../pages/Root";

const amount = 150;
const dummy = new Object3D();
function Thing() {
  const { vs, fs } = useShader();
  const ref = useRef<
    InstancedMesh<
      BufferGeometry,
      CustomShaderMaterialType<typeof MeshPhysicalMaterial>
    >
  >(null!);

  useEffect(() => {
    const mesh = ref.current;

    let i = 0;
    for (let x = 0; x < amount; x++) {
      dummy.position.set(Math.random(), Math.random(), Math.random());
      dummy.rotation.set(Math.random(), Math.random(), Math.random());
      dummy.position.multiplyScalar(10);

      dummy.position.x -= 5;
      dummy.position.y -= 5;
      dummy.position.z -= 5;

      dummy.updateMatrix();

      mesh.setMatrixAt(i++, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
    }),
    []
  );

  useFrame(({ clock }) => {
    ref.current.material.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <group>
      <instancedMesh ref={ref} args={[null, null, amount]}>
        <sphereGeometry args={[1, 64, 64]} />
        <CustomShaderMaterial
          baseMaterial={MeshPhysicalMaterial}
          vertexShader={patchShaders(vs)}
          fragmentShader={patchShaders(fs)}
          uniforms={uniforms}
          transparent
        />
      </instancedMesh>
    </group>
  );
}

export function Scene() {
  return (
    <>
      <Suspense>
        <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr" />
        <Thing />
      </Suspense>

      <PerspectiveCamera makeDefault position={[10, 10, 10]} />
      <OrbitControls makeDefault enablePan={false} />
    </>
  );
}
