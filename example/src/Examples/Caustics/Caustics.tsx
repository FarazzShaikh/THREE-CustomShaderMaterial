import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { patchShaders } from "gl-noise/build/glNoise.m";
import { useEffect, useMemo, useRef } from "react";
import { Box3Helper, MathUtils, Vector3 } from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { useShader } from "../../pages/Root";

const center = new Vector3(0, 0, 0);
export default function Caustics({ target, children }) {
  const { vs, fs } = useShader();

  const ref = useRef<any>(null!);
  const objref = useRef<any>(null!);

  useHelper(objref.current, Box3Helper);

  const uniforms = useMemo(
    () => ({
      uPosition: {
        value: new Vector3(-2, 1, 1),
      },
      uRotaiton: {
        value: new Vector3(1, 1, 1),
      },
      uAngle: {
        value: MathUtils.degToRad(45),
      },
      uScale: {
        value: new Vector3(),
      },
      uTime: {
        value: 0,
      },
    }),
    []
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime;

    if (target) {
      uniforms.uPosition.value.copy(target.position);
      uniforms.uScale.value.copy(target.scale);

      const vector = new Vector3(0, 0, 0);
      target.getWorldDirection(vector);
      uniforms.uRotaiton.value.copy(vector);
      uniforms.uAngle.value = vector.angleTo(center);
    }
  });

  useEffect(() => {
    ref.current.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = new CustomShaderMaterial({
          baseMaterial: obj.material,
          vertexShader: vs,
          fragmentShader: patchShaders(fs),
          uniforms: uniforms,
          patchMap: {
            csm_FogColor: {
              "#include <fog_fragment>": `
                #include <fog_fragment>

                vec4 fogColor = getFogColor(gl_FragColor);
                gl_FragColor = fogColor;
              `,
            },
          },
        });
      }
    });
  }, []);

  return (
    <>
      <group ref={ref}>{children}</group>
    </>
  );
}
