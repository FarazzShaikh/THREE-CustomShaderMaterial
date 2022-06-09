import keywords from './keywords'
import { CSMPatchMap } from './types'

const defaultPatchMap: CSMPatchMap = {
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
    vec4 csm_positionUnprojected = ${keywords.positionRaw};
    mat4x4 csm_unprojectMatrix = projectionMatrix * modelViewMatrix;
    #ifdef USE_INSTANCING
      csm_unprojectMatrix = csm_unprojectMatrix * instanceMatrix;
    #endif
    csm_positionUnprojected = inverse(csm_unprojectMatrix) * csm_positionUnprojected;
    vec3 transformed = csm_positionUnprojected.xyz;
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
    '#include <output_fragment>': `
    #include <output_fragment>
    gl_FragColor  = ${keywords.fragColor};
  `,
  },
  [`${keywords.emissive}`]: {
    'vec3 totalEmissiveRadiance = emissive;': `
    vec3 totalEmissiveRadiance = ${keywords.emissive};
    `,
  },
}
export default defaultPatchMap
