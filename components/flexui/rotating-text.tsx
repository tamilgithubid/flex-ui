"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface RotatingTextProps {
  words: string[];
  duration?: number;
  direction?: "up" | "down";
  /** Typography and color of the word. */
  className?: string;
  /** Layout classes for the non-painting size reservation. */
  containerClassName?: string;
}

export function RotatingText({
  words, duration = 2000, direction = "up", className, containerClassName,
}: RotatingTextProps) {
  const [index, setIndex] = useState(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || words.length < 2) return;
    const timer = setInterval(() => setIndex(previous => previous + 1), Math.max(600, duration));
    return () => clearInterval(timer);
  }, [duration, reducedMotion, words.length]);

  if (!words.length) return null;
  const word = words[(reducedMotion ? 0 : index) % words.length];
  const offset = direction === "up" ? "105%" : "-105%";

  return (
    <span data-rotating-slot="" className={cn("relative inline-grid overflow-hidden align-bottom leading-[1.15]", containerClassName)}>
      {/* Keep the slot unpainted: a parent text mask can include hidden sizing words. */}
      {/* Reserve the widest word so the surrounding headline never shifts. */}
      {words.map((value, position) => (
        <span
          key={position}
          data-rotating-measure=""
          aria-hidden="true"
          className={cn("col-start-1 row-start-1 whitespace-nowrap", className)}
          style={{ visibility: "hidden", opacity: 0, pointerEvents: "none" }}
        >{value}</span>
      ))}
      <span className="sr-only">{words[0]}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={reducedMotion ? "static" : index}
          aria-hidden="true"
          data-rotating-word=""
          initial={{ y: offset, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: direction === "up" ? "-105%" : "105%", opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
          className={cn("absolute inset-0 flex items-center justify-center whitespace-nowrap", className)}
        >{word}</motion.span>
      </AnimatePresence>
    </span>
  );
}
