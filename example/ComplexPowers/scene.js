import * as THREE from "three";

import{LightProbeGenerator} from "../lib/LightProbeGenerator.js";


import {
    pmremGenerator, renderer
} from './components.js';


const scene = new THREE.Scene();
let lightProbe;


function createLights() {

    // light probe
    lightProbe = new THREE.LightProbe();
    lightProbe.intensity = 2.;
    scene.add(lightProbe);

    // normal light
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1.);
    directionalLight.position.set(10, 10, 10);
    //directionalLight.castShadow = true;
    scene.add(directionalLight);


    let directionalLight2 = new THREE.DirectionalLight(0xffffff, 1.);
    directionalLight2.position.set(10, -10, -10);
    //directionalLight.castShadow = true;
    scene.add(directionalLight2);

    let ptLight = new THREE.PointLight(0xffffff, 1, 0, 2);
    ptLight.position.set(0,-3,-1);
    scene.add(ptLight);

}




//Makes environment map for the materials
//=============================================
function createEnvMap() {
    // envmap
    let genCubeUrls = function (prefix, postfix) {

        return [
            prefix + 'px' + postfix, prefix + 'nx' + postfix,
            prefix + 'py' + postfix, prefix + 'ny' + postfix,
            prefix + 'pz' + postfix, prefix + 'nz' + postfix
        ];

    };

    //CAN GENERATE CUBE MAPS
    //https://jaxry.github.io/panorama-to-cubemap/
    let urls = genCubeUrls('../textures/trees/', '.png');

    return new THREE.CubeTextureLoader().load(urls, function (cubeTexture) {

        cubeTexture.encoding = THREE.sRGBEncoding;

        lightProbe.copy(LightProbeGenerator.fromCubeTexture(cubeTexture));

    });

}







function createBkgScene() {

    let bkgScene={
        scene:undefined,
        room:undefined,
        mainLight:undefined,
    }


    bkgScene.scene = new THREE.Scene();

    var geometry = new THREE.BoxBufferGeometry();
    geometry.deleteAttribute('uv');

    var roomMaterial = new THREE.MeshStandardMaterial({
        color:0xfff8dc,
        metalness: 0.,
        side: THREE.BackSide
    });

    bkgScene.room = new THREE.Mesh(geometry, roomMaterial);
    bkgScene.room.scale.setScalar(50);

    bkgScene.scene.add(bkgScene.room);

    bkgScene.mainLight = new THREE.PointLight(0xffffff, 0.04, 0, 2);

    bkgScene.scene.add(bkgScene.mainLight);

    //build the cube map fom this scene:

    var generatedCubeRenderTarget = pmremGenerator.fromScene(bkgScene.scene, 0.02);


    return  generatedCubeRenderTarget.texture;
}























function buildScene(material) {

    createLights();

    scene.background=createBkgScene();

    const geometry = new THREE.PlaneGeometry(1,1, 400,400);
//new THREE.SphereGeometry(5, 64, 64);


    const surf = new THREE.Mesh(geometry, material);
    scene.add(surf);


    const light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    const dlight = new THREE.DirectionalLight(0xffffff);
    dlight.position.set(5, 5, 5);
    scene.add(dlight);

}



function createFragmentScene(shaderMat){

    let texScene=new THREE.Scene();

    //make the plane we will add to both scenes
    const plane = new THREE.PlaneBufferGeometry(2, 2);

    texScene.add(new THREE.Mesh(plane, shaderMat));

    return texScene;
}




export{
    scene, buildScene,createEnvMap,createFragmentScene
};













