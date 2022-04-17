import keywords from './keywords'

export const VERT = {
  [`${keywords.normal}`]: {
    '#include <beginnormal_vertex>': `
    vec3 objectNormal = ${keywords.normal};
    #ifdef USE_TANGENT
	    vec3 objectTangent = vec3( tangent.xyz );
    #endif
    `,
  },
  [`${keywords.positon}`]: {
    '#include <begin_vertex>': `
    vec3 transformed = ${keywords.positon};
  `,
  },
  [`${keywords.pointSize}`]: {
    'gl_PointSize = size;': `
    gl_PointSize = ${keywords.pointSize};
    `,
  },
}

export const FRAG = {
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
