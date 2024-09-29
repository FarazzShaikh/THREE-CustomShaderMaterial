import react from "@vitejs/plugin-react";
import fs from "fs/promises";
import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

/**
 * Copies LICENSE.md to the dist folder
 */
function copyLicensePlugin() {
  return {
    name: "copy-license",
    closeBundle: async () => {
      await fs.copyFile("../LICENSE.md", "./LICENSE.md");
      await fs.copyFile("../README.md", "./README.md");
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
      name: "custom-shader-material",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => `${entryName}.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@react-three/fiber", "three"],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [
    react(),
    dts({
      rollupTypes: true,
    }),
    copyLicensePlugin(),
  ],
});
