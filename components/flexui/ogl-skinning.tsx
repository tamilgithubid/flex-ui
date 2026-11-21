"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLSkinning(props: OGLSceneProps) {
  return <OGLExample {...props} example="skinning" />;
}

export { OGLSkinning as OglSkinning };
