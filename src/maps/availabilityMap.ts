import { keywordMap } from "./keywordMap";

// Map of CSM keywords to the materials they are available in
// Some keywords are only available in certain materials
export const availabilityMap = {
  [`${keywordMap.position}`]: "*",
  [`${keywordMap.positionRaw}`]: "*",
  [`${keywordMap.normal}`]: "*",
  [`${keywordMap.depthAlpha}`]: "*",
  [`${keywordMap.pointSize}`]: ["PointsMaterial"],

  [`${keywordMap.diffuse}`]: "*",
  [`${keywordMap.fragColor}`]: "*",
  [`${keywordMap.unlitFac}`]: ["*"],
  [`${keywordMap.emissive}`]: ["MeshStandardMaterial", "MeshPhysicalMaterial"],
  [`${keywordMap.roughness}`]: ["MeshStandardMaterial", "MeshPhysicalMaterial"],
  [`${keywordMap.metalness}`]: ["MeshStandardMaterial", "MeshPhysicalMaterial"],
  [`${keywordMap.iridescence}`]: [
    "MeshStandardMaterial",
    "MeshPhysicalMaterial",
  ],
  [`${keywordMap.ao}`]: [
    "MeshStandardMaterial",
    "MeshPhysicalMaterial",
    "MeshBasicMaterial",
    "MeshLambertMaterial",
    "MeshPhongMaterial",
    "MeshToonMaterial",
  ],
  [`${keywordMap.bump}`]: [
    "MeshLambertMaterial",
    "MeshMatcapMaterial",
    "MeshNormalMaterial",
    "MeshPhongMaterial",
    "MeshPhysicalMaterial",
    "MeshStandardMaterial",
    "MeshToonMaterial",
    "ShadowMaterial",
  ],
  [`${keywordMap.clearcoat}`]: ["MeshPhysicalMaterial"],
  [`${keywordMap.clearcoatRoughness}`]: ["MeshPhysicalMaterial"],
  [`${keywordMap.clearcoatNormal}`]: ["MeshPhysicalMaterial"],
  [`${keywordMap.transmission}`]: ["MeshPhysicalMaterial"],
  [`${keywordMap.thickness}`]: ["MeshPhysicalMaterial"],
};
