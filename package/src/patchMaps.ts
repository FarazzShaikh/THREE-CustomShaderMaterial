import keywords from './keywords'
import { iCSMPatchMap } from './types'

export const defaultPatchMap: iCSMPatchMap = {
  // VERT

  [`${keywords.normal}`]: {
    '#include <beginnormal_vertex>': `
    vec3 objectNormal = ${keywords.normal};
    #ifdef USE_TANGENT
	    vec3 objectTangent = vec3( tangent.xyz );
    #endif
    `,
  },
  [`${keywords.position}`]: {
    '#include <begin_vertex>': `
    vec3 transformed = ${keywords.position};
  `,
  },
  [`${keywords.positionRaw}`]: {
    '#include <begin_vertex>': `
    vec4 csm_internal_positionUnprojected = ${keywords.positionRaw};
    mat4x4 csm_internal_unprojectMatrix = projectionMatrix * modelViewMatrix;
    #ifdef USE_INSTANCING
      csm_internal_unprojectMatrix = csm_internal_unprojectMatrix * instanceMatrix;
    #endif
    csm_internal_positionUnprojected = inverse(csm_internal_unprojectMatrix) * csm_internal_positionUnprojected;
    vec3 transformed = csm_internal_positionUnprojected.xyz;
  `,
  },
  [`${keywords.pointSize}`]: {
    'gl_PointSize = size;': `
    gl_PointSize = ${keywords.pointSize};
    `,
  },

  // FRAG

  [`${keywords.diffuseColor}`]: {
    '#include <color_fragment>': `
    #include <color_fragment>
    diffuseColor = ${keywords.diffuseColor};
  `,
  },
  [`${keywords.fragColor}`]: {
    '#include <dithering_fragment>': `
    #include <dithering_fragment>
    gl_FragColor  = ${keywords.fragColor};
  `,
  },
  [`${keywords.emissive}`]: {
    'vec3 totalEmissiveRadiance = emissive;': `
    vec3 totalEmissiveRadiance = ${keywords.emissive};
    `,
  },
  [`${keywords.roughness}`]: {
    '#include <roughnessmap_fragment>': `
    #include <roughnessmap_fragment>
    roughnessFactor = ${keywords.roughness};
    `,
  },
  [`${keywords.metalness}`]: {
    '#include <metalnessmap_fragment>': `
    #include <metalnessmap_fragment>
    metalnessFactor = ${keywords.metalness};
    `,
  },
  [`${keywords.ao}`]: {
    '#include <aomap_fragment>': `
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= 1. - ${keywords.ao};
    `,
  },
  [`${keywords.bump}`]: {
    '#include <normal_fragment_maps>': `
    #include <normal_fragment_maps>

    vec3 csm_internal_orthogonal = ${keywords.bump} - (dot(${keywords.bump}, normal) * normal);
    vec3 csm_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_internal_orthogonal;
    normal = normalize(normal - csm_internal_projectedbump);
    `,
  },
  [`${keywords.depthAlpha}`]: {
    'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );': `
      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * ${keywords.depthAlpha} );
    `,
    'gl_FragColor = packDepthToRGBA( fragCoordZ );': `
      gl_FragColor = packDepthToRGBA( fragCoordZ );
      gl_FragColor.a *= ${keywords.depthAlpha};
    `,
  },
}

export const shaderMaterial_PatchMap: iCSMPatchMap = {
  // VERT
  [`${keywords.position}`]: {
    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );': `
    gl_Position = projectionMatrix * modelViewMatrix * vec4( ${keywords.position}, 1.0 );
  `,
  },
  [`${keywords.positionRaw}`]: {
    'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );': `
    gl_Position = ${keywords.position};
  `,
  },

  // FRAG
  [`${keywords.diffuseColor}`]: {
    'gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );': `
    gl_FragColor = ${keywords.diffuseColor};
  `,
  },
  [`${keywords.fragColor}`]: {
    'gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );': `
    gl_FragColor = ${keywords.fragColor};
  `,
  },
}
