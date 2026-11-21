"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/load-json.js";

export type LoadJSONProps = WebGLComponentProps;

export function LoadJSON(props: LoadJSONProps) {
  return <WebGLCanvas {...props} component="load-json" title="Load JSON" scene={scene} />;
}

export { LoadJSON as LoadJson };
