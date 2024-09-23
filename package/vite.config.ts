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
    },
    rollupOptions: {
      external: ["react", "react-dom", "@react-three/fiber", "three"],
      output: [
        {
          format: "es",
          entryFileNames: `entry/es/[name].js`,
        },
        {
          format: "cjs",
          entryFileNames: `entry/cjs/[name].cjs`,
        },
      ],
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  plugins: [react(), dts(), copyLicensePlugin()],
});
