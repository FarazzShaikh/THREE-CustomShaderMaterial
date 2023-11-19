import keywords from './keywords'

// Map of defines to their keywords
// this is because Three only injects some defines
// if certain properties are set in the material options.
// We need to add these defines manually if for example
// the user uses csm_Clearcoat but does not set clearcoat on the material.
export const defineMap = {
  CSM_USE_CLEARCOAT: [keywords.clearcoat, keywords.clearcoatNormal, keywords.clearcoatRoughness],
}
