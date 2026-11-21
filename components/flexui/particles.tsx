"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/particles.js";

export type ParticlesProps = WebGLComponentProps;

export function Particles(props: ParticlesProps) {
  return <WebGLCanvas {...props} component="particles" title="Particles" scene={scene} />;
}
