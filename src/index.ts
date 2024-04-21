import * as THREE from "three";
import {
  defaultCsmDefinitions,
  defaultCsmMainDefinitions,
  defaultFragDefinitions,
  defaultFragMain,
  defaultVertDefinitions,
  defaultVertMain,
} from "./defaults";
import hash from "./fnv1a";
import { availabilityMap, defaultPatchMap } from "./maps";
import { requiredPropsMap } from "./maps/requiredPropsMap";
import * as TYPES from "./types";
import { deepMergeObjects, isConstructor, stripComments } from "./utils";

export default class CustomShaderMaterial<
  T extends TYPES.MaterialConstructor = typeof THREE.Material
> extends THREE.Material {
  uniforms: TYPES.Uniform = {};

  constructor({
    baseMaterial,
    vertexShader,
    fragmentShader,
    uniforms,
    patchMap,
    cacheKey,
    globals,
    ...opts
  }: TYPES.CustomShaderMaterialParameters<T>) {
    let base: THREE.Material;
    if (isConstructor(baseMaterial)) {
      // If base material is a constructor, instantiate it
      // if opts is empty, replace it with undefined
      const isEmptyOpts = Object.keys(opts).length === 0;
      base = new baseMaterial(isEmptyOpts ? undefined : opts);
    } else {
      // Else, copy options onto base material and use the already create
      // instance as the base material
      base = baseMaterial;
      Object.assign(base, opts);
    }

    const blackList = ["ShaderMaterial", "RawShaderMaterial"];
    if (blackList.includes(base.type)) {
      throw new Error(
        `CustomShaderMaterial does not support ${base.type} as a base material.`
      );
    }

    super();
    console.log("NEW");

    const extendedBase = base as typeof base & TYPES.CSMProxy<T>;
    extendedBase.update = this.update.bind(extendedBase);
    extendedBase.uniforms = this.uniforms = uniforms || {};
    extendedBase.__csm = { baseMaterial: base, patchMap };
    extendedBase.update({
      fragmentShader,
      vertexShader,
      uniforms,
      patchMap,
      cacheKey,
      globals,
    });

    return extendedBase;
  }

  update({
    fragmentShader: _fs,
    vertexShader: _vs,
    uniforms,
    cacheKey,
    globals,
    patchMap,
  }: Omit<TYPES.CustomShaderMaterialBaseParameters<T>, "baseMaterial">) {
    console.log("UPDATE");

    const vertexShader = stripComments(_vs || "");
    const fragmentShader = stripComments(_fs || "");

    const self = this as typeof this & TYPES.CSMProxy<T>;
    if (uniforms) {
      self.uniforms = uniforms;
    }

    Object.entries(requiredPropsMap).forEach(([prop, matchKeywords]) => {
      for (const keyword in matchKeywords) {
        const matchKeyword = matchKeywords[keyword];
        if (
          (fragmentShader && fragmentShader.includes(matchKeyword)) ||
          (vertexShader && vertexShader.includes(matchKeyword))
        ) {
          // @ts-ignore
          if (!self[prop]) {
            // @ts-ignore
            self[prop] = 1;
          }
        }
      }
    });

    const extendShader = (
      prevShader: string,
      newShader?: string,
      isFrag?: boolean
    ) => {
      let mainBody,
        beforeMain = "";

      if (newShader) {
        const mainBodyRegex =
          /void\s+main\s*\(\s*\)[^{]*{((?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{[^{}]*})*})*})*})*})/gm;
        const mainBodyMatches = newShader.matchAll(mainBodyRegex);
        mainBody = mainBodyMatches.next().value?.[1];

        const mainIndex = newShader.indexOf("void main() {");
        beforeMain = newShader.slice(0, mainIndex);
      }

      prevShader = prevShader.replace(
        "void main() {",
        `
        // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial

        ${isFrag ? defaultFragDefinitions : defaultVertDefinitions}
        ${defaultCsmDefinitions}

        ${beforeMain}
        
        void main() {
          ${defaultCsmMainDefinitions}
          ${isFrag ? defaultFragMain : defaultVertMain}

          ${globals ? globals : ""}
          ${mainBody ? `{${mainBody}` : ""}
        `
      );

      return prevShader;
    };

    self.onBeforeCompile = (
      shader: THREE.WebGLProgramParametersWithUniforms,
      renderer: THREE.WebGLRenderer
    ) => {
      const userPatchMap = patchMap || {};
      const mergedPatchMap = deepMergeObjects(defaultPatchMap, userPatchMap);

      const type = self.__csm.baseMaterial.type;
      const typeDefine = type
        ? `#define IS_${type.toUpperCase()};\n`
        : `#define IS_UNKNOWN;\n`;
      shader.vertexShader =
        typeDefine + "#define IS_VERTEX\n" + shader.vertexShader;
      shader.fragmentShader =
        typeDefine + "#define IS_FRAGMENT\n" + shader.fragmentShader;

      for (const keyword in mergedPatchMap) {
        const doesIncludeInVert =
          keyword === "*" || (vertexShader && vertexShader.includes(keyword));
        const doesIncludeInFrag =
          keyword === "*" ||
          (fragmentShader && fragmentShader.includes(keyword));

        if (doesIncludeInFrag || doesIncludeInVert) {
          const availableIn = availabilityMap[keyword];

          if (
            availableIn &&
            availableIn !== "*" &&
            (Array.isArray(availableIn)
              ? !availableIn.includes(type)
              : availableIn !== type)
          ) {
            console.error(
              `CustomShaderMaterial: ${keyword} is not available in ${type}. Shader cannot compile.`
            );
            return;
          }

          const patchMap = mergedPatchMap[keyword];

          for (const toReplace in patchMap) {
            const replaceWith = patchMap[toReplace];
            if (typeof replaceWith === "object") {
              const type = replaceWith.type;
              const value = replaceWith.value;

              if (type === "fs") {
                shader.fragmentShader = shader.fragmentShader.replace(
                  toReplace,
                  value
                );
              } else if (type === "vs") {
                shader.vertexShader = shader.vertexShader.replace(
                  toReplace,
                  value
                );
              }
            } else if (replaceWith) {
              shader.vertexShader = shader.vertexShader.replace(
                toReplace,
                replaceWith
              );
              shader.fragmentShader = shader.fragmentShader.replace(
                toReplace,
                replaceWith
              );
            }
          }
        }
      }

      shader.vertexShader = extendShader(
        shader.vertexShader,
        vertexShader,
        false
      );

      shader.fragmentShader = extendShader(
        shader.fragmentShader,
        fragmentShader,
        true
      );

      if (uniforms) {
        shader.uniforms = { ...shader.uniforms, ...self.uniforms };
      }

      self.uniforms = shader.uniforms;
    };

    this.customProgramCacheKey = () => {
      return (
        cacheKey?.() || hash((vertexShader || "") + (fragmentShader || ""))
      );
    };

    this.needsUpdate = true;
  }
}

export {
  type CSMPatchMap,
  type CSMProxy,
  type CustomShaderMaterialParameters,
  type MaterialConstructor,
} from "./types";
