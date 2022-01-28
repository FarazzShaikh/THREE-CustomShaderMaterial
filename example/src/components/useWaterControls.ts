import React from "react";

import { CSM } from "three-custom-shader-material";
import { useControls } from "leva";
import { Color } from "three";

export default function useWaterControls(material: React.RefObject<CSM>) {
  useControls(
    "Water",
    () => ({
      Color: {
        value: "#52a7f7",
        onChange: (v) => {
          material.current!.uniforms.waterColor.value = new Color(v);
        },
      },
      HighlightColor: {
        value: "#b3ffff",
        onChange: (v) => {
          material.current!.uniforms.waterHighlight.value = new Color(v);
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
    }),
    [material]
  );
}
