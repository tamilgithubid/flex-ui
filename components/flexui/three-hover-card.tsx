"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface ThreeHoverCardProps {
  imageSrc?: string;
  imageAlt?: string;
  /** Use contain to keep the complete photograph visible. */
  imageFit?: "cover" | "contain";
  imagePosition?: string;
  title?: string;
  description?: string;
  height?: CSSProperties["height"];
  className?: string;
  children?: ReactNode;
}

export function ThreeHoverCard({
  imageSrc = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&h=1200&fit=crop&crop=faces",
  imageAlt = "Portrait",
  imageFit = "contain",
  imagePosition = "center",
  title = "Interactive 3D",
  description = "Hover to reveal a cinematic glass border with 3D depth effect.",
  height,
  className,
  children,
}: ThreeHoverCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spring = { stiffness: 180, damping: 26, mass: 0.65 };
  const smoothX = useSpring(mouseX, spring);
  const smoothY = useSpring(mouseY, spring);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);
  const shine = useTransform([smoothX, smoothY], ([x, y]) =>
    "radial-gradient(600px circle at " + ((x as number) + 0.5) * 100 + "% " +
    ((y as number) + 0.5) * 100 + "%, rgba(255,255,255,0.16), transparent 65%)"
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => { boundsRef.current = container.getBoundingClientRect(); };
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    measure();
    return () => observer.disconnect();
  }, []);

  const reset = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  }, [mouseX, mouseY]);

  const move = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = boundsRef.current;
    if (!bounds || !bounds.width || !bounds.height) return;
    mouseX.set(Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5)));
    mouseY.set(Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5)));
  }, [reducedMotion, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      data-three-hover-card=""
      className={cn("group/card relative h-[400px] w-full", className)}
      style={{ height, perspective: 1200 }}
      onPointerEnter={event => {
        boundsRef.current = event.currentTarget.getBoundingClientRect();
        if (event.pointerType !== "touch") setHovered(true);
      }}
      onPointerMove={move}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      <motion.div
        data-card-surface=""
        className="relative h-full w-full overflow-hidden rounded-[24px] border border-white/10 bg-zinc-950 shadow-2xl"
        style={{ rotateX: reducedMotion ? 0 : rotateX, rotateY: reducedMotion ? 0 : rotateY }}
      >
        {/* A soft backdrop fills wide layouts without cropping the main photograph. */}
        <div
          aria-hidden="true"
          className="absolute -inset-4 bg-cover bg-center opacity-35 blur-xl"
          style={{ backgroundImage: "url(" + JSON.stringify(imageSrc) + ")" }}
        />
        <motion.img
          src={imageSrc}
          alt={imageAlt}
          draggable={false}
          className="absolute inset-0 h-full w-full"
          style={{ objectFit: imageFit, objectPosition: imagePosition }}
          animate={{ scale: hovered && imageFit === "cover" && !reducedMotion ? 1.025 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/95 via-black/65 to-transparent" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: shine }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-300">Perspective / 01</p>
          <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h3>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-zinc-300">{description}</p>
          {children}
        </div>
        <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[10px] font-medium text-white/80 backdrop-blur-md">
          {hovered ? "Live" : "Explore"}
        </span>
      </motion.div>
    </div>
  );
}
