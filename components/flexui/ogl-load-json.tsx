"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLLoadJSON(props: OGLSceneProps) {
  return <OGLExample {...props} example="load-json" />;
}

export { OGLLoadJSON as OglLoadJson };
