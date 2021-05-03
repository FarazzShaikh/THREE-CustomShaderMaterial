import { OrbitControls } from "./lib/OrbitControls.js";

const { CustomShaderMaterial, TYPES } = THREE_CustomShaderMaterial;

import global from "./shaders/global.js";
import main from "./shaders/main.js";
import defines from "./shaders/defines.js";

const spheres = [];
const materials = [
  TYPES.NORMAL,
  TYPES.BASIC,
  TYPES.PHONG,
  TYPES.MATCAP,
  TYPES.TOON,
  TYPES.PHYSICAL,
];

function initSpheres() {
  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      const geometry = new THREE.SphereGeometry(5, 64, 64);
      const i = x * 3 + y;
      const type = materials[i % 6];
      const material = new CustomShaderMaterial({
        baseMaterial: type,
        vShader: {
          defines: defines,
          header: global,
          main: main,
        },
        uniforms: [
          {
            three_noise_seed: { value: 2 },
            dt: { value: 0 },
            fac: { value: i >= 6 ? 0 : 1 },
          },
        ],
        passthrough: {
          wireframe: false,
        },
      });

      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.x += x * 15 - 15;
      sphere.position.y += y * 15 - 15;
      scene.add(sphere);

      spheres.push(sphere);
    }
  }

  const loader = new THREE.FontLoader();
  loader.load("./lib/font.json", function (font) {
    spheres.forEach((s) => {
      const geometry = new THREE.TextGeometry(s.material._baseMaterial, {
        font: font,
        size: 1.5,
        height: 0.1,
      });

      const material = new THREE.MeshBasicMaterial({ color: "#fff" });
      const text = new THREE.Mesh(geometry, material);
      text.position.set(s.position.x, s.position.y, s.position.z);
      text.position.y -= 8;

      var box = new THREE.Box3().setFromObject(text);
      text.position.x -= box.getSize().x / 2;
      scene.add(text);
    });
  });
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 40);

const light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);

const dlight = new THREE.DirectionalLight(0xffffff);
dlight.position.set(5, 5, 5);
scene.add(dlight);

initSpheres();

const animate = function (dt) {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);

  for (let i = 0; i < 6; i++) {
    const sphere = spheres[i];
    sphere.material.updateUniform("dt", Math.sin(dt / 1000));
  }
};

animate();
