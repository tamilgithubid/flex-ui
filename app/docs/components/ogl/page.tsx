import type { Metadata } from "next";
import { OGLGallery } from "@/components/docs/ogl-gallery";

export const metadata: Metadata = { title: "OGL WebGL Examples", description: "18 original OGL examples with live WebGL previews, complete scene source and local assets." };

export default function OGLExamplesPage() { return <div className="min-w-0 space-y-8"><header><p className="text-sm font-medium text-cyan-400">WebGL / OGL</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-white">OGL examples</h1><p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">Explore the original OGL scenes inside FlexUI. Every example includes its shaders, models, textures, interactive controls and source code.</p></header><OGLGallery /></div>; }
