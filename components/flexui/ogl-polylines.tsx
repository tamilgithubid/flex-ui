"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLPolylines(props: OGLSceneProps) {
  return <OGLExample {...props} example="polylines" />;
}

export { OGLPolylines as OglPolylines };
