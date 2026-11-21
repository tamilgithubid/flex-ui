"use client";

import { OGLExample, type OGLSceneProps } from "./ogl-example";

export function OGLLoadGLTF(props: OGLSceneProps) {
  return <OGLExample {...props} example="load-gltf" />;
}

export { OGLLoadGLTF as OglLoadGltf };
