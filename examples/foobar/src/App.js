import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import CustomShaderMaterial from 'three-custom-shader-material'
import { MeshStandardMaterial } from 'three'

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
