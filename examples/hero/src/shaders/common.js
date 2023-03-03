export default /* glsl */ `

// private
#define GLN_PI 3.1415926538

float _gln_mod289(float x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 _gln_mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 _gln_mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 _gln_mod289(vec4 x) { 
    return x - floor(x * (1.0 / 289.0)) * 289.0; 
}

vec3 _gln_mod7(vec3 x) {
  return x - floor(x * (1.0 / 7.0)) * 7.0;
}

float _gln_permute(float x) {
  return _gln_mod289((34.0 * x + 10.0) * x);
}

vec2 _gln_permute(vec2 x) {
  return _gln_mod289((34.0 * x + 10.0) * x);
}

vec3 _gln_permute(vec3 x) {
  return _gln_mod289((34.0 * x + 10.0) * x);
}

vec4 _gln_permute(vec4 x) {
  return _gln_mod289(((x * 34.0) + 10.0) * x);
}

vec4 _gln_taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 _gln_fade(vec2 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

vec3 _gln_fade(vec3 t) {
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

// public

float gln_map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float gln_normalize(float v) { 
    return gln_map(v, -1., 1., 0., 1.); 
}

vec2 gln_normalize(vec2 v) { 
    return vec2(
      gln_normalize(v.x),
      gln_normalize(v.y)
    );
}

vec3 gln_normalize(vec3 v) { 
    return vec3(
      gln_normalize(v.x),
      gln_normalize(v.y),
      gln_normalize(v.z)
    );
}

struct gln_FBMOpts {
  float seed;
  float persistance;
  float lacunarity;
  int octaves;
};
`
