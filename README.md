
<br />
<p align="center">
   <a href="">
        <img src="./Assets/icon.png" alt="Logo" width="300" height="300">
    </a>

  <h1 align="center"><sup>THREE</sup>CustomShaderMaterial</h1>

  <p align="center">
    Extend Three.js standard materials with your own vertex shaders!
    <br />
    <a href="https://farazzshaikh.github.io/THREE-CustomShaderMaterial/example/index.html">View Demo</a>
    ·
    <a href="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/issues/new">Report Bug</a>
    ·
    <a href="https://farazzshaikh.github.io/THREE-CustomShaderMaterial/">API Docs</a>
  </p>
  <p align="center">
    <a href="https://www.npmjs.com/package/three-custom-shader-material"><img align="center" src="https://img.shields.io/npm/v/three-custom-shader-material?color=cc3534&style=for-the-badge" /></a>
  </p>
</p>

## BREAKING

Version 2.0.0 introduces potentially breaking changes. Please read the API and adjust your code accordingly.

## Installation

Make sure to have ThreeJS installed.
```bash
$ npm i three
```

Install through NPM
```bash
$ npm i three-custom-shader-material
```

Install through Yarn
```bash
$ yarn add three-custom-shader-material
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
// Import GLSL vertex shaders as strings
import header from "example/shaders/header.js";
import main from "example/shaders/main.js";
import defines from "example/shaders/defines.js";

// Import GLSL fragment shaders as strings
import fheader from "example/shaders/fheader.js";
import fmain from "example/shaders/fmain.js";
import fdefines from "example/shaders/fdefines.js";

// ...

const material = new CustomShaderMaterial({
    // Required
    baseMaterial: TYPES.PHYSICAL,       // Material to extend
    // Required
    vShader: {
        defines: defines,           
        header: header,                 // Custom Vertex Shader
        main: main,
    },
    // Optional
    fShader: {
        defines: fdefines,           
        header: fheader,                 // Custom Fragment Shader
        main: fmain,
    },
    // Optional
    uniforms: { 
        three_noise_seed: { value: 2 }  // Custom uniforms
    }, 
    // Optional
    passthrough: {
        wireframe: false,
        lights: true,                   // options passthrough to unerlying material.
  },
});

const plane = new THREE.Mesh(geometry, material); // Use like a regular material
```
## Note

- The variables `newPos` and `newNormal` must be defined in the `main` section of the custom vertex shader. 
- The Variable `newColor` must be assigned a value in the `main` section of the custom fragment shader.

See the example shaders for how to format shaders for use with CSM or use the `loadShadersCSM` loader from my library [glNoise](https://github.com/FarazzShaikh/glNoise).

## Credits

Icon made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/).
