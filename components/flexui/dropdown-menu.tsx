"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
}

export function DropdownMenu({ trigger, items, className }: DropdownMenuProps) {
  const nativeButton = React.isValidElement<React.ButtonHTMLAttributes<HTMLButtonElement>>(trigger) && trigger.type === "button";
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const closeMenu = useCallback((restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) {
      const trigger = triggerRef.current;
      (trigger?.querySelector<HTMLElement>("button, a[href], input, [tabindex]") ?? trigger)?.focus();
    }
  }, []);

  useEffect(() => {
    if (open && focused >= 0) itemRefs.current[focused]?.focus();
  }, [open, focused]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) {
        if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
          e.preventDefault();
          setOpen(true);
          setFocused(items.length === 0 ? -1 : e.key === "ArrowUp" ? items.length - 1 : 0);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeMenu(true);
      } else if (e.key === "Tab") {
        closeMenu();
      } else if (items.length > 0) {
        if (e.key === "ArrowDown") { e.preventDefault(); setFocused((f) => (f + 1) % items.length); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setFocused((f) => f <= 0 ? items.length - 1 : f - 1); }
        else if (e.key === "Home") { e.preventDefault(); setFocused(0); }
        else if (e.key === "End") { e.preventDefault(); setFocused(items.length - 1); }
        else if ((e.key === "Enter" || e.key === " ") && focused >= 0) {
          e.preventDefault();
          items[focused]?.onClick?.();
          closeMenu(true);
        }
      }
    },
    [open, focused, items, closeMenu]
  );

  return (
    <div ref={ref} className="relative inline-flex" onKeyDown={onKey}>
      <div
        ref={triggerRef}
        onClick={() => { setOpen((v) => !v); setFocused(items.length > 0 ? 0 : -1); }}
        tabIndex={nativeButton ? undefined : 0}
        className="inline-flex cursor-pointer"
        role={nativeButton ? undefined : "button"}
        aria-haspopup={nativeButton ? undefined : "menu"}
        aria-expanded={nativeButton ? undefined : open}
      >
        {nativeButton ? React.cloneElement(trigger, {
          type: trigger.props.type ?? "button",
          "aria-haspopup": "menu",
          "aria-expanded": open,
        }) : trigger}
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            role="menu"
            className={cn(
              "absolute right-0 top-full z-50 mt-2 min-w-[180px] overflow-hidden rounded-lg border border-white/[0.06] bg-zinc-950 py-1 shadow-xl",
              className
            )}
          >
            {items.map((item, i) => (
              <button
                key={i}
                ref={(element) => { itemRefs.current[i] = element; }}
                type="button"
                role="menuitem"
                tabIndex={focused === i ? 0 : -1}
                onClick={() => { item.onClick?.(); closeMenu(true); }}
                onFocus={() => setFocused(i)}
                onMouseEnter={() => setFocused(i)}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-white/80 transition-colors",
                  focused === i && "bg-white/[0.06] text-white"
                )}
              >
                {item.icon && <span className="text-white/50">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

