import keywords from './keywords'

// Map of CSM keywords to the materials they are available in
// Some keywords are only available in certain materials
export const defaultAvailabilityMap = {
  [`${keywords.position}`]: '*',
  [`${keywords.positionRaw}`]: '*',
  [`${keywords.normal}`]: '*',
  [`${keywords.pointSize}`]: ['PointsMaterial'],

  [`${keywords.diffuseColor}`]: '*',
  [`${keywords.fragColor}`]: '*',
  [`${keywords.emissive}`]: ['MeshStandardMaterial', 'MeshPhysicalMaterial'],
  [`${keywords.roughness}`]: ['MeshStandardMaterial', 'MeshPhysicalMaterial'],
  [`${keywords.metalness}`]: ['MeshStandardMaterial', 'MeshPhysicalMaterial'],
  [`${keywords.ao}`]: [
    'MeshStandardMaterial',
    'MeshPhysicalMaterial',
    'MeshBasicMaterial',
    'MeshLambertMaterial',
    'MeshPhongMaterial',
    'MeshToonMaterial',
  ],
  [`${keywords.bump}`]: [
    'MeshLambertMaterial',
    'MeshMatcapMaterial',
    'MeshNormalMaterial',
    'MeshPhongMaterial',
    'MeshPhysicalMaterial',
    'MeshStandardMaterial',
    'MeshToonMaterial',
    'ShadowMaterial',
  ],
  [`${keywords.depthAlpha}`]: ['MeshDepthMaterial'],
  [`${keywords.clearcoat}`]: ['MeshPhysicalMaterial'],
  [`${keywords.clearcoatRoughness}`]: ['MeshPhysicalMaterial'],
  [`${keywords.clearcoatNormal}`]: ['MeshPhysicalMaterial'],
}
