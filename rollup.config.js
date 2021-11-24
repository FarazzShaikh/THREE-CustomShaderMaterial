import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import dts from "rollup-plugin-dts";

const tsOpts = {
  useTsconfigDeclarationDir: true,
};

export default [
  {
    input: "index.ts",
    output: {
      sourcemap: true,
      file: "build/three-csm.m.js",
      format: "es",
    },
    external: ["three"],
    plugins: [typescript(tsOpts), terser()],
  },
  {
    input: "index.ts",
    output: {
      sourcemap: true,
      file: "build/three-csm.m.cdn.js",
      format: "es",
      paths: {
        three: "https://cdn.skypack.dev/three",
      },
    },
    external: ["three"],
    plugins: [typescript(tsOpts), terser()],
  },
  {
    input: "index.ts",
    output: {
      sourcemap: true,
      file: "build/three-csm.js",
      format: "iife",
      globals: {
        three: "THREE",
      },
      name: "THREE_CustomShaderMaterial",
    },
    external: ["three"],
    plugins: [typescript(tsOpts), terser()],
  },
  {
    input: "build/types/index.d.ts",
    output: [{ file: "build/three-csm.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
