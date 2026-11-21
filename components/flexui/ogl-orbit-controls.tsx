"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLOrbitControls(props: OGLSceneProps) {
  return <OGLExample {...props} example="orbit-controls" />;
}

export { OGLOrbitControls as OglOrbitControls };
