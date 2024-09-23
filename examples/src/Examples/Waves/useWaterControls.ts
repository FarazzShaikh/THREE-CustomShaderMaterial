import { useControls } from "leva";
import React from "react";
import { Color } from "three";
import CustomShaderMaterialType from "../../../../package/src";

export default function useWaterControls(
  material: React.RefObject<CustomShaderMaterialType<any>>
) {
  useControls(
    "Water",
    () => {
      if (!material.current) return {};

      return {
        Color: {
          value: "#52a7f7",
          onChange: (v) => {
            material.current!.uniforms.waterColor.value = new Color(
              v
            ).convertLinearToSRGB();
          },
        },
        HighlightColor: {
          value: "#b3ffff",
          onChange: (v) => {
            material.current!.uniforms.waterHighlight.value = new Color(
              v
            ).convertLinearToSRGB();
          },
        },

        Brightness: {
          value: 0.5,
          min: 0,
          max: 1,
          onChange: (v) => {
            material.current!.uniforms.brightness.value = v * 2;
          },
        },
      };
    },
    [material]
  );
}
