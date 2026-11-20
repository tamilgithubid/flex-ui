"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CursorAvatarStack } from "@/components/flexui/live-cursors";
import { ShowcaseGrid } from "@/components/docs/expandable-showcase";

/* ── Inline cursor (relative-positioned, not fixed) ────────────────────── */

function InlineCursor({ name, color, x, y }: { name: string; color: string; x: number; y: number }) {
  return (
    <motion.div
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="absolute left-0 top-0 pointer-events-none"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 3L10 17L12 10L19 8L3 3Z" fill={color} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
      </svg>
      <span
        className="ml-4 mt-1 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold shadow-lg"
        style={{ background: color, color: "#09090b" }}
      >
        {name}
      </span>
    </motion.div>
  );
}

/* ── Animated cursors hook ──────────────────────────────────────────────── */

function useAnimatedCursors(users: Array<{ name: string; color: string }>, bounds: { w: number; h: number }) {
  const [positions, setPositions] = useState(() =>
    users.map((_, i) => ({
      x: 30 + ((i * 73) % (bounds.w - 60)),
      y: 25 + ((i * 51) % (bounds.h - 50)),
    }))
  );

  const userCount = users.length;
  const targetsRef = useRef(positions.map((p) => ({ ...p })));

  useEffect(() => {
    const targetInterval = setInterval(() => {
      targetsRef.current = Array.from({ length: userCount }, () => ({
        x: 20 + Math.random() * (bounds.w - 50),
        y: 15 + Math.random() * (bounds.h - 40),
      }));
    }, 2200);

    const moveInterval = setInterval(() => {
      setPositions((prev) =>
        prev.map((p, i) => {
          const t = targetsRef.current[i] || p;
          return {
            x: p.x + (t.x - p.x) * 0.12 + (Math.random() - 0.5) * 4,
            y: p.y + (t.y - p.y) * 0.12 + (Math.random() - 0.5) * 4,
          };
        })
      );
    }, 130);

    return () => {
      clearInterval(targetInterval);
      clearInterval(moveInterval);
    };
  }, [userCount, bounds.w, bounds.h]);

  return users.map((u, i) => ({ ...u, ...positions[i] }));
}

/* ── Wrapper ────────────────────────────────────────────────────────────── */

function Wrapper({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl" style={{ background: "#09090b" }}>
      {children}
      {label && (
        <div className="pointer-events-none absolute bottom-0 inset-x-0 flex justify-center pb-3">
          <span className="rounded-full bg-white/5 px-3 py-1 text-[9px] font-medium uppercase tracking-widest text-white/25 backdrop-blur">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Example: Team Collaboration ────────────────────────────────────────── */

const teamUsers = [
  { name: "Alice", color: "#A78BFA" },
  { name: "Bob", color: "#34D399" },
  { name: "Charlie", color: "#F472B6" },
  { name: "Diana", color: "#60A5FA" },
];

function TeamCollabPreview() {
  const cursors = useAnimatedCursors(teamUsers, { w: 380, h: 240 });

  return (
    <Wrapper label="real-time collaboration">
      <div className="relative h-[280px] w-full overflow-hidden rounded-xl border border-white/[0.04]" style={{ background: "#0a0a0f" }}>
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(167,139,250,0.05),transparent_60%)]" />

        {/* Mock editor */}
        <div className="absolute left-4 top-4 flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-white/[0.06]" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/[0.06]" />
          <div className="h-2.5 w-2.5 rounded-full bg-white/[0.06]" />
          <span className="ml-2 text-[10px] font-medium text-white/15">team-project.tsx</span>
        </div>
        <div className="absolute left-6 top-14 space-y-2.5">
          {[80, 130, 95, 145, 70, 115].map((w, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-4 text-right text-[9px] text-white/10">{i + 1}</span>
              <div className="h-2 rounded-full bg-white/[0.04]" style={{ width: w }} />
            </div>
          ))}
        </div>

        <AnimatePresence>
          {cursors.map((c) => (
            <InlineCursor key={c.name} name={c.name} color={c.color} x={c.x} y={c.y} />
          ))}
        </AnimatePresence>
      </div>
    </Wrapper>
  );
}

/* ── Example: Design Review ─────────────────────────────────────────────── */

const reviewUsers = [
  { name: "Lead", color: "#A78BFA" },
  { name: "Design", color: "#FBBF24" },
  { name: "Dev", color: "#34D399" },
];

function DesignReviewPreview() {
  const cursors = useAnimatedCursors(reviewUsers, { w: 380, h: 240 });

  return (
    <Wrapper label="design review session">
      <div className="relative h-[280px] w-full overflow-hidden rounded-xl border border-white/[0.04]" style={{ background: "#0a0a0f" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(251,191,36,0.04),transparent_50%)]" />

        {/* Mock UI elements being reviewed */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 space-y-3">
          <div className="h-8 w-48 rounded-lg border border-white/[0.06] bg-white/[0.03]" />
          <div className="flex gap-2">
            <div className="h-20 w-[94px] rounded-lg border border-white/[0.06] bg-white/[0.02]" />
            <div className="h-20 w-[94px] rounded-lg border border-white/[0.06] bg-white/[0.02]" />
          </div>
          <div className="h-6 w-32 rounded-md border border-violet-500/10 bg-violet-500/[0.06]" />
        </div>

        {/* Comment markers */}
        <div className="absolute left-[60%] top-[30%] flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold" style={{ background: "#A78BFA", color: "#09090b" }}>1</div>
        <div className="absolute left-[35%] top-[65%] flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold" style={{ background: "#FBBF24", color: "#09090b" }}>2</div>

        <AnimatePresence>
          {cursors.map((c) => (
            <InlineCursor key={c.name} name={c.name} color={c.color} x={c.x} y={c.y} />
          ))}
        </AnimatePresence>
      </div>
    </Wrapper>
  );
}

/* ── Example: Avatar Stack ──────────────────────────────────────────────── */

const stackUsers = [
  { name: "Alice", color: "#A78BFA" },
  { name: "Bob", color: "#34D399" },
  { name: "Charlie", color: "#F472B6" },
  { name: "Diana", color: "#60A5FA" },
  { name: "Eve", color: "#FBBF24" },
  { name: "Frank", color: "#F87171" },
];

function AvatarStackPreview() {
  return (
    <Wrapper label="online presence indicator">
      <div className="relative flex h-[280px] w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-xl border border-white/[0.04]" style={{ background: "#0a0a0f" }}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(167,139,250,0.04),transparent_60%)]" />

        {/* Large stack */}
        <CursorAvatarStack users={stackUsers} maxVisible={6} />

        {/* Caption */}
        <div className="text-center">
          <p className="text-xs font-medium text-white/40">6 collaborators online</p>
          <p className="mt-1 text-[10px] text-white/20">Active in this workspace</p>
        </div>

        {/* Secondary smaller stack example */}
        <div className="flex items-center gap-3 rounded-lg border border-white/[0.04] bg-white/[0.02] px-4 py-2">
          <CursorAvatarStack users={stackUsers.slice(0, 3)} maxVisible={3} />
          <span className="text-[10px] text-white/30">editing header.tsx</span>
        </div>
      </div>
    </Wrapper>
  );
}

/* ── Example: Branded Cursors ───────────────────────────────────────────── */

const brandUsers = [
  { name: "Violet", color: "#8B5CF6" },
  { name: "Cyan", color: "#22D3EE" },
  { name: "Rose", color: "#FB7185" },
  { name: "Amber", color: "#F59E0B" },
];

function BrandedCursorsPreview() {
  const cursors = useAnimatedCursors(brandUsers, { w: 380, h: 240 });

  return (
    <Wrapper label="brand palette cursors">
      <div className="relative h-[280px] w-full overflow-hidden rounded-xl border border-white/[0.04]" style={{ background: "#0a0a0f" }}>
        {/* Multi-color radial glows */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_30%,rgba(139,92,246,0.04),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_75%_70%,rgba(34,211,238,0.04),transparent_40%)]" />

        {/* Color swatches */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3">
          {brandUsers.map((u) => (
            <div key={u.name} className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-lg" style={{ background: u.color, opacity: 0.15 }} />
              <span className="text-[9px] font-medium" style={{ color: u.color, opacity: 0.5 }}>{u.color}</span>
            </div>
          ))}
        </div>

        <AnimatePresence>
          {cursors.map((c) => (
            <InlineCursor key={c.name} name={c.name} color={c.color} x={c.x} y={c.y} />
          ))}
        </AnimatePresence>
      </div>
    </Wrapper>
  );
}

/* ── Examples array ─────────────────────────────────────────────────────── */

const examples = [
  {
    id: "lc-team",
    title: "Team Collaboration",
    tag: "Multiplayer",
    tagColor: "bg-violet-500/10 text-violet-400",
    description: "Four cursors navigating a mock code editor simultaneously. Smooth spring animations simulate real-time collaborative editing.",
    preview: <TeamCollabPreview />,
    code: `import { LiveCursors } from "@/components/flexui/live-cursors";

const users = [
  { id: "alice", name: "Alice", color: "#A78BFA", cursor: { x: 120, y: 80 } },
  { id: "bob", name: "Bob", color: "#34D399", cursor: { x: 240, y: 150 } },
  { id: "charlie", name: "Charlie", color: "#F472B6", cursor: { x: 300, y: 60 } },
  { id: "diana", name: "Diana", color: "#60A5FA", cursor: { x: 180, y: 200 } },
];

<LiveCursors cursors={users} />`,
    filename: "team-collaboration.tsx",
  },
  {
    id: "lc-review",
    title: "Design Review",
    tag: "Feedback",
    tagColor: "bg-amber-500/10 text-amber-400",
    description: "Three reviewers inspecting UI mockups with numbered comment markers. Demonstrates cursor awareness for design feedback workflows.",
    preview: <DesignReviewPreview />,
    code: `import { LiveCursors } from "@/components/flexui/live-cursors";

const reviewers = [
  { id: "lead", name: "Lead", color: "#A78BFA", cursor: { x: 200, y: 100 } },
  { id: "design", name: "Design", color: "#FBBF24", cursor: { x: 150, y: 180 } },
  { id: "dev", name: "Dev", color: "#34D399", cursor: { x: 300, y: 140 } },
];

<LiveCursors cursors={reviewers} />`,
    filename: "design-review.tsx",
  },
  {
    id: "lc-avatar-stack",
    title: "Avatar Stack",
    tag: "Presence",
    tagColor: "bg-emerald-500/10 text-emerald-400",
    description: "CursorAvatarStack renders a compact row of color-coded user initials. Shows overflow count when users exceed maxVisible limit.",
    preview: <AvatarStackPreview />,
    code: `import { CursorAvatarStack } from "@/components/flexui/live-cursors";

const users = [
  { name: "Alice", color: "#A78BFA" },
  { name: "Bob", color: "#34D399" },
  { name: "Charlie", color: "#F472B6" },
  { name: "Diana", color: "#60A5FA" },
  { name: "Eve", color: "#FBBF24" },
  { name: "Frank", color: "#F87171" },
];

<CursorAvatarStack users={users} maxVisible={6} />`,
    filename: "avatar-stack.tsx",
  },
  {
    id: "lc-branded",
    title: "Branded Cursors",
    tag: "Style",
    tagColor: "bg-rose-500/10 text-rose-400",
    description: "Custom brand palette applied to cursor arrows and name labels. Each cursor color matches a design system token for visual consistency.",
    preview: <BrandedCursorsPreview />,
    code: `import { LiveCursors } from "@/components/flexui/live-cursors";

const users = [
  { id: "v", name: "Violet", color: "#8B5CF6", cursor: { x: 100, y: 70 } },
  { id: "c", name: "Cyan", color: "#22D3EE", cursor: { x: 220, y: 120 } },
  { id: "r", name: "Rose", color: "#FB7185", cursor: { x: 160, y: 190 } },
  { id: "a", name: "Amber", color: "#F59E0B", cursor: { x: 300, y: 80 } },
];

<LiveCursors cursors={users} />`,
    filename: "branded-cursors.tsx",
  },
];

export function LiveCursorsExamples() {
  return <ShowcaseGrid items={examples} />;
}

