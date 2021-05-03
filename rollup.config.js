export default [
  {
    input: "index.js",
    output: {
      file: "build/three-csm.module.js",
      format: "es",
    },
    external: ["three"],
  },
  {
    input: "index.js",
    output: {
      file: "build/three-csm.js",
      format: "iife",
      globals: {
        three: "THREE",
      },
      name: "THREE_CustomShaderMaterial",
    },
    external: ["three"],
  },
];
