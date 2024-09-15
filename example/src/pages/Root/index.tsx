import { Canvas } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useLayoutEffect, useState } from "react";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import { SHADERS } from "../../Examples";
import { UI } from "./UI";

type ContextType = {
  vs: string;
  fs: string;
  setShader: (shader: [string, string]) => void;
};

export function Root() {
  const location = useLocation();
  const slug = location.pathname.replace("/", "");
  const shader =
    Object.values(SHADERS).find((shader) => shader.slug === slug) ||
    SHADERS.DEFAULT;

  const [[vs, fs], setShader] = useState([shader.vs, shader.fs]);

  useLayoutEffect(() => {
    setShader([shader.vs, shader.fs]);
  }, [slug]);

  return (
    <main>
      <UI vs={vs} fs={fs} setShader={setShader} />
      <Canvas shadows>
        <Outlet context={{ vs, fs, setShader } satisfies ContextType} />

        <Perf position="bottom-right r3f-perf" />
      </Canvas>
    </main>
  );
}

export function useShader() {
  return useOutletContext<ContextType>();
}
