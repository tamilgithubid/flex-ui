"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/skydome.js";

export type SkydomeProps = WebGLComponentProps;

export function Skydome(props: SkydomeProps) {
  return <WebGLCanvas {...props} component="skydome" title="Skydome" scene={scene} />;
}
