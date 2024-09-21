import * as T from "three";
const D = (
  /* glsl */
  `
    
#ifdef IS_VERTEX
    vec3 csm_Position;
    vec4 csm_PositionRaw;
    vec3 csm_Normal;

    // csm_PointSize
    #ifdef IS_POINTSMATERIAL
        float csm_PointSize;
    #endif
#else
    vec4 csm_DiffuseColor;
    vec4 csm_FragColor;
    float csm_UnlitFac;

    // csm_Emissive, csm_Roughness, csm_Metalness
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
        vec3 csm_Emissive;
        float csm_Roughness;
        float csm_Metalness;
        float csm_Iridescence;
        
        #if defined IS_MESHPHYSICALMATERIAL
            float csm_Clearcoat;
            float csm_ClearcoatRoughness;
            vec3 csm_ClearcoatNormal;
            float csm_Transmission;
            float csm_Thickness;
        #endif
    #endif

    // csm_AO
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHBASICMATERIAL || defined IS_MESHLAMBERTMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHTOONMATERIAL
        float csm_AO;
    #endif

    // csm_Bump
    #if defined IS_MESHLAMBERTMATERIAL || defined IS_MESHMATCAPMATERIAL || defined IS_MESHNORMALMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHSTANDARDMATERIAL || defined IS_MESHTOONMATERIAL || defined IS_SHADOWMATERIAL 
        vec3 csm_Bump;
        vec3 csm_FragNormal;
    #endif

    float csm_DepthAlpha;
#endif
`
), P = (
  /* glsl */
  `

#ifdef IS_VERTEX
    // csm_Position & csm_PositionRaw
    #ifdef IS_UNKNOWN
        csm_Position = vec3(0.0);
        csm_PositionRaw = vec4(0.0);
        csm_Normal = vec3(0.0);
    #else
        csm_Position = position;
        csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        csm_Normal = normal;
    #endif

    // csm_PointSize
    #ifdef IS_POINTSMATERIAL
        csm_PointSize = size;
    #endif
#else
    csm_UnlitFac = 0.0;

    // csm_DiffuseColor & csm_FragColor
    #if defined IS_UNKNOWN || defined IS_SHADERMATERIAL || defined IS_MESHDEPTHMATERIAL || defined IS_MESHDISTANCEMATERIAL || defined IS_MESHNORMALMATERIAL || defined IS_SHADOWMATERIAL
        csm_DiffuseColor = vec4(1.0, 0.0, 1.0, 1.0);
        csm_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
    #else
        #ifdef USE_MAP
            vec4 _csm_sampledDiffuseColor = texture2D(map, vMapUv);

            #ifdef DECODE_VIDEO_TEXTURE
            // inline sRGB decode (TODO: Remove this code when https://crbug.com/1256340 is solved)
            _csm_sampledDiffuseColor = vec4(mix(pow(_csm_sampledDiffuseColor.rgb * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), _csm_sampledDiffuseColor.rgb * 0.0773993808, vec3(lessThanEqual(_csm_sampledDiffuseColor.rgb, vec3(0.04045)))), _csm_sampledDiffuseColor.w);
            #endif

            csm_DiffuseColor = vec4(diffuse, opacity) * _csm_sampledDiffuseColor;
            csm_FragColor = vec4(diffuse, opacity) * _csm_sampledDiffuseColor;
        #else
            csm_DiffuseColor = vec4(diffuse, opacity);
            csm_FragColor = vec4(diffuse, opacity);
        #endif
    #endif

    // csm_Emissive, csm_Roughness, csm_Metalness
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
        csm_Emissive = emissive;
        csm_Roughness = roughness;
        csm_Metalness = metalness;

        #ifdef USE_IRIDESCENCE
            csm_Iridescence = iridescence;
        #else
            csm_Iridescence = 0.0;
        #endif

        #if defined IS_MESHPHYSICALMATERIAL
            #ifdef USE_CLEARCOAT
                csm_Clearcoat = clearcoat;
                csm_ClearcoatRoughness = clearcoatRoughness;
            #else
                csm_Clearcoat = 0.0;
                csm_ClearcoatRoughness = 0.0;
            #endif

            #ifdef USE_TRANSMISSION
                csm_Transmission = transmission;
                csm_Thickness = thickness;
            #else
                csm_Transmission = 0.0;
                csm_Thickness = 0.0;
            #endif
        #endif
    #endif

    // csm_AO
    #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHBASICMATERIAL || defined IS_MESHLAMBERTMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHTOONMATERIAL
        csm_AO = 0.0;
    #endif

    // csm_Bump
    #if defined IS_MESHLAMBERTMATERIAL || defined IS_MESHMATCAPMATERIAL || defined IS_MESHNORMALMATERIAL || defined IS_MESHPHONGMATERIAL || defined IS_MESHPHYSICALMATERIAL || defined IS_MESHSTANDARDMATERIAL || defined IS_MESHTOONMATERIAL || defined IS_SHADOWMATERIAL 
        csm_Bump = vec3(0.0);
        #ifdef FLAT_SHADED
            vec3 fdx = dFdx( vViewPosition );
            vec3 fdy = dFdy( vViewPosition );
            csm_FragNormal = normalize( cross( fdx, fdy ) );
        #else
            csm_FragNormal = normalize(vNormal);
            #ifdef DOUBLE_SIDED
                csm_FragNormal *= faceDirection;
            #endif
        #endif
    #endif

    csm_DepthAlpha = 1.0;
#endif
`
), H = (
  /* glsl */
  `
    varying mat4 csm_internal_vModelViewMatrix;
`
), x = (
  /* glsl */
  `
    csm_internal_vModelViewMatrix = modelViewMatrix;
`
), y = (
  /* glsl */
  `
    varying mat4 csm_internal_vModelViewMatrix;
`
), O = (
  /* glsl */
  `
    
`
), e = {
  // PBR (frag)
  diffuse: "csm_DiffuseColor",
  // Color + alpha
  roughness: "csm_Roughness",
  // Roughness
  metalness: "csm_Metalness",
  // Metalness
  emissive: "csm_Emissive",
  // Emissive
  ao: "csm_AO",
  // AO
  bump: "csm_Bump",
  // Bump
  fragNormal: "csm_FragNormal",
  // Fragment Normal
  clearcoat: "csm_Clearcoat",
  // Clearcoat factor
  clearcoatRoughness: "csm_ClearcoatRoughness",
  // Clearcoat roughness
  clearcoatNormal: "csm_ClearcoatNormal",
  // Clearcoat normals
  transmission: "csm_Transmission",
  // Transmission
  thickness: "csm_Thickness",
  // Thickness
  iridescence: "csm_Iridescence",
  // Iridescence
  // Extras
  pointSize: "csm_PointSize",
  // gl_PointSize (Frag)
  fragColor: "csm_FragColor",
  // gl_FragColor (Frag)
  depthAlpha: "csm_DepthAlpha",
  // Depth (MeshDepthMaterial)
  unlitFac: "csm_UnlitFac",
  // Unlit factor (mix between csm_FragColor and csm_DiffuseColor)
  // Vert
  position: "csm_Position",
  // gl_Position
  positionRaw: "csm_PositionRaw",
  // gl_Position (without projection)
  normal: "csm_Normal"
  // Vertex Normal
}, F = {
  [`${e.position}`]: "*",
  [`${e.positionRaw}`]: "*",
  [`${e.normal}`]: "*",
  [`${e.depthAlpha}`]: "*",
  [`${e.pointSize}`]: ["PointsMaterial"],
  [`${e.diffuse}`]: "*",
  [`${e.fragColor}`]: "*",
  [`${e.fragNormal}`]: "*",
  [`${e.unlitFac}`]: "*",
  [`${e.emissive}`]: ["MeshStandardMaterial", "MeshPhysicalMaterial"],
  [`${e.roughness}`]: ["MeshStandardMaterial", "MeshPhysicalMaterial"],
  [`${e.metalness}`]: ["MeshStandardMaterial", "MeshPhysicalMaterial"],
  [`${e.iridescence}`]: [
    "MeshStandardMaterial",
    "MeshPhysicalMaterial"
  ],
  [`${e.ao}`]: [
    "MeshStandardMaterial",
    "MeshPhysicalMaterial",
    "MeshBasicMaterial",
    "MeshLambertMaterial",
    "MeshPhongMaterial",
    "MeshToonMaterial"
  ],
  [`${e.bump}`]: [
    "MeshLambertMaterial",
    "MeshMatcapMaterial",
    "MeshNormalMaterial",
    "MeshPhongMaterial",
    "MeshPhysicalMaterial",
    "MeshStandardMaterial",
    "MeshToonMaterial",
    "ShadowMaterial"
  ],
  [`${e.clearcoat}`]: ["MeshPhysicalMaterial"],
  [`${e.clearcoatRoughness}`]: ["MeshPhysicalMaterial"],
  [`${e.clearcoatNormal}`]: ["MeshPhysicalMaterial"],
  [`${e.transmission}`]: ["MeshPhysicalMaterial"],
  [`${e.thickness}`]: ["MeshPhysicalMaterial"]
}, b = {
  // VERT
  "*": {
    "#include <lights_physical_fragment>": T.ShaderChunk.lights_physical_fragment,
    "#include <transmission_fragment>": T.ShaderChunk.transmission_fragment
  },
  [`${e.normal}`]: {
    "#include <beginnormal_vertex>": `
    vec3 objectNormal = ${e.normal};
    #ifdef USE_TANGENT
	    vec3 objectTangent = vec3( tangent.xyz );
    #endif
    `
  },
  [`${e.position}`]: {
    "#include <begin_vertex>": `
    vec3 transformed = ${e.position};
  `
  },
  [`${e.positionRaw}`]: {
    "#include <begin_vertex>": `
    vec4 csm_internal_positionUnprojected = ${e.positionRaw};
    mat4x4 csm_internal_unprojectMatrix = projectionMatrix * modelViewMatrix;
    #ifdef USE_INSTANCING
      csm_internal_unprojectMatrix = csm_internal_unprojectMatrix * instanceMatrix;
    #endif
    csm_internal_positionUnprojected = inverse(csm_internal_unprojectMatrix) * csm_internal_positionUnprojected;
    vec3 transformed = csm_internal_positionUnprojected.xyz;
  `
  },
  [`${e.pointSize}`]: {
    "gl_PointSize = size;": `
    gl_PointSize = ${e.pointSize};
    `
  },
  // FRAG
  [`${e.diffuse}`]: {
    "#include <color_fragment>": `
    #include <color_fragment>
    diffuseColor = ${e.diffuse};
  `
  },
  [`${e.fragColor}`]: {
    "#include <opaque_fragment>": `
    #include <opaque_fragment>
    gl_FragColor = mix(gl_FragColor, ${e.fragColor}, ${e.unlitFac});
  `
  },
  [`${e.emissive}`]: {
    "vec3 totalEmissiveRadiance = emissive;": `
    vec3 totalEmissiveRadiance = ${e.emissive};
    `
  },
  [`${e.roughness}`]: {
    "#include <roughnessmap_fragment>": `
    #include <roughnessmap_fragment>
    roughnessFactor = ${e.roughness};
    `
  },
  [`${e.metalness}`]: {
    "#include <metalnessmap_fragment>": `
    #include <metalnessmap_fragment>
    metalnessFactor = ${e.metalness};
    `
  },
  [`${e.ao}`]: {
    "#include <aomap_fragment>": `
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= 1. - ${e.ao};
    `
  },
  [`${e.bump}`]: {
    "#include <normal_fragment_maps>": `
    #include <normal_fragment_maps>

    vec3 csm_internal_orthogonal = ${e.bump} - (dot(${e.bump}, normal) * normal);
    vec3 csm_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_internal_orthogonal;
    normal = normalize(normal - csm_internal_projectedbump);
    `
  },
  [`${e.fragNormal}`]: {
    "#include <normal_fragment_maps>": `
      #include <normal_fragment_maps>
      normal = ${e.fragNormal};
    `
  },
  [`${e.depthAlpha}`]: {
    "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );": `
      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * ${e.depthAlpha} );
    `,
    "gl_FragColor = packDepthToRGBA( fragCoordZ );": `
      if(${e.depthAlpha} < 1.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `,
    "gl_FragColor = packDepthToRGBA( dist );": `
      if(${e.depthAlpha} < 1.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `
  },
  [`${e.clearcoat}`]: {
    "material.clearcoat = clearcoat;": `material.clearcoat = ${e.clearcoat};`
  },
  [`${e.clearcoatRoughness}`]: {
    "material.clearcoatRoughness = clearcoatRoughness;": `material.clearcoatRoughness = ${e.clearcoatRoughness};`
  },
  [`${e.clearcoatNormal}`]: {
    "#include <clearcoat_normal_fragment_begin>": `
      vec3 csm_coat_internal_orthogonal = csm_ClearcoatNormal - (dot(csm_ClearcoatNormal, nonPerturbedNormal) * nonPerturbedNormal);
      vec3 csm_coat_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_coat_internal_orthogonal;
      vec3 clearcoatNormal = normalize(nonPerturbedNormal - csm_coat_internal_projectedbump);
    `
  },
  [`${e.transmission}`]: {
    "material.transmission = transmission;": `
      material.transmission = ${e.transmission};
    `
  },
  [`${e.thickness}`]: {
    "material.thickness = thickness;": `
      material.thickness = ${e.thickness};
    `
  },
  [`${e.iridescence}`]: {
    "material.iridescence = iridescence;": `
      material.iridescence = ${e.iridescence};
    `
  }
}, w = {
  clearcoat: [
    e.clearcoat,
    e.clearcoatNormal,
    e.clearcoatRoughness
  ],
  transmission: [e.transmission],
  iridescence: [e.iridescence]
};
function U(M) {
  let n = 0;
  for (let m = 0; m < M.length; m++)
    n = M.charCodeAt(m) + (n << 6) + (n << 16) - n;
  const S = n >>> 0;
  return String(S);
}
function k(M) {
  try {
    new M();
  } catch (n) {
    if (n.message.indexOf("is not a constructor") >= 0)
      return !1;
  }
  return !0;
}
function L(M) {
  return M.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
}
class B extends T.Material {
  constructor({
    baseMaterial: n,
    vertexShader: S,
    fragmentShader: h,
    uniforms: m,
    patchMap: I,
    cacheKey: f,
    ...r
  }) {
    if (!n)
      throw new Error("CustomShaderMaterial: baseMaterial is required.");
    let i;
    if (k(n)) {
      const _ = Object.keys(r).length === 0;
      i = new n(_ ? void 0 : r);
    } else
      i = n, Object.assign(i, r);
    if (["ShaderMaterial", "RawShaderMaterial"].includes(i.type))
      throw new Error(
        `CustomShaderMaterial does not support ${i.type} as a base material.`
      );
    super(), this.uniforms = {}, this.vertexShader = "", this.fragmentShader = "";
    const t = i;
    t.name = `CustomShaderMaterial<${i.name}>`, t.update = this.update.bind(t), t.__csm = { prevOnBeforeCompile: i.onBeforeCompile };
    const o = { ...t.uniforms || {}, ...m || {} };
    return t.uniforms = this.uniforms = o, t.vertexShader = this.vertexShader = S || "", t.fragmentShader = this.fragmentShader = h || "", t.update({
      fragmentShader: t.fragmentShader,
      vertexShader: t.vertexShader,
      uniforms: t.uniforms,
      patchMap: I,
      cacheKey: f
    }), t;
  }
  update({
    fragmentShader: n,
    vertexShader: S,
    uniforms: h,
    cacheKey: m,
    patchMap: I
  }) {
    const f = L(S || ""), r = L(n || ""), i = this;
    h && (i.uniforms = h), S && (i.vertexShader = S), n && (i.fragmentShader = n), Object.entries(w).forEach(([a, o]) => {
      for (const _ in o) {
        const s = o[_];
        (r && r.includes(s) || f && f.includes(s)) && (i[a] || (i[a] = 1));
      }
    });
    const g = i.__csm.prevOnBeforeCompile, t = (a, o, _) => {
      var c;
      let s, d = "";
      if (o) {
        const l = /void\s+main\s*\(\s*\)[^{]*{((?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{[^{}]*})*})*})*})*})/gm;
        s = (c = o.matchAll(l).next().value) == null ? void 0 : c[1], s && (s = s.slice(0, -1));
        const u = o.indexOf("void main() {");
        d = o.slice(0, u);
      }
      if (_ && (o && o.includes(e.fragColor)) && s && (s = `csm_UnlitFac = 1.0;
` + s), a.includes("//~CSM_DEFAULTS")) {
        a = a.replace(
          "void main() {",
          `
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          ${d}
          
          void main() {
          `
        );
        const l = a.lastIndexOf("//~CSM_MAIN_END");
        if (l !== -1) {
          const v = `
            ${s ? `${s}` : ""}
            //~CSM_MAIN_END
          `;
          a = a.slice(0, l) + v + a.slice(l);
        }
      } else {
        const l = /void\s*main\s*\(\s*\)\s*{/gm;
        a = a.replace(
          l,
          `
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          //~CSM_DEFAULTS
          ${_ ? y : H}
          ${D}
  
          ${d}
          
          void main() {
            {
              ${P}
            }
            ${_ ? O : x}

            ${s ? `${s}` : ""}
            //~CSM_MAIN_END
          `
        );
      }
      return a;
    };
    i.onBeforeCompile = (a, o) => {
      g == null || g(a, o);
      const s = { ...b, ...I || {} }, d = i.type, R = d ? `#define IS_${d.toUpperCase()};
` : `#define IS_UNKNOWN;
`;
      a.vertexShader = R + `#define IS_VERTEX
` + a.vertexShader, a.fragmentShader = R + `#define IS_FRAGMENT
` + a.fragmentShader;
      for (const c in s) {
        const l = c === "*" || f && f.includes(c);
        if (c === "*" || r && r.includes(c) || l) {
          const u = F[c];
          if (u && u !== "*" && (Array.isArray(u) ? !u.includes(d) : u !== d)) {
            console.error(
              `CustomShaderMaterial: ${c} is not available in ${d}. Shader cannot compile.`
            );
            return;
          }
          const C = s[c];
          for (const p in C) {
            const A = C[p];
            if (typeof A == "object") {
              const $ = A.type, N = A.value;
              $ === "fs" ? a.fragmentShader = a.fragmentShader.replace(
                p,
                N
              ) : $ === "vs" && (a.vertexShader = a.vertexShader.replace(
                p,
                N
              ));
            } else
              A && (a.vertexShader = a.vertexShader.replace(
                p,
                A
              ), a.fragmentShader = a.fragmentShader.replace(
                p,
                A
              ));
          }
        }
      }
      a.vertexShader = t(
        a.vertexShader,
        f,
        !1
      ), a.fragmentShader = t(
        a.fragmentShader,
        r,
        !0
      ), h && (a.uniforms = { ...a.uniforms, ...i.uniforms }), i.uniforms = a.uniforms;
    };
    const E = i.customProgramCacheKey;
    i.customProgramCacheKey = () => ((m == null ? void 0 : m()) || U((f || "") + (r || ""))) + (E == null ? void 0 : E.call(i)), i.needsUpdate = !0;
  }
}
export {
  B as default
};
//# sourceMappingURL=vanilla.js.map
