"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLFrustumCulling(props: OGLSceneProps) {
  return <OGLExample {...props} example="frustum-culling" />;
}

export { OGLFrustumCulling as OglFrustumCulling };
