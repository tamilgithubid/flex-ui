"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLParticles(props: OGLSceneProps) {
  return <OGLExample {...props} example="particles" />;
}

export { OGLParticles as OglParticles };
