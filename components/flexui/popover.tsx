"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface PopoverProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function Popover({ trigger, children, side = "bottom", className }: PopoverProps) {
  const nativeButton = React.isValidElement<React.ButtonHTMLAttributes<HTMLButtonElement>>(trigger) && trigger.type === "button";
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const r = triggerRef.current.getBoundingClientRect();
    const m: Record<string, { top: number; left: number }> = {
      bottom: { top: r.bottom + 8, left: r.left + r.width / 2 },
      top: { top: r.top - 8, left: r.left + r.width / 2 },
      left: { top: r.top + r.height / 2, left: r.left - 8 },
      right: { top: r.top + r.height / 2, left: r.right + 8 },
    };
    setPos(m[side]);
  }, [open, side]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target) || contentRef.current?.contains(target)) return;
      setOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        const trigger = triggerRef.current;
        (trigger?.querySelector<HTMLElement>("button, a[href], input, [tabindex]") ?? trigger)?.focus();
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const translate = { bottom: "-translate-x-1/2", top: "-translate-x-1/2 -translate-y-full", left: "-translate-x-full -translate-y-1/2", right: "-translate-y-1/2" };

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((value) => !value);
          }
        }}
        className="inline-flex"
        role={nativeButton ? undefined : "button"}
        tabIndex={nativeButton ? undefined : 0}
        aria-haspopup={nativeButton ? undefined : "dialog"}
        aria-expanded={nativeButton ? undefined : open}
      >
        {nativeButton ? React.cloneElement(trigger, {
          type: trigger.props.type ?? "button",
          "aria-haspopup": "dialog",
          "aria-expanded": open,
        }) : trigger}
      </div>
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={contentRef}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                style={{ position: "fixed", top: pos.top, left: pos.left }}
                role="dialog"
                className={cn("z-50 rounded-lg border border-white/[0.06] bg-zinc-950 p-4 text-sm text-white shadow-xl", translate[side], className)}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}

