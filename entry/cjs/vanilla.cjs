"use strict";const D=require("three");function x(s){const i=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(s){for(const t in s)if(t!=="default"){const d=Object.getOwnPropertyDescriptor(s,t);Object.defineProperty(i,t,d.get?d:{enumerable:!0,get:()=>s[t]})}}return i.default=s,Object.freeze(i)}const T=x(D),O=`
    
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
`,b=`

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
`,y=`
    varying mat4 csm_internal_vModelViewMatrix;
`,w=`
    csm_internal_vModelViewMatrix = modelViewMatrix;
`,k=`
    varying mat4 csm_internal_vModelViewMatrix;
`,j=`
    
`,e={diffuse:"csm_DiffuseColor",normal:"csm_Normal",roughness:"csm_Roughness",metalness:"csm_Metalness",emissive:"csm_Emissive",ao:"csm_AO",bump:"csm_Bump",clearcoat:"csm_Clearcoat",clearcoatRoughness:"csm_ClearcoatRoughness",clearcoatNormal:"csm_ClearcoatNormal",transmission:"csm_Transmission",thickness:"csm_Thickness",iridescence:"csm_Iridescence",pointSize:"csm_PointSize",fragColor:"csm_FragColor",depthAlpha:"csm_DepthAlpha",fragColorInfluence:"csm_FragColorInfluence",position:"csm_Position",positionRaw:"csm_PositionRaw"},F={[`${e.position}`]:"*",[`${e.positionRaw}`]:"*",[`${e.normal}`]:"*",[`${e.depthAlpha}`]:"*",[`${e.pointSize}`]:["PointsMaterial"],[`${e.diffuse}`]:"*",[`${e.fragColor}`]:"*",[`${e.fragColorInfluence}`]:["*"],[`${e.emissive}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.roughness}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.metalness}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.iridescence}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.ao}`]:["MeshStandardMaterial","MeshPhysicalMaterial","MeshBasicMaterial","MeshLambertMaterial","MeshPhongMaterial","MeshToonMaterial"],[`${e.bump}`]:["MeshLambertMaterial","MeshMatcapMaterial","MeshNormalMaterial","MeshPhongMaterial","MeshPhysicalMaterial","MeshStandardMaterial","MeshToonMaterial","ShadowMaterial"],[`${e.clearcoat}`]:["MeshPhysicalMaterial"],[`${e.clearcoatRoughness}`]:["MeshPhysicalMaterial"],[`${e.clearcoatNormal}`]:["MeshPhysicalMaterial"],[`${e.transmission}`]:["MeshPhysicalMaterial"],[`${e.thickness}`]:["MeshPhysicalMaterial"]},B={"*":{"#include <lights_physical_fragment>":T.ShaderChunk.lights_physical_fragment,"#include <transmission_fragment>":T.ShaderChunk.transmission_fragment},[`${e.normal}`]:{"#include <beginnormal_vertex>":`
    vec3 objectNormal = ${e.normal};
    #ifdef USE_TANGENT
	    vec3 objectTangent = vec3( tangent.xyz );
    #endif
    `},[`${e.position}`]:{"#include <begin_vertex>":`
    vec3 transformed = ${e.position};
  `},[`${e.positionRaw}`]:{"#include <begin_vertex>":`
    vec4 csm_internal_positionUnprojected = ${e.positionRaw};
    mat4x4 csm_internal_unprojectMatrix = projectionMatrix * modelViewMatrix;
    #ifdef USE_INSTANCING
      csm_internal_unprojectMatrix = csm_internal_unprojectMatrix * instanceMatrix;
    #endif
    csm_internal_positionUnprojected = inverse(csm_internal_unprojectMatrix) * csm_internal_positionUnprojected;
    vec3 transformed = csm_internal_positionUnprojected.xyz;
  `},[`${e.pointSize}`]:{"gl_PointSize = size;":`
    gl_PointSize = ${e.pointSize};
    `},[`${e.diffuse}`]:{"#include <color_fragment>":`
    #include <color_fragment>
    diffuseColor = ${e.diffuse};
  `},[`${e.fragColor}`]:{"#include <opaque_fragment>":`
    #include <opaque_fragment>
    gl_FragColor = mix(gl_FragColor, ${e.fragColor}, ${e.fragColorInfluence});
  `},[`${e.emissive}`]:{"vec3 totalEmissiveRadiance = emissive;":`
    vec3 totalEmissiveRadiance = ${e.emissive};
    `},[`${e.roughness}`]:{"#include <roughnessmap_fragment>":`
    #include <roughnessmap_fragment>
    roughnessFactor = ${e.roughness};
    `},[`${e.metalness}`]:{"#include <metalnessmap_fragment>":`
    #include <metalnessmap_fragment>
    metalnessFactor = ${e.metalness};
    `},[`${e.ao}`]:{"#include <aomap_fragment>":`
    #include <aomap_fragment>
    reflectedLight.indirectDiffuse *= 1. - ${e.ao};
    `},[`${e.bump}`]:{"#include <normal_fragment_maps>":`
    #include <normal_fragment_maps>

    vec3 csm_internal_orthogonal = ${e.bump} - (dot(${e.bump}, normal) * normal);
    vec3 csm_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_internal_orthogonal;
    normal = normalize(normal - csm_internal_projectedbump);
    `},[`${e.depthAlpha}`]:{"gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );":`
      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * ${e.depthAlpha} );
    `,"gl_FragColor = packDepthToRGBA( fragCoordZ );":`
      if(${e.depthAlpha} > 0.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `,"gl_FragColor = packDepthToRGBA( dist );":`
      if(${e.depthAlpha} > 0.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `},[`${e.clearcoat}`]:{"material.clearcoat = clearcoat;":`material.clearcoat = ${e.clearcoat};`},[`${e.clearcoatRoughness}`]:{"material.clearcoatRoughness = clearcoatRoughness;":`material.clearcoatRoughness = ${e.clearcoatRoughness};`},[`${e.clearcoatNormal}`]:{"#include <clearcoat_normal_fragment_begin>":`
      vec3 csm_coat_internal_orthogonal = csm_ClearcoatNormal - (dot(csm_ClearcoatNormal, nonPerturbedNormal) * nonPerturbedNormal);
      vec3 csm_coat_internal_projectedbump = mat3(csm_internal_vModelViewMatrix) * csm_coat_internal_orthogonal;
      vec3 clearcoatNormal = normalize(nonPerturbedNormal - csm_coat_internal_projectedbump);
    `},[`${e.transmission}`]:{"material.transmission = transmission;":`
      material.transmission = ${e.transmission};
    `},[`${e.thickness}`]:{"material.thickness = thickness;":`
      material.thickness = ${e.thickness};
    `},[`${e.iridescence}`]:{"material.iridescence = iridescence;":`
      material.iridescence = ${e.iridescence};
    `}},z={clearcoat:[e.clearcoat,e.clearcoatNormal,e.clearcoatRoughness],transmission:[e.transmission],iridescence:[e.iridescence]};function U(s){let i=0;for(let f=0;f<s.length;f++)i=s.charCodeAt(f)+(i<<6)+(i<<16)-i;const t=i>>>0;return String(t)}function V(s){try{new s}catch(i){if(i.message.indexOf("is not a constructor")>=0)return!1}return!0}function H(s,i){for(const t in i)i[t]instanceof Object&&Object.assign(i[t],H(s[t],i[t]));return Object.assign(s||{},i),s}function P(s){return s.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,"")}function G(s){return s.replace(/\n/g,"")}function Y(s){return s.replace(/\s/g,"")}function W(s){const i=s.name;return Y(G(s.toString()))===`${i}(){}`}class q extends T.Material{constructor({baseMaterial:i,vertexShader:t,fragmentShader:d,uniforms:f,patchMap:R,cacheKey:M,...m}){if(!i)throw new Error("CustomShaderMaterial: baseMaterial is required.");let n;if(V(i)){const l=Object.keys(m).length===0;n=new i(l?void 0:m)}else n=i,Object.assign(n,m);if(["ShaderMaterial","RawShaderMaterial"].includes(n.type))throw new Error(`CustomShaderMaterial does not support ${n.type} as a base material.`);super(),this.uniforms={},this.vertexShader="",this.fragmentShader="";const o=n;o.name=`CustomShaderMaterial<${n.name}>`,o.update=this.update.bind(o),o.__csm={prevOnBeforeCompile:n.onBeforeCompile};const a={...o.uniforms||{},...f||{}};return o.uniforms=this.uniforms=a,o.vertexShader=this.vertexShader=t||"",o.fragmentShader=this.fragmentShader=d||"",o.update({fragmentShader:o.fragmentShader,vertexShader:o.vertexShader,uniforms:o.uniforms,patchMap:R,cacheKey:M}),o}update({fragmentShader:i,vertexShader:t,uniforms:d,cacheKey:f,patchMap:R}){const M=P(t||""),m=P(i||""),n=this;d&&(n.uniforms=d),t&&(n.vertexShader=t),i&&(n.fragmentShader=i),Object.entries(z).forEach(([a,l])=>{for(const h in l){const c=l[h];(m&&m.includes(c)||M&&M.includes(c))&&(n[a]||(n[a]=1))}});const S=n.__csm.prevOnBeforeCompile,o=!W(S),C=(a,l,h)=>{var p;let c,_="";if(l){const r=/void\s+main\s*\(\s*\)[^{]*{((?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{[^{}]*})*})*})*})*})/gm;c=(p=l.matchAll(r).next().value)==null?void 0:p[1],c&&(c=c.slice(0,-1));const v=l.indexOf("void main() {");_=l.slice(0,v)}if(o){a=a.replace("void main() {",`
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          ${_}
          
          void main() {
          `);const r=a.lastIndexOf("//~CSM_MAIN_END");if(r!==-1){const I=`
            ${c?`${c}`:""}
            //~CSM_MAIN_END
          `;a=a.slice(0,r)+I+a.slice(r)}}else{const r=/void\s*main\s*\(\s*\)\s*{/gm;a=a.replace(r,`
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          ${h?k:y}
          ${O}
  
          ${_}
          
          void main() {
            ${b}
            ${h?j:w}

            ${c?`${c}`:""}
            //~CSM_MAIN_END
          `)}return a};n.onBeforeCompile=(a,l)=>{S==null||S(a,l);const c=H(B,R||{}),_=n.type,p=_?`#define IS_${_.toUpperCase()};
`:`#define IS_UNKNOWN;
`;a.vertexShader=p+`#define IS_VERTEX
`+a.vertexShader,a.fragmentShader=p+`#define IS_FRAGMENT
`+a.fragmentShader;for(const r in c){const I=r==="*"||M&&M.includes(r);if(r==="*"||m&&m.includes(r)||I){const A=F[r];if(A&&A!=="*"&&(Array.isArray(A)?!A.includes(_):A!==_)){console.error(`CustomShaderMaterial: ${r} is not available in ${_}. Shader cannot compile.`);return}const $=c[r];for(const g in $){const u=$[g];if(typeof u=="object"){const N=u.type,L=u.value;N==="fs"?a.fragmentShader=a.fragmentShader.replace(g,L):N==="vs"&&(a.vertexShader=a.vertexShader.replace(g,L))}else u&&(a.vertexShader=a.vertexShader.replace(g,u),a.fragmentShader=a.fragmentShader.replace(g,u))}}}a.vertexShader=C(a.vertexShader,M,!1),a.fragmentShader=C(a.fragmentShader,m,!0),d&&(a.uniforms={...a.uniforms,...n.uniforms}),n.uniforms=a.uniforms};const E=n.customProgramCacheKey;n.customProgramCacheKey=()=>((f==null?void 0:f())||U((M||"")+(m||"")))+(E==null?void 0:E.call(n)),n.needsUpdate=!0}}module.exports=q;
//# sourceMappingURL=vanilla.cjs.map
