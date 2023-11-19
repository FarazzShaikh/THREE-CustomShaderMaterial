import { keywordMap } from './keywordMap'

// Map of CSM keywords to the materials they are available in
// Some keywords are only available in certain materials
export const defaultAvailabilityMap = {
  [`${keywordMap.position}`]: '*',
  [`${keywordMap.positionRaw}`]: '*',
  [`${keywordMap.normal}`]: '*',
  [`${keywordMap.pointSize}`]: ['PointsMaterial'],

  [`${keywordMap.diffuse}`]: '*',
  [`${keywordMap.fragColor}`]: '*',
  [`${keywordMap.emissive}`]: ['MeshStandardMaterial', 'MeshPhysicalMaterial'],
  [`${keywordMap.roughness}`]: ['MeshStandardMaterial', 'MeshPhysicalMaterial'],
  [`${keywordMap.metalness}`]: ['MeshStandardMaterial', 'MeshPhysicalMaterial'],
  [`${keywordMap.ao}`]: [
    'MeshStandardMaterial',
    'MeshPhysicalMaterial',
    'MeshBasicMaterial',
    'MeshLambertMaterial',
    'MeshPhongMaterial',
    'MeshToonMaterial',
  ],
  [`${keywordMap.bump}`]: [
    'MeshLambertMaterial',
    'MeshMatcapMaterial',
    'MeshNormalMaterial',
    'MeshPhongMaterial',
    'MeshPhysicalMaterial',
    'MeshStandardMaterial',
    'MeshToonMaterial',
    'ShadowMaterial',
  ],
  [`${keywordMap.depthAlpha}`]: ['MeshDepthMaterial'],
  [`${keywordMap.clearcoat}`]: ['MeshPhysicalMaterial'],
  [`${keywordMap.clearcoatRoughness}`]: ['MeshPhysicalMaterial'],
  [`${keywordMap.clearcoatNormal}`]: ['MeshPhysicalMaterial'],
}
