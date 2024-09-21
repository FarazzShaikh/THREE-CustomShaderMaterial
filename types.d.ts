import * as THREE from "three";
export interface IUniform<TValue = any> {
    value: TValue;
}
export type Uniform = {
    [key: string]: IUniform;
};
export type MaterialConstructor = new (...opts: any[]) => THREE.Material;
type MaterialParams<T extends MaterialConstructor> = ConstructorParameters<T>[0];
export type CSMPatchMap = {
    [keyword: string]: {
        [toReplace: string]: string | {
            value: string;
            type: "fs" | "vs";
        };
    };
};
export type CustomShaderMaterialBaseParameters<T extends MaterialConstructor> = {
    baseMaterial: T | InstanceType<T>;
    vertexShader?: string;
    fragmentShader?: string;
    uniforms?: Uniform;
    patchMap?: CSMPatchMap;
    cacheKey?: () => string;
};
export type CustomShaderMaterialParameters<T extends MaterialConstructor> = CustomShaderMaterialBaseParameters<T> & (MaterialParams<T> extends undefined ? any : MaterialParams<T>);
export type CSMProxy<T extends MaterialConstructor> = InstanceType<T> & {
    vertexShader: string;
    fragmentShader: string;
    uniforms: Uniform;
    update: (opts: Omit<CustomShaderMaterialBaseParameters<T>, "baseMaterial">) => void;
    __csm: {
        prevOnBeforeCompile: THREE.Material["onBeforeCompile"];
    };
};
export {};
