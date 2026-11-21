"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLPBR(props: OGLSceneProps) {
  return <OGLExample {...props} example="pbr" />;
}

export { OGLPBR as OglPbr };
