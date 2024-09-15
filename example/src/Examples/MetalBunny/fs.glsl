uniform vec3 colorMap[5];
uniform float uTime;

varying vec3 csm_vPosition;

gln_FBMOpts opts = gln_FBMOpts(1., 0.3, 2.0, 5);

float domainWarp(vec3 uv) {
    float scale = 2.;
    float falloff = 1.;
    vec3 outUv = vec3(0.);

    for (float i = 0.; i < 10.; i += 1.) {
        vec3 offset = vec3(
        (i + uTime) * 0.1 ,
        (i + uTime) * 0.2 ,
        (i + uTime) * 0.3 
        );

        vec3 dUv = vec3(
        gln_simplex_fbm((scale * uv) + outUv, opts),
        gln_simplex_fbm((scale * uv) + outUv, opts),
        gln_simplex_fbm((scale * uv) + outUv, opts)
        );

        outUv = falloff * dUv + offset;
    }

    return gln_simplex_fbm(uv + scale * outUv, opts);
}

vec3 saturateColor(vec3 v, float s) {
    return vec3(
        clamp(v.x, 0., s),
        clamp(v.y, 0., s),
        clamp(v.z, 0., s)
    );
}

// Get color from colorMap based on t. Smoothly interpolate between colors.
vec3 colorMapLookup(float t) {
    float tScaled = t * 4.;
    float tFloor = floor(tScaled);
    float tFrac = tScaled - tFloor;

    int index = int(tFloor);
    int nextIndex = int(tFloor) + 1;

    if(index < 0) index = 4;
    if(index > 4) index = 0;
    if(nextIndex < 0) nextIndex = 4;
    if(nextIndex > 4) nextIndex = 0;

    vec3 colorA = colorMap[index];
    vec3 colorB = colorMap[nextIndex];

    return mix(colorA, colorB, tFrac);
}

void main() {
    float warpedNoise = domainWarp(csm_vPosition);
    vec3 col = colorMapLookup(warpedNoise);
    csm_DiffuseColor = vec4(col, 1.);

    float noise = gln_simplex(csm_vPosition);
    csm_Metalness = smoothstep(0.49, 0.5, noise);
}