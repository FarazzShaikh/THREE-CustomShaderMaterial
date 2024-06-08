import * as THREE from "three";
import * as TYPES from "./types";
export default class CustomShaderMaterial<T extends TYPES.MaterialConstructor = typeof THREE.Material> extends THREE.Material {
    uniforms: TYPES.Uniform;
    vertexShader: string;
    fragmentShader: string;
    constructor({ baseMaterial, vertexShader, fragmentShader, uniforms, patchMap, cacheKey, ...opts }: TYPES.CustomShaderMaterialParameters<T>);
    update({ fragmentShader: _fs, vertexShader: _vs, uniforms, cacheKey, patchMap, }: Omit<TYPES.CustomShaderMaterialBaseParameters<T>, "baseMaterial">): void;
}
export { type CSMPatchMap, type CSMProxy, type CustomShaderMaterialParameters, type MaterialConstructor, } from './types';
