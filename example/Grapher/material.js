import * as THREE from "three";

import { CustomShaderMaterial, TYPES } from "../../build/three-csm.module.js";

import{ui} from "./ui.js";

function buildMaterial(vertex,env,tex) {


    const material = new CustomShaderMaterial({
        baseMaterial: TYPES.PHYSICAL,
        vShader: {
            defines: vertex.defines,
            header: vertex.header,
            main: vertex.main,
        },
        uniforms: {
            //three_noise_seed: { value: 2 },
            uTime: {value: 1.0},
            rotX: {value: ui.rotx},
            rotY: {value: ui.roty},
            rotU  : {value: ui.rotu},
            tumble: {value: ui.tumble},
            baseRad:{value:ui.baseRad},
            fn: {value: ui.fn},
            proj: {value: ui.proj},
            uColor: {value: new THREE.Color(0, 1, 1)},
            uResolution: {value: new THREE.Vector3()},
            uSeed: {value: Math.random()},
            uType: {value: localStorage.getItem("type") || 0},
        },
        passthrough: {
            wireframe: false,
        },
    });

    //material.color.set(0x3086E6);
    material.clearcoat = 1;
   // material.metalness = 1.;
    material.map = tex;
    material.envMap=env;
    material.envMapIntensity=1.5;
    material.side=THREE.DoubleSide;
    material.transparent=true;
    material.transmission=1.-ui.opacity;

    return material;
}



export{buildMaterial}