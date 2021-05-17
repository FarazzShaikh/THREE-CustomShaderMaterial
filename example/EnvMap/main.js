import * as THREE from "three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";
import { EXRLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/EXRLoader.js";

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
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  renderer.domElement.style.cursor = "wait";

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.set(0, 0, 10);

  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const material = new CustomShaderMaterial({
    baseMaterial: TYPES.PHYSICAL,
    vShader: {
      defines: vertex.defines,
      header: vertex.header,
      main: vertex.main,
    },
    uniforms: {
      uTime: { value: 1.0 },
      uColor: { value: new THREE.Color(1, 1, 1) },
      uResolution: { value: new THREE.Vector3() },
      uSeed: { value: Math.random() },
      uType: { value: localStorage.getItem("type") || 0 },
    },
    passthrough: {
      wireframe: false,
      metalness: 1,
      roughness: false,
    },
  });

  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  let exrCubeRenderTarget, exrBackground;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  THREE.DefaultLoadingManager.onLoad = function () {
    pmremGenerator.dispose();
  };

  new EXRLoader()
    .setDataType(THREE.UnsignedByteType)
    .load("./textures/env.exr", function (texture) {
      exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
      exrBackground = exrCubeRenderTarget.texture;

      texture.dispose();
      scene.background = exrBackground;
      material.envMap = exrBackground;
      renderer.domElement.style.cursor = "default";
      document.body.style.cursor = "default";
      animate();
    });

  const animate = function (dt) {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);

    const canvas = renderer.domElement;
    material.uniforms.uResolution.value.set(canvas.width, canvas.height, 1);
    material.uniforms.uTime.value = dt * 0.001;
  };
});
