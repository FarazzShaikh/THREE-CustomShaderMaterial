import { OrbitControls, Sphere } from "@react-three/drei";

import { useControls } from "leva";
import { useMemo } from "react";
import { Color, MeshPhysicalMaterial } from "three";
import CSM from "../../../../package/src";
import { useShader } from "../../pages/Root";
import { Stage } from "./Stage";

import psrd from "./psrd.glsl?raw";

class PreviousCSM extends CSM<typeof MeshPhysicalMaterial> {
  constructor() {
    super({
      roughness: 0,
      metalness: 1,
      baseMaterial: MeshPhysicalMaterial,
      vertexShader: /* glsl */ `
        varying vec2 vUv1;

        void main() {
          vUv1 = uv;
        }`,
      fragmentShader: /* glsl */ `
        varying vec2 vUv1;

        void main () {
          csm_DiffuseColor = vec4(vUv1, 0.0, 1.0);
        }`,
    });
  }
}

class CustomMaterial extends CSM<typeof PreviousCSM> {
  constructor() {
    super({
      baseMaterial: PreviousCSM,
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vPosition;

        void main(){
          vPosition = position;
          vUv = uv;
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;

        uniform vec3 uCsmColor;

        ${psrd}

        mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
          vec3 q0 = dFdx( eye_pos.xyz );
          vec3 q1 = dFdy( eye_pos.xyz );
          vec2 st0 = dFdx( uv.st );
          vec2 st1 = dFdy( uv.st );
          vec3 N = surf_norm;
          vec3 q1perp = cross( q1, N );
          vec3 q0perp = cross( N, q0 );
          vec3 T = q1perp * st0.x + q0perp * st1.x;
          vec3 B = q1perp * st0.y + q0perp * st1.y;
          float det = max( dot( T, T ), dot( B, B ) );
          float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
          return mat3( T * scale, B * scale, N );
        }

        void main() {
          vec3 gradient;
          float psrdN = 0.5 + 0.5 * psrdnoise(vPosition * 10.0, vec3(0.0), 2.0, gradient);

          mat3 tbn = getTangentFrame( - vViewPosition, csm_FragNormal, vUv );
          vec3 customNormal = normalize( tbn * -gradient );

          // csm_FragNormal = customNormal;
          // csm_DiffuseColor = vec4(vec3(psrdN), 1.0);
          csm_DiffuseColor.rgb *= 0.5;
        }
      `,
      uniforms: {
        uCsmColor: { value: new Color("#ff00ff") },
      },
    });

    // Object.defineProperties(this, {
    //   uniformColor: {
    //     get: () => {
    //       return this.uniforms.uCsmColor.value.getHex();
    //     },
    //     set: (v: string) => {
    //       this.uniforms.uCsmColor.value.set(v);
    //     },
    //   },
    // });
  }

  get uniformColor() {
    return this.uniforms.uCsmColor.value.getHex();
  }

  set uniformColor(v: string) {
    this.uniforms.uCsmColor.value.set(v);
  }

  init() {
    console.log("init");
  }
}

export function Scene() {
  const { vs, fs } = useShader();

  const mat = useMemo(() => new CustomMaterial(), []);
  console.log(mat);

  const { flatShading } = useControls({
    color: {
      value: "#ff0000",
      label: "Color",
      onChange: (v: string) => {
        mat.uniformColor = v;
      },
    },
    flatShading: {
      value: false,
      label: "Flat Shading",
    },
  });

  return (
    <>
      <OrbitControls />

      <Stage
        adjustCamera={1.5}
        environment={{
          preset: "sunset",
          background: true,
          blur: 4,
        }}
        preset="upfront"
        shadows={{
          type: "accumulative",
          //   color: "#fac9ed",
          colorBlend: 2,
          alphaTest: 0.3,
          opacity: 0.6,
          radius: 3,
        }}
      >
        <Sphere castShadow args={[1, 32, 32]} material={mat}></Sphere>
      </Stage>
    </>
  );
}
