import React from 'react'

// @ts-ignore
import CustomShaderMaterialType from 'three-custom-shader-material/vanilla'
import { useControls } from 'leva'
import { Color } from 'three'

export default function useWaterControls(material: React.RefObject<CustomShaderMaterialType>) {
  useControls(
    'Water',
    () => ({
      Color: {
        value: '#52a7f7',
        onChange: v => {
          console.log(material.current)
          material.current!.uniforms.waterColor.value = new Color(v).convertLinearToSRGB()
        },
      },
      HighlightColor: {
        value: '#b3ffff',
        onChange: v => {
          material.current!.uniforms.waterHighlight.value = new Color(v).convertLinearToSRGB()
        },
      },

      Brightness: {
        value: 0.5,
        min: 0,
        max: 1,
        onChange: v => {
          material.current!.uniforms.brightness.value = v * 2
        },
      },
    }),
    [material]
  )
}
