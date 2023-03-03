export default function FBM(name: string, type: string = 'float', args?: string, defArgs?: string) {
  return /* glsl */ `
      ${type} gln_${name}_fbm(vec3 p, gln_FBMOpts opts ${args ? `, ${args} funcOpts` : ''}) {
          p += (_gln_permute(opts.seed * 0.01) + _gln_permute(opts.seed * 0.1)) * 10.;
          float persistance = opts.persistance;
          float lacunarity = opts.lacunarity;
          int octaves = opts.octaves;
  
          ${type} result = ${type}(0.0);
          float amplitude = 1.0;
          float frequency = 1.0;
          float maximum = amplitude;
  
          #ifdef GLN_MAX_FBM_ITERATIONS
              int max = GLN_MAX_FBM_ITERATIONS;
          #else
              int max = 10;
          #endif
  
          for (int i = 0; i < max; i++) {
              if (i >= octaves)
              break;
  
              ${type} noiseVal = gln_${name}(p * frequency ${args ? ', funcOpts' : ''});
              result += noiseVal * amplitude;
  
              frequency *= lacunarity;
              amplitude *= persistance;
              maximum += amplitude;
          }
  
          return gln_map(result / maximum, -1., 1., 0., 1.);
      }
  
      ${
        args
          ? /* glsl */ `
              ${type} gln_${name}_fbm(vec3 p, gln_FBMOpts opts) {
          ${args} funcOpts = ${args}${defArgs};
          return gln_${name}_fbm(p, opts, funcOpts);
          }
              `
          : ``
      }
  
      ${type} gln_${name}_fbm(vec3 p) {
          gln_FBMOpts opts = gln_FBMOpts(0., 0.5, 2., 8);
          return gln_${name}_fbm(p, opts);
      }
  
      ${type} gln_${name}_fbm(vec2 p, gln_FBMOpts opts) {
          return gln_${name}_fbm(vec3(p, 0.), opts);
      }
  
      ${type} gln_${name}_fbm(vec2 p) {
          return gln_${name}_fbm(vec3(p, 0.));
      }
      `
}
