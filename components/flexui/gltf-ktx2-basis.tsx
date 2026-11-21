"use client";

import { WebGLCanvas, type WebGLComponentProps } from "./webgl-canvas";
import scene from "./webgl/scenes/gltf-ktx2-basis.js";

export type GLTFKTX2BasisProps = WebGLComponentProps;

export function GLTFKTX2Basis(props: GLTFKTX2BasisProps) {
  return <WebGLCanvas {...props} component="gltf-ktx2-basis" title="GLTF KTX2 Basis" scene={scene} />;
}

export { GLTFKTX2Basis as GltfKtx2Basis };
