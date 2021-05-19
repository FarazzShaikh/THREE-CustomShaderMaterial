
// the function which defines the displacement
float displace(vec3 point) { return texture2D(uHeightMap, uv).r * 0.2; }