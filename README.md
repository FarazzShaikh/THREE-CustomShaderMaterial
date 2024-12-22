<h1 align="center">Custom Shader Material</h1>
<h3 align="center">Extend Three.js standard materials with your own shaders!</h3>

<br>

<p align="center">
  <a href="https://farazzshaikh.github.io/THREE-CustomShaderMaterial/#/waves" target="_blank"><img width="32.3%" src="https://raw.githubusercontent.com/FarazzShaikh/THREE-CustomShaderMaterial/main/assets/waves-demo.png" alt="Waves" /></a>
   <a href="https://farazzshaikh.github.io/THREE-CustomShaderMaterial/#/points" target="_blank"><img width="32.3%" src="https://raw.githubusercontent.com/FarazzShaikh/THREE-CustomShaderMaterial/main/assets/points-demo.png" alt="Points" /></a>
  <a href="https://farazzshaikh.github.io/THREE-CustomShaderMaterial/#/caustics" target="_blank"><img width="32.3%" src="https://raw.githubusercontent.com/FarazzShaikh/THREE-CustomShaderMaterial/main/assets/caustics-demo.png" alt="Caustics" /></a>
</p>
</p>
<p align="middle">
  <i>These demos are real, you can click them! They contains full code, too.
  <a href="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/tree/main/examples/src/Examples">More demos here! 📦</a>
  </i>
</p>
<br />
<p align="center">
 
  <a href="https://www.npmjs.com/package/three-custom-shader-material" target="_blank">
    <img src="https://img.shields.io/npm/v/three-custom-shader-material.svg?style=for-the-badge" />
  </a>
  <a href="https://www.npmjs.com/package/three-custom-shader-material" target="_blank">
    <img src="https://img.shields.io/npm/dt/three-custom-shader-material?style=for-the-badge&colorB=red" />
  </a>
  <br />
  <a href="https://github.com/sponsors/FarazzShaikh" target="_blank">
    <img src="https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors" />
  </a>
  <a href="https://twitter.com/CantBeFaraz" target="_blank">
    <img src="https://img.shields.io/twitter/follow/CantBeFaraz?style=for-the-badge&logo=x" alt="Chat on Twitter">
  </a>
</p>

Custom Shader Material (CSM) lets you extend Three.js' material library with your own Vertex and Fragment shaders. **_It Supports both Vanilla and React!_**

<details>
  <summary>Show Vanilla example</summary>

```js
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

function Box() {
  const geometry = new THREE.BoxGeometry();
  const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: /* glsl */ ` ... `, // Your vertex Shader
    fragmentShader: /* glsl */ ` ... `, // Your fragment Shader
    // Your Uniforms
    uniforms: {
      uTime: { value: 0 },
      ...
    },
    // Base material properties
    flatShading: true,
    color: 0xff00ff,
    ...
  });

  return new THREE.Mesh(geometry, material);
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
        vertexShader={/* glsl */ ` ... `} // Your vertex Shader
        fragmentShader={/* glsl */ ` ... `} // Your fragment Shader
        // Your Uniforms
        uniforms={{
          uTime: { value: 0 },
          ...
        }}
        // Base material properties
        flatShading
        color={0xff00ff}
        ...
      />
    </mesh>
  )
}
```

</details>
<details>
  <summary>Show Vue (Tresjs) example</summary>
  
  > Moved to [Cientos' Docs](https://cientos.tresjs.org/guide/materials/custom-shader-material.html#trescustomshadermaterial)

</details>

## Installation

```bash
npm install three-custom-shader-material
yarn add three-custom-shader-material
```

## Output Variables

CSM provides the following output variables, all of them are optional but you MUST use these variables like you would use standard GLSL output variables to see results.

| Variable                          | Type    | Description                                                | Available In                                    | Notes                                                                                                                                                          |
| --------------------------------- | ------- | ---------------------------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <h3>Vertex Shader</h3>            | -       | -                                                          | -                                               | -                                                                                                                                                              |
| csm_Position                      | `vec3`  | Custom vertex position.                                    | Vertex Shader                                   | csm_Position will be projected furthur down the line. Thus, no projection is needed here.                                                                      |
| csm_PositionRaw                   | `vec4`  | Direct equivalent of `gl_Position`.                        | Vertex Shader                                   |                                                                                                                                                                |
| csm_Normal                        | `vec3`  | Custom vertex normals.                                     | Vertex Shader                                   |
| csm_PointSize                     | `float` | Direct equivalent of `gl_PointSize`.                       | Vertex Shader                                   | Only available in `PointsMaterial`                                                                                                                             |
| <h3>Fragmet Shader</h3>           | -       | -                                                          | -                                               | -                                                                                                                                                              |
| csm_DiffuseColor                  | `vec4`  | Custom diffuse color.                                      | Fragment Shader                                 | Base material's shading will be applied to this color.                                                                                                         |
| csm_FragColor                     | `vec4`  | Direct equivalent of `gl_FragColor`.                       | Fragment Shader                                 | csm_FragColor will override any shading applied by a base material. To preserve shading and other effects like roughness and metalness, use `csm_DiffuseColor` |
| csm_Roughness                     | `float` | Custom roughness.                                          | Fragment Shader                                 | Only available in materials with an `roughnessMap`.                                                                                                            |
| csm_Metalness                     | `float` | Custom metalness.                                          | Fragment Shader                                 | Only available in materials with an `metalnessMap`.                                                                                                            |
| csm_AO                            | `float` | Custom AO.                                                 | Fragment Shader                                 | Only available in materials with an `aoMap`.                                                                                                                   |
| csm_Bump                          | `vec3`  | Custom bump as perturbation to fragment normals.           | Fragment Shader                                 | Only available in materials with a `bumpMap`.                                                                                                                  |
| csm_Clearcoat                     | `float` | Custom clearcoat factor.                                   | Fragment Shader                                 | Only available in materials with a `clearcoat`.                                                                                                                |
| csm_ClearcoatRoughness            | `float` | Custom clearcoat roughenss factor.                         | Fragment Shader                                 | Only available in materials with a `clearcoat`.                                                                                                                |
| csm_ClearcoatNormal               | `vec3`  | Custom clearcoat normal.                                   | Fragment Shader                                 | Only available in materials with a `clearcoat`.                                                                                                                |
| csm_Transmission                  | `float` | Custom transmission factor.                                | Fragment Shader                                 | Only available in materials with a `transmission`.                                                                                                             |
| csm_Thickness                     | `float` | Custom transmission thickness.                             | Fragment Shader                                 | Only available in materials with a `transmission`.                                                                                                             |
| csm_Iridescence                   | `float` | Custom iridescence factor.                                 | Fragment Shader                                 | Only available in materials with a `iridescence`.                                                                                                              |
| csm_Emissive                      | `vec3`  | Custom emissive color.                                     | Fragment Shader                                 | Only available in materials with a `emissive`.                                                                                                                 |
| csm_FragNormal                    | `vec3`  | Custom fragment normal.                                    | Only available in materials with a `normalMap`. |
| <h3>Fragmet Shader (Special)</h3> | -       | -                                                          | -                                               | -                                                                                                                                                              |
| csm_DepthAlpha                    | `float` | Custom alpha for `MeshDepthMaterial`.                      | Fragment Shader                                 | Useful for controlling `customDepthMaterial` with same shader as the shader material.                                                                          |
| csm_UnlitFac                      | `float` | Custom mix between `csm_DiffuseColor` and `csm_FragColor`. | Fragment Shader                                 | Can be used to mix lit and unlit materials. Set to `1.0` by default if `csm_FragColor` is found in shader string.                                              |

## Typing

CSM infers prop types based on the `baseMaterial` prop. However, if this does not work for what ever reason, you can pass your base material type as a generic to `CustomShaderMaterial<T>`.

```ts
// Vanilla
const material = new CustomShaderMaterial<THREE.MeshPhysicalMaterial>({
  baseMaterial: THREE.MeshPhysicalMaterial,
  //...Any props
});

// React
<CustomShaderMaterial<THREE.MeshPhysicalMaterial>
  baseMaterial={THREE.MeshPhysicalMaterial}
  //...Any props
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

> Note: If `<KEYWORD>` is not found in shader string, the patch map will not be applied. To ALWAYS apply a patch map, use the special keyword - `*` (star).
>
> ```js
> patchMap={{
>   "*": { "TO_REPLACE": "REPLACED_WITH" }
> }}
> ```

## Extending already extended materials

CSM allows you to extend other CSM instances. Values set in the first shader will affect the next.

> Note: Extending of other materials that use `onBeforeCompile` may or may not work depending on if the default `#includes` are mangled.

<details>
  <summary>Show Vanilla example</summary>

```js
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

function Box() {
  const material1 = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    //...Any props
  });
  const material2 = new CustomShaderMaterial({
    baseMaterial: material1,
    //...Any props
  });
}
```

</details>

<details >
  <summary>Show React example</summary>

```jsx
import CustomShaderMaterial from "three-custom-shader-material";
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla";

function Cube() {
  const [materialRef, setMaterialRef] = useState();

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
  );
}
```

</details>

### Gotchas

- `csm_Position` **MUST** be a non-projected vector. i.e., no need to multiply `projectionMatrix` or `modelViewPosition` with it. If you require projection, use `csm_PositionRaw`.
- Instancing must be handled manually when using `csm_PositionRaw` by multiplying in `instanceMatrix` into your projection math.
- When extending already extended material, variables, uniforms, attributes, varyings and functions are **NOT** scoped to the material they are defined in. Thus, you **WILL** get redefinition errors if you do not manually scope these identifiers.
- Extending of other materials that use `onBeforeCompile` may or may not work depending on if the default `#includes` are mangled.
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

  Where A was the first in the chain.

- Cache key calculation takes into account base material's cache key. Useful for propagating changes across multiple chained CSM instances.
- If you find yourself lost in a patchMap, it's often simpler to just make a `ShaderMaterial` with the necessary `#includes`.

## Performance

With v6, CSM's initialization cost is now negligible 🥳 Still, a couple important notes about performance:

- Changing these props will rebuild the material
  - `baseMaterial`
  - `fragmentShader`
  - `vertexShader`
  - `uniforms`
  - `cacheKey`
- CSM uses ThreeJS's default shader program caching system. Materials with the same cache key, will use the the same shader program.
- `<meshPhysicalMaterial />` and `<CSM baseMaterial={meshPhysicalMaterial}>` are the same, and will use the same cached shader program. The default cache key is such:

  ```js
  (cacheKey?.() || hash((vertexShader || "") + (fragmentShader || ""))) +
    baseMaterialCacheKey?.();
  ```

  You can provide your own cache key function via the `cacheKey` prop.

> Note: CSM will only rebuild if the **reference** to the above props change, for example, in React, doing `uniforms={{...}}` means that the uniforms object is unstable, i.e. it is re-created, with a **new** reference every render. Instead, condsider memoizing the uniforms prop `const uniforms = useMemo(() -> ({...}));`. The uniforms object will then have the same refrence on every render.

> If the uniforms are memoized, changing their value by doing `uniforms.foo.value = ...` will not cause CSM to rebuild, as the refrence of `uniforms` does not change.

## License

```
MIT License

Copyright (c) 2024 Faraz Shaikh

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
