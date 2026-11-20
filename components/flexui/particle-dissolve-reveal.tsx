"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sparkles, RefreshCw, Sliders, Zap } from "lucide-react";

export interface ParticleDissolveRevealProps {
  title?: string;
  subtitle?: string;
  image?: string;
  category?: string;
  className?: string;
}

export function ParticleDissolveReveal({
  title = "Quantum Particle Disintegration",
  subtitle = "High-velocity pixel physics engine with smooth orbital particle dispersion",
  image = "/templates/assets/blog_cover_ai.jpg",
  category = "Physics Engine",
  className,
}: ParticleDissolveRevealProps) {
  const [isDissolved, setIsDissolved] = useState(false);
  const [particleCount, setParticleCount] = useState(80);

  // Generate deterministic particles layout with orbital momentum
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 260 + 80;
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 0.9 + 0.5,
      color:
        i % 4 === 0
          ? "#06b6d4"
          : i % 3 === 0
          ? "#a855f7"
          : i % 2 === 0
          ? "#ec4899"
          : "#3b82f6",
    };
  });

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-6 md:p-12 min-h-[520px] select-none",
        className
      )}
    >
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute h-[400px] w-[600px] rounded-full bg-pink-500/10 blur-[160px]" />

      {/* Main Outer Display Card */}
      <div className="relative h-[390px] w-full max-w-md overflow-hidden rounded-3xl border border-white/15 bg-zinc-950 p-6 shadow-2xl backdrop-blur-xl">
        <AnimatePresence>
          {!isDissolved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 1.08,
                filter: "blur(16px) brightness(150%)",
                transition: { duration: 0.4 },
              }}
              className="relative h-full w-full flex flex-col justify-between"
            >
              {/* Header Image */}
              <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-xl">
                <img
                  src={image}
                  alt={title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 backdrop-blur-md">
                  {category}
                </span>
              </div>

              {/* Text Information */}
              <div className="my-auto space-y-1">
                <h3 className="text-xl font-black text-white leading-tight">
                  {title}
                </h3>
                <p className="text-xs leading-relaxed text-zinc-400 font-light">
                  {subtitle}
                </p>
              </div>

              {/* Dissolve Trigger Button */}
              <button
                onClick={() => setIsDissolved(true)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 py-3 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]"
              >
                <Sparkles className="h-4 w-4" />
                Trigger Pixel Dissolve
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Particles Burst Engine */}
        {isDissolved && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{
                  x: p.x,
                  y: p.y,
                  opacity: 0,
                  scale: 0,
                }}
                transition={{
                  duration: p.duration,
                  ease: [0.25, 1, 0.5, 1],
                }}
                style={{
                  backgroundColor: p.color,
                  width: p.size,
                  height: p.size,
                  boxShadow: `0 0 12px ${p.color}`,
                }}
                className="absolute rounded-full"
              />
            ))}

            {/* Reassembly State UI */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center z-20 space-y-3 p-4"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-bold text-purple-300 backdrop-blur-md">
                <Zap className="h-4 w-4 text-purple-400" />
                Disintegrated into {particleCount} Pixels
              </span>
              <p className="text-xs text-zinc-400 font-light">
                Card layout pixels converted into high-velocity orbital particle field.
              </p>

              <button
                onClick={() => setIsDissolved(false)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-zinc-900 px-6 py-3 text-xs font-bold text-white transition-all hover:border-cyan-500/40 hover:bg-zinc-800"
              >
                <RefreshCw className="h-4 w-4 text-cyan-400" />
                Reassemble Card
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
