import * as THREE from 'three'
import CSM from 'three-custom-shader-material/vanilla'

const base = THREE.MeshPhysicalMaterial

export class Vanilla extends CSM<typeof base> {
  constructor() {
    super({
      baseMaterial: base,
      clearcoat: 1,
    })
  }
}
