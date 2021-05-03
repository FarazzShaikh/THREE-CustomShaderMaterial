import * as THREE from "three";
import { TYPES } from "./Types";

/**
 * This class lets you use your own custom Vertex Shaders along with
 * predefined ThreeJS Fragmet Shaders. This takes away the hastle of
 * writing code for lighting and shaing.
 */
export class CustomShaderMaterial extends THREE.ShaderMaterial {
  /**
   * Creates an instance of the <code>CustomShaderMaterial</code> class.
   *
   * <b>The variable <code>newPos</code> and <code>newNormal</code> must be
   * defined in the main section of the indjected shader.</b>
   *
   * @typedef
   *
   * @param {Object} options                Options for material.
   * @param {string} options.baseMaterial   Base Material. The material whos fragment shader is used. Any type from the exported <code>TYPES</code> object
   * @param {Object} options.vShader        Custom Vertex Shader
   * @param {string} options.vShader.defines        Constant definitions like - "#define PI = 3.14;"
   * @param {string} options.vShader.header         Code to be injected above main. Place function definitions here.
   * @param {string} options.vShader.main           Code to be injected above main. Put main shader code here.
   * @param {Object} options.uniforms       Custom Uniforms to be passed to the shader.
   * @param {Object} options.passthrough    Any custom options to be passed to the underlying base material.
   */
  constructor(options) {
    const { baseMaterial, vShader } = options;
    const uniforms = options.uniforms ?? [];
    const passthrough = options.passthrough ?? {};
    const baseShader = THREE.ShaderLib[baseMaterial];

    if (baseShader === undefined) throw "Invalid Base Material Type";

    super({
      uniforms: THREE.UniformsUtils.merge([baseShader.uniforms, ...uniforms]),

      extensions: {
        derivatives: true,
      },

      vertexShader: _patchShader(THREE.ShaderChunk.meshphysical_vert, vShader),
      fragmentShader: baseShader.fragmentShader,
      lights:
        baseMaterial === TYPES.PHYSICAL ||
        baseMaterial === TYPES.TOON ||
        baseMaterial === TYPES.PHONG,
      ...passthrough,
    });

    this._baseMaterial = baseMaterial;
  }

  /**
   * This funciton lets you update a custom uniform you have set.
   * Make sure to address the uniform by the name of its key.
   *
   * @param {string} unifrom Name of the Unifrom to update
   * @param {any} value      Value to set.
   */
  updateUniform(unifrom, value) {
    this.uniforms[unifrom].value = value;
  }
}

/**
 * From https://codepen.io/marco_fugaro/pen/xxZWPWJ?editors=0010
 */
function _patchShader(shader, { defines = "", header = "", main = "" }) {
  let patchedShader = shader;

  const replaces = {
    "#include <defaultnormal_vertex>": THREE.ShaderChunk.defaultnormal_vertex.replace(
      "vec3 transformedNormal = objectNormal;",
      `vec3 transformedNormal = newNormal;`
    ),

    "#include <displacementmap_vertex>": `
          transformed = newPos;
        `,
  };

  const replaceAll = (str, find, rep) => str.split(find).join(rep);
  Object.keys(replaces).forEach((key) => {
    patchedShader = replaceAll(patchedShader, key, replaces[key]);
  });

  patchedShader = patchedShader.replace(
    "void main() {",
    `
      ${header}
      void main() {
        ${main}
      `
  );

  return `
      ${defines}
      ${patchedShader}
    `;
}
