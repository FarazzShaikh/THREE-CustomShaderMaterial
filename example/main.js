import * as THREE from "three";
import { OrbitControls } from "OrbitControls";
import { EXRLoader } from "ESRLoader";

import { CustomShaderMaterial, TYPES } from "../build/three-csm.module.js";
import { loadShadersCSM } from "./lib/glNoise/build/glNoise.m.js";

const paths = {
  defines: "./shaders/defines.glsl",
  header: "./shaders/header.glsl",
  main: "./shaders/main.glsl",
};

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

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;

  const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.set(0, 0, 10);

  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const material = new CustomShaderMaterial({
    baseMaterial: TYPES.BASIC,
    vShader: {
      defines: vertex.defines,
      header: vertex.header,
      main: vertex.main,
    },
    uniforms: {
      three_noise_seed: { value: 2 },
      uTime: { value: 1.0 },
      uColor: { value: new THREE.Color(1, 1, 1) },
      uResolution: { value: new THREE.Vector3() },
      uSeed: { value: Math.random() },
      uType: { value: localStorage.getItem("type") || 0 },
    },
    passthrough: {
      wireframe: false,
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
    .load("Assets/env.exr", function (texture) {
      exrCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
      exrBackground = exrCubeRenderTarget.texture;

      texture.dispose();
      scene.background = exrBackground;
      material.envMap = exrBackground;
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
