import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/THREE-CustomShaderMaterial/",
  plugins: [react()],
  resolve: {
    alias: {
      "three-custom-shader-material/vanilla": path.resolve(
        __dirname,
        "../package/src/index.ts"
      ),
      "three-custom-shader-material": path.resolve(
        __dirname,
        "../package/src/React/index.tsx"
      ),
    },
  },
});
