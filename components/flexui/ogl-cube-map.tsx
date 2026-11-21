"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLCubeMap(props: OGLSceneProps) {
  return <OGLExample {...props} example="cube-map" />;
}

export { OGLCubeMap as OglCubeMap };
