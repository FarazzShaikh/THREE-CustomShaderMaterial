import * as THREE from 'three';
import { CustomShaderMaterial } from '../src/index';
import global from './shaders/global';
import main from './shaders/main';

export default function initMaterial(type) {
    const test = new CustomShaderMaterial({
        baseMaterial: type,
        vShader: [main, global],
        uniforms: [
            {time: {value: 0.0}},
            THREE.UniformsLib.lights,
        ],
        options: {
            wireframe: false,
            lights: true,
            flatShading: true,
        }
    })
    
    let time = 0.0
    setInterval(() => {
        time+=0.0005
        test.updateUniform('time', time)
    }, 1/60);
    return test.getMaterial()
}
