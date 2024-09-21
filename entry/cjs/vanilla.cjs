"use strict";const D=require("three");function P(o){const s=Object.create(null,{[Symbol.toStringTag]:{value:"Module"}});if(o){for(const c in o)if(c!=="default"){const f=Object.getOwnPropertyDescriptor(o,c);Object.defineProperty(s,c,f.get?f:{enumerable:!0,get:()=>o[c]})}}return s.default=o,Object.freeze(s)}const v=P(D),H=`
    
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
`,x=`

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
`,y=`
    varying mat4 csm_internal_vModelViewMatrix;
`,O=`
    csm_internal_vModelViewMatrix = modelViewMatrix;
`,b=`
    varying mat4 csm_internal_vModelViewMatrix;
`,F=`
    
`,e={diffuse:"csm_DiffuseColor",roughness:"csm_Roughness",metalness:"csm_Metalness",emissive:"csm_Emissive",ao:"csm_AO",bump:"csm_Bump",fragNormal:"csm_FragNormal",clearcoat:"csm_Clearcoat",clearcoatRoughness:"csm_ClearcoatRoughness",clearcoatNormal:"csm_ClearcoatNormal",transmission:"csm_Transmission",thickness:"csm_Thickness",iridescence:"csm_Iridescence",pointSize:"csm_PointSize",fragColor:"csm_FragColor",depthAlpha:"csm_DepthAlpha",unlitFac:"csm_UnlitFac",position:"csm_Position",positionRaw:"csm_PositionRaw",normal:"csm_Normal"},w={[`${e.position}`]:"*",[`${e.positionRaw}`]:"*",[`${e.normal}`]:"*",[`${e.depthAlpha}`]:"*",[`${e.pointSize}`]:["PointsMaterial"],[`${e.diffuse}`]:"*",[`${e.fragColor}`]:"*",[`${e.fragNormal}`]:"*",[`${e.unlitFac}`]:"*",[`${e.emissive}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.roughness}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.metalness}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.iridescence}`]:["MeshStandardMaterial","MeshPhysicalMaterial"],[`${e.ao}`]:["MeshStandardMaterial","MeshPhysicalMaterial","MeshBasicMaterial","MeshLambertMaterial","MeshPhongMaterial","MeshToonMaterial"],[`${e.bump}`]:["MeshLambertMaterial","MeshMatcapMaterial","MeshNormalMaterial","MeshPhongMaterial","MeshPhysicalMaterial","MeshStandardMaterial","MeshToonMaterial","ShadowMaterial"],[`${e.clearcoat}`]:["MeshPhysicalMaterial"],[`${e.clearcoatRoughness}`]:["MeshPhysicalMaterial"],[`${e.clearcoatNormal}`]:["MeshPhysicalMaterial"],[`${e.transmission}`]:["MeshPhysicalMaterial"],[`${e.thickness}`]:["MeshPhysicalMaterial"]},k={"*":{"#include <lights_physical_fragment>":v.ShaderChunk.lights_physical_fragment,"#include <transmission_fragment>":v.ShaderChunk.transmission_fragment},[`${e.normal}`]:{"#include <beginnormal_vertex>":`
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
    gl_FragColor = mix(gl_FragColor, ${e.fragColor}, ${e.unlitFac});
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
    `},[`${e.fragNormal}`]:{"#include <normal_fragment_maps>":`
      #include <normal_fragment_maps>
      normal = ${e.fragNormal};
    `},[`${e.depthAlpha}`]:{"gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );":`
      gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity * ${e.depthAlpha} );
    `,"gl_FragColor = packDepthToRGBA( fragCoordZ );":`
      if(${e.depthAlpha} < 1.0) discard;
      gl_FragColor = packDepthToRGBA( dist );
    `,"gl_FragColor = packDepthToRGBA( dist );":`
      if(${e.depthAlpha} < 1.0) discard;
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
    `}},U={clearcoat:[e.clearcoat,e.clearcoatNormal,e.clearcoatRoughness],transmission:[e.transmission],iridescence:[e.iridescence]};function z(o){let s=0;for(let _=0;_<o.length;_++)s=o.charCodeAt(_)+(s<<6)+(s<<16)-s;const c=s>>>0;return String(c)}function B(o){try{new o}catch(s){if(s.message.indexOf("is not a constructor")>=0)return!1}return!0}function L(o){return o.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g,"")}class j extends v.Material{constructor({baseMaterial:s,vertexShader:c,fragmentShader:f,uniforms:_,patchMap:I,cacheKey:u,...l}){if(!s)throw new Error("CustomShaderMaterial: baseMaterial is required.");let i;if(B(s)){const S=Object.keys(l).length===0;i=new s(S?void 0:l)}else i=s,Object.assign(i,l);if(["ShaderMaterial","RawShaderMaterial"].includes(i.type))throw new Error(`CustomShaderMaterial does not support ${i.type} as a base material.`);super(),this.uniforms={},this.vertexShader="",this.fragmentShader="";const t=i;t.name=`CustomShaderMaterial<${i.name}>`,t.update=this.update.bind(t),t.__csm={prevOnBeforeCompile:i.onBeforeCompile};const r={...t.uniforms||{},..._||{}};return t.uniforms=this.uniforms=r,t.vertexShader=this.vertexShader=c||"",t.fragmentShader=this.fragmentShader=f||"",t.update({fragmentShader:t.fragmentShader,vertexShader:t.vertexShader,uniforms:t.uniforms,patchMap:I,cacheKey:u}),t}update({fragmentShader:s,vertexShader:c,uniforms:f,cacheKey:_,patchMap:I}){const u=L(c||""),l=L(s||""),i=this;f&&(i.uniforms=f),c&&(i.vertexShader=c),s&&(i.fragmentShader=s),Object.entries(U).forEach(([a,r])=>{for(const S in r){const n=r[S];(l&&l.includes(n)||u&&u.includes(n))&&(i[a]||(i[a]=1))}});const g=i.__csm.prevOnBeforeCompile,t=(a,r,S)=>{var m;let n,M="";if(r){const d=/void\s+main\s*\(\s*\)[^{]*{((?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{(?:[^{}]+|{[^{}]*})*})*})*})*})/gm;n=(m=r.matchAll(d).next().value)==null?void 0:m[1],n&&(n=n.slice(0,-1));const h=r.indexOf("void main() {");M=r.slice(0,h)}if(S&&(r&&r.includes(e.fragColor))&&n&&(n=`csm_UnlitFac = 1.0;
`+n),a.includes("//~CSM_DEFAULTS")){a=a.replace("void main() {",`
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          ${M}
          
          void main() {
          `);const d=a.lastIndexOf("//~CSM_MAIN_END");if(d!==-1){const T=`
            ${n?`${n}`:""}
            //~CSM_MAIN_END
          `;a=a.slice(0,d)+T+a.slice(d)}}else{const d=/void\s*main\s*\(\s*\)\s*{/gm;a=a.replace(d,`
          // THREE-CustomShaderMaterial by Faraz Shaikh: https://github.com/FarazzShaikh/THREE-CustomShaderMaterial
  
          //~CSM_DEFAULTS
          ${S?b:y}
          ${H}
  
          ${M}
          
          void main() {
            {
              ${x}
            }
            ${S?F:O}

            ${n?`${n}`:""}
            //~CSM_MAIN_END
          `)}return a};i.onBeforeCompile=(a,r)=>{g==null||g(a,r);const n={...k,...I||{}},M=i.type,R=M?`#define IS_${M.toUpperCase()};
`:`#define IS_UNKNOWN;
`;a.vertexShader=R+`#define IS_VERTEX
`+a.vertexShader,a.fragmentShader=R+`#define IS_FRAGMENT
`+a.fragmentShader;for(const m in n){const d=m==="*"||u&&u.includes(m);if(m==="*"||l&&l.includes(m)||d){const h=w[m];if(h&&h!=="*"&&(Array.isArray(h)?!h.includes(M):h!==M)){console.error(`CustomShaderMaterial: ${m} is not available in ${M}. Shader cannot compile.`);return}const C=n[m];for(const p in C){const A=C[p];if(typeof A=="object"){const $=A.type,N=A.value;$==="fs"?a.fragmentShader=a.fragmentShader.replace(p,N):$==="vs"&&(a.vertexShader=a.vertexShader.replace(p,N))}else A&&(a.vertexShader=a.vertexShader.replace(p,A),a.fragmentShader=a.fragmentShader.replace(p,A))}}}a.vertexShader=t(a.vertexShader,u,!1),a.fragmentShader=t(a.fragmentShader,l,!0),f&&(a.uniforms={...a.uniforms,...i.uniforms}),i.uniforms=a.uniforms};const E=i.customProgramCacheKey;i.customProgramCacheKey=()=>((_==null?void 0:_())||z((u||"")+(l||"")))+(E==null?void 0:E.call(i)),i.needsUpdate=!0}}module.exports=j;
//# sourceMappingURL=vanilla.cjs.map
