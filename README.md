
# THREE-CustomShaderMaterial


CustomShaderMaterial is an extension of the Three.js standard material library. It offers a way to add a **custom vertex shader** to the already existing materials in Three.js.

![](https://media.giphy.com/media/gjTseZtNbw2FLUcbgv/giphy.gif)

## Installation 
``` lang-bash
npm i three-custom-shader-material --save
```

## Usage
### Import Class 
``` lang-js
import { CustomShaderMaterial, TYPES } from  'three-custom-shader-material';
```

### Create Material Instance
``` lang-js
const main = `
	//GLSL code to be injected into main.
`;
const global = `
	//GLSL code to be injected outside main.
`;
const CSM =  new  CustomShaderMaterial({
	baseMaterial: TYPES.NORMAL,
	vShader: [main, global],
	uniforms: [],
	options: {}
});
```

### Assign Material To Mesh 
``` lang-js
const geometry =  new  THREE.SphereGeometry(0.2, 64, 64);
const material =  CSM.getMaterial(); //Get Three.js Compatible Material.
const mesh =  new  THREE.Mesh(geometry, material);
```
#### [Wiki](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial/wiki) 

## Dependancies
### Three.js
``` lang-bash
npm i three --save
```



