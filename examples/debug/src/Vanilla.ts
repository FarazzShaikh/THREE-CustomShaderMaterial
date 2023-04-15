import CSM, { MaterialConstructor, iCSMParams, iCSMPatchMap } from 'three-custom-shader-material/vanilla'
import * as THREE from 'three'

export class Vanilla extends CSM {
  constructor() {
    super({
      baseMaterial: THREE.MeshPhysicalMaterial,
    })
  }
}
