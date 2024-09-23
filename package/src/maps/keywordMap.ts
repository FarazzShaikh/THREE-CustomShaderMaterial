export const keywordMap = {
  // PBR (frag)
  diffuse: "csm_DiffuseColor", // Color + alpha
  roughness: "csm_Roughness", // Roughness
  metalness: "csm_Metalness", // Metalness
  emissive: "csm_Emissive", // Emissive
  ao: "csm_AO", // AO
  bump: "csm_Bump", // Bump
  fragNormal: "csm_FragNormal", // Fragment Normal
  clearcoat: "csm_Clearcoat", // Clearcoat factor
  clearcoatRoughness: "csm_ClearcoatRoughness", // Clearcoat roughness
  clearcoatNormal: "csm_ClearcoatNormal", // Clearcoat normals
  transmission: "csm_Transmission", // Transmission
  thickness: "csm_Thickness", // Thickness
  iridescence: "csm_Iridescence", // Iridescence

  // Extras
  pointSize: "csm_PointSize", // gl_PointSize (Frag)
  fragColor: "csm_FragColor", // gl_FragColor (Frag)
  depthAlpha: "csm_DepthAlpha", // Depth (MeshDepthMaterial)
  unlitFac: "csm_UnlitFac", // Unlit factor (mix between csm_FragColor and csm_DiffuseColor)

  // Vert
  position: "csm_Position", // gl_Position
  positionRaw: "csm_PositionRaw", // gl_Position (without projection)
  normal: "csm_Normal", // Vertex Normal
};
