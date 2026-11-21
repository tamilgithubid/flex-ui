"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/tube.js";

export type TubeProps = WebGLComponentProps;

export function Tube(props: TubeProps) {
  return <WebGLCanvas {...props} component="tube" title="Tube" scene={scene} />;
}
