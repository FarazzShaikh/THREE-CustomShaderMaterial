import * as THREE from "three";
import {
  defaultCsmDefinitions,
  defaultCsmMainDefinitions,
  defaultFragDefinitions,
  defaultFragMain,
  defaultVertDefinitions,
  defaultVertMain,
} from "./defaults";
import { availabilityMap, defaultPatchMap, keywordMap } from "./maps";
import { requiredPropsMap } from "./maps/requiredPropsMap";
import hash from "./sdbm";
import * as TYPES from "./types";
import { isConstructor, stripComments } from "./utils";

export default class CustomShaderMaterial<
  T extends TYPES.MaterialConstructor = typeof THREE.Material
> extends THREE.Material {
  uniforms: TYPES.Uniform = {};
  vertexShader: string = "";
  fragmentShader: string = "";

  constructor({
    baseMaterial,
    vertexShader,
    fragmentShader,
    uniforms,
    patchMap,
    cacheKey,
    ...opts
  }: TYPES.CustomShaderMaterialParameters<T>) {
    if (!baseMaterial) {
      throw new Error("CustomShaderMaterial: baseMaterial is required.");
    }

    let base: THREE.Material;
    if (isConstructor(baseMaterial)) {
      // If base material is a constructor, instantiate it
      // if opts is empty, replace it with undefined
      const isEmptyOpts = Object.keys(opts).length === 0;
      base = new baseMaterial(isEmptyOpts ? undefined : opts);
    } else {
      // Else, use the already created instance as the base material
      // and copy options onto it
      base = baseMaterial;
      Object.assign(base, opts);
    }

    // Blacklist some materials that are not supported
    const blackList = ["ShaderMaterial", "RawShaderMaterial"];
    if (blackList.includes(base.type)) {
      throw new Error(
        `CustomShaderMaterial does not support ${base.type} as a base material.`
      );
    }

    super();

    // Return a proxy to the base material with CSM types and methods
    const extendedBase = base as typeof base & TYPES.CSMProxy<T>;
    extendedBase.name = `CustomShaderMaterial<${base.name || base.type}>`;
    extendedBase.update = this.update.bind(extendedBase);
    extendedBase.__csm = {
      prevOnBeforeCompile: base.onBeforeCompile,
      baseMaterial: base,
      vertexShader,
      fragmentShader,
      uniforms,
      patchMap,
      cacheKey,
    };

    const prevUniforms = extendedBase.uniforms || {};
    const newUniforms = uniforms || {};
    const mergedUniforms = { ...prevUniforms, ...newUniforms };

    extendedBase.uniforms = this.uniforms = mergedUniforms;
    extendedBase.vertexShader = this.vertexShader = vertexShader || "";
    extendedBase.fragmentShader = this.fragmentShader = fragmentShader || "";

    // Initialize custom shaders
    extendedBase.update({
      fragmentShader: extendedBase.fragmentShader,
      vertexShader: extendedBase.vertexShader,
      uniforms: extendedBase.uniforms,
      patchMap,
      cacheKey,
    });

    // Merge "this" with the extended base
    Object.assign(this, extendedBase);

    // Copy getters and setters from the base material
    const gettersAndSetters = Object.getOwnPropertyDescriptors(
      Object.getPrototypeOf(extendedBase)
    );

    for (const key in gettersAndSetters) {
      const descriptor = gettersAndSetters[key];
      if (descriptor.get || descriptor.set) {
        Object.defineProperty(this, key, descriptor);
      }
    }

    // Override type setter because of this BS: https://github.com/mrdoob/three.js/blob/841ca14e89f3ec925e071a321958e49a883343c0/src/materials/Material.js#L22
    Object.defineProperty(this, "type", {
      get() {
        return base.type;
      },
      set(value) {
        base.type = value;
      },
    });

    return this;
  }

  update({
    fragmentShader: _fs,
    vertexShader: _vs,
    uniforms,
    cacheKey,
    patchMap,
  }: Omit<TYPES.CustomShaderMaterialBaseParameters<T>, "baseMaterial">) {
    // Strip comments from shaders, makes it so that commented keywords are not detected
    const vertexShader = stripComments(_vs || "");
    const fragmentShader = stripComments(_fs || "");

    // Get typed `this` for the proxy
    const self = this as typeof this & TYPES.CSMProxy<T>;

    // Replace the shaders if they are provided
    if (uniforms) self.uniforms = uniforms;
    if (_vs) self.vertexShader = _vs;
    if (_fs) self.fragmentShader = _fs;

    // Some keywords require certain properties to be set for their chunks to be included via #ifdef
    // so we must check if the shaders contain these keywords and set the properties accordingly
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

    // Check it the previous onBeforeCompile exists
    const prevOnBeforeCompile = self.__csm.prevOnBeforeCompile;

    // Helper function to extend the shader
    const extendShader = (
      prevShader: string,
      newShader?: string,
      isFrag?: boolean
    ) => {
      let mainBody: string | undefined;
      let beforeMain: string = "";

      // Prepare the main body and beforeMain
      if (newShader) {
        // Simpler approach to extract main function body
        const mainStartIndex = newShader.search(/void\s+main\s*\(\s*\)\s*{/);
        if (mainStartIndex !== -1) {
          // Get everything before main function
          beforeMain = newShader.slice(0, mainStartIndex);

          // Find the matching closing brace using brace counting
          let braceCount = 0;
          let mainEndIndex = -1;

          for (let i = mainStartIndex; i < newShader.length; i++) {
            if (newShader[i] === "{") braceCount++;
            if (newShader[i] === "}") {
              braceCount--;
              if (braceCount === 0) {
                mainEndIndex = i;
                break;
              }
            }
          }

          if (mainEndIndex !== -1) {
            // Extract main body without the outer braces
            const fullMain = newShader.slice(mainStartIndex, mainEndIndex + 1);
            mainBody = fullMain.slice(fullMain.indexOf("{") + 1, -1);
          }
        } else {
          beforeMain = newShader;
        }
      }

      // Set csm_UnlitFac if csm_FragColor is used to preserve
      // legacy behavior.
      if (isFrag) {
        const hasFragColor = newShader
          ? newShader.includes(keywordMap.fragColor)
          : false;
        if (hasFragColor && mainBody) {
          mainBody = "csm_UnlitFac = 1.0;\n" + mainBody;
        }
      }

      const defaultsAlreadyIncluded = prevShader.includes("//~CSM_DEFAULTS");

      // Inject
      if (defaultsAlreadyIncluded) {
        prevShader = prevShader.replace(
          "void main() {",
          `
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          ${beforeMain}
          
          void main() {
          `
        );

        const lastMainEndIndex = prevShader.lastIndexOf("//~CSM_MAIN_END");

        if (lastMainEndIndex !== -1) {
          const toAppend = `
            ${mainBody ? `${mainBody}` : ""}
            //~CSM_MAIN_END
          `;
          prevShader =
            prevShader.slice(0, lastMainEndIndex) +
            toAppend +
            prevShader.slice(lastMainEndIndex);
        }
      } else {
        const regex = /void\s*main\s*\(\s*\)\s*{/gm;

        prevShader = prevShader.replace(
          regex,
          `
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          //~CSM_DEFAULTS
          ${isFrag ? defaultFragDefinitions : defaultVertDefinitions}
          ${defaultCsmDefinitions}
  
          ${beforeMain}
          
          void main() {
            {
              ${defaultCsmMainDefinitions}
            }
            ${isFrag ? defaultFragMain : defaultVertMain}

            ${mainBody ? `${mainBody}` : ""}
            //~CSM_MAIN_END
          `
        );
      }

      return prevShader;
    };

    // Override onBeforeCompile
    self.onBeforeCompile = (
      shader: THREE.WebGLProgramParametersWithUniforms,
      renderer: THREE.WebGLRenderer
    ) => {
      // Apply previous onBeforeCompile
      prevOnBeforeCompile?.(shader, renderer);

      const userPatchMap = patchMap || {};
      // const mergedPatchMap = { ...defaultPatchMap, ...userPatchMap };

      // Append some defines
      const type = self.type;
      const typeDefine = type
        ? `#define IS_${type.toUpperCase()};\n`
        : `#define IS_UNKNOWN;\n`;
      shader.vertexShader =
        typeDefine + "#define IS_VERTEX\n" + shader.vertexShader;
      shader.fragmentShader =
        typeDefine + "#define IS_FRAGMENT\n" + shader.fragmentShader;

      // Check if the keyword is available in the current material type
      const runPatchMap = (_patchMap: TYPES.CSMPatchMap) => {
        for (const keyword in _patchMap) {
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

            const patchMap = _patchMap[keyword];

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
      };

      runPatchMap(defaultPatchMap);
      runPatchMap(userPatchMap);

      // Extend the shaders
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

    const prevCacheKey = self.customProgramCacheKey;

    self.customProgramCacheKey = () => {
      return (
        (cacheKey?.() || hash((vertexShader || "") + (fragmentShader || ""))) +
        prevCacheKey?.call(self)
      );
    };

    self.needsUpdate = true;
  }

  clone() {
    // Get typed `this` for the proxy
    const self = this as typeof this & TYPES.CSMProxy<T>;

    // @ts-ignore
    const newObj = new self.constructor({
      baseMaterial: self.__csm.baseMaterial.clone(),
      vertexShader: self.__csm.vertexShader,
      fragmentShader: self.__csm.fragmentShader,
      uniforms: self.__csm.uniforms,
      patchMap: self.__csm.patchMap,
      cacheKey: self.__csm.cacheKey,
    });

    return newObj;
  }
}

export {
  type CSMPatchMap,
  type CSMProxy,
  type CustomShaderMaterialParameters,
  type MaterialConstructor,
} from "./types";
