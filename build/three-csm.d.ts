import * as THREE$1 from 'three';

declare type tMaterialTypes = {
    [key: string]: string;
};
declare type tUniforms = {
    [key: string]: THREE.IUniform<any>;
};
declare type tPassthrough = {
    [key: string]: THREE.MaterialParameters;
};
declare const TYPES: tMaterialTypes;
interface iCustomShader {
    defines?: string;
    header?: string;
    main?: string;
}
interface iOptions {
    baseMaterial: string;
    vShader: iCustomShader;
    fShader: iCustomShader;
    uniforms?: tUniforms;
    passthrough?: tPassthrough;
}

declare class CustomShaderMaterial extends THREE$1.Material {
    uniforms: tUniforms;
    constructor(options: iOptions);
}

export { CustomShaderMaterial, TYPES };
