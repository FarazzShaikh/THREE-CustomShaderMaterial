import { keywordMap } from "./keywordMap";

// Map of props to their keywords
// this is because Three only injects some defines
// if certain properties are set in the material options.
// We need to enforce these props on the material. For example
// the user uses csm_Clearcoat but does not set clearcoat on the material.
export const requiredPropsMap = {
  clearcoat: [
    keywordMap.clearcoat,
    keywordMap.clearcoatNormal,
    keywordMap.clearcoatRoughness,
  ],
  transmission: [keywordMap.transmission],
  iridescence: [keywordMap.iridescence],
};
