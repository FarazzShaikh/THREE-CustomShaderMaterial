import * as THREE from "three";
import { CSMPatchMap } from "../types";
import { keywordMap } from "./keywordMap";

// Map of CSM keywords to their substitutions
export const defaultPatchMap: CSMPatchMap = {
  // VERT
  "*": {
    "#include <lights_physical_fragment>":
      THREE.ShaderChunk.lights_physical_fragment,
    "#include <transmission_fragment>": THREE.ShaderChunk.transmission_fragment,
  },
  [`${keywordMap.normal}`]: {
    "#include <beginnormal_vertex>": `
    vec3 objectNormal = ${keywordMap.normal};
    #ifdef USE_TANGENT
	    vec3 objectTangent = vec3( tangent.xyz );
    #endif
    `,
  },
  [`${keywordMap.position}`]: {
    "#include <begin_vertex>": `
    vec3 transformed = ${keywordMap.position};
  `,
  },
  [`${keywordMap.positionRaw}`]: {
    "#include <project_vertex>": `
    #include <project_vertex>
    gl_Position = ${keywordMap.positionRaw};
  `,
  },
  [`${keywordMap.pointSize}`]: {
    "gl_PointSize = size;": `
    gl_PointSize = ${keywordMap.pointSize};
    `,
  },

  // FRAG

  [`${keywordMap.diffuse}`]: {
    "#include <color_fragment>": `
    #include <color_fragment>
    diffuseColor = ${keywordMap.diffuse};
  `,
  },
  [`${keywordMap.fragColor}`]: {
    "#include <opaque_fragment>": `
    #include <opaque_fragment>
    gl_FragColor = mix(gl_FragColor, ${keywordMap.fragColor}, ${keywordMap.unlitFac});
  `,
  },
  [`${keywordMap.emissive}`]: {
    "vec3 totalEmissiveRadiance = emissive;": `
    vec3 totalEmissiveRadiance = ${keywordMap.emissive};
    `,
  },
  [`${keywordMap.roughness}`]: {
    "#include <roughnessmap_fragment>": `
    #include <roughnessmap_fragment>
    roughnessFactor = ${keywordMap.roughness};
    `,
  },
  [`${keywordMap.metalness}`]: {
    "#include <metalnessmap_fragment>": `
    #include <metalnessmap_fragment>
    metalnessFactor = ${keywordMap.metalness};
    `,
  },
  [`${keywordMap.ao}`]: {
    "#include <aomap_fragment>": `
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= 1. - ${keywordMap.ao};
    `,
  },
  [`${keywordMap.bump}`]: {
    "#include <normal_fragment_maps>": `
    #include <normal_fragment_maps>

    vec3 csm_internal_orthogonal = ${keywordMap.bump} - (dot(${keywordMap.bump}, normal) * normal);
    vec3 csm_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_internal_orthogonal;
    normal = normalize(normal - csm_internal_projectedbump);
    `,
  },
  [`${keywordMap.fragNormal}`]: {
    "#include <normal_fragment_maps>": `
      #include <normal_fragment_maps>
      normal = ${keywordMap.fragNormal};
    `,
  },
  [`${keywordMap.depthAlpha}`]: {
    "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );": `
      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * 1.0 - ${keywordMap.depthAlpha} );
    `,
    "gl_FragColor = packDepthToRGBA( fragCoordZ );": `
      if(${keywordMap.depthAlpha} < 1.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `,
    "gl_FragColor = packDepthToRGBA( dist );": `
      if(${keywordMap.depthAlpha} < 1.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `,
  },
  [`${keywordMap.clearcoat}`]: {
    "material.clearcoat = clearcoat;": `material.clearcoat = ${keywordMap.clearcoat};`,
  },
  [`${keywordMap.clearcoatRoughness}`]: {
    "material.clearcoatRoughness = clearcoatRoughness;": `material.clearcoatRoughness = ${keywordMap.clearcoatRoughness};`,
  },
  [`${keywordMap.clearcoatNormal}`]: {
    "#include <clearcoat_normal_fragment_begin>": `
      vec3 csm_coat_internal_orthogonal = csm_ClearcoatNormal - (dot(csm_ClearcoatNormal, nonPerturbedNormal) * nonPerturbedNormal);
      vec3 csm_coat_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_coat_internal_orthogonal;
      vec3 clearcoatNormal = normalize(nonPerturbedNormal - csm_coat_internal_projectedbump);
    `,
  },
  [`${keywordMap.transmission}`]: {
    "material.transmission = transmission;": `
      material.transmission = ${keywordMap.transmission};
    `,
  },
  [`${keywordMap.thickness}`]: {
    "material.thickness = thickness;": `
      material.thickness = ${keywordMap.thickness};
    `,
  },
  [`${keywordMap.iridescence}`]: {
    "material.iridescence = iridescence;": `
      material.iridescence = ${keywordMap.iridescence};
    `,
  },
};
