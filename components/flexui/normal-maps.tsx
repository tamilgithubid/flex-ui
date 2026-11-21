"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/normal-maps.js";

export type NormalMapsProps = WebGLComponentProps;

export function NormalMaps(props: NormalMapsProps) {
  return <WebGLCanvas {...props} component="normal-maps" title="Normal Maps" scene={scene} />;
}
