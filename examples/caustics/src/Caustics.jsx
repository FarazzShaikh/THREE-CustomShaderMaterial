import { Box, TransformControls, useHelper } from '@react-three/drei'
import { useMemo } from 'react'
import { useRef, useEffect } from 'react'
import { BoxHelper, Color, MathUtils, Matrix4, Vector3 } from 'three'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import { patchShaders } from 'gl-noise/build/glNoise.m'
import { useControls } from 'leva'
import { useFrame } from '@react-three/fiber'

const center = new Vector3(0, 0, 0)
export default function Caustics({ target, children }) {
  const ref = useRef()
  const objref = useRef()

  useHelper(BoxHelper, objref.current)

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
  )

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.elapsedTime

    if (target) {
      uniforms.uPosition.value.copy(target.position)
      uniforms.uScale.value.copy(target.scale)

      const vector = new Vector3(0, 0, 0)
      target.getWorldDirection(vector)
      uniforms.uRotaiton.value.copy(vector)
      uniforms.uAngle.value = vector.angleTo(center)
    }
  })

  useEffect(() => {
    ref.current.traverse((obj) => {
      if (obj.isMesh) {
        obj.material = new CustomShaderMaterial({
          baseMaterial: obj.material,
          vertexShader: /* glsl */ `
            varying vec3 csm_vWorldPosition;
            varying vec3 csm_vPosition;
            varying vec3 csm_vNormal;
            varying vec2 csm_vUv;

            void main() {
              csm_vNormal = normal;
              csm_vUv = uv;
              csm_vPosition = position;
              csm_vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            }
          `,
          uniforms: uniforms,
          fragmentShader: patchShaders(/* glsl */ `
            varying vec3 csm_vWorldPosition;
            varying vec3 csm_vPosition;
            varying vec3 csm_vNormal;
            varying vec2 csm_vUv;

            uniform vec3 uPosition;
            uniform vec3 uRotaiton;
            uniform vec3 uScale;
            uniform float uTime;
            uniform float uAngle;

            #include <shadowmask_pars_fragment>

            mat4 rotationMatrix(vec3 axis, float angle) {
               axis = normalize(axis);
               float s = sin(angle);
               float c = cos(angle);
               float oc = 1.0 - c;

               return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                           oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                           oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                           0.0,                                0.0,                                0.0,                                1.0);
            }

            vec3 rotate(vec3 v, vec3 axis, float angle) {
            	mat4 m = rotationMatrix(axis, angle);
            	return (m * vec4(v, 1.0)).xyz;
            }

            float sdBox(vec3 p, vec3 b) {
              vec3 q = abs(p) - b;
              return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
            }

            vec4 getFogColor(vec4 color) {
              vec3 scale = uScale;
              vec3 p = csm_vWorldPosition;
              p.x -= uPosition.x;
              p.y -= uPosition.y;
              p.z -= uPosition.z;
              vec3 pos = rotate(p, uRotaiton, uAngle);

              float box = 1. - clamp(sdBox(p, scale), 0., 1.);
              box = box >= 0.5 ? 1. : 0.;

              gln_tWorleyOpts opts = gln_tWorleyOpts(1., -2., 1., false);

              
              float noiseScale = 1.7;
              float t =  (uTime * 0.1);
              float offset = 0.05;

              vec3 n1 = vec3(
                gln_worley(((pos.xz + t) + vec2(offset, offset)) * noiseScale, opts),
                gln_worley(((pos.xz + t) + vec2(offset, -offset)) * noiseScale, opts),
                gln_worley(((pos.xz + t) + vec2(-offset, -offset)) * noiseScale, opts)
              );
              
              float noiseScale2 = 1.2;
              float t2 =  (uTime * 0.2);
              float offset2 = 0.02;
              vec3 n2 = vec3(
                gln_worley(((pos.xz + t2) + vec2(offset2, offset2)) * noiseScale2, opts),
                gln_worley(((pos.xz + t2) + vec2(offset2, -offset2)) * noiseScale2, opts),
                gln_worley(((pos.xz + t2) + vec2(-offset2, -offset2)) * noiseScale2, opts)
              );

              vec3 n = min(n1, n2);
              n = pow(n, vec3(3.)) * 1.2;

              vec3 projectorDirection = normalize(pos);
              float dotProduct = 1. - dot(csm_vNormal, projectorDirection);
              dotProduct = pow(dotProduct, 3.);
              dotProduct = clamp(dotProduct, 0., 1.);
              
              float shadow = getShadowMask();

              float fac = dotProduct * box * shadow;
              vec3 c = color.rgb + n;
              return mix(color, vec4(c, 1.), fac);
              // return vec4(vec3(n), 1.);

            }

            void main() {
              vec4 csm_FogColor;
            }
          `),
          patchMap: {
            csm_FogColor: {
              '#include <fog_fragment>': `
                #include <fog_fragment>

                vec4 fogColor = getFogColor(gl_FragColor);
                gl_FragColor = fogColor;
              `,
            },
          },
        })
      }
    })
  }, [])

  return (
    <>
      <group ref={ref}>{children}</group>
    </>
  )
}
