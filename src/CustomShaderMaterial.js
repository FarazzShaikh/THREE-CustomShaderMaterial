import * as THREE from 'three';

export const TYPES = {
    NORMAL: 'normal',
    BASIC: 'basic',
    PHONG: 'phong',
    MATCAP: 'matcap',
    TOON: 'toon',
    PHYSICAL: 'physical',
    LAMBERT: 'lambert'
}

export class CustomShaderMaterial {
    constructor({ baseMaterial, vShader, uniforms, options }) {

        const shaderLib = THREE.ShaderLib[baseMaterial] 
        if(shaderLib) {
            let customUniforms = THREE.UniformsUtils.merge([
                shaderLib.uniforms,
                ...uniforms
            ]);
    
            this.material = new THREE.ShaderMaterial({
                uniforms: customUniforms,
                vertexShader: shaderLib.vertexShader,
                fragmentShader: shaderLib.fragmentShader,
                ...options
            });
    
            this.material.onBeforeCompile = (shader) => {
                shader.vertexShader = shader.vertexShader.replace(/#include <begin_vertex>/g, vShader[0])
                shader.vertexShader = __insertAtIndex(shader.vertexShader, 0, vShader[1])

                // if(base === 'CustomShaderMaterial') {
                //     shader.fragmentShader = shader.fragmentShader.replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', fShader)
                //     console.log(shader.fragmentShader)
                // }
            }
        } else {
            throw `Invalid Shader Type.`
        }
        
    }

    getMaterial() {
        return this.material
    }

    updateUniform(unifrom, value) {
        this.material.uniforms[unifrom].value = value
    }
}

function __insertAtIndex(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}