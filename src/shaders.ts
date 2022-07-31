export const defaultDefinitions = /* glsl */ `

#ifdef IS_VERTEX
    vec3 csm_Position = position;
    vec4 csm_PositionRaw = projectionMatrix * modelViewMatrix * vec4(position, 1.);
#else
    #ifdef IS_SHADERMATERIAL
        vec4 csm_DiffuseColor = vec4(1., 0., 1., 1.);
        vec4 csm_FragColor = vec4(1., 0., 1., 1.);
    #else
        #if defined IS_MESHSTANDARDMATERIAL || defined IS_MESHPHYSICALMATERIAL
            vec3 csm_Emissive = emissive;
            float csm_Roughness = roughness;
            float csm_Metalness = metalness;
        #endif
        
        #ifdef USE_MAP
            vec4 _csm_sampledDiffuseColor = texture2D(map, vUv);

            #ifdef DECODE_VIDEO_TEXTURE
            // inline sRGB decode (TODO: Remove this code when https://crbug.com/1256340 is solved)
            _csm_sampledDiffuseColor = vec4(mix(pow(_csm_sampledDiffuseColor.rgb * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), _csm_sampledDiffuseColor.rgb * 0.0773993808, vec3(lessThanEqual(_csm_sampledDiffuseColor.rgb, vec3(0.04045)))), _csm_sampledDiffuseColor.w);
            #endif

            vec4 csm_DiffuseColor = vec4(diffuse, opacity) * _csm_sampledDiffuseColor;
            vec4 csm_FragColor = vec4(diffuse, opacity) * _csm_sampledDiffuseColor;
        #else
            vec4 csm_DiffuseColor = vec4(diffuse, opacity);
            vec4 csm_FragColor = vec4(diffuse, opacity);
        #endif
    #endif
#endif
`
