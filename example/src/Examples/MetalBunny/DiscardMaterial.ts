import { shaderMaterial } from "@react-three/drei";

export const DiscardMaterial = /* @__PURE__ */ shaderMaterial(
  {},
  "void main() { }",
  "void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard;  }"
);
