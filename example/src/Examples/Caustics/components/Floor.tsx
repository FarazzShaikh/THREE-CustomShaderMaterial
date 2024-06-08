import { useTexture } from "@react-three/drei";

export function Floor({ size = 30, ...props }) {
  const textureRepeat = size / 2 / 2;

  const [Albedo, AO, Displacement, Normal, Roughness] = useTexture([
    import.meta.env.BASE_URL + "/Caustics/pooltiles/tlfmffydy_4K_Albedo.jpg",
    import.meta.env.BASE_URL + "/Caustics/pooltiles/tlfmffydy_4K_AO.jpg",
    import.meta.env.BASE_URL +
      "/Caustics/pooltiles/tlfmffydy_4K_Displacement.jpg",
    import.meta.env.BASE_URL + "/Caustics/pooltiles/tlfmffydy_4K_Normal.jpg",
    import.meta.env.BASE_URL + "/Caustics/pooltiles/tlfmffydy_4K_Roughness.jpg",
  ]);

  return (
    <mesh castShadow receiveShadow {...props}>
      <planeGeometry args={[size, size, 256, 256]} />
      <meshPhysicalMaterial
        map={Albedo}
        aoMap={AO}
        // displacementMap={Displacement}
        normalMap={Normal}
        roughness={0.0}
        roughnessMap={Roughness}
      />
    </mesh>
  );
}
