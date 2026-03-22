"use client";

import { ImagesBadge } from "@/components/ui/images-badge";

export function ImagesBadgeExamples() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
          Default
        </p>
        <div className="flex h-20 w-full items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
          <ImagesBadge
            text="New Release"
            images={[
              "https://assets.aceternity.com/pro/agenforce-1.webp",
              "https://assets.aceternity.com/pro/agenforce-2.webp",
              "https://assets.aceternity.com/pro/agenforce-3.webp",
            ]}
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
          With Link
        </p>
        <div className="flex h-20 w-full items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
          <ImagesBadge
            text="Check it out"
            href="https://example.com"
            target="_blank"
            images={[
              "https://assets.aceternity.com/pro/agenforce-1.webp",
              "https://assets.aceternity.com/pro/agenforce-2.webp",
              "https://assets.aceternity.com/pro/agenforce-3.webp",
            ]}
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
          Smaller Size
        </p>
        <div className="flex h-20 w-full items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950">
          <ImagesBadge
            text="Compact"
            images={[
              "https://assets.aceternity.com/pro/agenforce-1.webp",
              "https://assets.aceternity.com/pro/agenforce-2.webp",
            ]}
            folderSize={{ width: 24, height: 18 }}
            teaserImageSize={{ width: 15, height: 10 }}
            hoverImageSize={{ width: 36, height: 24 }}
          />
        </div>
      </div>
    </div>
  );
}
