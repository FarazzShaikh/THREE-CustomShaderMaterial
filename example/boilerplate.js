import * as THREE from 'three';
import initMaterial from './example';
import { TYPES } from '../src/index';

var camera, scene, renderer;
var geometry, material, mesh;
var geometry2, material2, mesh2;
var geometry3, material3, mesh3;
var geometry4, material4, mesh4;
var geometry5, material5, mesh5;
var geometry6, material6, mesh6;

function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
    camera.position.z = 1.5;

    scene = new THREE.Scene();

    geometry = new THREE.SphereGeometry(0.2, 64, 64);
    material = initMaterial(TYPES.BASIC);
    mesh = new THREE.Mesh(geometry, material);
    mesh.translateX(1)
    mesh.translateY(0.5)
    scene.add(mesh);

    geometry2 = new THREE.SphereGeometry(0.2, 64, 64);
    material2 = initMaterial(TYPES.NORMAL);
    mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.translateX(0)
    mesh2.translateY(0.5)
    scene.add(mesh2);

    geometry3 = new THREE.SphereGeometry(0.2, 64, 64);
    material3 = initMaterial(TYPES.PHYSICAL);
    mesh3 = new THREE.Mesh(geometry3, material3);
    mesh3.translateX(-1)
    mesh3.translateY(0.5)
    scene.add(mesh3);

    geometry4 = new THREE.SphereGeometry(0.2, 64, 64);
    material4 = initMaterial(TYPES.TOON);
    mesh4 = new THREE.Mesh(geometry4, material4);
    mesh4.translateX(1)
    mesh4.translateY(-0.5)
    scene.add(mesh4);

    geometry5 = new THREE.SphereGeometry(0.2, 64, 64);
    material5 = initMaterial(TYPES.PHONG);
    mesh5 = new THREE.Mesh(geometry5, material5);
    mesh5.translateX(0)
    mesh5.translateY(-0.5)
    scene.add(mesh5);

    geometry6 = new THREE.SphereGeometry(0.2, 64, 64);
    material6 = initMaterial(TYPES.LAMBERT);
    mesh6 = new THREE.Mesh(geometry6, material6);
    mesh6.translateX(-1)
    mesh6.translateY(-0.5)
    scene.add(mesh6);

    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    window.addEventListener('resize', () => {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }, false);

    document.body.style.margin = 0
    document.body.style.padding = 0
    document.body.style.overflow = 'hidden'
    document.body.style.backgroundColor = 'black'



}

function animate() {

    requestAnimationFrame(animate);

    // mesh.rotation.x += 0.01;
    // mesh.rotation.y += 0.01;

    renderer.render(scene, camera);

}

export function main() {
    init()
    animate()
}