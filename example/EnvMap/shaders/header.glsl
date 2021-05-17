
// the function which defines the displacement
float displace(vec3 point) {
  float n;
  n = gln_normalize(gln_perlin((point.xy + uTime) * 0.6));
  return n;
}
vec3 orthogonal(vec3 v) {
  return normalize(abs(v.x) > abs(v.z) ? vec3(-v.y, v.x, 0.0)
                                       : vec3(0.0, -v.z, v.y));
}
