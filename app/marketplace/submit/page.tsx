"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/components/flexui/theme-provider";
import { themes } from "@/lib/themes";

/* ── Animation ──────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] as const } },
};

/* ── Form Fields ────────────────────────────────────────────────────────── */
const CATEGORIES = ["Buttons", "Cards", "Animations", "Backgrounds", "Layout", "Data Viz", "Effects", "3D/WebGL"];
const TIERS = [
  { value: "1", label: "Tier 1 — Basic (CSS + Tailwind)" },
  { value: "2", label: "Tier 2 — Motion (Framer Motion)" },
  { value: "3", label: "Tier 3 — WebGL (Three.js / WebGPU)" },
];

export default function SubmitPage() {
  const { themeName } = useTheme();
  const currentTheme = themes[themeName];
  const accent = currentTheme?.tokens["--flexui-accent"] ?? "#A78BFA";
  const glowPrimary = currentTheme?.tokens["--flexui-glow-primary"] ?? "167,139,250";

  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    category: "",
    tier: "1",
    sourceCode: "",
    demoUrl: "",
    authorName: "",
    authorGithub: "",
    tags: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST to /api/marketplace/submit
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl items-center justify-center px-6 py-20 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl" style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)" }}>
            ✓
          </div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--flexui-heading)" }}>
            Submission Received!
          </h2>
          <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--flexui-body)" }}>
            Your component has been submitted for review. Our team will evaluate it
            for code quality, accessibility, and design consistency. You&apos;ll receive
            a notification once it&apos;s approved.
          </p>
          <Link
            href="/marketplace"
            className="mt-6 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all duration-200 hover:brightness-110"
            style={{ background: accent, color: "var(--flexui-accent-foreground)" }}
          >
            Back to Marketplace
          </Link>
        </motion.div>
      </div>
    );
  }

  const inputStyle = {
    background: "var(--flexui-surface)",
    border: "1px solid var(--flexui-border)",
    color: "var(--flexui-heading)",
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <motion.div initial="hidden" animate="visible" variants={fadeUp}>
        <Link href="/marketplace" className="text-xs font-medium transition-colors duration-200" style={{ color: accent }}>
          ← Back to Marketplace
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight" style={{ color: "var(--flexui-heading)" }}>
          Submit a Component
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--flexui-body)" }}>
          Share your component with the FlexUI community. All submissions are reviewed
          for quality, accessibility, and design consistency.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {/* Component Name */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--flexui-heading)" }}>
              Component Name <span style={{ color: "var(--flexui-error)" }}>*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g., aurora-tabs"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-200 focus:ring-2"
              style={{ ...inputStyle, "--tw-ring-color": accent } as React.CSSProperties}
            />
            <p className="mt-1 text-[10px]" style={{ color: "var(--flexui-caption)" }}>
              Kebab-case, e.g., &quot;aurora-tabs&quot; or &quot;crystal-card&quot;
            </p>
          </div>

          {/* Title */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--flexui-heading)" }}>
              Display Title <span style={{ color: "var(--flexui-error)" }}>*</span>
            </label>
            <input
              required
              type="text"
              placeholder="e.g., Aurora Tabs"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-200"
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--flexui-heading)" }}>
              Description <span style={{ color: "var(--flexui-error)" }}>*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe what the component does and what makes it unique..."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="w-full resize-none rounded-lg px-3.5 py-2.5 text-sm outline-none transition-all duration-200"
              style={inputStyle}
            />
          </div>

          {/* Category & Tier */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--flexui-heading)" }}>
                Category <span style={{ color: "var(--flexui-error)" }}>*</span>
              </label>
              <select
                required
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
                style={inputStyle}
              >
                <option value="">Select category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--flexui-heading)" }}>
                Tier <span style={{ color: "var(--flexui-error)" }}>*</span>
              </label>
              <select
                required
                value={form.tier}
                onChange={(e) => update("tier", e.target.value)}
                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
                style={inputStyle}
              >
                {TIERS.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Source Code */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--flexui-heading)" }}>
              Source Code <span style={{ color: "var(--flexui-error)" }}>*</span>
            </label>
            <textarea
              required
              rows={12}
              placeholder='Paste your component source code here (TypeScript/TSX)...'
              value={form.sourceCode}
              onChange={(e) => update("sourceCode", e.target.value)}
              className="w-full resize-y rounded-lg px-3.5 py-2.5 font-mono text-xs leading-relaxed outline-none transition-all duration-200"
              style={inputStyle}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--flexui-heading)" }}>
              Tags
            </label>
            <input
              type="text"
              placeholder="e.g., animation, spring, gradient (comma separated)"
              value={form.tags}
              onChange={(e) => update("tags", e.target.value)}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
          </div>

          {/* Demo URL */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--flexui-heading)" }}>
              Demo URL
            </label>
            <input
              type="url"
              placeholder="https://your-demo.vercel.app"
              value={form.demoUrl}
              onChange={(e) => update("demoUrl", e.target.value)}
              className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
          </div>

          {/* Author info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--flexui-heading)" }}>
                Your Name <span style={{ color: "var(--flexui-error)" }}>*</span>
              </label>
              <input
                required
                type="text"
                placeholder="Your display name"
                value={form.authorName}
                onChange={(e) => update("authorName", e.target.value)}
                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--flexui-heading)" }}>
                GitHub Username
              </label>
              <input
                type="text"
                placeholder="@username"
                value={form.authorGithub}
                onChange={(e) => update("authorGithub", e.target.value)}
                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-lg py-3 text-sm font-bold transition-all duration-200 hover:brightness-110"
            style={{ background: accent, color: "var(--flexui-accent-foreground)", boxShadow: "var(--flexui-shadow-glow)" }}
          >
            Submit for Review
          </button>
        </form>
      </motion.div>
    </div>
  );
}
