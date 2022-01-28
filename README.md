<br />

<p align="center">
  <img  src="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/raw/master/Assets/logo.png" alt="Logo" width="240" height="240" >
</p>

<h1 align="center">Custom Shader Material</h1>
<h3 align="center">Extend Three.js standard materials with your own shaders!</h3>

<br>

<p align="center">
  <a href="https://codesandbox.io/s/customshadermaterial-waves-0lg38?file=/src/App.tsx" target="_blank"><img height="260" src="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/raw/master/Assets/wavesDemo.png" alt="Waves" /></a>
</p>
<p align="middle">
  <i>The demo is real, you can click it! It contains full code, too. 📦</i>
</p>
<br />

<p align="center">
  <a href="https://www.npmjs.com/package/three-custom-shader-material" target="_blank">
    <img src="https://img.shields.io/npm/v/three-custom-shader-material.svg?style=flat&colorA=000000&colorB=000000" />
  </a>
  <a href="https://www.npmjs.com/package/three-custom-shader-material" target="_blank">
    <img src="https://img.shields.io/npm/dm/three-custom-shader-material.svg?style=flat&colorA=000000&colorB=000000" />
  </a>
  <a href="https://twitter.com/CantBeFaraz" target="_blank">
    <img src="https://img.shields.io/twitter/follow/CantBeFaraz?label=%40CantBeFaraz&style=flat&colorA=000000&colorB=000000&logo=twitter&logoColor=000000" alt="Chat on Twitter">
  </a>
</p>

<br>

Custom Shader Material (CSM) lets you extend Three.js' material library with your own Vertex and Fragment shaders.

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
        baseMaterial={MeshPhysicalMaterial}
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

<details>
  <summary>Show Typescript example</summary>

```tsx
import CustomShaderMaterial, { CSM } from 'three-custom-shader-material'

function Cube() {
  const materialRef = useRef<CSM | null>(null)

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
        baseMaterial={MeshPhysicalMaterial}
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
  <summary>Show VanillaJS example</summary>

```js
import { CSM } from 'three-custom-shader-material'

function Box() {
  const geometry = new THREE.BoxGeometry()
  const material = new CSM({
    MeshPhysicalMaterial    // baseMaterial
    /* glsl */ ` ... `,     // vertexShader
    /* glsl */ ` ... `,     // fragmentShader
    { uTime: {
        value: 0,           // uniforms
      },
    },
    {
      flatShading: true     // options
      color: 0xff00ff
    }
  })

  return new THREE.Mesh(geometry, material)
}
```

</details>

## Installation

npm

```sh
npm install three-custom-shader-material
```

Yarn

```sh
yarn add three-custom-shader-material
```

## Output Variables

CSM provides the following output variables:

| Variable         | Required | Type    | Description             | Available In    | Notes                                                                                                |
| ---------------- | -------- | ------- | ----------------------- | --------------- | ---------------------------------------------------------------------------------------------------- |
| csm_Position     | ❌       | `vec3`  | Custom vertex position. | Vertex Shader   | csm_Position will be multiplied by `projectionMatrix` and `modelViewPosition` furthur down the line. |
| csm_Normal       | ❌       | `vec3`  | Custom vertex normals.  | Vertex Shader   |                                                                                                      |
| csm_PointSize    | ❌       | `float` | Custom gl_Point size.   | Vertex Shader   |                                                                                                      |
| csm_DiffuseColor | ❌       | `vec4`  | Custom diffuse color.   | Fragment Shader |                                                                                                      |

You must use these variables like you would use standard GLSL output variables.

```c
// gl_Position = projectionMatrix * modelViewPosition * position * vec3(2.0);
csm_Position = position * vec3(2.0);
```

## Roadmap

- [ ] Support `MeshToonMaterial`
- [ ] Support `MeshLambertMaterial`
- [ ] Support `MeshDepthMaterial`
- [ ] `gl_FragColor` override
- [ ] Make `csm_Position` independent from `modelViewPosition` and `projectionMatrix`

## Credits

Icon made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/).
