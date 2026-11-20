"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CreepyGlitchButtonProps {
  text?: string;
  hoverText?: string;
  onClick?: () => void;
  className?: string;
}

export function CreepyGlitchButton({
  text = "SYSTEM OVERRIDE",
  hoverText = "OVERRIDE ENGAGED",
  onClick,
  className,
}: CreepyGlitchButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [pupilScale, setPupilScale] = useState(1);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [displayText, setDisplayText] = useState(text);

  const buttonRef = useRef<HTMLButtonElement>(null);

  // 1. Human Real-Time Saccadic Cursor Tracking & Pupil Dilation
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;

      const dx = e.clientX - btnCenterX;
      const dy = e.clientY - btnCenterY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Clamp pupil translation matrix (-1 to 1)
      const maxOffset = 380;
      const normX = Math.max(-1, Math.min(1, dx / maxOffset));
      const normY = Math.max(-1, Math.min(1, dy / maxOffset));

      // Natural Human Pupil Dilation (Constricts when near center, dilates when looking far)
      const dilation = Math.max(0.85, Math.min(1.2, 0.9 + (dist / 600) * 0.3));

      setMousePos({ x: normX, y: normY });
      setPupilScale(dilation);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, []);

  // 2. Realistic Human Biological Blinking Rhythm (Natural 2.8s to 4.5s intervals)
  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const scheduleBlink = () => {
      const delay = Math.random() * 2000 + 2800;
      blinkTimeout = setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          scheduleBlink();
        }, 150);
      }, delay);
    };

    scheduleBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  // 3. Professional Subtle Text Transition
  useEffect(() => {
    if (!isHovered) {
      setDisplayText(text);
      return;
    }

    const chars = "☠#@!⚡OVERRIDE";
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        hoverText
          .split("")
          .map((char, index) => {
            if (index < iteration) return hoverText[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= hoverText.length) clearInterval(interval);
      iteration += 1 / 2;
    }, 30);

    return () => clearInterval(interval);
  }, [isHovered, text, hoverText]);

  return (
    <div className={cn("relative flex items-center justify-center p-12 select-none", className)}>
      <motion.button
        ref={buttonRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="group relative flex h-16 w-80 items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-950 px-6 font-mono text-xs font-bold tracking-widest text-neutral-300 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all duration-300 hover:border-red-600/60 hover:text-white hover:shadow-[0_20px_50px_rgba(220,38,38,0.25)]"
      >
        {/* Ambient Subtle Red Backdrop Aura */}
        <div
          className={cn(
            "pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-red-600/20 via-neutral-900 to-red-600/20 blur-xl transition-opacity duration-500",
            isHovered ? "opacity-100" : "opacity-30"
          )}
        />

        {/* ================= LEFT ANATOMICAL REAL HUMAN EYE ================= */}
        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-700/80 bg-neutral-900 shadow-md overflow-hidden">
          {/* Eyelid Container with Biological Blink */}
          <motion.div
            animate={{
              scaleY: isBlinking ? 0.05 : 1,
            }}
            transition={{ duration: 0.12, ease: "easeInOut" }}
            className="relative flex h-full w-full items-center justify-center bg-gradient-to-b from-neutral-100 via-white to-neutral-200"
          >
            {/* Sclera Blood Vessel Shadow Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-red-900/10 to-red-950/25 pointer-events-none" />

            {/* Iris Layer */}
            <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-neutral-950 via-red-900 to-amber-600 shadow-inner">
              {/* Pupil with Cursor Tracking & Dynamic Dilation */}
              <motion.div
                animate={{
                  x: mousePos.x * 5,
                  y: mousePos.y * 5,
                  scale: pupilScale,
                }}
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
                className="h-2.5 w-2.5 rounded-full bg-black shadow-[0_0_6px_rgba(0,0,0,1)]"
              >
                {/* Specular Light Reflection Point */}
                <div className="ml-0.5 mt-0.5 h-0.8 w-0.8 rounded-full bg-white opacity-90" />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* ================= CENTER BUTTON TEXT ================= */}
        <span className="relative z-10 font-mono tracking-widest text-center transition-colors duration-200">
          {displayText}
        </span>

        {/* ================= RIGHT ANATOMICAL REAL HUMAN EYE ================= */}
        <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-700/80 bg-neutral-900 shadow-md overflow-hidden">
          {/* Eyelid Container with Biological Blink */}
          <motion.div
            animate={{
              scaleY: isBlinking ? 0.05 : 1,
            }}
            transition={{ duration: 0.12, ease: "easeInOut" }}
            className="relative flex h-full w-full items-center justify-center bg-gradient-to-b from-neutral-100 via-white to-neutral-200"
          >
            {/* Sclera Blood Vessel Shadow Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-red-900/10 to-red-950/25 pointer-events-none" />

            {/* Iris Layer */}
            <div className="relative flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-neutral-950 via-red-900 to-amber-600 shadow-inner">
              {/* Pupil with Cursor Tracking & Dynamic Dilation */}
              <motion.div
                animate={{
                  x: mousePos.x * 5,
                  y: mousePos.y * 5,
                  scale: pupilScale,
                }}
                transition={{ type: "spring", stiffness: 450, damping: 28 }}
                className="h-2.5 w-2.5 rounded-full bg-black shadow-[0_0_6px_rgba(0,0,0,1)]"
              >
                {/* Specular Light Reflection Point */}
                <div className="ml-0.5 mt-0.5 h-0.8 w-0.8 rounded-full bg-white opacity-90" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.button>
    </div>
  );
}
