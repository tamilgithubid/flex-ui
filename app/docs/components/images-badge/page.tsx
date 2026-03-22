import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { InstallTabs } from "@/components/docs/install-tabs";
import { ImagesBadgePlayground } from "./playground";
import { ImagesBadgeExamples } from "./examples";

export const metadata: Metadata = {
  title: "Images Badge — FlexUI",
  description:
    "An animated folder badge component that displays images with a 3D hover effect.",
};

const imagesBadgeSource = `"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ImagesBadgeProps {
  text: string;
  images: string[];
  className?: string;
  href?: string;
  target?: string;
  folderSize?: { width: number; height: number };
  teaserImageSize?: { width: number; height: number };
  hoverImageSize?: { width: number; height: number };
  hoverTranslateY?: number;
  hoverSpread?: number;
  hoverRotation?: number;
}

export function ImagesBadge({
  text,
  images,
  className,
  href,
  target,
  folderSize = { width: 32, height: 24 },
  teaserImageSize = { width: 20, height: 14 },
  hoverImageSize = { width: 48, height: 32 },
  hoverTranslateY = -35,
  hoverSpread = 20,
  hoverRotation = 15,
}: ImagesBadgeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const displayImages = images.slice(0, 3);
  const tabWidth = folderSize.width * 0.375;
  const tabHeight = folderSize.height * 0.25;
  const Component = href ? "a" : "div";

  return (
    <Component
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 perspective-[1000px] transform-3d",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Folder Container */}
      <motion.div
        className="relative"
        style={{
          width: folderSize.width,
          height: folderSize.height,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Folder Back */}
        <div className="absolute inset-0 rounded-[4px] bg-gradient-to-b from-amber-400 to-amber-500 shadow-sm dark:from-amber-500 dark:to-amber-600">
          {/* Folder Tab */}
          <div
            className="absolute left-0.5 rounded-t-[2px] bg-gradient-to-b from-amber-300 to-amber-400 dark:from-amber-400 dark:to-amber-500"
            style={{
              top: -tabHeight * 0.65,
              width: tabWidth,
              height: tabHeight,
            }}
          />
        </div>

        {/* Images that pop out */}
        {displayImages.map((image, index) => {
          const totalImages = displayImages.length;
          const baseRotation =
            totalImages === 1
              ? 0
              : totalImages === 2
                ? (index - 0.5) * hoverRotation
                : (index - 1) * hoverRotation;
          const hoverY = hoverTranslateY - (totalImages - 1 - index) * 3;
          const hoverX =
            totalImages === 1
              ? 0
              : totalImages === 2
                ? (index - 0.5) * hoverSpread
                : (index - 1) * hoverSpread;
          const teaseY = -4 - (totalImages - 1 - index) * 1;
          const teaseRotation =
            totalImages === 1
              ? 0
              : totalImages === 2
                ? (index - 0.5) * 3
                : (index - 1) * 3;

          return (
            <motion.div
              key={index}
              className="absolute top-0.5 left-1/2 origin-bottom overflow-hidden rounded-[3px] bg-white shadow-sm ring-1 shadow-black/10 ring-black/10 dark:bg-neutral-800 dark:shadow-white/10 dark:ring-white/10"
              animate={{
                x: \`calc(-50% + \${isHovered ? hoverX : 0}px)\`,
                y: isHovered ? hoverY : teaseY,
                rotate: isHovered ? baseRotation : teaseRotation,
                width: isHovered ? hoverImageSize.width : teaserImageSize.width,
                height: isHovered ? hoverImageSize.height : teaserImageSize.height,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 25,
                delay: index * 0.03,
              }}
              style={{
                zIndex: 10 + index,
              }}
            >
              <img
                src={image}
                alt={\`Preview \${index + 1}\`}
                className="h-full w-full object-cover"
              />
            </motion.div>
          );
        })}

        {/* Folder Front */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[85%] origin-bottom rounded-[4px] bg-gradient-to-b from-amber-300 to-amber-400 shadow-sm dark:from-amber-400 dark:to-amber-500"
          animate={{
            rotateX: isHovered ? -45 : -25,
            scaleY: isHovered ? 0.8 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 25,
          }}
          style={{
            transformStyle: "preserve-3d",
            zIndex: 20,
          }}
        >
          <div className="absolute top-1 right-1 left-1 h-px bg-amber-200/50 dark:bg-amber-300/50" />
        </motion.div>
      </motion.div>

      {/* Text */}
      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
        {text}
      </span>
    </Component>
  );
}`;

export default function ImagesBadgePage() {
  return (
    <>
      <DocSection>
        <h1>Images Badge</h1>
        <p>
          An animated folder badge component that displays preview images with a 3D hover
          effect. Images fan out when hovered, creating an interactive reveal animation.
        </p>
      </DocSection>

      <DocSection>
        <DocSubSection title="Installation">
          <InstallTabs
            npm="npx shadcn@latest add https://flexui.dev/r/images-badge.json"
            yarn="npx shadcn@latest add https://flexui.dev/r/images-badge.json"
            pnpm="pnpm dlx shadcn@latest add https://flexui.dev/r/images-badge.json"
          />
        </DocSubSection>
      </DocSection>

      <DocSection>
        <DocSubSection title="Usage">
          <CodeBlock
            code={`import { ImagesBadge } from "@/components/ui/images-badge";

export default function Demo() {
  return (
    <ImagesBadge
      text="New Release"
      images={[
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
        "https://example.com/image3.jpg",
      ]}
    />
  );
}`}
            language="tsx"
          />
        </DocSubSection>
      </DocSection>

      <DocSection>
        <DocSubSection title="Playground">
          <ImagesBadgePlayground />
        </DocSubSection>
      </DocSection>

      <DocSection>
        <DocSubSection title="Examples">
          <ImagesBadgeExamples />
        </DocSubSection>
      </DocSection>

      <DocSection>
        <DocSubSection title="API Reference">
          <ApiTable
            rows={[
              {
                name: "text",
                type: "string",
                default: "—",
                description: "Display text beside the folder badge",
                required: true,
              },
              {
                name: "images",
                type: "string[]",
                default: "—",
                description: "Array of image URLs (max 3 displayed)",
                required: true,
              },
              {
                name: "href",
                type: "string",
                default: "undefined",
                description: "Optional link URL",
                required: false,
              },
              {
                name: "target",
                type: "string",
                default: "undefined",
                description: 'Link target (e.g., "_blank")',
                required: false,
              },
              {
                name: "folderSize",
                type: "{ width: number; height: number }",
                default: "{ width: 32, height: 24 }",
                description: "Folder dimensions in pixels",
                required: false,
              },
              {
                name: "hoverImageSize",
                type: "{ width: number; height: number }",
                default: "{ width: 48, height: 32 }",
                description: "Image size on hover",
                required: false,
              },
              {
                name: "hoverTranslateY",
                type: "number",
                default: "-35",
                description: "Vertical translation on hover (pixels)",
                required: false,
              },
              {
                name: "hoverSpread",
                type: "number",
                default: "20",
                description: "Horizontal spread distance on hover (pixels)",
                required: false,
              },
              {
                name: "hoverRotation",
                type: "number",
                default: "15",
                description: "Rotation angle for fanned images (degrees)",
                required: false,
              },
              {
                name: "className",
                type: "string",
                default: "undefined",
                description: "Additional CSS classes",
                required: false,
              },
            ]}
          />
        </DocSubSection>
      </DocSection>

      <DocSection>
        <DocSubSection title="Component Code">
          <CodeBlock code={imagesBadgeSource} language="tsx" />
        </DocSubSection>
      </DocSection>
    </>
  );
}
