export default function Lights() {
  return (
    <group>
      <hemisphereLight
        args={[
          'white', //
          'darkslategrey',
          0.4,
        ]}
      />
      <directionalLight
        castShadow //
        position={[-5, 3, -5]}
        intensity={3}
        shadow-Bias={-0.0002}
        color="orange"
      />
      <directionalLight
        position={[1, 1, 1]} //
        intensity={0.3}
      />
    </group>
  )
}
