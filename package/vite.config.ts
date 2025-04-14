import react from "@vitejs/plugin-react";
import fs from "fs/promises";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

function copyFiles() {
  return {
    name: "copy-license",
    closeBundle: async () => {
      await fs.copyFile("../LICENSE.md", "./dist/LICENSE.md");
      await fs.copyFile("../README.md", "./dist/README.md");
      await fs.copyFile("./dist/vanilla.d.ts", "./dist/vanilla/vanilla.d.ts");
      await fs.rm("./dist/vanilla.d.ts");

      // Write vanilla package.json
      const vanillaJson = {
        main: "three-custom-shader-material.cjs.js",
        module: "three-custom-shader-material.es.js",
        type: "module",
        types: "vanilla.d.ts",
      };
      await fs.writeFile(
        "./dist/vanilla/package.json",
        JSON.stringify(vanillaJson, null, 2)
      );
    },
  };
}

export default defineConfig({
  build: {
    lib: {
      entry: {
        vanilla: path.resolve(__dirname, "src/index.ts"),
        react: path.resolve(__dirname, "src/React/index.tsx"),
      },
      name: "three-custom-shader-material",
      formats: ["es", "cjs"],
      fileName: (format, entry) => {
        switch (entry) {
          case "vanilla":
            return `vanilla/three-custom-shader-material.${format}.js`;
          case "react":
            return `three-custom-shader-material.${format}.js`;
          default:
            return `${entry}.${format}.js`;
        }
      },
    },
    rollupOptions: {
      external: [
        "react",
        "react/jsx-runtime",
        "react-dom",
        "react-dom/client",
        "three",
        "@react-three/fiber",
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
    }),
    copyFiles(),
  ],
});
