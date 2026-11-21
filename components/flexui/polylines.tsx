"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/polylines.js";

export type PolylinesProps = WebGLComponentProps;

export function Polylines(props: PolylinesProps) {
  return <WebGLCanvas {...props} component="polylines" title="Polylines" scene={scene} />;
}
