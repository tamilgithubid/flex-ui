"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { ShowcaseGrid } from "@/components/docs/expandable-showcase";

// ─── Basic Timeline ─────────────────────────────────────────────────────────
function BasicTimelinePreview() {
  const data = [
    {
      title: "2024",
      content: (
        <div>
          <p className="text-sm text-neutral-800 dark:text-neutral-200">
            Started working on exciting new projects.
          </p>
        </div>
      ),
    },
    {
      title: "2023",
      content: (
        <div>
          <p className="text-sm text-neutral-800 dark:text-neutral-200">
            Launched first version of the timeline component.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}

// ─── Timeline with Images ──────────────────────────────────────────────────
function TimelineWithImagesPreview() {
  const data = [
    {
      title: "Design Phase",
      content: (
        <div>
          <p className="mb-4 text-sm text-neutral-800 dark:text-neutral-200">
            Created comprehensive design system.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=150&fit=crop"
              alt="design"
              className="h-24 w-full rounded-lg object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200&h=150&fit=crop"
              alt="design"
              className="h-24 w-full rounded-lg object-cover"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Development",
      content: (
        <div>
          <p className="mb-4 text-sm text-neutral-800 dark:text-neutral-200">
            Built and tested features.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=150&fit=crop"
              alt="dev"
              className="h-24 w-full rounded-lg object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=150&fit=crop"
              alt="dev"
              className="h-24 w-full rounded-lg object-cover"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}

// ─── Timeline with Lists ────────────────────────────────────────────────────
function TimelineWithListsPreview() {
  const data = [
    {
      title: "Q1 Updates",
      content: (
        <div>
          <ul className="space-y-2 text-sm text-neutral-800 dark:text-neutral-200">
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span> Feature 1 complete
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span> Feature 2 complete
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✅</span> Testing phase
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "Q2 Goals",
      content: (
        <div>
          <ul className="space-y-2 text-sm text-neutral-800 dark:text-neutral-200">
            <li className="flex items-center gap-2">
              <span className="text-lg">→</span> Release v2.0
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">→</span> Expand documentation
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">→</span> Community engagement
            </li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <Timeline data={data} />
    </div>
  );
}

const examples = [
  {
    id: "timeline-basic",
    title: "Basic Timeline",
    tag: "Default",
    tagColor: "bg-zinc-800 text-zinc-400 border-zinc-700",
    description: "Simple timeline with title and text content.",
    preview: <BasicTimelinePreview />,
    code: `const data = [
  {
    title: "2024",
    content: <p>Started working on exciting projects.</p>
  },
  {
    title: "2023",
    content: <p>Launched first version.</p>
  }
];

<Timeline data={data} />`,
    filename: "basic-timeline.tsx",
  },
  {
    id: "timeline-images",
    title: "Timeline with Images",
    tag: "Media",
    tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    description: "Timeline entries with images displayed in a grid.",
    preview: <TimelineWithImagesPreview />,
    code: `const data = [
  {
    title: "Design Phase",
    content: (
      <div>
        <p>Created comprehensive design system.</p>
        <div className="grid grid-cols-2 gap-3">
          <img src="..." className="h-24 w-full rounded-lg" />
          <img src="..." className="h-24 w-full rounded-lg" />
        </div>
      </div>
    )
  }
];

<Timeline data={data} />`,
    filename: "timeline-images.tsx",
  },
  {
    id: "timeline-lists",
    title: "Timeline with Lists",
    tag: "Content",
    tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    description: "Timeline entries featuring list items with checkmarks.",
    preview: <TimelineWithListsPreview />,
    code: `const data = [
  {
    title: "Q1 Updates",
    content: (
      <ul className="space-y-2">
        <li>✅ Feature 1 complete</li>
        <li>✅ Feature 2 complete</li>
      </ul>
    )
  }
];

<Timeline data={data} />`,
    filename: "timeline-lists.tsx",
  },
];

export function TimelineExamples() {
  return <ShowcaseGrid items={examples} />;
}
