"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/pbr.js";

export type PBRProps = WebGLComponentProps;

export function PBR(props: PBRProps) {
  return <WebGLCanvas {...props} component="pbr" title="PBR" scene={scene} />;
}

export { PBR as Pbr };
