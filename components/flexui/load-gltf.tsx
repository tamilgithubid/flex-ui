"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/load-gltf.js";

export type LoadGLTFProps = WebGLComponentProps;

export function LoadGLTF(props: LoadGLTFProps) {
  return <WebGLCanvas {...props} component="load-gltf" title="Load GLTF" scene={scene} />;
}

export { LoadGLTF as LoadGltf };
