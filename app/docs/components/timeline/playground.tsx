"use client";

import React from "react";
import { Timeline } from "@/components/ui/timeline";
import { PreviewCodeTabs } from "@/components/docs/preview-code-tabs";

const code = `"use client";

import { Timeline } from "@/components/ui/timeline";

export default function TimelineDemo() {
  const data = [
    {
      title: "2024",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Built and launched new features
          </p>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300"
              alt="feature"
              className="h-20 w-full rounded-lg object-cover md:h-44"
            />
            <img
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300"
              alt="feature"
              className="h-20 w-full rounded-lg object-cover md:h-44"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2023",
      content: (
        <div>
          <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Launched first version
          </p>
          <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
            ✅ Initial release
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}`;

export function TimelinePlayground() {
  const data = [
    {
      title: "2024",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Built and launched FLEX UI and FLEX UI Pro from scratch
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 md:h-44" />
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 md:h-44" />
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 md:h-44" />
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-green-500 to-green-600 md:h-44" />
          </div>
        </div>
      ),
    },
    {
      title: "Early 2023",
      content: (
        <div>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Started working on the timeline component design and implementation.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Created beautiful animations and smooth scroll experiences.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 md:h-44" />
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 md:h-44" />
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 md:h-44" />
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-red-500 to-red-600 md:h-44" />
          </div>
        </div>
      ),
    },
    {
      title: "Changelog",
      content: (
        <div>
          <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Deployed 5 new components on FlexUI today
          </p>
          <div className="mb-8">
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Card grid component
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Timeline component
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Smooth animations
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Responsive design
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
              ✅ Dark mode support
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 md:h-44" />
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-slate-500 to-slate-600 md:h-44" />
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-rose-500 to-rose-600 md:h-44" />
            <div className="h-20 w-full rounded-lg bg-gradient-to-br from-stone-500 to-stone-600 md:h-44" />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <PreviewCodeTabs
        preview={
          <div className="w-full">
            <Timeline data={data} />
          </div>
        }
        code={code}
        filename="timeline-demo.tsx"
      />
    </div>
  );
}
