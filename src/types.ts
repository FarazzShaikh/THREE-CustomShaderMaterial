import { IUniform, Material } from 'three'

export interface iCSMProps {
  baseMaterial: typeof Material
  vertexShader?: string
  fragmentShader?: string
  uniforms?: { [key: string]: IUniform<any> }
}

export interface iCSMShader {
  defines: string
  header: string
  main: string
}
