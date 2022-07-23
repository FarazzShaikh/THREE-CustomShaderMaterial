import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'

export default function App(root) {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  const geometry = new THREE.BoxGeometry()
  const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshBasicMaterial,
    vertexShader: `
        varying vec2 vUv;

        void main() {
            vUv = uv;
        }
    `,
    fragmentShader: `
        varying vec2 vUv;

        void main() {
            csm_FragColor = vec4(vUv, 1., 1.);
        }
    `,
  })
  const cube = new THREE.Mesh(geometry, material)
  cube.position.x -= 2
  scene.add(cube)

  const m = material.clone()

  const cube2 = new THREE.Mesh(geometry, material.clone())
  cube2.position.x += 2
  scene.add(cube2)

  const controls = new OrbitControls(camera, renderer.domElement)

  function animate() {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    cube2.rotation.x += 0.01
    cube2.rotation.y += 0.01

    renderer.render(scene, camera)
    controls.update()
  }

  animate()
}
