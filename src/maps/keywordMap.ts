export const keywordMap = {
  // PBR
  diffuse: "csm_DiffuseColor", // Color + alpha
  normal: "csm_Normal", // Normal
  roughness: "csm_Roughness", // Roughness
  metalness: "csm_Metalness", // Metalness
  emissive: "csm_Emissive", // Emissive
  ao: "csm_AO", // AO
  bump: "csm_Bump", // Bump
  clearcoat: "csm_Clearcoat", // Clearcoat factor
  clearcoatRoughness: "csm_ClearcoatRoughness", // Clearcoat roughness
  clearcoatNormal: "csm_ClearcoatNormal", // Clearcoat normals
  transmission: "csm_Transmission", // Transmission
  thickness: "csm_Thickness", // Thickness
  iridescence: "csm_Iridescence", // Iridescence

  // Extras
  pointSize: "csm_PointSize",
  fragColor: "csm_FragColor",
  depthAlpha: "csm_DepthAlpha", // Depth
  unlitFac: "csm_UnlitFac", // Unlit factor

  // Vert
  position: "csm_Position",
  positionRaw: "csm_PositionRaw",
};
