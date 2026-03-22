import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { InstallTabs } from "@/components/docs/install-tabs";
import { TimelinePlayground } from "./playground";
import { TimelineExamples } from "./examples";

export const metadata: Metadata = {
  title: "Timeline — FlexUI",
  description:
    "An animated vertical timeline component with scroll-triggered animations and timeline entries with title and content.",
};

const timelineSource = `"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  // Timeline implementation with scroll animation
  // Full source: npx shadcn@latest add @flexui/timeline`;

export default function TimelineDoc() {
  return (
    <div className="min-w-0 flex-1 space-y-14">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-400">
            Tier 1
          </span>
          <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-zinc-500">
            Animated
          </span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight text-white">
          Timeline
        </h1>
        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-zinc-400">
          An animated vertical timeline component that displays a series of events or milestones. The timeline animates based on scroll position, revealing entries as you scroll down the page.
        </p>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Preview */}
      <DocSection id="preview" title="Preview">
        <TimelinePlayground />
      </DocSection>

      {/* Examples */}
      <DocSection id="examples" title="Examples">
        <TimelineExamples />
      </DocSection>

      {/* Installation */}
      <DocSection id="installation" title="Installation">
        <InstallTabs
          cli={
            <div className="space-y-3">
              <CodeBlock
                code="npx shadcn@latest add @flexui/timeline"
                filename="Terminal"
              />
              <p className="text-sm text-zinc-500">
                Installs{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
                  framer-motion
                </code>{" "}
                and writes both components to{" "}
                <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-zinc-300">
                  components/
                </code>
                .
              </p>
            </div>
          }
          manual={
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-300">
                  1. Install dependencies
                </p>
                <CodeBlock
                  code="npm install framer-motion"
                  filename="Terminal"
                />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-300">
                  2. Copy component source
                </p>
                <CodeBlock
                  code={timelineSource}
                  filename="components/ui/timeline.tsx"
                  language="tsx"
                />
              </div>
            </div>
          }
        />
      </DocSection>

      {/* What You Get */}
      <DocSection id="what-you-get" title="What You Get">
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              icon: "⧉",
              label: "Scroll Animation",
              desc: "Timeline animates based on scroll position, with smooth progress tracking through the entire timeline.",
            },
            {
              icon: "●",
              label: "Timeline Dots",
              desc: "Styled timeline markers with gradient effect that appears as users scroll through the timeline.",
            },
            {
              icon: "≡",
              label: "Vertical Layout",
              desc: "Responsive design that switches from single column on mobile to multi-column on tablet and desktop.",
            },
            {
              icon: "✦",
              label: "Flexible Content",
              desc: "Each timeline entry accepts any React content - text, images, lists, or custom components.",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="group/card rounded-xl border border-white/[0.06] bg-zinc-950/50 p-5 transition-all duration-300 hover:border-white/[0.1] hover:bg-zinc-900/40"
            >
              <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-sm font-bold text-blue-400">
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
            code={`import { Timeline } from "@/components/ui/timeline";\nimport { TimelineDemo } from "@/components/flexui/timeline";`}
            filename="Named exports"
          />
        </DocSubSection>

        <DocSubSection id="timeline-props" title="Timeline Props">
          <ApiTable
            rows={[
              {
                name: "data",
                type: "TimelineEntry[]",
                default: "\u2014",
                description: "Array of timeline entries containing title and content.",
                required: true,
              },
            ]}
          />
        </DocSubSection>

        <DocSubSection id="timeline-entry" title="TimelineEntry Interface">
          <ApiTable
            rows={[
              {
                name: "title",
                type: "string",
                default: "\u2014",
                description: "The title text for this timeline entry.",
                required: true,
              },
              {
                name: "content",
                type: "React.ReactNode",
                default: "\u2014",
                description: "The content to display for this timeline entry.",
                required: true,
              },
            ]}
          />
        </DocSubSection>
      </DocSection>
    </div>
  );
}
