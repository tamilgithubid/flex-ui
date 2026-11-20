"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Layers } from "lucide-react";

export interface LiquidSlide {
  id: string | number;
  title: string;
  subtitle?: string;
  image: string;
  tag?: string;
}

export interface LiquidRippleSliderProps {
  slides?: LiquidSlide[];
  className?: string;
  autoPlayInterval?: number;
}

const defaultSlides: LiquidSlide[] = [
  {
    id: 1,
    title: "Quantum Neural Architecture",
    subtitle: "Real-time AI interface rendering & fluid physics",
    image: "/templates/assets/blog_cover_ai.jpg",
    tag: "Spatial AI",
  },
  {
    id: 2,
    title: "Design Systems & UI Engineering",
    subtitle: "Unified design tokens with dynamic glassmorphism",
    image: "/templates/assets/blog_cover_design.jpg",
    tag: "UI Engineering",
  },
  {
    id: 3,
    title: "Aurum Chronograph Series",
    subtitle: "Luxury dark titanium aesthetic with precision acoustics",
    image: "/templates/assets/ecom_watch.jpg",
    tag: "Luxury Tech",
  },
  {
    id: 4,
    title: "AuraFlow Studio ANC",
    subtitle: "Acoustic spatial clarity with active noise elimination",
    image: "/templates/assets/ecom_headphones.jpg",
    tag: "Audio Hardware",
  },
];

export function LiquidRippleSlider({
  slides = defaultSlides,
  className,
  autoPlayInterval = 6000,
}: LiquidRippleSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, autoPlayInterval, slides.length]);

  const handlePointerDown = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { id: Date.now(), x, y };
    setRipples((prev) => [...prev.slice(-4), newRipple]);
  };

  const nextSlide = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) handlePointerDown(e);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e?: React.MouseEvent<HTMLElement>) => {
    if (e) handlePointerDown(e);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const activeSlide = slides[currentIndex];

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-6 md:p-12 min-h-[540px] select-none",
        className
      )}
    >
      {/* Ambient background lighting */}
      <div className="pointer-events-none absolute h-[400px] w-[700px] rounded-full bg-cyan-500/10 blur-[160px]" />

      {/* Main Slider Display Window */}
      <div
        onClick={handlePointerDown}
        className="group relative h-[400px] w-full max-w-4xl cursor-pointer overflow-hidden rounded-3xl border border-white/15 bg-zinc-950 shadow-2xl backdrop-blur-xl"
      >
        {/* Animated Slide Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id}
            initial={{ opacity: 0, scale: 1.1, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.94, filter: "blur(8px)" }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
            className="absolute inset-0"
          >
            <img
              src={activeSlide.image}
              alt={activeSlide.title}
              className="h-full w-full object-cover"
            />
            {/* Cinematic Gradient Mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-zinc-950/20" />
          </motion.div>
        </AnimatePresence>

        {/* Interactive Ripple Shockwaves */}
        <AnimatePresence>
          {ripples.map((r) => (
            <motion.div
              key={r.id}
              initial={{ scale: 0, opacity: 0.9 }}
              animate={{ scale: 4.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              style={{ left: r.x, top: r.y }}
              className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 h-44 w-44 rounded-full border-2 border-cyan-400/80 bg-cyan-400/20 blur-md z-30"
            />
          ))}
        </AnimatePresence>

        {/* Foreground Content Card */}
        <div className="absolute inset-0 flex flex-col justify-between p-8 z-20">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-400 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5" />
              {activeSlide.tag || "Liquid Distortion"}
            </span>

            <span className="rounded-xl border border-white/10 bg-zinc-950/80 px-3.5 py-1.5 font-mono text-xs font-bold text-cyan-300 backdrop-blur-md">
              0{currentIndex + 1} / 0{slides.length}
            </span>
          </div>

          <div className="max-w-xl">
            <motion.h3
              key={`title-${activeSlide.id}`}
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-2xl md:text-4xl font-extrabold tracking-tight text-white leading-tight"
            >
              {activeSlide.title}
            </motion.h3>
            {activeSlide.subtitle && (
              <motion.p
                key={`sub-${activeSlide.id}`}
                initial={{ y: 15, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mt-2 text-xs md:text-sm text-zinc-300 font-light leading-relaxed"
              >
                {activeSlide.subtitle}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Controls & Thumbnail Row */}
      <div className="mt-6 flex items-center justify-between w-full max-w-4xl">
        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-300 transition-colors hover:border-cyan-500/40 hover:bg-zinc-800 hover:text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-cyan-400 transition-colors hover:border-cyan-500/40 hover:bg-zinc-800"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={nextSlide}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-zinc-300 transition-colors hover:border-cyan-500/40 hover:bg-zinc-800 hover:text-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Thumbnail Cards */}
        <div className="hidden sm:flex items-center gap-3">
          {slides.map((slide, idx) => (
            <button
              key={slide.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative h-12 w-20 overflow-hidden rounded-xl border transition-all duration-300",
                idx === currentIndex
                  ? "border-cyan-400 ring-2 ring-cyan-400/40 scale-105"
                  : "border-white/10 opacity-60 hover:opacity-100"
              )}
            >
              <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
