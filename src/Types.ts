/**
 * @typedef {Object<string>} tMaterialTypes
 */
export type tMaterialTypes = { [key: string]: string };
/**
 * @typedef {Object<THREE.IUniform<any>>} tMaterialTypes
 */
export type tUniforms = { [key: string]: THREE.IUniform<any> };
/**
 * @typedef {Object<THREE.MaterialParameters>} tMaterialTypes
 */
export type tPassthrough = { [key: string]: THREE.MaterialParameters };

/**
 * @enum
 * @readonly
 * @property {string} NORMAL MeshNormalMaterial
 * @property {string} BASIC MeshBasicMaterial
 * @property {string} PHONG MeshPhongMaterial
 * @property {string} MATCAP MeshMatcapMaterial
 * @property {string} TOON MeshToonMaterial
 * @property {string} PHYSICAL MeshPhysicalMaterial
 * @property {string} LAMBERT MeshLambertMaterial
 * @property {string} DEPTH MeshDepthMaterial
 * @property {string} POINTS PointsMaterial
 */
export const TYPES: tMaterialTypes = {
  NORMAL: "MeshNormalMaterial",
  BASIC: "MeshBasicMaterial",
  PHONG: "MeshPhongMaterial",
  MATCAP: "MeshMatcapMaterial",
  TOON: "MeshToonMaterial",
  PHYSICAL: "MeshPhysicalMaterial",
  LAMBERT: "MeshLambertMaterial",
  DEPTH: "MeshDepthMaterial",
  POINTS: "PointsMaterial",
};

/**
 * @interface
 * @readonly
 * @property {string} defines        Constant definitions like - "#define PI = 3.14;"
 * @property {string} header         Code to be injected above main. Place function definitions here.
 * @property {string} main           Code to be injected above main. Put main shader code here.
 */
export interface iCustomShader {
  defines?: string;
  header?: string;
  main?: string;
}

/**
 * @interface
 * @readonly
 * @property {string} baseMaterial         Base Material. The material whos fragment shader is used. Any type from the exported <code>TYPES</code> object.
 * @see TYPES
 * @property {iCustomShader} vShader       Custom Vertex Shader
 * @property {iCustomShader} fShader]      Custom Fragment Shader
 * @property {tUniforms} uniforms          Custom Uniforms to be passed to the shader.
 * @property {tPassthrough} passthrough    Any custom options to be passed to the underlying base material.
 *
 */
export interface iOptions {
  baseMaterial: string;
  vShader: iCustomShader;
  fShader: iCustomShader;
  uniforms?: tUniforms;
  passthrough?: tPassthrough;
}
