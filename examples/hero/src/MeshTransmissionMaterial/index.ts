import * as THREE from 'three'
import { DiscardMaterial } from './DiscardMaterial'

type FBOSettings = {
  /** Defines the count of MSAA samples. Can only be used with WebGL 2. Default: 0 */
  samples?: number
  /** If set, the scene depth will be rendered into buffer.depthTexture. Default: false */
  depth?: boolean
} & THREE.WebGLRenderTargetOptions

function getRendertarget(
  gl: THREE.WebGLRenderer,
  /** Width in pixels, or settings (will render fullscreen by default) */
  width?: number | FBOSettings,
  /** Height in pixels */
  height?: number,
  /**Settings */
  settings?: FBOSettings
) {
  const dpr = window.devicePixelRatio
  const _width = typeof width === 'number' ? width : window.innerWidth * dpr
  const _height = typeof height === 'number' ? height : window.innerHeight * dpr
  const _settings = (typeof width === 'number' ? settings : (width as FBOSettings)) || {}
  const { samples = 0, depth, ...targetSettings } = _settings

  const target = new THREE.WebGLRenderTarget(_width, _height, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    encoding: gl.outputEncoding,
    type: THREE.HalfFloatType,
    ...targetSettings,
  })

  if (depth) {
    target.depthTexture = new THREE.DepthTexture(_width, _height, THREE.FloatType)
  }

  target.samples = samples
  return target
}

interface MeshTransmissionMaterialParameters extends THREE.MeshPhysicalMaterialParameters {
  /** transmissionSampler, you can use the threejs transmission sampler texture that is
   *  generated once for all transmissive materials. The upside is that it can be faster if you
   *  use multiple MeshPhysical and Transmission materials, the downside is that transmissive materials
   *  using this can't see other transparent or transmissive objects, default: false */
  transmissionSampler?: boolean
  /** Render the backside of the material (more cost, better results), default: false */
  backside?: boolean
  /** Backside thickness (when backside is true), default: 0 */
  backsideThickness?: number
  /** Resolution of the local buffer, default: undefined (fullscreen) */
  resolution?: number
  /** Resolution of the local buffer for backfaces, default: undefined (fullscreen) */
  backsideResolution?: number
  /** Refraction samples, default: 6 */
  samples?: number
  /** Buffer scene background (can be a texture, a cubetexture or a color), default: null */
  background?: THREE.Texture | THREE.Color
  /** The scene rendered into a texture (use it to share a texture between materials), default: null  */
  buffer?: THREE.Texture
  /* Thickness (refraction), default: 0 */
  thickness?: number
  /* Chromatic aberration, default: 0.03 */
  chromaticAberration?: number
  /* Roughness (blur), default: 0 */
  roughness?: number
  /* Anisotropy, default: 0.1 */
  anisotropy?: number
  /* Distortion, default: 0 */
  distortion?: number
  /* Distortion scale, default: 0.5 */
  distortionScale?: number
  /* Temporal distortion (speed of movement), default: 0.0 */
  temporalDistortion?: number
}

interface Uniform<T> {
  value: T
}

interface MeshTransmissionMaterialUpdateState {
  scene: THREE.Scene
  camera: THREE.Camera
  gl: THREE.WebGLRenderer
  clock: THREE.Clock
}

export class MeshTransmissionMaterial extends THREE.MeshPhysicalMaterial {
  uniforms: {
    chromaticAberration: Uniform<number>
    transmission: Uniform<number>
    transmissionMap: Uniform<THREE.Texture | null>
    _transmission: Uniform<number>
    thickness: Uniform<number>
    roughness: Uniform<number>
    thicknessMap: Uniform<THREE.Texture | null>
    attenuationDistance: Uniform<number>
    attenuationColor: Uniform<THREE.Color>
    anisotropy: Uniform<number>
    time: Uniform<number>
    distortion: Uniform<number>
    distortionScale: Uniform<number>
    temporalDistortion: Uniform<number>
    buffer: Uniform<THREE.Texture | null>
  }

  private _fboMain: THREE.WebGLRenderTarget
  private _fboBack: THREE.WebGLRenderTarget
  private _oldBg?: THREE.Color | THREE.Texture | null
  private _oldTone?: THREE.ToneMapping
  private _target?: THREE.Mesh<THREE.BufferGeometry, THREE.ShaderMaterial | this>
  private _discardMaterial: DiscardMaterial
  private _gl: THREE.WebGLRenderer

  transmissionSampler: boolean
  background: THREE.Color | THREE.Texture | null
  backside: boolean
  backsideThickness: number
  samples?: number
  resolution?: number
  backsideResolution?: number

  constructor(
    gl: THREE.WebGLRenderer,
    {
      buffer,
      transmissionSampler = false,
      backside = false,
      side = THREE.FrontSide,
      transmission = 1,
      thickness = 0,
      backsideThickness = 0,
      samples = 10,
      resolution,
      backsideResolution,
      background,
      chromaticAberration = 0.03,
      roughness = 0,
      anisotropy = 0.1,
      distortion = 0,
      distortionScale = 0.5,
      temporalDistortion = 0.0,
      attenuationColor = new THREE.Color(0, 0, 0),
      attenuationDistance = 0,
      transmissionMap = null,
      ...parameters
    }: MeshTransmissionMaterialParameters = {}
  ) {
    super(parameters)

    super.roughness = roughness
    super.transmission = transmission
    super.thickness = thickness
    super.thicknessMap = transmissionMap
    super.side = side

    this._fboMain = getRendertarget(gl, resolution)
    this._fboBack = getRendertarget(gl, backsideResolution || resolution)
    this._discardMaterial = new DiscardMaterial()
    this._gl = gl

    this.uniforms = {
      chromaticAberration: { value: chromaticAberration },
      // Transmission must always be 0, unless transmissionSampler is being used
      transmission: { value: transmissionSampler ? transmission : 0 },
      // Instead a workaround is used, see below for reasons why
      _transmission: { value: transmission },
      transmissionMap: { value: transmissionMap },
      // Roughness is 1 in THREE.MeshPhysicalMaterial but it makes little sense in a transmission material
      roughness: { value: roughness },
      thickness: { value: thickness },
      thicknessMap: { value: super.thicknessMap },
      attenuationDistance: { value: attenuationDistance },
      attenuationColor: { value: attenuationColor },
      anisotropy: { value: anisotropy },
      time: { value: 0 },
      distortion: { value: distortion },
      distortionScale: { value: distortionScale },
      temporalDistortion: { value: temporalDistortion },
      buffer: { value: buffer || this._fboMain.texture },
    }

    this.transmissionSampler = transmissionSampler
    this.background = background || null
    this.backside = backside
    this.backsideThickness = backsideThickness
    this.samples = samples
    this.resolution = resolution
    this.backsideResolution = backsideResolution

    this.onBeforeCompile = (shader: THREE.Shader & { defines: { [key: string]: string } }) => {
      shader.uniforms = {
        ...shader.uniforms,
        ...this.uniforms,
      }

      // If the transmission sampler is active inject a flag
      if (transmissionSampler) shader.defines.USE_SAMPLER = ''
      // Otherwise we do use use .transmission and must therefore force USE_TRANSMISSION
      // because threejs won't inject it for us
      else shader.defines.USE_TRANSMISSION = ''

      shader.fragmentShader = fragmentHead + shader.fragmentShader
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <transmission_pars_fragment>',
        fragmentTransmission
      )
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <transmission_fragment>',
        fragmentRefraction(samples)
      )
    }

    // const _uniforms: any = { ...this.uniforms }
    // delete _uniforms.transmission
    // delete _uniforms.thicknessMap
    // delete _uniforms.attenuationDistance
    // delete _uniforms.attenuationColor

    // Object.keys(_uniforms).forEach((name) =>
    //   Object.defineProperty(this, name, {
    //     // @ts-ignore
    //     get: () => this.uniforms[name].value,
    //     // @ts-ignore
    //     set: (v) => (this.uniforms[name].value = v),
    //   })
    // )
  }

  // Define setters and getters for all uniforms in order
  get chromaticAberration() {
    return this.uniforms.chromaticAberration.value
  }
  set chromaticAberration(v) {
    this.uniforms.chromaticAberration.value = v
  }
  // @ts-expect-error
  get transmission() {
    return this.uniforms?._transmission.value
  }
  set transmission(v) {
    if (this.uniforms) this.uniforms._transmission.value = v
  }
  // @ts-expect-error
  get transmissionMap() {
    return this.uniforms?.transmissionMap.value
  }
  set transmissionMap(v) {
    if (this.uniforms) this.uniforms.transmissionMap.value = v
  }
  // @ts-expect-error
  get thickness() {
    return this.uniforms?.thickness.value
  }
  set thickness(v) {
    if (this.uniforms) this.uniforms.thickness.value = v
  }
  // @ts-expect-error
  get thicknessMap() {
    return this.uniforms?.thicknessMap.value
  }
  set thicknessMap(v) {
    if (this.uniforms) this.uniforms.thicknessMap.value = v
  }
  // @ts-expect-error
  get attenuationDistance() {
    return this.uniforms?.attenuationDistance.value
  }
  set attenuationDistance(v) {
    if (this.uniforms) this.uniforms.attenuationDistance.value = v
  }
  // @ts-expect-error
  get attenuationColor() {
    return this.uniforms?.attenuationColor.value
  }
  set attenuationColor(v) {
    if (this.uniforms) this.uniforms.attenuationColor.value = v
  }

  get anisotropy() {
    return this.uniforms.anisotropy.value
  }
  set anisotropy(v) {
    this.uniforms.anisotropy.value = v
  }

  get distortion() {
    return this.uniforms.distortion.value
  }
  set distortion(v) {
    this.uniforms.distortion.value = v
  }

  get distortionScale() {
    return this.uniforms.distortionScale.value
  }
  set distortionScale(v) {
    this.uniforms.distortionScale.value = v
  }

  get temporalDistortion() {
    return this.uniforms.temporalDistortion.value
  }
  set temporalDistortion(v) {
    this.uniforms.temporalDistortion.value = v
  }

  get buffer() {
    return this.uniforms.buffer.value
  }
  set buffer(v) {
    this.uniforms.buffer.value = v
  }
  set time(v) {
    this.uniforms.time.value = v
  }
  get time() {
    return this.uniforms.time.value
  }

  update(state: MeshTransmissionMaterialUpdateState, target: THREE.Mesh<THREE.BufferGeometry, this>) {
    this.time = state.clock.getElapsedTime()

    // Render only if the buffer matches the built-in and no transmission sampler is set
    if (this.buffer === this._fboMain.texture && !this.transmissionSampler) {
      this._target = target

      if (target) {
        // Save defaults
        this._oldTone = state.gl.toneMapping
        this._oldBg = state.scene.background

        // Switch off tonemapping lest it double tone maps
        // Save the current background and set the HDR as the new BG
        // Use discardmaterial, the target will be invisible, but it's shadows will still be cast
        state.gl.toneMapping = THREE.NoToneMapping
        if (this.background) state.scene.background = this.background
        this._target.material = this._discardMaterial

        if (this.backside) {
          // Render into the backside buffer
          state.gl.setRenderTarget(this._fboBack)
          state.gl.render(state.scene, state.camera)
          // And now prepare the material for the main render using the backside buffer
          this._target.material = this
          this._target.material.buffer = this._fboBack.texture
          this._target.material.thickness = this.backsideThickness
          this._target.material.side = THREE.BackSide
        }

        // Render into the main buffer
        state.gl.setRenderTarget(this._fboMain)
        state.gl.render(state.scene, state.camera)

        // this._target.material = this
        // @ts-ignore
        this._target.material.thickness = this.thickness
        this._target.material.side = this.side
        // @ts-ignore
        this._target.material.buffer = this._fboMain.texture

        // Set old state back
        state.scene.background = this._oldBg
        state.gl.setRenderTarget(null)
        this._target.material = this
        state.gl.toneMapping = this._oldTone
      }
    }
  }

  dispose() {
    this._fboMain.dispose()
    this._fboBack.dispose()
    this._discardMaterial.dispose()
    super.dispose()
  }
}

const fragmentHead = /* glsl */ `
  uniform float chromaticAberration;         
  uniform float anisotropy;      
  uniform float time;
  uniform float distortion;
  uniform float distortionScale;
  uniform float temporalDistortion;
  uniform sampler2D buffer;
  vec3 random3(vec3 c) {
    float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
    vec3 r;
    r.z = fract(512.0*j);
    j *= .125;
    r.x = fract(512.0*j);
    j *= .125;
    r.y = fract(512.0*j);
    return r-0.5;
  }
  float seed = 0.0;
  uint hash( uint x ) {
    x += ( x << 10u );
    x ^= ( x >>  6u );
    x += ( x <<  3u );
    x ^= ( x >> 11u );
    x += ( x << 15u );
    return x;
  }
  // Compound versions of the hashing algorithm I whipped together.
  uint hash( uvec2 v ) { return hash( v.x ^ hash(v.y)                         ); }
  uint hash( uvec3 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z)             ); }
  uint hash( uvec4 v ) { return hash( v.x ^ hash(v.y) ^ hash(v.z) ^ hash(v.w) ); }
  // Construct a float with half-open range [0:1] using low 23 bits.
  // All zeroes yields 0.0, all ones yields the next smallest representable value below 1.0.
  float floatConstruct( uint m ) {
    const uint ieeeMantissa = 0x007FFFFFu; // binary32 mantissa bitmask
    const uint ieeeOne      = 0x3F800000u; // 1.0 in IEEE binary32
    m &= ieeeMantissa;                     // Keep only mantissa bits (fractional part)
    m |= ieeeOne;                          // Add fractional part to 1.0
    float  f = uintBitsToFloat( m );       // Range [1:2]
    return f - 1.0;                        // Range [0:1]
  }
  // Pseudo-random value in half-open range [0:1].
  float random( float x ) { return floatConstruct(hash(floatBitsToUint(x))); }
  float random( vec2  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
  float random( vec3  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
  float random( vec4  v ) { return floatConstruct(hash(floatBitsToUint(v))); }
  float rand() {
    float result = random(vec3(gl_FragCoord.xy, seed));
    seed += 1.0;
    return result;
  }
  const float F3 =  0.3333333;
  const float G3 =  0.1666667;
  float snoise(vec3 p) {
    vec3 s = floor(p + dot(p, vec3(F3)));
    vec3 x = p - s + dot(s, vec3(G3));
    vec3 e = step(vec3(0.0), x - x.yzx);
    vec3 i1 = e*(1.0 - e.zxy);
    vec3 i2 = 1.0 - e.zxy*(1.0 - e);
    vec3 x1 = x - i1 + G3;
    vec3 x2 = x - i2 + 2.0*G3;
    vec3 x3 = x - 1.0 + 3.0*G3;
    vec4 w, d;
    w.x = dot(x, x);
    w.y = dot(x1, x1);
    w.z = dot(x2, x2);
    w.w = dot(x3, x3);
    w = max(0.6 - w, 0.0);
    d.x = dot(random3(s), x);
    d.y = dot(random3(s + i1), x1);
    d.z = dot(random3(s + i2), x2);
    d.w = dot(random3(s + 1.0), x3);
    w *= w;
    w *= w;
    d *= w;
    return dot(d, vec4(52.0));
  }
  float snoiseFractal(vec3 m) {
    return 0.5333333* snoise(m)
          +0.2666667* snoise(2.0*m)
          +0.1333333* snoise(4.0*m)
          +0.0666667* snoise(8.0*m);
  }
`

const fragmentTransmission = /* glsl */ `
  #ifdef USE_TRANSMISSION
  // Transmission code is based on glTF-Sampler-Viewer
  // https://github.com/KhronosGroup/glTF-Sample-Viewer
  uniform float _transmission;
  uniform float thickness;
  uniform float attenuationDistance;
  uniform vec3 attenuationColor;
  #ifdef USE_TRANSMISSIONMAP
    uniform sampler2D transmissionMap;
  #endif
  #ifdef USE_THICKNESSMAP
    uniform sampler2D thicknessMap;
  #endif
  uniform vec2 transmissionSamplerSize;
  uniform sampler2D transmissionSamplerMap;
  uniform mat4 modelMatrix;
  uniform mat4 projectionMatrix;
  varying vec3 vWorldPosition;
  vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
    // Direction of refracted light.
    vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
    // Compute rotation-independant scaling of the model matrix.
    vec3 modelScale;
    modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
    modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
    modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
    // The thickness is specified in local space.
    return normalize( refractionVector ) * thickness * modelScale;
  }
  float applyIorToRoughness( const in float roughness, const in float ior ) {
    // Scale roughness with IOR so that an IOR of 1.0 results in no microfacet refraction and
    // an IOR of 1.5 results in the default amount of microfacet refraction.
    return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
  }
  vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
    float framebufferLod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );            
    #ifdef USE_SAMPLER
      #ifdef texture2DLodEXT
        return texture2DLodEXT(transmissionSamplerMap, fragCoord.xy, framebufferLod);
      #else
        return texture2D(transmissionSamplerMap, fragCoord.xy, framebufferLod);
      #endif
    #else
      return texture2D(buffer, fragCoord.xy);
    #endif
  }
  vec3 applyVolumeAttenuation( const in vec3 radiance, const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
    if ( isinf( attenuationDistance ) ) {
      // Attenuation distance is +∞, i.e. the transmitted color is not attenuated at all.
      return radiance;
    } else {
      // Compute light attenuation using Beer's law.
      vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
      vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance ); // Beer's law
      return transmittance * radiance;
    }
  }
  vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
    const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
    const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
    const in vec3 attenuationColor, const in float attenuationDistance ) {
    vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
    vec3 refractedRayExit = position + transmissionRay;
    // Project refracted vector on the framebuffer, while mapping to normalized device coordinates.
    vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
    vec2 refractionCoords = ndcPos.xy / ndcPos.w;
    refractionCoords += 1.0;
    refractionCoords /= 2.0;
    // Sample framebuffer to get pixel the refracted ray hits.
    vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
    vec3 attenuatedColor = applyVolumeAttenuation( transmittedLight.rgb, length( transmissionRay ), attenuationColor, attenuationDistance );
    // Get the specular component.
    vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
    return vec4( ( 1.0 - F ) * attenuatedColor * diffuseColor, transmittedLight.a );
  }
  #endif
`

const fragmentRefraction = (samples: number) => /* glsl */ `
  // Improve the refraction to use the world pos
  material.transmission = _transmission;
  material.transmissionAlpha = 1.0;
  material.thickness = thickness;
  material.attenuationDistance = attenuationDistance;
  material.attenuationColor = attenuationColor;
  #ifdef USE_TRANSMISSIONMAP
    material.transmission *= texture2D( transmissionMap, vUv ).r;
  #endif
  #ifdef USE_THICKNESSMAP
    material.thickness *= texture2D( thicknessMap, vUv ).g;
  #endif
  
  vec3 pos = vWorldPosition;
  vec3 v = normalize( cameraPosition - pos );
  vec3 n = inverseTransformDirection( normal, viewMatrix );
  vec3 transmission = vec3(0.0);
  float transmissionR, transmissionB, transmissionG;
  float randomCoords = rand();
  float thickness_smear = thickness * max(pow(roughnessFactor, 0.33), anisotropy);
  vec3 distortionNormal = vec3(0.0);
  vec3 temporalOffset = vec3(time, -time, -time) * temporalDistortion;
  if (distortion > 0.0) {
    distortionNormal = distortion * vec3(snoiseFractal(vec3((pos * distortionScale + temporalOffset))), snoiseFractal(vec3(pos.zxy * distortionScale - temporalOffset)), snoiseFractal(vec3(pos.yxz * distortionScale + temporalOffset)));
  }
  for (float i = 0.0; i < ${samples}.0; i ++) {
    vec3 sampleNorm = normalize(n + roughnessFactor * roughnessFactor * 2.0 * normalize(vec3(rand() - 0.5, rand() - 0.5, rand() - 0.5)) * pow(rand(), 0.33) + distortionNormal);
    transmissionR = getIBLVolumeRefraction(
      sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
      pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness  + thickness_smear * (i + randomCoords) / float(${samples}),
      material.attenuationColor, material.attenuationDistance
    ).r;
    transmissionG = getIBLVolumeRefraction(
      sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
      pos, modelMatrix, viewMatrix, projectionMatrix, material.ior  * (1.0 + chromaticAberration * (i + randomCoords) / float(${samples})) , material.thickness + thickness_smear * (i + randomCoords) / float(${samples}),
      material.attenuationColor, material.attenuationDistance
    ).g;
    transmissionB = getIBLVolumeRefraction(
      sampleNorm, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
      pos, modelMatrix, viewMatrix, projectionMatrix, material.ior * (1.0 + 2.0 * chromaticAberration * (i + randomCoords) / float(${samples})), material.thickness + thickness_smear * (i + randomCoords) / float(${samples}),
      material.attenuationColor, material.attenuationDistance
    ).b;
    transmission.r += transmissionR;
    transmission.g += transmissionG;
    transmission.b += transmissionB;
  }
  transmission /= ${samples}.0;
  totalDiffuse = mix( totalDiffuse, transmission.rgb, material.transmission );
`
