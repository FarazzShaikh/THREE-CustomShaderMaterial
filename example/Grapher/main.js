import * as THREE from "three";

import { loadShadersCSM } from "../lib/glNoise/build/glNoise.m.js";

import { camera } from "./components.js";

import { scene, buildScene, createEnvMap } from "./scene.js";

import { buildMaterial } from "./material.js";

import {
  shaderVars,
  createFragmentScene,
  updateFragmentUniforms,
} from "./fragScene.js";

import { renderer, controls } from "./components.js";

import { ui, createUI } from "./ui.js";

const paths = {
  defines: "./vertex/defines.glsl",
  header: "./vertex/complexExp.glsl",
  main: "./vertex/main.glsl",
};

let shaderTex = new THREE.WebGLRenderTarget(1024, 1024);

const updateVertexUniforms = function (material, time) {
  // material.transparent=true;
  material.transmission = 1 - ui.opacity;

  material.uniforms.uTime.value = time;
  material.uniforms.rotX.value = ui.rotx;
  material.uniforms.rotY.value = ui.roty;
  material.uniforms.rotU.value = ui.rotu;
  material.uniforms.tumble.value = ui.tumble;
  material.uniforms.proj.value = ui.proj;
  material.uniforms.baseRad.value = ui.baseRad;
  material.uniforms.fn.value = ui.power;
};

let time = 0;

const animate = function () {
  requestAnimationFrame(animate);
  controls.update();

  //renderer.render(scene, camera);

  // //render the texture for the main surface
  renderer.setRenderTarget(shaderTex);
  renderer.render(shaderVars.scene, shaderVars.camera);
  //
  // //render the main scene
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);

  updateFragmentUniforms(time);

  updateVertexUniforms(mat, time);

  time += 0.01;
  //const canvas = renderer.domElement;
  //mat.uniforms.uResolution.value.set(canvas.width, canvas.height, 1);
};

//running things:
let mat;
loadShadersCSM(paths).then((vertex) => {
  createUI();

  let env = createEnvMap();

  createFragmentScene();

  mat = buildMaterial(vertex, env, shaderTex.texture);

  buildScene(mat);

  animate();
});
