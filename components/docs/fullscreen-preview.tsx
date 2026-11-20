"use client";

import { useClientReady } from "@/hooks/use-client-ready";

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface FullscreenPreviewProps {
  /** The component to render fullscreen */
  children: (props: { isFullscreen: boolean }) => React.ReactNode;
  /** Component title shown in fullscreen header */
  title: string;
  /** Component badge/tier label */
  badge?: string;
  /** Badge color class */
  badgeColor?: string;
  /** Accent color for UI elements */
  accentColor?: string;
  /** Optional bottom controls rendered in fullscreen */
  controls?: React.ReactNode;
}

/**
 * Fullscreen Preview
 *
 * Wraps any component with a "Live Preview" button. When clicked,
 * opens a cinematic fullscreen overlay with the component rendered
 * at full viewport size. Includes title bar, close button, and
 * optional controls. ESC key or button to exit.
 */
export function FullscreenPreview({
  children,
  title,
  badge = "3D",
  badgeColor = "bg-orange-500/10 text-orange-400 border-orange-500/20",
  accentColor = "#A78BFA",
  controls,
}: FullscreenPreviewProps) {
  const [open, setOpen] = useState(false);
  const mounted = useClientReady();


  // ESC key handler
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const openFullscreen = useCallback(() => setOpen(true), []);
  const closeFullscreen = useCallback(() => setOpen(false), []);

  // Live Preview button
  const trigger = (
    <button
      onClick={openFullscreen}
      className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
      style={{
        background: `linear-gradient(135deg, ${accentColor}18, ${accentColor}08)`,
        border: `1px solid ${accentColor}25`,
        color: accentColor,
      }}
    >
      {/* Animated glow */}
      <span
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${accentColor}15, transparent 70%)`,
        }}
      />
      {/* Play icon */}
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${accentColor}20` }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className="relative flex flex-col items-start">
        <span className="text-xs font-bold tracking-wide">Live Preview</span>
        <span className="text-[10px] font-medium opacity-50">Fullscreen Experience</span>
      </span>
      {/* Expand icon */}
      <span className="relative ml-2 opacity-40 transition-opacity group-hover:opacity-80">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </span>
    </button>
  );

  // Fullscreen overlay
  const overlay = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[99999] flex flex-col"
          style={{ background: "#050507" }}
        >
          {/* Top bar */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="relative z-10 flex items-center justify-between px-6 py-4"
            style={{ background: "rgba(5,5,7,0.8)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="flex items-center gap-3">
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${badgeColor}`}>
                {badge}
              </span>
              <span className="text-sm font-bold text-white/90">{title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-medium uppercase tracking-widest text-white/20">
                ESC to close
              </span>
              <button
                onClick={closeFullscreen}
                className="flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200 hover:bg-white/10"
                style={{ color: "white" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>

          {/* Component area — full viewport */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative flex-1 overflow-hidden"
          >
            {children({ isFullscreen: true })}
          </motion.div>

          {/* Bottom controls bar */}
          {controls && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="relative z-10 flex items-center justify-center gap-4 px-6 py-4"
              style={{ background: "rgba(5,5,7,0.8)", backdropFilter: "blur(12px)", borderTop: "1px solid rgba(255,255,255,0.04)" }}
            >
              {controls}
            </motion.div>
          )}

          {/* Corner watermark */}
          <div className="pointer-events-none absolute bottom-4 left-6 z-10 text-[10px] font-bold uppercase tracking-widest text-white/[0.06]">
            FlexUI
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {trigger}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}

/**
 * Fullscreen control pill button — for use in the controls bar.
 */
export function FullscreenControl({
  label,
  active,
  onClick,
  color,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-200"
      style={{
        background: active ? `${color ?? "#A78BFA"}20` : "rgba(255,255,255,0.04)",
        color: active ? (color ?? "#A78BFA") : "rgba(255,255,255,0.4)",
        border: `1px solid ${active ? `${color ?? "#A78BFA"}30` : "rgba(255,255,255,0.06)"}`,
      }}
    >
      {label}
    </button>
  );
}

