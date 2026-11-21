"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/orbit-controls.js";

export type OrbitControlsProps = WebGLComponentProps;

export function OrbitControls(props: OrbitControlsProps) {
  return <WebGLCanvas {...props} component="orbit-controls" title="Orbit Controls" scene={scene} />;
}
