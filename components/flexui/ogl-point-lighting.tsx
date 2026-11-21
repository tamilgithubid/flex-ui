"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLPointLighting(props: OGLSceneProps) {
  return <OGLExample {...props} example="point-lighting" />;
}

export { OGLPointLighting as OglPointLighting };
