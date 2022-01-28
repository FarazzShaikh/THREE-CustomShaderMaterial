import keywords from "./keywords";

export const VERT = {
  "#include <defaultnormal_vertex>": `
    vec3 transformedNormal = ${keywords.normal};
    `,

  "#include <project_vertex>": `
    transformed = ${keywords.posiiton};
    #include <project_vertex>
  `,
  "gl_PointSize = size;": `gl_PointSize = ${keywords.pointSize};`,
};

export const FRAG = {
  "#include <color_fragment>": `
    #include <color_fragment>
    diffuseColor = ${keywords.diffuseColor};
`,
};
