"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLShadowMaps(props: OGLSceneProps) {
  return <OGLExample {...props} example="shadow-maps" />;
}

export { OGLShadowMaps as OglShadowMaps };
