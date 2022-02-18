import keywords from './keywords'

export const VERT = {
  [`${keywords.normal}`]: {
    '#include <defaultnormal_vertex>': `
    #include <defaultnormal_vertex>
    transformedNormal = ${keywords.normal};
    `,
  },
  [`${keywords.posiiton}`]: {
    '#include <project_vertex>': `
    transformed = ${keywords.posiiton};
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
}
