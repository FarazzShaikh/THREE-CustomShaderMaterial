import React from "react";
import { Html } from "@react-three/drei";

export default function Copy({ base }: any) {
  return (
    <>
      <Html center transform position={[0, 3, 0]} rotation-y={Math.PI / 4}>
        <div
          style={{
            maxWidth: "300px",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          <code>
            <strong>{base.name}</strong>
            <span style={{ fontSize: "8px" }}> + Custom shader</span>
          </code>
        </div>
      </Html>

      <Html
        center
        transform
        position={[3, 0, 0]}
        rotation-z={Math.PI / 2}
        rotation-x={-Math.PI / 2}
      >
        <div
          style={{
            maxWidth: "300px",
            fontSize: "10px",
            textAlign: "center",
          }}
        >
          <code>
            {[
              "MeshToonMaterial",
              "MeshLambertMaterial",
              "MeshDepthMaterial",
            ].includes(base.name)
              ? "Coming soon"
              : ""}
          </code>
        </div>
      </Html>

      <Html center transform position={[0, 0, 3]} rotation-x={-Math.PI / 2}>
        <div
          style={{
            maxWidth: "300px",
            fontSize: "12px",
            textAlign: "center",
          }}
        >
          <a
            href="https://github.com/FarazzShaikh/THREE-CustomShaderMaterial"
            target={"_blank"}
            style={{
              textDecoration: "none",
            }}
          >
            Custom Shader Material
          </a>
        </div>
      </Html>
    </>
  );
}
