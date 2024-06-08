import { AttachType } from "@react-three/fiber/dist/declarations/src/core/renderer";
import * as React from "react";
import { Material } from "three";
import CustomShaderMaterialImpl, { MaterialConstructor } from "../index";
import { CustomShaderMaterialProps } from "./types";

function useDidUpdateEffect(
  fn: (...opts: any[]) => any,
  inputs: React.DependencyList
) {
  const didMountRef = React.useRef(false);

  React.useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }
    didMountRef.current = true;
  }, inputs);
}

function CustomShaderMaterial<T extends MaterialConstructor>(
  {
    baseMaterial,
    vertexShader,
    fragmentShader,
    uniforms,
    cacheKey,
    patchMap,
    attach,
    ...opts
  }: CustomShaderMaterialProps<T>,
  ref: React.Ref<InstanceType<T>>
) {
  const material = React.useMemo(() => {
    return new CustomShaderMaterialImpl({
      baseMaterial,
      vertexShader,
      fragmentShader,
      uniforms,
      cacheKey,
      patchMap,
      ...opts,
    });
  }, [baseMaterial]);

  useDidUpdateEffect(() => {
    material.update({
      vertexShader,
      fragmentShader,
      uniforms,
      patchMap,
      cacheKey,
    });
  }, [vertexShader, fragmentShader, uniforms, patchMap, cacheKey]);

  React.useEffect(() => () => material.dispose(), [material]);

  return (
    <primitive
      ref={ref}
      attach={attach ?? "material"}
      object={material}
      {...opts}
    />
  );
}

// export default React.forwardRef(CustomShaderMaterial) as <
//   T extends MaterialConstructor
// >(
//   props: CustomShaderMaterialProps<T> & { ref?: React.Ref<InstanceType<T>> }
// ) => React.ReactElement;

export default React.forwardRef(CustomShaderMaterial) as <
  T extends MaterialConstructor = typeof Material
>(
  props: CustomShaderMaterialProps<T> & {
    ref?: React.Ref<CustomShaderMaterialImpl<T>>;
    attach?: AttachType;
  }
) => React.ReactElement;

export { type CustomShaderMaterialProps } from "./types";
