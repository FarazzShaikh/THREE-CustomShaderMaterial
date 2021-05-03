import noise from "./utils/noise.js";

export default `

uniform float dt;
uniform float fac;

${noise}

// the function which defines the displacement
float displace(vec3 point) {
 return perlin(vec2(point.xy + dt) * 0.7) * fac;
}

vec3 orthogonal(vec3 v) {
    return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
        : vec3(0.0, -v.z, v.y));
}

`;
