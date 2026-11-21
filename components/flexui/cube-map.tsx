"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/cube-map.js";

export type CubeMapProps = WebGLComponentProps;

export function CubeMap(props: CubeMapProps) {
  return <WebGLCanvas {...props} component="cube-map" title="Cube Map" scene={scene} />;
}
