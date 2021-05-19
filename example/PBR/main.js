import * as THREE from "three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

import { CustomShaderMaterial, TYPES } from "../../build/three-csm.module.js";
import { loadShadersCSM } from "../lib/glNoise/build/glNoise.m.js";

const paths = {
  defines: "./shaders/defines.glsl",
  header: "./shaders/header.glsl",
  main: "./shaders/main.glsl",
};

document.body.style.cursor = "wait";

loadShadersCSM(paths).then((vertex) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.cursor = "wait";

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0.8, 2, 0.8);

  // create a texture loader.
  const textureLoader = new THREE.TextureLoader();

  // load a texture
  const height = textureLoader.load("./textures/height.png");
  const color = textureLoader.load("./textures/color.png");
  const normal = textureLoader.load("./textures/normal.png");
  const roughness_ao = textureLoader.load("./textures/roughness-ao.png");

  const geometry = new THREE.PlaneGeometry(5, 5, 512, 512);
  const material = new CustomShaderMaterial({
    baseMaterial: TYPES.PHYSICAL,
    vShader: {
      defines: vertex.defines,
      header: vertex.header,
      main: vertex.main,
    },
    uniforms: {
      uTime: { value: 1.0 },
      uResolution: { value: new THREE.Vector3() },
      uHeightMap: new THREE.Uniform(height),
    },
    passthrough: {
      wireframe: false,
      map: color,
      normalMap: normal,
      aoMap: roughness_ao,
      roughnessMap: roughness_ao,
    },
  });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.receiveShadow = true;
  sphere.castShadow = true;
  sphere.rotateX(-Math.PI / 2);
  scene.add(sphere);

  const sphere3 = sphere.clone();
  sphere3.position.x -= 5;
  scene.add(sphere3);

  const sphere5 = sphere.clone();
  sphere5.position.z -= 5;
  scene.add(sphere5);

  const directionalLight = new THREE.DirectionalLight(0xfff3de, 0.3);
  directionalLight.position.set(-2, 5, 2);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const animate = function (dt) {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

    const canvas = renderer.domElement;
    material.uniforms.uResolution.value.set(canvas.width, canvas.height, 1);
    material.uniforms.uTime.value = dt * 0.001;
  };

  renderer.domElement.style.cursor = "default";
  document.body.style.cursor = "default";
  animate();
});
