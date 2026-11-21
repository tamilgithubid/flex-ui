"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLSkydome(props: OGLSceneProps) {
  return <OGLExample {...props} example="skydome" />;
}

export { OGLSkydome as OglSkydome };
