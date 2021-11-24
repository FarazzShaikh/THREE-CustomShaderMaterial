
<br />
<p align="center">
   <a href="">
        <img src="./Assets/logo.png" alt="Logo" width="300" height="300">
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

## Installation
```bash
npm install three-custom-shader-material
# or
yarn add three-custom-shader-material
```

For Browsers, download files from `build/`. Here is what each file is:

- `three-csm.js` - IIFE type module for browsers importing Three using a `<script>` tag.
- `three-csm.m.js` - ES Module. Import Three the NodeJS way `import * as THREE from "three"`
- `three-csm.m.cdn.js` - ES Module. Import Three from a CDN `import * as THREE from "https://cdn.skypack.dev/three"`

## Importing


### NodeJS

In NodeJS, you can import it like you normally do.
```js
import { CustomShaderMaterial, TYPES } from "three-custom-shader-material"
```


### ES modules

```js
import { CustomShaderMaterial, TYPES } from "three-csm.m.js"
// or
import { CustomShaderMaterial, TYPES } from "three-csm.m.cdn.js"
```

### Browser

In HTML using IIFE.

```html
<script src="three.js"></script>
<script src="three-csm.js"></script>

<!-- Your script -->
<script src="main.js" defer></script>
```

Then, in your JavaScript you can use the `THREE_Noise` object.
```js
const { CustomShaderMaterial, TYPES } = THREE_CustomShaderMaterial;
```


## Usage

```js
// Set up ThreeJS 
// ... 

// Set up CSM
const material = new CustomShaderMaterial({
    // Material to extend
    baseMaterial: TYPES.PHYSICAL,      
    vShader: {
        // Custom Vertex Shader
        defines: await (await fetch("vert_defines.glsl")).text(),           
        header: await (await fetch("vert_header.glsl")).text(),                    
        main: await (await fetch("vert_main.glsl")).text(),    
    },
    fShader: {
        // Custom Fragment Shader
        defines: await (await fetch("frag_defines.glsl")).text(),           
        header: await (await fetch("frag_header.glsl")).text(),                    
        main: await (await fetch("frag_main.glsl")).text(),  
    },
    uniforms: { 
        // Custom uniforms
        uTime: { value: 0 }  
    }, 
    passthrough: {
        // options passthrough to unerlying material.
        wireframe: false,
        lights: true,                   
  },
});

const plane = new THREE.Mesh(geometry, material); // Use like a regular material

// ...

function render(time) {
    if(material.uniforms)
        material.uniforms.time.value = time;

    // ...
}

```

Here is what the different keys in the `vShader` and `fShader` objects may contain.

- `defines` - All your macro and pragma definitions.
- `header` - All your global variables, functions, uniforms, varyings and attribute definitions.
- `main` - Main Shader code. Part to be injected into the `main()` function of the underlying material.

All shader code passed into CSM must be strings.

## Output Variables

CSM provides the following output variables:

| Variable | Type | Description | Available In |
|----------|------|-------------|--------------|
| csm_Position | `vec3` | Custom vertex position. | Vertex Shader | 
| csm_Normal | `vec3` | Custom vertex position. | Vertex Shader | 
| csm_DiffuseColor | `vec4` | Custom frag color. | Fragment Shader | 

You must use these variables like you would use standard GLSL output variables.

```c
// gl_Position = position * vec3(2.0);
csm_Position = position * vec3(2.0);
```

See the `example` directory for how to format shaders for use with CSM.

## Loading Shaders

The best way to load shaders for CSM would be to use the [loadShaderCSM](https://github.com/FarazzShaikh/glNoise#loadshaderscsm) loader from my library [glNoise](https://github.com/FarazzShaikh/glNoise).


If you do not want another dependency then your best bets are the following

- Use `fetch` in the browser like so:
  ```js
  const frag_defines = await (await fetch("frag_defines.glsl")).text();
  ```
- Use `fs` in NodeJS
  ```js
  const frag_defines = await new Promise((res, rej) => {
      fs.readFile("frag_defines.glsl", "utf8", (err, data) => {
        if(err) rej(err);
        res(data);
      });
  });

  // or with fs/promises

  const frag_defines = await fs.readFile("frag_defines.glsl", "utf8")
  ```
- Export the shader as a string from a `.js` file.
  ```js
    // frag_defines.js
    export defualt ` // glsl
        ...
    `;

    // main.js
    import frag_defines from "frag_defines.js";
  ```

## Credits

Icon made by [Freepik](https://www.freepik.com) from [www.flaticon.com](https://www.flaticon.com/).
