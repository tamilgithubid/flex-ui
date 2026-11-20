"use client";

import { FullscreenPreview } from "@/components/docs/fullscreen-preview";
import { PreviewCodeTabs } from "@/components/docs/preview-code-tabs";
import { PropsConfigurator } from "@/components/docs/props-configurator";
import { CursorAvatarStack } from "@/components/flexui/live-cursors";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/* ── Inline cursor (works inside a relative container, not fixed) ──────── */

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

/* ── User pool ──────────────────────────────────────────────────────────── */

const userPool = [
  { name: "Alice", color: "#A78BFA" },
  { name: "Bob", color: "#34D399" },
  { name: "Charlie", color: "#F472B6" },
  { name: "Diana", color: "#60A5FA" },
  { name: "Eve", color: "#FBBF24" },
  { name: "Frank", color: "#F87171" },
];

/* ── Simulated cursor hook ──────────────────────────────────────────────── */

function useSimulatedCursors(count: number) {
  const [cursors, setCursors] = useState(() =>
    userPool.slice(0, count).map((u, i) => ({
      ...u,
      x: 60 + i * 80,
      y: 50 + i * 45,
    }))
  );

  const targetsRef = useRef(
    userPool.slice(0, count).map((_, i) => ({
      x: 60 + i * 80,
      y: 50 + i * 45,
    }))
  );

  useEffect(() => {
    // Pick new random targets every 2s
    const targetInterval = setInterval(() => {
      targetsRef.current = targetsRef.current.map(() => ({
        x: 30 + Math.random() * 340,
        y: 20 + Math.random() * 230,
      }));
    }, 2000);

    // Move toward targets smoothly every 120ms
    const moveInterval = setInterval(() => {
      setCursors((prev) =>
        prev.map((c, i) => {
          const t = targetsRef.current[i] || { x: 200, y: 140 };
          return {
            ...c,
            x: c.x + (t.x - c.x) * 0.15 + (Math.random() - 0.5) * 6,
            y: c.y + (t.y - c.y) * 0.15 + (Math.random() - 0.5) * 6,
          };
        })
      );
    }, 120);

    return () => {
      clearInterval(targetInterval);
      clearInterval(moveInterval);
    };
  }, [count]);

  // Resize when count changes
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
    setCursors(
      userPool.slice(0, count).map((u, i) => ({
        ...u,
        x: 60 + i * 80,
        y: 50 + i * 45,
      }))
    );
    targetsRef.current = userPool.slice(0, count).map((_, i) => ({
      x: 60 + i * 80,
      y: 50 + i * 45,
    }));
    });
    return () => cancelAnimationFrame(frame);
  }, [count]);

  return cursors;
}

/* ── Props ──────────────────────────────────────────────────────────────── */

const propDefs = [
  {
    name: "cursorCount",
    label: "Cursor Count",
    control: { type: "select" as const, options: ["2", "3", "4", "6"] },
    defaultValue: "4",
  },
  {
    name: "showAvatarStack",
    label: "Show Avatar Stack",
    control: { type: "boolean" as const },
    defaultValue: true,
  },
];

function generateCode(values: Record<string, string | number | boolean>) {
  const count = Number(values.cursorCount);
  const showStack = values.showAvatarStack;
  const usersSlice = userPool.slice(0, count);
  const usersStr = usersSlice
    .map((u) => `  { id: "${u.name.toLowerCase()}", name: "${u.name}", color: "${u.color}", cursor: { x: ${Math.round(Math.random() * 300 + 50)}, y: ${Math.round(Math.random() * 200 + 30)} } }`)
    .join(",\n");

  return `import { LiveCursors${showStack ? ", CursorAvatarStack" : ""} } from "@/components/flexui/live-cursors";

const users = [
${usersStr}
];

export function Demo() {
  return (
    <div className="relative h-[300px] w-full rounded-xl border border-white/[0.06] bg-zinc-950">
      <LiveCursors cursors={users} />${
    showStack
      ? `\n      <div className="absolute bottom-4 right-4 z-10">
        <CursorAvatarStack users={users} />
      </div>`
      : ""
  }
    </div>
  );
}`;
}

/* ── Fullscreen content (separate component so hooks are valid) ─────────── */

function FullscreenCursorsContent() {
  const fsCursors = useSimulatedCursors(6);
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: "#0a0a0f" }}>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(96,165,250,0.06),transparent_60%)]" />
      <AnimatePresence>
        {fsCursors.map((c) => <InlineCursor key={c.name} name={c.name} color={c.color} x={c.x * 2.5} y={c.y * 2} />)}
      </AnimatePresence>
      <div className="absolute bottom-6 right-6"><CursorAvatarStack users={fsCursors} /></div>
    </div>
  );
}

/* ── Playground ─────────────────────────────────────────────────────────── */

export function LiveCursorsPlayground() {
  const [values, setValues] = useState<Record<string, string | number | boolean>>({
    cursorCount: "4",
    showAvatarStack: true,
  });

  const cursors = useSimulatedCursors(Number(values.cursorCount));

  return (
    <div className="space-y-4">
      <PreviewCodeTabs
        preview={
          <div className="relative overflow-hidden rounded-2xl" style={{ background: "#09090b" }}>
            {/* Container */}
            <div
              className="relative w-full overflow-hidden rounded-2xl border border-white/[0.04]"
              style={{ height: 340, background: "#0a0a0f" }}
            >
              {/* Grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.04]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              />
              {/* Radial glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(167,139,250,0.06),transparent_60%)]" />

              {/* Mock editor chrome */}
              <div className="absolute left-4 top-4 flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-white/[0.06]" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/[0.06]" />
                <div className="h-2.5 w-2.5 rounded-full bg-white/[0.06]" />
                <span className="ml-2 text-[10px] font-medium text-white/15">collaborative-workspace.tsx</span>
              </div>

              {/* Mock code lines */}
              <div className="absolute left-6 top-14 space-y-2.5">
                {[72, 120, 90, 140, 60, 110, 85].map((w, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-4 text-right text-[9px] text-white/10">{i + 1}</span>
                    <div className="h-2 rounded-full bg-white/[0.04]" style={{ width: w }} />
                  </div>
                ))}
              </div>

              {/* Animated cursors */}
              <AnimatePresence>
                {cursors.map((c) => (
                  <InlineCursor key={c.name} name={c.name} color={c.color} x={c.x} y={c.y} />
                ))}
              </AnimatePresence>

              {/* Avatar stack */}
              {values.showAvatarStack && (
                <div className="absolute bottom-4 right-4 z-10">
                  <CursorAvatarStack users={cursors} />
                </div>
              )}

              {/* Overlay hint */}
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-end pb-4">
                <p className="text-[10px] font-medium uppercase tracking-widest text-white/20">
                  Simulated real-time cursors
                </p>
              </div>
            </div>
          </div>
        }
        code={generateCode(values)}
        filename="live-cursors-demo.tsx"
      />
      <div className="flex flex-wrap items-center gap-3">
        <PropsConfigurator propDefs={propDefs} values={values} onChange={(n, v) => setValues((p) => ({ ...p, [n]: v }))} />
        <FullscreenPreview title="Live Cursors" badge="Collaboration" badgeColor="bg-blue-500/10 text-blue-400 border-blue-500/20" accentColor="#60A5FA">
          {() => <FullscreenCursorsContent />}
        </FullscreenPreview>
      </div>
    </div>
  );
}

