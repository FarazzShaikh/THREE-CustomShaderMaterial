import keywords from './keywords'

export const VERT = {
  [`${keywords.normal}`]: {
    '#include <defaultnormal_vertex>': `
    vec3 transformedNormal = ${keywords.normal};
    #ifdef USE_INSTANCING
    	// this is in lieu of a per-instance normal-matrix
    	// shear transforms in the instance matrix are not supported
    	mat3 m = mat3( instanceMatrix );
    	transformedNormal /= vec3( dot( m[ 0 ], m[ 0 ] ), dot( m[ 1 ], m[ 1 ] ), dot( m[ 2 ], m[ 2 ] ) );
    	transformedNormal = m * transformedNormal;
    #endif
    transformedNormal = normalMatrix * transformedNormal;
    #ifdef FLIP_SIDED
    	transformedNormal = - transformedNormal;
    #endif
    #ifdef USE_TANGENT
    	vec3 transformedTangent = ( modelViewMatrix * vec4( objectTangent, 0.0 ) ).xyz;
    	#ifdef FLIP_SIDED
    		transformedTangent = - transformedTangent;
    	#endif
    #endif
    `,
  },
  [`${keywords.positon}`]: {
    '#include <project_vertex>': `
    transformed = ${keywords.positon};
    #include <project_vertex>
  `,
  },
  [`${keywords.pointSize}`]: {
    'gl_PointSize = size;': `gl_PointSize = ${keywords.pointSize};`,
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
