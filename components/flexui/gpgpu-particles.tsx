"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/gpgpu-particles.js";

export type GPGPUParticlesProps = WebGLComponentProps;

export function GPGPUParticles(props: GPGPUParticlesProps) {
  return <WebGLCanvas {...props} component="gpgpu-particles" title="GPGPU Particles" scene={scene} />;
}

export { GPGPUParticles as GpgpuParticles };
