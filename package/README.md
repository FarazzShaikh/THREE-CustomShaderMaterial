<h1 align="center">Custom Shader Material</h1>

<a href="https://codesandbox.io/s/github/FarazzShaikh/THREE-CustomShaderMaterial/tree/main/examples/hero" target="_blank"><img  src="https://raw.githubusercontent.com/FarazzShaikh/THREE-CustomShaderMaterial/main/examples/hero/thumbnail.png" alt="Hero" /></a>

<h3 align="center">Extend Three.js standard materials with your own shaders!</h3>

<br>

<p align="center">
  <a href="https://codesandbox.io/s/github/FarazzShaikh/THREE-CustomShaderMaterial/tree/main/examples/waves" target="_blank"><img width="32.3%" src="https://raw.githubusercontent.com/FarazzShaikh/THREE-CustomShaderMaterial/main/examples/waves/thumbnail.png" alt="Waves" /></a>
   <a href="https://codesandbox.io/s/github/FarazzShaikh/THREE-CustomShaderMaterial/tree/main/examples/points" target="_blank"><img width="32.3%" src="https://raw.githubusercontent.com/FarazzShaikh/THREE-CustomShaderMaterial/main/examples/points/thumbnail.png" alt="Points" /></a>
  <a href="https://codesandbox.io/s/github/FarazzShaikh/THREE-CustomShaderMaterial/tree/main/examples/caustics" target="_blank"><img width="32.3%" src="https://raw.githubusercontent.com/FarazzShaikh/THREE-CustomShaderMaterial/main/examples/caustics/thumbnail.png" alt="Caustics" /></a>
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
    silent: true, // Disables the default warning if true
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
        {/*silent parameter to true disables the default warning if needed*/}
        silent
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

| Variable         | Type    | Description                                                                                                           | Available In    | Notes                                                                                                                                                          |
| ---------------- | ------- | --------------------------------------------------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| csm_Position     | `vec3`  | Custom vertex position.                                                                                               | Vertex Shader   | csm_Position will be projected furthur down the line. Thus, no projection is needed here.                                                                      |
| csm_PositionRaw  | `vec3`  | Direct equivalent of `gl_Position`.                                                                                   | Vertex Shader   |                                                                                                                                                                |
| csm_Normal       | `vec3`  | Custom vertex normals.                                                                                                | Vertex Shader   |
| csm_PointSize    | `float` | Custom gl_PointSize.                                                                                                  | Vertex Shader   | Only available in `PointsMaterial`                                                                                                                             |
| -                | -       | -                                                                                                                     | -               | -                                                                                                                                                              |
| csm_DiffuseColor | `vec4`  | Custom diffuse color.                                                                                                 | Fragment Shader |
| csm_FragColor    | `vec4`  | Direct equivalent of `gl_FragColor`.                                                                                  | Fragment Shader | csm_FragColor will override any shading applied by a base material. To preserve shading and other effects like roughness and metalness, use `csm_DiffuseColor` |
| csm_Emissive     | `vec3`  | Custom emissive color.                                                                                                | Fragment Shader | Only available in `MeshPhysicalMaterial` and `MeshStandardMaterial`                                                                                            |
| csm_Roughness    | `float` | Custom roughness.                                                                                                     | Fragment Shader | Only available in `MeshPhysicalMaterial` and `MeshStandardMaterial`                                                                                            |
| csm_Metalness    | `float` | Custom metalness.                                                                                                     | Fragment Shader | Only available in `MeshPhysicalMaterial` and `MeshStandardMaterial`                                                                                            |
| csm_AO           | `float` | Custom AO.                                                                                                            | Fragment Shader | Only available in materials with an `aoMap`.                                                                                                                   |
| csm_Bump         | `vec3`  | Custom Bump.                                                                                                          | Fragment Shader | Only available in materials with a `bumpMap`.                                                                                                                  |
| csm_DepthAlpha   | `float` | Custom alpha for depth material. Lets you control customDepthMaterial with the same shader as your regular materials. | Fragment Shader |                                                                                                                                                                |

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

## Extending already extended materials

CSM allows you to extend other CSM instances or materials that already use `onBeforeCompile` to extend base functionality such as [`MeshTransmissionMaterial`](https://github.com/pmndrs/drei#meshtransmissionmaterial). It is as simple as passing a ref to that material in as the `baseMaterial`:

<details>
  <summary>Show Vanilla example</summary>

```js
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

function Box() {
  const material1 = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    //...Any props
  })
  const material2 = new CustomShaderMaterial({
    baseMaterial: material1,
    //...Any props
  })

  // OR
  const material1 = new MeshTransmissionMaterial()
  const material2 = new CustomShaderMaterial({
    baseMaterial: material1,
    //...Any props
  })
}
```

</details>

<details >
  <summary>Show React example</summary>

```jsx
import CustomShaderMaterial from 'three-custom-shader-material'
import CustomShaderMaterialImpl from 'three-custom-shader-material/vanilla'

function Cube() {
  const [materialRef, setMaterialRef] = useState()
  // OR
  const materialRef = useMemo(
    () =>
      new CustomShaderMaterialImpl({
        baseMaterial: THREE.MeshPhysicalMaterial,
      }),
    []
  )

  return (
    <>
      <CustomShaderMaterial
        ref={setMaterialRef}
        baseMaterial={THREE.MeshPhysicalMaterial}
        //...Any props
      />

      {materialRef && (
        <CustomShaderMaterial
          baseMaterial={materialRef}
          //...Any props
        />
      )}
    </>
  )
}
```

</details>

### Gotchas

- When extending already extended material, variables, uniforms, attributes, varyings and functions are **NOT** scoped to the material they are defined in. Thus, you **WILL** get redefinition errors if you do not manually scope these identifiers.
- When using an instance of CSM as the baseMaterial, or chining multiple CSM instances, or when extending any material that uses `onBeforeCompile` the injection order is as follows:

  ```glsl
  void main() {
    // shader A
    // shader B
    // shader C
    // shader D

    // original shader
  }
  ```

  > The last injected shader will contain values set in all the shaders injected before it.

## Performance

CSM is great for small overrides. Even though doable, if you find yourself lost in a patchMap, it's often simpler to just make a `ShaderMaterial` with the necessary `#includes`.

CSM has a non-negligible startup cost, i.e it does take more milliseconds than a plain `ShaderMaterial` to load. However, once loaded it is practically free. It also uses caching so reusing materials will not incur any extra cost. Couple important notes about performance:

- Changing these props will rebuild the material
  - `baseMaterial`
  - `fragmentShader`
  - `vertexShader`
  - `uniforms`
  - `cacheKey`
- `<meshPhysicalMaterial />` and `<CSM baseMaterial={meshPhysicalMaterial}>` are the same, and will use the same cached shader program. The default cache key is such:

  ```js
  hash(stripSpaces(fragmentShader) + stripSpaces(vertexShader) + serializedUniforms)
  ```

  You can provide your own cache key function via the `cacheKey` prop.

## Development

```sh
git clone https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
cd THREE-CustomShaderMaterial
yarn
yarn dev
```

Will watch for changes in `package/` and will hot-reload `examples/debug`.

## License

```
MIT License

Copyright (c) 2021 Faraz Shaikh

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
