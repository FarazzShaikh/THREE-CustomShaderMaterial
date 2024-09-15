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
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

function Box() {
  const geometry = new THREE.BoxGeometry();
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
<details>
  <summary>Show Vue (Tresjs) example</summary>

_You need to have installed [Cientos](https://cientos.tresjs.org/) pkg to use this component._

```vue
<script setup>
import { CustomShaderMaterial } from "@tresjs/cientos";
</script>
<template>
  <TresMesh>
    <TresTorusKnotGeometry :args="[1, 0.3, 512, 32]" />
    <CustomShaderMaterial
      :baseMaterial="THREE.MeshPhysicalMaterial"
      :vertexShader="yourGLSLVertex"
      :fragmentShader="yourGLSLFragment"
      :uniforms="yourUniforms"
      silent
    />
  </TresMesh>
</template>
```

</details>
