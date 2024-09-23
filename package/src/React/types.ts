import { CustomShaderMaterialParameters, MaterialConstructor } from "../types";

export type CustomShaderMaterialProps<T extends MaterialConstructor> =
  CustomShaderMaterialParameters<T> & {};
