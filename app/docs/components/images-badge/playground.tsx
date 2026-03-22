"use client";

import { ImagesBadge } from "@/components/ui/images-badge";

export function ImagesBadgePlayground() {
  return (
    <div className="flex items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-950">
      <ImagesBadge
        text="Introducing Agenforce Marketing Template"
        images={[
          "https://assets.aceternity.com/pro/agenforce-1.webp",
          "https://assets.aceternity.com/pro/agenforce-2.webp",
          "https://assets.aceternity.com/pro/agenforce-3.webp",
        ]}
      />
    </div>
  );
}
