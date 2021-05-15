//=============================================
//Imports from lib/
//=============================================

import * as THREE from "three";

//=============================================
//Imports from My Code
//=============================================

import {
    ui
} from './ui.js';









//=============================================
//Variables Defined in this File
//=============================================


let shaderVars={
    camera:undefined,
    scene:undefined,
    code: undefined,
    uniforms:undefined,
}





//=============================================
//Functions Internal to this file
//=============================================


async function createShaderCode(){

    const Text=await fetch('./fragment/shader.glsl');

    shaderVars.code=await Text.text();

}




function createFragmentUniforms(){
    
    shaderVars.uniforms={
        
        //these are some fixed parameters
        
        res: {
            value: 1024.
            },
        
        
        //these change the projection function, thus the color:
                xMin: {
            value: ui.xMin
            },
                xMax: {
            value: ui.xMax
            },
                yMin: {
            value: ui.yMin
            },
                yMax: {
            value: ui.yMax
            },
                fn: {
            value: ui.fn
             },
      
            time: {
                value: 0
            },
        grid: {
            value: ui.grid
        },
        hue: {
            value: ui.hue
        },
            complexTex: {
                value: ui.complexTex
            },
    };
    
}









//=============================================
//Functions to Export
//=============================================




function updateFragmentUniforms(newTime){
    
    shaderVars.uniforms.xMin.value=ui.xMin;
    shaderVars.uniforms.xMax.value=ui.xMax;
    shaderVars.uniforms.yMin.value=ui.yMin;
    shaderVars.uniforms.yMax.value=ui.yMax;
    shaderVars.uniforms.complexTex.value=ui.complexTex;
    shaderVars.uniforms.time.value=newTime;
    shaderVars.uniforms.fn.value=ui.power;
    shaderVars.uniforms.grid.value=ui.grid;
    shaderVars.uniforms.hue.value=ui.hue;
    
}




async function createFragmentScene(){

    shaderVars.scene= new THREE.Scene();
    
    shaderVars.camera = new THREE.OrthographicCamera(
                -1, // left
                1, // right
                1, // top
                -1, // bottom
                -1, // near,
                1, // far
    );

    
    createFragmentUniforms();
    
    await createShaderCode();
    
    //make the plane we will add to both scenes
    const plane = new THREE.PlaneBufferGeometry(2, 2);
    
    //make the material we render the texture to
    const mat = new THREE.ShaderMaterial({
                fragmentShader: shaderVars.code,
                uniforms: shaderVars.uniforms,
            });
    
    shaderVars.scene.add(new THREE.Mesh(plane, mat));
}






//=============================================
//Exports from this file
//=============================================




export{
    shaderVars,
    createShaderCode,
    createFragmentScene,
    updateFragmentUniforms,
};