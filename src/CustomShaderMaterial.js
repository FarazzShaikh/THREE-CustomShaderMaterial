import * as THREE from "three";

/**
 * @typedef {Object} CustomShader
 * @property {string} defines        Constant definitions like - "#define PI = 3.14;"
 * @property {string} header         Code to be injected above main. Place function definitions here.
 * @property {string} main           Code to be injected above main. Put main shader code here.
 */

/**
 * This class lets you use your own custom Vertex Shaders along with
 * predefined ThreeJS Fragmet Shaders. This takes away the hastle of
 * writing code for lighting and shaing.
 */
export class CustomShaderMaterial extends THREE.Material {
  /**
   * Creates an instance of the <code>CustomShaderMaterial</code> class.
   *
   * <b>The variable <code>newPos</code> and <code>newNormal</code> must be
   * defined in the main section of the indjected shader.</b>
   *
   *
   * @param {Object} options                    Options for material.
   * @param {string} options.baseMaterial       Base Material. The material whos fragment shader is used. Any type from the exported <code>TYPES</code> object
   * @param {CustomShader} options.vShader   Custom Vertex Shader
   * @param {CustomShader} options.fShader   Custom Fragment Shader
   * @param {Object} options.uniforms           Custom Uniforms to be passed to the shader.
   * @param {Object} options.passthrough        Any custom options to be passed to the underlying base material.
   *
   * @example
   * const material = new CustomShaderMaterial({
   *     baseMaterial: TYPES.PHYSICAL,
   *     vShader: {
   *         defines: vertex.defines,
   *         header: vertex.header,
   *         main: vertex.main,
   *     },
   *     uniforms: {
   *         uTime: { value: 1.0 },
   *         uResolution: { value: new THREE.Vector3() },
   *     },
   *     passthrough: {
   *         wireframe: true,
   *     },
   * });
   * material.uniforms.uResolution.set(1920, 1080, 0);
   */
  constructor(options) {
    const base = new THREE[options.baseMaterial](options.passthrough);
    super();

    for (const key in base) {
      if (this[key] === undefined) this[key] = 0;
    }

    this.setValues(base);

    this.onBeforeCompile = (shader) => {
      shader.vertexShader = _patchvShader(shader.vertexShader, {
        defines: options.vShader.defines,
        header: options.vShader.header,
        main: options.vShader.main,
      });

      Object.keys(options.uniforms).forEach((k) => {
        shader.uniforms[k] = options.uniforms[k];
      });

      this.uniforms = shader.uniforms;
      this.needsUpdate = true;
    };
  }
}

/**
 * From https://codepen.io/marco_fugaro/pen/xxZWPWJ?editors=0010
 * @private
 */
function _patchvShader(shader, { defines = "", header = "", main = "" }) {
  let patchedShader = shader;

  const replaces = {
    "#include <defaultnormal_vertex>":
      THREE.ShaderChunk.defaultnormal_vertex.replace(
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
