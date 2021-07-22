import * as THREE from "https://cdn.skypack.dev/three";
import { OrbitControls } from "https://cdn.skypack.dev/three/examples/jsm/controls/OrbitControls.js";

import { CustomShaderMaterial, TYPES } from "../../build/three-csm.m.cdn.js";
import { loadShadersCSM } from "../lib/glNoise/build/glNoise.m.js";

const paths = {
  header: "./shaders/header.glsl",
  main: "./shaders/main.glsl",
};

const frag_paths = {
  header: "./shaders/frag/header.glsl",
  main: "./shaders/frag/main.glsl",
};

function lights(scene) {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5, 100);
  const light = new THREE.HemisphereLight(0xffffff, 0xf7d9aa, 0.9);

  scene.add(light);
  scene.add(directionalLight);

  directionalLight.position.set(8, 8, 2);
  directionalLight.castShadow = true;

  directionalLight.shadow.mapSize.width = 512; // default
  directionalLight.shadow.mapSize.height = 512; // default
  directionalLight.shadow.camera.near = 0.5; // default
  directionalLight.shadow.camera.far = 500;
}

function initHelpers(scene) {
  const size = 10;
  const divisions = 10;

  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
}

let gap = 6;
let cols = 3;
let i = 0;
let j = 0;
let groups = [];
function initSpheres(vertex, fragment, scene, font, options) {
  const geometry = new THREE.SphereGeometry(1, 8, 8);

  let fShader = {
    defines: fragment.defines,
    header: fragment.header,
    main: fragment.main,
  };

  if (options && options.vertexColors) {
    const colors = [];
    const position = geometry.attributes.position;
    const l = position.count;

    for (let i = 0; i < l; i++) {
      const r = Math.random();
      const g = Math.random();
      const b = Math.random();
      colors.push(r, g, b, 1);
    }

    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 4));
    geometry.attributes.color.needsUpdate = true;
    fShader = undefined;
  }

  const group = new THREE.Group();

  let materials = [];

  for (const key in TYPES) {
    if (i === gap * cols) {
      i = 0;
      j += gap;
    }

    const type = TYPES[key];

    const material = new CustomShaderMaterial({
      baseMaterial: type,
      vShader: vertex,
      fShader: fShader,
      uniforms: {
        uTime: { value: 1.0 },
      },
      passthrough: options,
    });

    materials.push(material);

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x += i;
    mesh.position.y -= j;
    group.add(mesh);
    groups.push(group);
    const str = `
${type}
${options ? JSON.stringify(options, null, 4) : ""}
    `;

    const textGeometry = new THREE.TextGeometry(str, {
      font: font,
      size: 0.2,
      height: 0.01,
    });
    let textMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });
    const text = new THREE.Mesh(textGeometry, textMaterial);
    text.position.x += i - 1;
    text.position.y -= j + 2;
    text.position.z += 1;
    group.add(text);

    i += gap;
  }

  group.position.x -= gap;
  group.position.y += gap + 30;
  scene.add(group);
  return materials;
}

loadShadersCSM(paths).then((vertex) => {
  loadShadersCSM(frag_paths).then((fragment) => {
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, (window.innerHeight * 5) / 2, (window.innerHeight * 5) / -2, -100, 100);
    // camera.position.set(0, 0, 3);
    camera.zoom = 50;
    camera.updateProjectionMatrix();

    const renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight * 5);
    document.body.appendChild(renderer.domElement);

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // const controls = new OrbitControls(camera, renderer.domElement);
    lights(scene);
    initHelpers(scene);

    let materials = [];
    const loader = new THREE.FontLoader();
    loader.load("./Assets/font/font.json", (font) => {
      materials.push(...initSpheres(vertex, fragment, scene, font));
      materials.push(
        ...initSpheres(vertex, fragment, scene, font, {
          wireframe: true,
          transparent: true,
        })
      );
      materials.push(
        ...initSpheres(vertex, fragment, scene, font, {
          flatShading: true,
        })
      );
      materials.push(
        ...initSpheres(vertex, fragment, scene, font, {
          vertexColors: true,
        })
      );
    });

    const animate = function (time) {
      renderer.render(scene, camera);
      //   controls.update();

      materials.forEach((m) => {
        if (m.uniforms) {
          m.uniforms.uTime.value = time * 0.001;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  });
});
