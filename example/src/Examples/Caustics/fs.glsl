varying vec3 csm_vWorldPosition;
varying vec3 csm_vPosition;
varying vec3 csm_vNormal;
varying vec2 csm_vUv;

uniform vec3 uPosition;
uniform vec3 uRotaiton;
uniform vec3 uScale;
uniform float uTime;
uniform float uAngle;

#include <shadowmask_pars_fragment>

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
    mat4 m = rotationMatrix(axis, angle);
    return (m * vec4(v, 1.0)).xyz;
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

vec4 getFogColor(vec4 color) {
    vec3 scale = uScale;
    vec3 p = csm_vWorldPosition;
    p.x -= uPosition.x;
    p.y -= uPosition.y;
    p.z -= uPosition.z;
    vec3 pos = rotate(p, uRotaiton, uAngle);

    float box = 1. - clamp(sdBox(p, scale), 0., 1.);
    box = box >= 0.5 ? 1. : 0.;

    gln_tWorleyOpts opts = gln_tWorleyOpts(1., -2., 1., false);

    
    float noiseScale = 1.7;
    float t =  (uTime * 0.1);
    float offset = 0.05;

    vec3 n1 = vec3(
    gln_worley(((pos.xz + t) + vec2(offset, offset)) * noiseScale, opts),
    gln_worley(((pos.xz + t) + vec2(offset, -offset)) * noiseScale, opts),
    gln_worley(((pos.xz + t) + vec2(-offset, -offset)) * noiseScale, opts)
    );
    
    float noiseScale2 = 1.2;
    float t2 =  (uTime * 0.2);
    float offset2 = 0.02;
    vec3 n2 = vec3(
    gln_worley(((pos.xz + t2) + vec2(offset2, offset2)) * noiseScale2, opts),
    gln_worley(((pos.xz + t2) + vec2(offset2, -offset2)) * noiseScale2, opts),
    gln_worley(((pos.xz + t2) + vec2(-offset2, -offset2)) * noiseScale2, opts)
    );

    vec3 n = min(n1, n2);
    n = pow(n, vec3(3.)) * 1.2;

    vec3 projectorDirection = normalize(pos);
    float dotProduct = 1. - dot(csm_vNormal, projectorDirection);
    dotProduct = pow(dotProduct, 3.);
    dotProduct = clamp(dotProduct, 0., 1.);
    
    float shadow = getShadowMask();

    float fac = dotProduct * box * shadow;
    vec3 c = color.rgb + n;
    return mix(color, vec4(c, 1.), fac);
    // return vec4(vec3(n), 1.);

}

void main() {
    vec4 csm_FogColor;
}