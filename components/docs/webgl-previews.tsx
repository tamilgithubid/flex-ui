"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { WebGLComponentProps } from "@/components/flexui/webgl-canvas";
import type { WebGLComponentId } from "@/lib/webgl-components";

export const webglPreviews: Record<WebGLComponentId, ComponentType<WebGLComponentProps>> = {
  "skydome": dynamic(() => import("@/components/flexui/skydome").then(module => module.Skydome)),
  "cube-map": dynamic(() => import("@/components/flexui/cube-map").then(module => module.CubeMap)),
  "normal-maps": dynamic(() => import("@/components/flexui/normal-maps").then(module => module.NormalMaps)),
  "point-lighting": dynamic(() => import("@/components/flexui/point-lighting").then(module => module.PointLighting)),
  "pbr": dynamic(() => import("@/components/flexui/pbr").then(module => module.PBR)),
  "shadow-maps": dynamic(() => import("@/components/flexui/shadow-maps").then(module => module.ShadowMaps)),
  "gpgpu-particles": dynamic(() => import("@/components/flexui/gpgpu-particles").then(module => module.GPGPUParticles)),
  "skinning": dynamic(() => import("@/components/flexui/skinning").then(module => module.Skinning)),
  "load-json": dynamic(() => import("@/components/flexui/load-json").then(module => module.LoadJSON)),
  "particles": dynamic(() => import("@/components/flexui/particles").then(module => module.Particles)),
  "polylines": dynamic(() => import("@/components/flexui/polylines").then(module => module.Polylines)),
  "tube": dynamic(() => import("@/components/flexui/tube").then(module => module.Tube)),
  "load-gltf": dynamic(() => import("@/components/flexui/load-gltf").then(module => module.LoadGLTF)),
  "gltf-ktx2-basis": dynamic(() => import("@/components/flexui/gltf-ktx2-basis").then(module => module.GLTFKTX2Basis)),
  "sort-transparency": dynamic(() => import("@/components/flexui/sort-transparency").then(module => module.SortTransparency)),
  "frustum-culling": dynamic(() => import("@/components/flexui/frustum-culling").then(module => module.FrustumCulling)),
  "orbit-controls": dynamic(() => import("@/components/flexui/orbit-controls").then(module => module.OrbitControls)),
  "mouse-flowmap": dynamic(() => import("@/components/flexui/mouse-flowmap").then(module => module.MouseFlowmap)),
};
