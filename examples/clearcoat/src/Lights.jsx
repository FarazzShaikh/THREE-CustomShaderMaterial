import { Environment, Lightformer, useHelper } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

export default function Lights() {
  const dirLight1 = useRef()
  const dirLightCamera1 = useRef()

  useHelper(dirLight1, THREE.DirectionalLightHelper, 1, 'hotpink')
  useHelper(dirLightCamera1, THREE.CameraHelper, 1, 'hotpink')

  return (
    <>
      <directionalLight
        ref={dirLight1}
        castShadow
        position={[7, 10, -5.5]}
        target-position={[0, 0, 0]}
        intensity={4}
        shadow-mapSize={1024}
        shadow-bias={-0.001}
      >
        <orthographicCamera
          ref={dirLightCamera1}
          left={-20}
          right={15}
          top={15}
          bottom={-5}
          near={0.1}
          far={20}
          attach="shadow-camera"
        />
      </directionalLight>

      {/* <Environment
        files={
          "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/abandoned_parking_2k.hdr"
        }
        background
      /> */}

      {/* <directionalLight position={[2.5, 5, 5]} intensity={0.5} /> */}
      {/* <directionalLight position={[2, 0, 0]} intensity={1} /> */}
      {/* <directionalLight position={[-2, 0, 0]} intensity={1} /> */}

      <Environment frames={Infinity} resolution={256} blur={1}>
        <Lightformers />
        <Environment files={'https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/parking_garage_2k.hdr'} background />
      </Environment>

      {/* <Environment preset="studio" /> */}
    </>
  )
}

function Lightformers({ positions = [2, 0, 2, 0] }) {
  const group = useRef()
  // useFrame(
  //   (state, delta) =>
  //     (group.current.position.z += delta * 10) > 20 &&
  //     (group.current.position.z = -60)
  // );
  return (
    <>
      {/* Ceiling */}
      <group ref={group}>
        {positions.map((x, i) => (
          <Lightformer
            key={i}
            form="circle"
            intensity={2}
            rotation={[Math.PI / 2, 0, 0]}
            position={[i * 4 - (3 * 4) / 2, 4, 0]}
            scale={[1, 5, 0]}
          />
        ))}
      </group>
      {/* Sides */}

      <Lightformer intensity={1} rotation-y={-Math.PI / 2} position={[-1, 0, 0]} scale={[10, 0.2, 1]} />
      <Lightformer intensity={1} rotation-y={-Math.PI / 2} position={[1, 0, 0]} scale={[10, 0.2, 1]} />
    </>
  )
}
