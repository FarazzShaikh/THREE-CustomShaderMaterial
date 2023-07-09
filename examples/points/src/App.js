import { OrbitControls } from '@react-three/drei'
import { Environment } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef } from 'react'
import { IcosahedronGeometry, PointsMaterial } from 'three'

import CustomShaderMaterial from 'three-custom-shader-material'
import { patchShaders } from 'gl-noise/build/glNoise.m'
import Tag from './Tag'

const shader = {
  vertex: /* glsl */ `
    uniform float uTime;
    varying float vVisibility;
    varying vec3 vViewNormal;

    void main() {
      vec3 n = gln_curl(position + uTime * 0.05);

      
			vec3 _viewNormal = normalMatrix * normal;
      vViewNormal = _viewNormal;
			vec4 _mvPosition = modelViewMatrix * vec4(position, 1.);

    	float visibility = step(-0.1, dot(-normalize(_mvPosition.xyz), normalize(_viewNormal)));
      vVisibility = visibility;

      csm_Position = position + (normal * n * 0.5);
      csm_PointSize += ((1. - visibility) * 0.05);
    }
    `,
  fragment: /* glsl */ `
    varying float vVisibility;
    varying vec3 vViewNormal;

    void main() {

      vec2 uv = vec2(gl_PointCoord.x, 1. - gl_PointCoord.y);
      vec2 cUV = 2. * uv - 1.;
      float a = .15 / length(cUV);
      float alpha = 1.;
      if(a < 0.15) alpha = 0.;

      csm_DiffuseColor = vec4(vViewNormal, (vVisibility + 0.01) * alpha);
    }


    `,
}

function Thing() {
  const pointsRef = useRef()
  const matRef = useRef()

  useEffect(() => {
    pointsRef.current.geometry = new IcosahedronGeometry(1, 32)
  }, [])

  useFrame(({ clock }) => {
    matRef.current.uniforms.uTime.value = clock.elapsedTime
  })

  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0,
      },
    }),
    []
  )

  return (
    <group>
      <points ref={pointsRef}>
        <CustomShaderMaterial
          ref={matRef}
          baseMaterial={PointsMaterial}
          size={0.02}
          vertexShader={patchShaders(shader.vertex)}
          fragmentShader={patchShaders(shader.fragment)}
          uniforms={uniforms}
          transparent
        />
      </points>
    </group>
  )
}

function App() {
  return (
    <>
      <Canvas
        camera={{
          position: [0, 0, 2.5],
        }}
      >
        <Suspense>
          <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/venice_sunset_1k.hdr" />
          <Thing />
        </Suspense>

        <OrbitControls enablePan={false} />
      </Canvas>

      <Tag />
    </>
  )
}

export default App
