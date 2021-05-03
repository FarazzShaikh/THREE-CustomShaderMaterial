
<br />
<p align="center">
  <h1 align="center">THREE-CustomShaderMaterial</h1>

  <p align="center">
    Extend Three.js standard materials with your own vertex shaders!
    <br />
    <a href="">View Demo</a>
    ·
    <a href="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/issues/new">Report Bug</a>
    ·
    <a href="">API Docs</a>
  </p>
  <p align="center">
    <a href="https://www.npmjs.com/package/three-custom-shader-material"><img align="center" src="https://img.shields.io/npm/v/three-custom-shader-material?color=cc3534&style=for-the-badge" /></a>
  </p>
</p>


## Installation

Make sure to have ThreeJS installed.
```bash
$ npm i three
```

Install through NPM
```bash
$ npm i three-custom-shader-material
```

For Browsers, download `build/three-csm.js`.

## Importing

### Browser

In your HTML
```html
<script src="lib/three-csm.js"></script>
<script src="./main.js" defer></script>
```

Then, in your JavaScript you can use the `THREE_Noise` object.
```js
const { CustomShaderMaterial, TYPES } = THREE_CustomShaderMaterial;
```

### NodeJS
In NodeJS, you can import it like you normally do.
```js
import {CustomShaderMaterial, TYPES} from "three-custom-shader-material"
```

## Usage

```js
// Import shader chunks
import global from "example/shaders/global.js";
import main from "example/shaders/main.js";
import defines from "example/shaders/defines.js";

// ...

const material = new CustomShaderMaterial({
    baseMaterial: TYPES.PHYSICAL,       // Material to extend
    vShader: {
        defines: defines,           
        header: global,                 // Custom Vertex Shader
        main: main,
    },
    uniforms: [{ 
        three_noise_seed: { value: 2 } // Custom uniforms
    }], 
    passthrough: {
        wireframe: false,
        lights: true,                   // Options passthrough to unerlying material.
  },
});

const plane = new THREE.Mesh(geometry, material); // Use like a regular material
```
## Note

The variables `newPos` and `newNormal` must be defined in the `main` section of the injected shader. See the example shaders for how to format shaders for use with CSM.