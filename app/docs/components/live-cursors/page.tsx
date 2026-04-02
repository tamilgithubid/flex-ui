import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { MousePointer2, Users, Zap, Palette } from "lucide-react";
import { LiveCursorsPlayground } from "./playground";
import { LiveCursorsExamples } from "./examples";

export const metadata: Metadata = {
  title: "Live Cursors — FlexUI",
  description:
    "Real-time cursor positions for collaborative sessions with smooth interpolation and user labels.",
};

export default function LiveCursorsDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-400">
            Collaboration
          </span>
          <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-500">
            Real-time
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          Live Cursors
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          Real-time cursor positions for collaborative sessions. Renders
          smooth, interpolated cursors with user labels and colors — connect
          to any WebSocket or real-time backend by passing cursor data as
          props.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Preview */}
      <DocSection id="preview" title="Preview">
        <LiveCursorsPlayground />
      </DocSection>

      {/* Examples */}
      <DocSection id="examples" title="Examples">
        <LiveCursorsExamples />
      </DocSection>

      {/* Installation */}
      <DocSection id="installation" title="Installation">
        <div className="space-y-3">
          <CodeBlock
            code="npx flexui add live-cursors"
            filename="Terminal"
          />
          <p className="text-sm text-zinc-500">
            Installs the component to{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
              components/flexui/live-cursors.tsx
            </code>
            . No external dependencies — pure React with Framer Motion for smooth
            interpolation.
          </p>
        </div>
      </DocSection>

      {/* Usage */}
      <DocSection id="usage" title="Usage">
        <CodeBlock
          code={`import { LiveCursors } from "@/components/flexui/live-cursors";
import type { CursorData } from "@/components/flexui/live-cursors";

// Connect to your real-time backend (WebSocket, Liveblocks, Supabase, etc.)
const cursors: CursorData[] = [
  { id: "user-1", x: 200, y: 150, name: "Alice", color: "#8b5cf6" },
  { id: "user-2", x: 400, y: 300, name: "Bob", color: "#22d3ee" },
];

export default function CollaborativeCanvas() {
  return (
    <div className="relative h-screen w-full">
      <LiveCursors cursors={cursors} className="pointer-events-none" />
      {/* Your collaborative content */}
    </div>
  );
}`}
          filename="app/page.tsx"
          language="tsx"
        />
      </DocSection>

      {/* What You Get */}
      <DocSection id="what-you-get" title="What You Get">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: <MousePointer2 className="h-4 w-4 text-blue-400" />,
              label: "Smooth Interpolation",
              desc: "Framer Motion spring animations interpolate between cursor positions for fluid 60fps rendering.",
            },
            {
              icon: <Users className="h-4 w-4 text-blue-400" />,
              label: "User Labels",
              desc: "Each cursor displays a color-coded name label that fades in/out based on activity.",
            },
            {
              icon: <Zap className="h-4 w-4 text-blue-400" />,
              label: "Backend Agnostic",
              desc: "Pass cursor data as props — works with WebSockets, Liveblocks, Supabase Realtime, or any provider.",
            },
            {
              icon: <Palette className="h-4 w-4 text-blue-400" />,
              label: "Per-User Colors",
              desc: "Each cursor has its own color for easy identification in multi-user sessions.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="group/card rounded-xl border border-white/[0.06] bg-zinc-950/50 p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-zinc-900/40"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
                {item.icon}
              </div>
              <p className="text-sm font-semibold text-white">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </DocSection>

      {/* API Reference */}
      <DocSection id="api-reference" title="API Reference">
        <DocSubSection id="exports" title="Exports">
          <CodeBlock
            code={`import { LiveCursors } from "@/components/flexui/live-cursors";
import type { CursorData } from "@/components/flexui/live-cursors";`}
            filename="Named exports"
          />
        </DocSubSection>

        <DocSubSection id="cursor-data" title="CursorData Type">
          <CodeBlock
            code={`interface CursorData {
  id: string;       // Unique user identifier
  x: number;        // X position in pixels
  y: number;        // Y position in pixels
  name?: string;    // Display name shown on the cursor label
  color?: string;   // Cursor color (hex string, defaults to random)
}`}
            filename="Type definition"
            language="tsx"
          />
        </DocSubSection>

        <DocSubSection id="props" title="Props">
          <ApiTable
            rows={[
              {
                name: "cursors",
                type: "CursorData[]",
                default: "[]",
                description:
                  "Array of cursor positions and metadata for all active users.",
                required: true,
              },
              {
                name: "className",
                type: "string",
                default: "\u2014",
                description:
                  "Additional CSS classes for the overlay container. Typically set to pointer-events-none.",
              },
            ]}
          />
        </DocSubSection>
      </DocSection>

      {/* Customization */}
      <DocSection id="customization" title="Customization Patterns">
        <DocSubSection id="with-websocket" title="With WebSocket Backend">
          <CodeBlock
            code={`"use client";

import { useEffect, useState } from "react";
import { LiveCursors, CursorData } from "@/components/flexui/live-cursors";

export function CollaborativeEditor() {
  const [cursors, setCursors] = useState<CursorData[]>([]);

  useEffect(() => {
    const ws = new WebSocket("wss://your-server.com/cursors");
    ws.onmessage = (e) => setCursors(JSON.parse(e.data));

    const handleMove = (e: MouseEvent) => {
      ws.send(JSON.stringify({ x: e.clientX, y: e.clientY }));
    };
    window.addEventListener("mousemove", handleMove);

    return () => {
      ws.close();
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return <LiveCursors cursors={cursors} />;
}`}
            filename="WebSocket integration"
            language="tsx"
          />
        </DocSubSection>
      </DocSection>

      {/* Performance */}
      <DocSection id="performance" title="Performance Notes">
        <div className="rounded-xl border border-white/[0.06] bg-zinc-950/50 p-5">
          <ul className="space-y-3 text-sm text-zinc-400">
            {[
              "Cursor positions are animated with Framer Motion springs — no manual RAF loop needed.",
              "Each cursor is a separate motion.div for independent re-renders — adding/removing users is O(1).",
              "Labels use opacity transitions to fade out idle cursors, reducing visual noise.",
              "Use pointer-events-none on the container to prevent cursor overlay from blocking interactions.",
            ].map((note, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-green-500/10 text-[10px] font-bold text-green-400">
                  {i + 1}
                </span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </DocSection>
    </div>
  );
}
