"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLTube(props: OGLSceneProps) {
  return <OGLExample {...props} example="tube" />;
}

export { OGLTube as OglTube };
