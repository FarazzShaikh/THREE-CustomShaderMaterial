import * as v from "three";
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
    float csm_FragColorInfluence;

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
    #endif

    float csm_DepthAlpha;
#endif
`
), x = (
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
    csm_FragColorInfluence = 0.0;

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
    #endif

    csm_DepthAlpha = 1.0;
#endif
`
), O = (
  /* glsl */
  `
    varying mat4 csm_internal_vModelViewMatrix;
`
), y = (
  /* glsl */
  `
    csm_internal_vModelViewMatrix = modelViewMatrix;
`
), b = (
  /* glsl */
  `
    varying mat4 csm_internal_vModelViewMatrix;
`
), w = (
  /* glsl */
  `
    
`
), e = {
  // PBR
  diffuse: "csm_DiffuseColor",
  // Color + alpha
  normal: "csm_Normal",
  // Normal
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
  fragColor: "csm_FragColor",
  depthAlpha: "csm_DepthAlpha",
  // Depth
  fragColorInfluence: "csm_FragColorInfluence",
  // Unlit factor
  // Vert
  position: "csm_Position",
  positionRaw: "csm_PositionRaw"
}, k = {
  [`${e.position}`]: "*",
  [`${e.positionRaw}`]: "*",
  [`${e.normal}`]: "*",
  [`${e.depthAlpha}`]: "*",
  [`${e.pointSize}`]: ["PointsMaterial"],
  [`${e.diffuse}`]: "*",
  [`${e.fragColor}`]: "*",
  [`${e.fragColorInfluence}`]: ["*"],
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
}, F = {
  // VERT
  "*": {
    "#include <lights_physical_fragment>": v.ShaderChunk.lights_physical_fragment,
    "#include <transmission_fragment>": v.ShaderChunk.transmission_fragment
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
    gl_FragColor = mix(gl_FragColor, ${e.fragColor}, ${e.fragColorInfluence});
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
  [`${e.depthAlpha}`]: {
    "gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );": `
      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * ${e.depthAlpha} );
    `,
    "gl_FragColor = packDepthToRGBA( fragCoordZ );": `
      if(${e.depthAlpha} > 0.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `,
    "gl_FragColor = packDepthToRGBA( dist );": `
      if(${e.depthAlpha} > 0.0) discard;
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
}, B = {
  clearcoat: [
    e.clearcoat,
    e.clearcoatNormal,
    e.clearcoatRoughness
  ],
  transmission: [e.transmission],
  iridescence: [e.iridescence]
};
function j(n) {
  let i = 0;
  for (let d = 0; d < n.length; d++)
    i = n.charCodeAt(d) + (i << 6) + (i << 16) - i;
  const c = i >>> 0;
  return String(c);
}
function z(n) {
  try {
    new n();
  } catch (i) {
    if (i.message.indexOf("is not a constructor") >= 0)
      return !1;
  }
  return !0;
}
function H(n, i) {
  for (const c in i)
    i[c] instanceof Object && Object.assign(i[c], H(n[c], i[c]));
  return Object.assign(n || {}, i), n;
}
function P(n) {
  return n.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, "");
}
function U(n) {
  return n.replace(/\n/g, "");
}
function V(n) {
  return n.replace(/\s/g, "");
}
function G(n) {
  const i = n.name;
  return V(U(n.toString())) === `${i}(){}`;
}
class Y extends v.Material {
  constructor({
    baseMaterial: i,
    vertexShader: c,
    fragmentShader: M,
    uniforms: d,
    patchMap: R,
    cacheKey: _,
    ...m
  }) {
    if (!i)
      throw new Error("CustomShaderMaterial: baseMaterial is required.");
    let s;
    if (z(i)) {
      const l = Object.keys(m).length === 0;
      s = new i(l ? void 0 : m);
    } else
      s = i, Object.assign(s, m);
    if (["ShaderMaterial", "RawShaderMaterial"].includes(s.type))
      throw new Error(
        `CustomShaderMaterial does not support ${s.type} as a base material.`
      );
    super(), this.uniforms = {}, this.vertexShader = "", this.fragmentShader = "";
    const t = s;
    t.name = `CustomShaderMaterial<${s.name}>`, t.update = this.update.bind(t), t.__csm = { prevOnBeforeCompile: s.onBeforeCompile };
    const a = { ...t.uniforms || {}, ...d || {} };
    return t.uniforms = this.uniforms = a, t.vertexShader = this.vertexShader = c || "", t.fragmentShader = this.fragmentShader = M || "", t.update({
      fragmentShader: t.fragmentShader,
      vertexShader: t.vertexShader,
      uniforms: t.uniforms,
      patchMap: R,
      cacheKey: _
    }), t;
  }
  update({
    fragmentShader: i,
    vertexShader: c,
    uniforms: M,
    cacheKey: d,
    patchMap: R
  }) {
    const _ = P(c || ""), m = P(i || ""), s = this;
    M && (s.uniforms = M), c && (s.vertexShader = c), i && (s.fragmentShader = i), Object.entries(B).forEach(([a, l]) => {
      for (const h in l) {
        const r = l[h];
        (m && m.includes(r) || _ && _.includes(r)) && (s[a] || (s[a] = 1));
      }
    });
    const u = s.__csm.prevOnBeforeCompile, t = !G(u), C = (a, l, h) => {
      var A;
      let r, f = "";
      if (l) {
        const o = /void\s+main\s*\(\s*\)[^{]*{((?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{[^{}]*})*})*})*})*})/gm;
        r = (A = l.matchAll(o).next().value) == null ? void 0 : A[1], r && (r = r.slice(0, -1));
        const T = l.indexOf("void main() {");
        f = l.slice(0, T);
      }
      if (t) {
        a = a.replace(
          "void main() {",
          `
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          ${f}
          
          void main() {
          `
        );
        const o = a.lastIndexOf("//~CSM_MAIN_END");
        if (o !== -1) {
          const I = `
            ${r ? `${r}` : ""}
            //~CSM_MAIN_END
          `;
          a = a.slice(0, o) + I + a.slice(o);
        }
      } else {
        const o = /void\s*main\s*\(\s*\)\s*{/gm;
        a = a.replace(
          o,
          `
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          ${h ? b : O}
          ${D}
  
          ${f}
          
          void main() {
            ${x}
            ${h ? w : y}

            ${r ? `${r}` : ""}
            //~CSM_MAIN_END
          `
        );
      }
      return a;
    };
    s.onBeforeCompile = (a, l) => {
      u == null || u(a, l);
      const r = H(F, R || {}), f = s.type, A = f ? `#define IS_${f.toUpperCase()};
` : `#define IS_UNKNOWN;
`;
      a.vertexShader = A + `#define IS_VERTEX
` + a.vertexShader, a.fragmentShader = A + `#define IS_FRAGMENT
` + a.fragmentShader;
      for (const o in r) {
        const I = o === "*" || _ && _.includes(o);
        if (o === "*" || m && m.includes(o) || I) {
          const p = k[o];
          if (p && p !== "*" && (Array.isArray(p) ? !p.includes(f) : p !== f)) {
            console.error(
              `CustomShaderMaterial: ${o} is not available in ${f}. Shader cannot compile.`
            );
            return;
          }
          const $ = r[o];
          for (const g in $) {
            const S = $[g];
            if (typeof S == "object") {
              const N = S.type, L = S.value;
              N === "fs" ? a.fragmentShader = a.fragmentShader.replace(
                g,
                L
              ) : N === "vs" && (a.vertexShader = a.vertexShader.replace(
                g,
                L
              ));
            } else
              S && (a.vertexShader = a.vertexShader.replace(
                g,
                S
              ), a.fragmentShader = a.fragmentShader.replace(
                g,
                S
              ));
          }
        }
      }
      a.vertexShader = C(
        a.vertexShader,
        _,
        !1
      ), a.fragmentShader = C(
        a.fragmentShader,
        m,
        !0
      ), M && (a.uniforms = { ...a.uniforms, ...s.uniforms }), s.uniforms = a.uniforms;
    };
    const E = s.customProgramCacheKey;
    s.customProgramCacheKey = () => ((d == null ? void 0 : d()) || j((_ || "") + (m || ""))) + (E == null ? void 0 : E.call(s)), s.needsUpdate = !0;
  }
}
export {
  Y as default
};
//# sourceMappingURL=vanilla.js.map
