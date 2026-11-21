"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/frustum-culling.js";

export type FrustumCullingProps = WebGLComponentProps;

export function FrustumCulling(props: FrustumCullingProps) {
  return <WebGLCanvas {...props} component="frustum-culling" title="Frustum Culling" scene={scene} />;
}
