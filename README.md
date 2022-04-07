<br />

<p align="center">
  <img  src="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/raw/master/Assets/logo.png" alt="Logo" width="240" height="240" >
</p>

<h1 align="center">Custom Shader Material</h1>
<h3 align="center">Extend Three.js standard materials with your own shaders!</h3>

<br>

<p align="center">
  <a href="https://0lg38.sse.codesandbox.io/" target="_blank"><img width="49%" src="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/raw/master/Assets/waves-demo.png" alt="Waves" /></a>
   <a href="https://0lg38.sse.codesandbox.io/" target="_blank"><img width="49%" src="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/raw/master/Assets/points-demo.png" alt="Waves" /></a>
</p>
<p align="middle">
  <i>The demo is real, you can click it! It contains full code, too. 📦</i>
</p>
<br />

<p align="center">
  <a href="https://www.npmjs.com/package/three-custom-shader-material" target="_blank">
    <img src="https://img.shields.io/npm/v/three-custom-shader-material.svg?style=for-the-badge&colorA=000000&colorB=000000" />
  </a>
  <a href="https://www.npmjs.com/package/three-custom-shader-material" target="_blank">
    <img src="https://img.shields.io/npm/dt/three-custom-shader-material?style=for-the-badge&colorA=000000&colorB=000000" />
  </a>
  <a href="https://twitter.com/CantBeFaraz" target="_blank">
    <img src="https://img.shields.io/twitter/follow/CantBeFaraz?label=%40CantBeFaraz&style=for-the-badge&colorA=000000&colorB=000000&logo=twitter&logoColor=000000" alt="Chat on Twitter">
  </a>
</p>

<br>

Custom Shader Material (CSM) lets you extend Three.js' material library with your own Vertex and Fragment shaders.

<p align="center">
  <img width="40%" src="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/raw/master/Assets/react-ex.png" alt="Waves" />
  <img width="40%" src="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/raw/master/Assets/vanilla-ex.png" alt="Waves" />
</p>
<p align="middle">
  <i>Supports both Vanilla and React!</i>
</p>
<br />

<details>
  <summary>Show React example</summary>

```jsx
import CustomShaderMaterial from 'three-custom-shader-material'

function Cube() {
  const materialRef = useRef()

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh>
      <boxGeometry />
      <CustomShaderMaterial
        ref={materialRef}
        baseMaterial={THREE.MeshPhysicalMaterial}
        vertexShader={/* glsl */ ` ... `}
        fragmentShader={/* glsl */ ` ... `}
        uniforms={{
          uTime: {
            value: 0,
          },
        }}
        flatShading
        color={0xff00ff}
        // ...
      />
    </mesh>
  )
}
```

</details>

<details>
  <summary>Show React TS example</summary>

```tsx
import CustomShaderMaterial from 'three-custom-shader-material'
import CustomShaderMaterialType from 'three-custom-shader-material/vanilla'

function Cube() {
  const materialRef = useRef<CustomShaderMaterialType | null>(null)

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh>
      <boxGeometry />
      <CustomShaderMaterial
        ref={materialRef}
        baseMaterial={THREE.MeshPhysicalMaterial}
        vertexShader={/* glsl */ ` ... `}
        fragmentShader={/* glsl */ ` ... `}
        uniforms={{
          uTime: {
            value: 0,
          },
        }}
        flatShading
        color={0xff00ff}
        // ...
      />
    </mesh>
  )
}
```

</details>

<details>
  <summary>Show Vanilla example</summary>

```js
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

function Box() {
  const geometry = new THREE.BoxGeometry()
  const material = new CustomShaderMaterial(
    THREE.MeshPhysicalMaterial    // baseMaterial
    /* glsl */ ` ... `,           // vertexShader
    /* glsl */ ` ... `,           // fragmentShader
    { uTime: {
        value: 0,                 // uniforms
      },
    },
    {
      flatShading: true           // options
      color: 0xff00ff
    }
  )

  return new THREE.Mesh(geometry, material)
}
```

</details>

## Installation

npm

```bash
npm install three-custom-shader-material
```

Yarn

```bash
yarn add three-custom-shader-material
```

## Output Variables

CSM provides the following output variables:

| Variable         | Required | Type    | Description             | Available In    | Notes                                                                                                |
| ---------------- | -------- | ------- | ----------------------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| csm_Position     | ❌       | `vec3`  | Custom vertex position. | Vertex Shader   | csm_Position will be multiplied by `projectionMatrix` and `modelViewPosition` furthur down the line. |
| csm_Normal       | ❌       | `vec3`  | Custom vertex normals.  | Vertex Shader   |                                                                                                      |
| csm_PointSize    | ❌       | `float` | Custom gl_PointSize.    | Vertex Shader   |                                                                                                      |
| csm_DiffuseColor | ❌       | `vec4`  | Custom diffuse color.   | Fragment Shader |                                                                                                      |
| csm_FragColor    | ❌       | `vec4`  | Custom gl_FragColor.    | Fragment Shader |                                                                                                      |
| csm_Emissive     | ❌       | `vec3`  | Custom emissive color.  | Fragment Shader |                                                                                                      |

You must use these variables like you would use standard GLSL output variables.

```glsl
// gl_Position = projectionMatrix * modelViewPosition * position * vec3(2.0);
csm_Position = position * vec3(2.0);
```

**Note: Shaders passed to CSM are indentation-sensitive.**

```glsl
void main() {
  if(...) {

    ...

} // Bad indentation. This will cause a compile error.

  ...

  }  // Bad indentation. This will cause a compile error.
```
