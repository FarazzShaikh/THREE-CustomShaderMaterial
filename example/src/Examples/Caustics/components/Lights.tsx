import { TransformControls } from "@react-three/drei";
import { forwardRef, memo } from "react";
import { TransformControls as TransformControlsImpl } from "three-stdlib";

const Lights = forwardRef<TransformControlsImpl>((_, ref) => {
  return (
    <>
      <hemisphereLight
        args={[0xffffff, 0xffffff, 1.0]}
        color={0x7095c1}
        groundColor={0xcbc1b2}
      />

      <TransformControls
        ref={ref}
        position={[1, 1, 1]}
        scale={5}
        rotation={[Math.PI / 4, Math.PI / 5, Math.PI / 4]}
      >
        <directionalLight
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
export default memo(Lights);
