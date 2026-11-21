"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/mouse-flowmap.js";

export type MouseFlowmapProps = WebGLComponentProps;

export function MouseFlowmap(props: MouseFlowmapProps) {
  return <WebGLCanvas {...props} component="mouse-flowmap" title="Mouse Flowmap" scene={scene} />;
}
