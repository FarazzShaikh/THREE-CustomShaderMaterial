import { forwardRef } from 'react'

const Lights = forwardRef((props, ref) => {
  return (
    <>
      <hemisphereLight args={[0xffffff, 0xffffff, 1.0]} color={0x7095c1} groundColor={0xcbc1b2} />
      <directionalLight
        castShadow
        shadow-mapSize={[4096, 4096]}
        shadow-camera-left={-22}
        shadow-camera-bottom={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        position={[1, 1, 1]}
      />
    </>
  )
})
export default Lights
