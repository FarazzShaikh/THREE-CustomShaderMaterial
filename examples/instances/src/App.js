import { OrbitControls } from '@react-three/drei'
import { Environment } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { IcosahedronBufferGeometry, MeshPhysicalMaterial, Object3D, PointsMaterial } from 'three'

import CustomShaderMaterial from 'three-custom-shader-material'
import { patchShaders } from 'gl-noise/build/glNoise.m'

const shader = {
  vertex: /* glsl */ `
    uniform float uTime;

    vec3 displace(vec3 point) {
      vec3 instancePosition = (instanceMatrix * vec4(point, 1.)).xyz;
      return instancePosition + (normal * gln_perlin((instancePosition * 2.) + uTime) * 0.5);
    }  

    vec3 orthogonal(vec3 v) {
      return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
      : vec3(0.0, -v.z, v.y));
    }

    vec3 recalcNormals(vec3 newPos) {
      float offset = 0.001;
      vec3 tangent = orthogonal(normal);
      vec3 bitangent = normalize(cross(normal, tangent));
      vec3 neighbour1 = position + tangent * offset;
      vec3 neighbour2 = position + bitangent * offset;

      vec3 displacedNeighbour1 = displace(neighbour1);
      vec3 displacedNeighbour2 = displace(neighbour2);

      vec3 displacedTangent = displacedNeighbour1 - newPos;
      vec3 displacedBitangent = displacedNeighbour2 - newPos;

      return normalize(cross(displacedTangent, displacedBitangent));
    }

    void main() {
      vec3 p = displace(position);
      csm_PositionRaw = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(p, 1.);
      csm_Normal = recalcNormals(p);
    }
    `,
  fragment: /* glsl */ `
    void main() {
      csm_DiffuseColor = vec4(1.);
    }
    `,
}

const amount = 150
const dummy = new Object3D()
function Thing() {
  const ref = useRef()

  useEffect(() => {
    const mesh = ref.current

    let i = 0
    for (let x = 0; x < amount; x++) {
      dummy.position.set(Math.random(), Math.random(), Math.random())
      dummy.rotation.set(Math.random(), Math.random(), Math.random())
      dummy.position.multiplyScalar(10)

      dummy.position.x -= 5
      dummy.position.y -= 5
      dummy.position.z -= 5

      dummy.updateMatrix()

      mesh.setMatrixAt(i++, dummy.matrix)
    }
    mesh.instanceMatrix.needsUpdate = true
  }, [])

  const args = useMemo(() => [null, null, amount], [amount])
  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
    }),
    []
  )

  useFrame(({ clock }) => {
    ref.current.material.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <group>
      <instancedMesh ref={ref} args={args}>
        <sphereGeometry args={[1, 64, 64]} />
        <CustomShaderMaterial
          baseMaterial={MeshPhysicalMaterial}
          size={0.01}
          vertexShader={patchShaders(shader.vertex)}
          fragmentShader={patchShaders(shader.fragment)}
          uniforms={uniforms}
          transparent
        />
      </instancedMesh>
    </group>
  )
}

function App() {
  return (
    <>
      <Canvas
        camera={{
          position: [10, 10, 10],
        }}
      >
        <Suspense>
          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr" />
          <Thing />
        </Suspense>

        <OrbitControls enablePan={false} />
      </Canvas>
    </>
  )
}

export default App
