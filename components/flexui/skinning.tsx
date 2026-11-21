"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/skinning.js";

export type SkinningProps = WebGLComponentProps;

export function Skinning(props: SkinningProps) {
  return <WebGLCanvas {...props} component="skinning" title="Skinning" scene={scene} />;
}
