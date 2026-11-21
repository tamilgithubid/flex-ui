"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/shadow-maps.js";

export type ShadowMapsProps = WebGLComponentProps;

export function ShadowMaps(props: ShadowMapsProps) {
  return <WebGLCanvas {...props} component="shadow-maps" title="Shadow Maps" scene={scene} />;
}
