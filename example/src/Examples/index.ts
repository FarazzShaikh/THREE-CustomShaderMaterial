import { Scene as DefaultScene } from "./default/Scene";
import fs_default from "./default/fs.glsl?raw";
import vs_default from "./default/vs.glsl?raw";

import { Scene as VanillaScene } from "./Vanilla/Scene";
import fs_vanilla from "./Vanilla/fs.glsl?raw";
import vs_vanilla from "./Vanilla/vs.glsl?raw";

import { Scene as InstancesScene } from "./Instances/Scene";
import fs_instances from "./Instances/fs.glsl?raw";
import vs_instances from "./Instances/vs.glsl?raw";

import { Scene as WavesScene } from "./Waves/Scene";
import fs_waves from "./Waves/fs.glsl?raw";
import vs_waves from "./Waves/vs.glsl?raw";

import { Scene as CausticsScene } from "./Caustics/Scene";
import fs_caustics from "./Caustics/fs.glsl?raw";
import vs_caustics from "./Caustics/vs.glsl?raw";

import { Scene as PointsScene } from "./Points/Scene";
import fs_points from "./Points/fs.glsl?raw";
import vs_points from "./Points/vs.glsl?raw";

import { Scene as ShadowsScene } from "./Shadows/Scene";
import fs_shadows from "./Shadows/fs.glsl?raw";
import vs_shadows from "./Shadows/vs.glsl?raw";

export interface ExampleSceneProps {
  fs: string;
  vs: string;
}

export const SHADERS: {
  [key: string]: {
    fs: string;
    vs: string;
    slug: string;
    label: string;
    category: string;
    Component: React.ComponentType;
  };
} = {
  DEFAULT: {
    fs: fs_default,
    vs: vs_default,
    Component: DefaultScene,
    slug: "default",
    label: "Default",
    category: "Examples",
  },
  VANILLA: {
    fs: fs_vanilla,
    vs: vs_vanilla,
    Component: VanillaScene,
    slug: "vanilla",
    label: "Vanilla",
    category: "Examples",
  },
  INSTANCES: {
    fs: fs_instances,
    vs: vs_instances,
    slug: "instances",
    Component: InstancesScene,
    label: "Instances",
    category: "Examples",
  },
  WAVES: {
    fs: fs_waves,
    vs: vs_waves,
    slug: "waves",
    Component: WavesScene,
    label: "Waves",
    category: "Tech Demos",
  },
  CAUSTICS: {
    fs: fs_caustics,
    vs: vs_caustics,
    slug: "caustics",
    Component: CausticsScene,
    label: "Caustics",
    category: "Tech Demos",
  },
  POINTS: {
    fs: fs_points,
    vs: vs_points,
    slug: "points",
    Component: PointsScene,
    label: "Points",
    category: "Tech Demos",
  },
  SHADOWS: {
    fs: fs_shadows,
    vs: vs_shadows,
    slug: "shadows",
    Component: ShadowsScene,
    label: "Shadows",
    category: "Tech Demos",
  },
  // METAL_BUNNY: {
  //   fs: fs_metalBunny,
  //   vs: vs_metalBunny,
  //   slug: "metal-bunny",
  //   Component: MetalBunnyScene,
  //   label: "Metal Bunny",
  //   category: "Tech Demos",
  // },
};
