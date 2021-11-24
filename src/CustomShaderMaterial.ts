import * as THREE from "three";
import { iCustomShader, iOptions, tUniforms } from "./Types";

/**
 * This class lets you use your own custom Vertex Shaders along with
 * predefined ThreeJS Fragmet Shaders. This takes away the hastle of
 * writing code for lighting and shaing.
 */
export class CustomShaderMaterial extends THREE.Material {
  /**
   * @member {tUniforms} uniforms Uniforms of the material. May be undefined.
   */
  public uniforms: tUniforms;

  /**
   * @param {iOptions} options                    Options for material.
   *
   * @example
   * const material = new CustomShaderMaterial({
   *     baseMaterial: TYPES.PHYSICAL,
   *     vShader: {
   *         defines: vertex.defines,
   *         header: vertex.header,
   *         main: vertex.main,
   *     },
   *    fShader: {
   *         defines: fragment.defines,
   *         header: fragment.header,
   *         main: fragment.main,
   *     },
   *     uniforms: {
   *         uTime: { value: 1.0 },
   *         uResolution: { value: new THREE.Vector2() },
   *     },
   *     passthrough: {
   *         flatShading: true,
   *     },
   * });
   *
   * if(material.uniforms)
   *    material.uniforms.uResolution.set(1920, 1080);
   */
  constructor(options: iOptions) {
    if (!options) {
      throw new Error("Options object must be provided.");
    }

    if (!options.uniforms) options.uniforms = {};
    if (!options.passthrough) options.passthrough = {};

    // @ts-ignore
    const base = new THREE[options.baseMaterial](options.passthrough);
    super();

    for (const key in base) {
      // @ts-ignore
      if (this[key] === undefined) this[key] = 0;
    }

    this.setValues(base as THREE.MaterialParameters);

    const regex = /\/\*[\s\S]*?\*\/|\/\/.*/g;

    this.onBeforeCompile = (shader) => {
      shader.vertexShader = _patchShader("vert", shader.vertexShader, {
        defines: options.vShader.defines?.replace(regex, ""),
        header: options.vShader.header?.replace(regex, ""),
        main: options.vShader.main?.replace(regex, ""),
      });

      if (options.fShader) {
        shader.fragmentShader = _patchShader("frag", shader.fragmentShader, {
          defines: options.fShader.defines?.replace(regex, ""),
          header: options.fShader.header?.replace(regex, ""),
          main: options.fShader.main?.replace(regex, ""),
        });
      }

      shader.uniforms = { ...shader.uniforms, ...options.uniforms };

      this.uniforms = shader.uniforms;
      this.needsUpdate = true;
    };
  }
}

/**
 * From https://codepen.io/marco_fugaro/pen/xxZWPWJ?editors=0010
 * @private
 */
function _patchShader(type: string, shader: string, customShader: iCustomShader): string {
  const { defines = "", header = "", main = "" } = customShader;
  let patchedShader = shader;

  let transformedPosition = main.includes("csm_Position") ? "csm_Position" : "position";
  let transformedNormal = main.includes("csm_Normal") ? "csm_Normal" : "normal";
  let transformedColor = main.includes("csm_DiffuseColor") ? "diffuseColor = csm_DiffuseColor" : "";

  if (main.includes("newPos")) {
    transformedPosition = "newPos";
  }

  if (main.includes("newNormal")) {
    transformedNormal = "newNormal";
  }

  if (main.includes("newColor")) {
    transformedColor = "diffuseColor = newColor";
  }

  const replaces: {
    [key: string]: string;
  } =
    type === "vert"
      ? {
          "#include <defaultnormal_vertex>": `
          vec3 transformedNormal = ${transformedNormal};
          `,

          "#include <project_vertex>": `
          transformed = ${transformedPosition};
          #include <project_vertex>
        `,
        }
      : {
          "#include <color_fragment>": `
          #include <color_fragment>
          ${transformedColor};
    `,
        };

  const replaceAll = (str: string, find: string, rep: string) => str.split(find).join(rep);

  Object.keys(replaces).forEach((key: string) => {
    const v = replaces[key]!;
    patchedShader = replaceAll(patchedShader, key, v);
  });

  patchedShader = patchedShader.replace(
    "void main() {",
    `
      ${header}
      void main() {
        vec3 csm_Position;
        vec3 csm_Normal;
        vec4 csm_DiffuseColor;
        float csm_PointSize;
        ${main}
      `
  );


  if(main.includes("csm_PointSize")) {
    patchedShader = patchedShader.replace("gl_PointSize = size;", "gl_PointSize = csm_PointSize;")
  }


  return `
      ${defines}
      ${patchedShader}
    `;
}
