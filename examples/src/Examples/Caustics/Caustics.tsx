import { useHelper } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { patchShaders } from "gl-noise/build/glNoise.m";
import { useEffect, useMemo, useRef } from "react";
import { Box3Helper, Material, MathUtils, Vector3 } from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { useShader } from "../../pages/Root";
import Lights from "./components/Lights";

const center = new Vector3(0, 0, 0);
export default function Caustics({ children }) {
  const lightRef = useRef<any>(null!);
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

    if (lightRef.current) {
      uniforms.uPosition.value.copy(lightRef.current.object.position);
      uniforms.uScale.value.copy(lightRef.current.object.scale);

      const vector = new Vector3(0, 0, 0);
      lightRef.current.object.getWorldDirection(vector);
      uniforms.uRotaiton.value.copy(vector);
      uniforms.uAngle.value = vector.angleTo(center);
    }
  });

  const prevMaterials = useRef<{
    [id: string]: Material;
  }>({});
  const csmInstances = useRef<CustomShaderMaterial[]>([]);

  useEffect(() => {
    ref.current.traverse((obj) => {
      if (obj.isMesh && obj.material) {
        if (!prevMaterials.current[obj.material.uuid]) {
          prevMaterials.current[obj.material.uuid] = obj.material.clone();
          obj.material.dispose();

          obj.material = new CustomShaderMaterial({
            baseMaterial: obj.material,
            vertexShader: vs,
            fragmentShader: patchShaders(fs),
            uniforms: uniforms,
            patchMap: {
              "*": {
                "#include <fog_fragment>": `
                  #include <fog_fragment>
                  gl_FragColor = getCausticsColor(gl_FragColor);
                `,
              },
            },
          });

          csmInstances.current.push(obj.material);
        }
      }
    });

    return () => {
      if (ref.current) {
        ref.current.traverse((obj) => {
          if (obj.isMesh) {
            obj.material.dispose();
            obj.material = prevMaterials.current[obj.material.uuid];
          }
        });
      } else {
        Object.values(prevMaterials.current).forEach((material) =>
          material.dispose()
        );
        for (const csm of csmInstances.current) {
          csm.dispose();
        }
        prevMaterials.current = {};
        csmInstances.current = [];
      }
    };
  }, []);

  return (
    <>
      <Lights ref={lightRef} />

      <group ref={ref}>{children}</group>
    </>
  );
}
