var THREE_CustomShaderMaterial = (function (exports, THREE) {
  'use strict';

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
      Object.keys(e).forEach(function (k) {
        if (k !== 'default') {
          var d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: function () {
              return e[k];
            }
          });
        }
      });
    }
    n['default'] = e;
    return Object.freeze(n);
  }

  var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);

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
  class CustomShaderMaterial extends THREE__namespace.ShaderMaterial {
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
      const baseShader = THREE__namespace.ShaderLib[baseMaterial];

      if (baseShader === undefined) throw "Invalid Base Material Type";

      super({
        uniforms: THREE__namespace.UniformsUtils.merge([baseShader.uniforms, ...uniforms]),

        extensions: {
          derivatives: true,
        },

        vertexShader: _patchShader(THREE__namespace.ShaderChunk.meshphysical_vert, vShader),
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
      "#include <defaultnormal_vertex>": THREE__namespace.ShaderChunk.defaultnormal_vertex.replace(
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

  exports.CustomShaderMaterial = CustomShaderMaterial;
  exports.TYPES = TYPES;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

}({}, THREE));
