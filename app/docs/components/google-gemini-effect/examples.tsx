"use client";

import { useScroll, useTransform } from "motion/react";
import React from "react";
import { GoogleGeminiEffect } from "@/components/ui/google-gemini-effect";
import { GoogleGeminiEffectPlayground } from "./playground";

export function GoogleGeminiEffectExamples() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-4">
          Default Example
        </p>
        <GoogleGeminiEffectPlayground />
      </div>
    </div>
  );
}
