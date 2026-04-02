"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CursorData {
  /** User ID */
  id: string;
  /** Display name */
  name: string;
  /** Cursor position */
  cursor: { x: number; y: number } | null;
  /** User color */
  color: string;
}

interface LiveCursorsProps {
  /** Array of other users' cursor data */
  cursors: CursorData[];
  /** Additional CSS classes for the container */
  className?: string;
}

/**
 * Live Cursors
 *
 * Renders real-time cursor positions of other users in a collaborative session.
 * Each cursor is color-coded with a name label and smooth spring animation.
 *
 * @example
 * ```tsx
 * const { others } = useCollaboration();
 * <LiveCursors cursors={others.map(u => ({
 *   id: u.name,
 *   name: u.name,
 *   cursor: u.cursor,
 *   color: u.color,
 * }))} />
 * ```
 */
export function LiveCursors({ cursors, className }: LiveCursorsProps) {
  return (
    <div className={cn("pointer-events-none fixed inset-0 z-[9999]", className)}>
      <AnimatePresence>
        {cursors.map(
          (user) =>
            user.cursor && (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  x: user.cursor.x,
                  y: user.cursor.y,
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.5,
                }}
                className="absolute -left-1 -top-1"
              >
                {/* Cursor arrow */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3L10 17L12 10L19 8L3 3Z"
                    fill={user.color}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth="1"
                  />
                </svg>

                {/* Name label */}
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="ml-4 mt-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-semibold shadow-lg"
                  style={{
                    background: user.color,
                    color: "#09090b",
                  }}
                >
                  {user.name}
                </motion.div>
              </motion.div>
            )
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Cursor Avatar Stack
 *
 * Shows a horizontal stack of user avatars with their colors.
 * Useful in toolbars/headers to show who's online.
 */
interface CursorAvatarStackProps {
  users: Array<{ name: string; color: string; avatar?: string }>;
  maxVisible?: number;
  className?: string;
}

export function CursorAvatarStack({
  users,
  maxVisible = 5,
  className,
}: CursorAvatarStackProps) {
  const visible = users.slice(0, maxVisible);
  const remaining = users.length - maxVisible;

  return (
    <div className={cn("flex items-center -space-x-2", className)}>
      <AnimatePresence>
        {visible.map((user) => (
          <motion.div
            key={user.name}
            initial={{ opacity: 0, scale: 0.5, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: -8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-black ring-2 ring-[#09090b]"
            style={{ background: user.color, color: "#09090b" }}
            title={user.name}
          >
            {user.avatar || user.name.charAt(0).toUpperCase()}
          </motion.div>
        ))}
      </AnimatePresence>
      {remaining > 0 && (
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full text-[9px] font-bold ring-2 ring-[#09090b]"
          style={{ background: "rgba(255,255,255,0.1)", color: "#a1a1aa" }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
