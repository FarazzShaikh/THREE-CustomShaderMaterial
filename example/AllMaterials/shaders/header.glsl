uniform float uSeed;
uniform float uTime;
uniform int uType;

// the function which defines the displacement
float displace(vec3 point) {
  float n;
  n = gln_normalize(gln_perlin((point.xy + uTime) * 0.6));
  return n;
}
