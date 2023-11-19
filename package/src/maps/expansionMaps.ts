import * as THREE from 'three'

// Map of shader includes to be expanded
// Some substitutions require 2 replacements within
// one include, which is not possible without expanding the includes.
export const expansionMaps = {
  '#include <lights_physical_fragment>': THREE.ShaderChunk.lights_physical_fragment,
}
