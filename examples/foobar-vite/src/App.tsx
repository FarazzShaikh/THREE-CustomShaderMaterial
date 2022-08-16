import { Environment } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { MeshStandardMaterial } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'

function App() {
  return (
    <Canvas>
      <Environment preset="sunset" />
      <mesh>
        <dodecahedronGeometry />
        <CustomShaderMaterial baseMaterial={MeshStandardMaterial} color="hotpink" />
      </mesh>
    </Canvas>
  )
}

export default App
