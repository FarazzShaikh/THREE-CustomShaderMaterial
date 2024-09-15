import { TransformControls, useHelper } from "@react-three/drei";
import { forwardRef, useRef } from "react";
import { DirectionalLightHelper } from "three";
import { TransformControls as TransformControlsImpl } from "three-stdlib";

const Lights = forwardRef<TransformControlsImpl>((_, ref) => {
  const dirLight = useRef<any>(null!);

  useHelper(dirLight.current, DirectionalLightHelper, 5);

  return (
    <>
      {/* @ts-ignore */}
      <TransformControls
        ref={ref}
        position={[1, 1, 1]}
        scale={5}
        rotation={[Math.PI / 4, Math.PI / 5, Math.PI / 4]}
      >
        <hemisphereLight
          args={[0xffffff, 0xffffff, 1.0]}
          color={0x7095c1}
          groundColor={0xcbc1b2}
        />
        <directionalLight
          ref={dirLight}
          castShadow
          shadow-mapSize={[4096, 4096]}
          shadow-camera-left={-22}
          shadow-camera-bottom={-22}
          shadow-camera-right={22}
          shadow-camera-top={22}
        />
      </TransformControls>
    </>
  );
});
export default Lights;
