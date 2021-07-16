export default [
  {
    input: "index.js",
    output: {
      file: "build/three-csm.m.js",
      format: "es",
    },
    external: ["three"],
  },
  {
    input: "index.js",
    output: {
      file: "build/three-csm.m.cdn.js",
      format: "es",
      paths: {
        three: "https://cdn.skypack.dev/three",
      },
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
