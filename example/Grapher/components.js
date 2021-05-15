import * as THREE from "three";

import {OrbitControls} from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(0, 0, 20);



const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;

//make the pmrem generator if we need it
let pmremGenerator = new THREE.PMREMGenerator(renderer);

pmremGenerator.compileCubemapShader();


const controls = new OrbitControls(camera, renderer.domElement);

















export{renderer,pmremGenerator,controls,camera}