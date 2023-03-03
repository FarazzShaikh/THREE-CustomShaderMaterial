import * as THREE from 'three'

export class DiscardMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      vertexShader: `void main() {}`,
      fragmentShader: `void main() { gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0); discard; }`,
    })
  }
}
