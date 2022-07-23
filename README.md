<br />

<p align="center">
  <img  src="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/raw/master/Assets/logo.png" alt="Logo" width="240" height="240" >
</p>

<h1 align="center">Custom Shader Material</h1>
<h3 align="center">Extend Three.js standard materials with your own shaders!</h3>

<br>

<p align="center">
  <a href="https://codesandbox.io/embed/github/farazzshaikh/THREE-CustomShaderMaterial/tree/master/examples/waves" target="_blank"><img width="32.3%" src="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/raw/master/Assets/waves-demo.png" alt="Waves" /></a>
   <a href="https://codesandbox.io/embed/github/farazzshaikh/THREE-CustomShaderMaterial/tree/master/examples/points" target="_blank"><img width="32.3%" src="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/raw/master/Assets/points-demo.png" alt="Waves" /></a>
  <a href="https://codesandbox.io/embed/github/farazzshaikh/THREE-CustomShaderMaterial/tree/master/examples/caustics" target="_blank"><img width="32.3%" src="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/raw/master/Assets/caustics-ex.png" alt="Caustics" /></a>
</p>
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

Custom Shader Material (CSM) lets you extend Three.js' material library with your own Vertex and Fragment shaders. **_It Supports both Vanilla and React!_**

<details>
  <summary>Show Vanilla example</summary>

```js
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

function Box() {
  const geometry = new THREE.BoxGeometry()
  const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: /* glsl */ ` ... `,
    fragmentShader: /* glsl */ ` ... `,
    uniforms: {
      uTime: {
        value: 0,
      },
    },
    flatShading: true,
    color: 0xff00ff,
  })

  return new THREE.Mesh(geometry, material)
}
```

</details>

<details >
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

## Installation

```bash
npm install three-custom-shader-material
yarn add three-custom-shader-material
```

## Output Variables

CSM provides the following output variables, all of them are optional but you MUST use these variables like you would use standard GLSL output variables to see results.

| Variable         | Type    | Description             | Available In    | Notes                                                                                                                                                          |
| ---------------- | ------- | ----------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| csm_Position     | `vec3`  | Custom vertex position. | Vertex Shader   | csm_Position will be projected furthur down the line. Thus, no projection is needed here.                                                                      |
| csm_DiffuseColor | `vec4`  | Custom diffuse color.   | Fragment Shader |                                                                                                                                                                |
| csm_Normal       | `vec3`  | Custom vertex normals.  | Vertex Shader   |                                                                                                                                                                |
| csm_PointSize    | `float` | Custom gl_PointSize.    | Vertex Shader   | Only available in `PointsMaterial`                                                                                                                             |
| csm_FragColor    | `vec4`  | Custom gl_FragColor.    | Fragment Shader | csm_FragColor will override any shading applied by a base material. To preserve shading and other effects like roughness and metalness, use `csm_DiffuseColor` |
| csm_Emissive     | `vec3`  | Custom emissive color.  | Fragment Shader | Only available in `MeshPhysicalMaterial` and `MeshStandardMaterial`                                                                                            |
| csm_Roughness    | `float` | Custom roughness.       | Fragment Shader | Only available in `MeshPhysicalMaterial` and `MeshStandardMaterial`                                                                                            |
| csm_Metalness    | `float` | Custom metalness.       | Fragment Shader | Only available in `MeshPhysicalMaterial` and `MeshStandardMaterial`                                                                                            |

```glsl
// gl_Position = projectionMatrix * modelViewPosition * position * vec3(2.0);
csm_Position = position * vec3(2.0);
```

## Custom overrides

You can define any custom overrides you'd like using the `patchMap` prop. The prop is used as shown below.

```js
const material = new CustomShaderMaterial({
   baseMaterial: THREE.MeshPhysicalMaterial,
   vertexShader: ` ... `,
   fragmentShader: ... `,
   uniforms: {...},
   patchMap={{
      "<KEYWORD>": {        // The keyword you will assign to in your custom shader
        "TO_REPLACE":       // The chunk you'd like to replace.
          "REPLACED_WITH"   // The chunk you'd like put in place of `TO_REPLACE`
      }
   }}
})
```
