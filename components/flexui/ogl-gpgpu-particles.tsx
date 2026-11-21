"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLGPGPUParticles(props: OGLSceneProps) {
  return <OGLExample {...props} example="gpgpu-particles" />;
}

export { OGLGPGPUParticles as OglGpgpuParticles };
