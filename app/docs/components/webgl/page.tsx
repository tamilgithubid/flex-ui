import type { Metadata } from "next";
import { WebGLGallery } from "@/components/docs/webgl-gallery";

export const metadata: Metadata = { title: "WebGL Components", description: "Interactive FlexUI WebGL components with live previews, React source, shaders and installation." };

export default function WebGLComponentsPage() {
  return <div className="min-w-0 space-y-8"><header><p className="text-sm font-medium text-cyan-400">FlexUI / Components</p><h1 className="mt-2 text-4xl font-bold tracking-tight text-white">WebGL components</h1><p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">Bring depth, motion and interaction to your interface. Explore live previews, copy the source and customize every scene.</p></header><WebGLGallery /></div>;
}
