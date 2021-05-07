import * as THREE from 'three';

const TYPES = {
  NORMAL: "normal",
  BASIC: "basic",
  PHONG: "phong",
  MATCAP: "matcap",
  TOON: "toon",
  PHYSICAL: "physical",
};

/**
 * This class lets you use your own custom Vertex Shaders along with
 * predefined ThreeJS Fragmet Shaders. This takes away the hastle of
 * writing code for lighting and shaing.
 */
class CustomShaderMaterial extends THREE.ShaderMaterial {
  /**
   * @typedef {Object} CustomShader
   * @property {string} defines        Constant definitions like - "#define PI = 3.14;"
   * @property {string} header         Code to be injected above main. Place function definitions here.
   * @property {string} main           Code to be injected above main. Put main shader code here.
   */

  /**
   * Creates an instance of the <code>CustomShaderMaterial</code> class.
   *
   * <b>The variable <code>newPos</code> and <code>newNormal</code> must be
   * defined in the main section of the indjected shader.</b>
   *
   *
   * @param {Object} options                    Options for material.
   * @param {string} options.baseMaterial       Base Material. The material whos fragment shader is used. Any type from the exported <code>TYPES</code> object
   * @param {...CustomShader} options.vShader   Custom Vertex Shader
   * @param {...CustomShader} options.fShader   Custom Fragment Shader
   * @param {Object} options.uniforms           Custom Uniforms to be passed to the shader.
   * @param {Object} options.passthrough        Any custom options to be passed to the underlying base material.
   */
  constructor(options) {
    if (options.vShader === undefined)
      throw new Error("Vertex Shader must be provided.");

    if (options.baseMaterial === undefined)
      throw new Error("Base material must be defined.");

    const baseMaterial = options.baseMaterial || TYPES.BASIC;
    const vShader = options.vShader || {};
    const fShader = options.fShader || {};
    const uniforms = options.uniforms || [];
    const passthrough = options.passthrough || {};
    const baseShader = THREE.ShaderLib[baseMaterial];

    super({
      uniforms: THREE.UniformsUtils.merge([baseShader.uniforms, ...uniforms]),

      extensions: {
        derivatives: true,
      },

      vertexShader: _patchvShader(THREE.ShaderChunk.meshphysical_vert, vShader),
      fragmentShader: _patchfShader(baseShader.fragmentShader, fShader),
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

function _patchfShader(shader, { defines = "", header = "", main = "" }) {
  const patchedShader = shader.replace(
    "void main() {",
    `
    ${header}
    void main() {
      ${main}
      ${main === "" ? "" : "return;"}
    `
  );

  return `
    ${defines}
    ${patchedShader}
    `;
}

/**
 * From https://codepen.io/marco_fugaro/pen/xxZWPWJ?editors=0010
 */
function _patchvShader(shader, { defines = "", header = "", main = "" }) {
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

export { CustomShaderMaterial, TYPES };
