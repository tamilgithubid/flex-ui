import type { Metadata } from "next";
import { CodeBlock } from "@/components/ui/code-block";
import { DocSection, DocSubSection } from "@/components/docs/doc-section";
import { ApiTable } from "@/components/docs/api-table";
import { InstallTabs } from "@/components/docs/install-tabs";
import { GoogleGeminiEffectPlayground } from "./playground";
import { GoogleGeminiEffectExamples } from "./examples";

export const metadata: Metadata = {
  title: "Google Gemini Effect — FlexUI",
  description:
    "An animated SVG path effect synchronized with scroll progress, creating dynamic wave animations.",
};

const googleGeminiEffectSource = `"use client";
import { cn } from "@/lib/utils";
import { motion, MotionValue } from "motion/react";
import React from "react";

const transition = {
  duration: 0,
  ease: "linear" as const,
};

export const GoogleGeminiEffect = ({
  pathLengths,
  title,
  description,
  className,
}: {
  pathLengths: MotionValue[];
  title?: string;
  description?: string;
  className?: string;
}) => {
  return (
    <div className={cn("sticky top-80", className)}>
      <p className="text-lg md:text-7xl font-normal pb-4 text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-100 to-neutral-300">
        {title || \`Build with FLEX UI\`}
      </p>
      <p className="text-xs md:text-xl font-normal text-center text-neutral-400 mt-4 max-w-lg mx-auto">
        {description ||
          \`Scroll this component and see the bottom SVG come to life wow this
        works!\`}
      </p>
      <div className="w-full h-[890px] -top-60 md:-top-40  flex items-center justify-center bg-red-transparent absolute ">
        <button className="font-bold bg-white rounded-full md:px-4 md:py-2 px-2 py-1 md:mt-24 mt-8 z-30 md:text-base text-black text-xs  w-fit mx-auto ">
        Flex-UI
        </button>
      </div>
      <svg
        width="1440"
        height="890"
        viewBox="0 0 1440 890"
        xmlns="http://www.w3.org/2000/svg"
        className=" absolute -top-60  md:-top-40 w-full"
      >
        {/* SVG paths with motion animations */}
        {/* ... SVG content ... */}
      </svg>
    </div>
  );
};`;

export default function GoogleGeminiEffectPage() {
  return (
    <>
      <DocSection>
        <h1>Google Gemini Effect</h1>
        <p>
          An animated SVG path effect synchronized with scroll progress. Creates dynamic wave
          animations with multiple colored strokes that animate based on scroll position.
        </p>
      </DocSection>

      <DocSection>
        <DocSubSection title="Installation">
          <InstallTabs
            npm="npx shadcn@latest add https://flexui.dev/r/google-gemini-effect.json"
            yarn="npx shadcn@latest add https://flexui.dev/r/google-gemini-effect.json"
            pnpm="pnpm dlx shadcn@latest add https://flexui.dev/r/google-gemini-effect.json"
          />
        </DocSubSection>
      </DocSection>

      <DocSection>
        <DocSubSection title="Usage">
          <CodeBlock
            code={`"use client";
import { useScroll, useTransform } from "motion/react";
import React from "react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";

export default function Demo() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);

  return (
    <div className="h-[400vh] bg-black w-full rounded-md relative pt-40" ref={ref}>
      <GoogleGeminiEffect
        pathLengths={[
          pathLengthFirst,
          pathLengthSecond,
          pathLengthThird,
          pathLengthFourth,
          pathLengthFifth,
        ]}
      />
    </div>
  );
}`}
            language="tsx"
          />
        </DocSubSection>
      </DocSection>

      <DocSection>
        <DocSubSection title="Playground">
          <GoogleGeminiEffectPlayground />
        </DocSubSection>
      </DocSection>

      <DocSection>
        <DocSubSection title="Examples">
          <GoogleGeminiEffectExamples />
        </DocSubSection>
      </DocSection>

      <DocSection>
        <DocSubSection title="API Reference">
          <ApiTable
            rows={[
              {
                name: "pathLengths",
                type: "MotionValue[]",
                default: "—",
                description: "Array of MotionValue objects controlling each SVG path animation",
                required: true,
              },
              {
                name: "title",
                type: "string",
                default: "'Build with Flex UI'",
                description: "Main heading text",
                required: false,
              },
              {
                name: "description",
                type: "string",
                default: "'Scroll this component...'",
                description: "Subtitle text with instructions",
                required: false,
              },
              {
                name: "className",
                type: "string",
                default: "undefined",
                description: "Additional CSS classes for container",
                required: false,
              },
            ]}
          />
        </DocSubSection>
      </DocSection>

      <DocSection>
        <DocSubSection title="Component Code">
          <CodeBlock code={googleGeminiEffectSource} language="tsx" />
        </DocSubSection>
      </DocSection>
    </>
  );
}
