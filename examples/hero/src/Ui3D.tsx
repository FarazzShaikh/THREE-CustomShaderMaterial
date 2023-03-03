import { Html, Text } from '@react-three/drei'
import appState from './state/appState'

const textConfig = {
  anchorX: 'center' as const,
  font: '/CabinSketch-Regular.ttf',
  fontSize: 1,
  color: '#000000',
  rotation: [-Math.PI / 2, 0, 0] as [number, number, number],
}

export function Ui3D() {
  const { isMetallic, isBump, setMetallic, setBump } = appState()

  return (
    <>
      <Text {...textConfig} position={[-4.5, -0.0001, -1]} fontSize={0.4}>
        three-
      </Text>
      <Text {...textConfig} position={[-3, -0.0001, 0]}>
        Custom
      </Text>
      <Text {...textConfig} position={[2.6, -0.0001, 0]}>
        Shader
      </Text>
      <Text receiveShadow {...textConfig} position={[0, -0.0001, 1.2]}>
        Material
      </Text>

      <Html sprite transform position={[-0.15, 2.7, 0]}>
        <div className="infoCard">
          <p>
            <a target="_blank" href="https://github.com/pmndrs/drei#meshtransmissionmaterial">
              MeshTransmissionMaterial
            </a>
            <br />
            with <strong>color</strong>, <strong>metalness</strong>
            <br />
            and <strong>bump</strong> driven by noise.
          </p>
        </div>
      </Html>
    </>
  )
}
