"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/point-lighting.js";

export type PointLightingProps = WebGLComponentProps;

export function PointLighting(props: PointLightingProps) {
  return <WebGLCanvas {...props} component="point-lighting" title="Point Lighting" scene={scene} />;
}
