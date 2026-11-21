"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/sort-transparency.js";

export type SortTransparencyProps = WebGLComponentProps;

export function SortTransparency(props: SortTransparencyProps) {
  return <WebGLCanvas {...props} component="sort-transparency" title="Sort Transparency" scene={scene} />;
}
