"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/components/flexui/theme-provider";
import { themes } from "@/lib/themes";

/* ── Animations ─────────────────────────────────────────────────────────── */
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.04 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] as const } },
};

/* ── Sample Data ────────────────────────────────────────────────────────── */
const CATEGORIES = ["All", "Buttons", "Cards", "Animations", "Backgrounds", "Layout", "Data Viz", "Effects", "3D/WebGL"] as const;

type Category = (typeof CATEGORIES)[number];

interface MarketplaceComponent {
  id: string;
  name: string;
  title: string;
  description: string;
  author: string;
  authorAvatar: string;
  category: Category;
  downloads: number;
  rating: number;
  tags: string[];
  tier: 1 | 2 | 3;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
}

const SAMPLE_COMPONENTS: MarketplaceComponent[] = [
  {
    id: "1", name: "aurora-tabs", title: "Aurora Tabs", description: "Tab switcher with aurora borealis gradient animation on the active indicator.", author: "flexui-team", authorAvatar: "F", category: "Layout", downloads: 12400, rating: 4.9, tags: ["animation", "tabs", "gradient"], tier: 2, isVerified: true, isFeatured: true, createdAt: "2026-03-15",
  },
  {
    id: "2", name: "crystal-card", title: "Crystal Card", description: "Frosted glass card with prismatic light refraction on hover using WebGL.", author: "community", authorAvatar: "C", category: "Cards", downloads: 8700, rating: 4.7, tags: ["webgl", "glass", "hover"], tier: 3, isVerified: true, isFeatured: true, createdAt: "2026-03-10",
  },
  {
    id: "3", name: "elastic-button", title: "Elastic Button", description: "Button with spring-physics elastic deformation on press. Bouncy and satisfying.", author: "motion-lab", authorAvatar: "M", category: "Buttons", downloads: 15200, rating: 4.8, tags: ["spring", "physics", "button"], tier: 1, isVerified: true, isFeatured: false, createdAt: "2026-03-08",
  },
  {
    id: "4", name: "nebula-background", title: "Nebula Background", description: "GPU-accelerated cosmic nebula background with particle dust and volumetric glow.", author: "gpu-effects", authorAvatar: "G", category: "Backgrounds", downloads: 6300, rating: 4.6, tags: ["webgpu", "particles", "cosmic"], tier: 3, isVerified: false, isFeatured: true, createdAt: "2026-03-01",
  },
  {
    id: "5", name: "wave-counter", title: "Wave Counter", description: "Animated number counter with liquid wave fill effect as values change.", author: "flexui-team", authorAvatar: "F", category: "Data Viz", downloads: 9100, rating: 4.5, tags: ["counter", "animation", "liquid"], tier: 2, isVerified: true, isFeatured: false, createdAt: "2026-02-28",
  },
  {
    id: "6", name: "magnetic-drawer", title: "Magnetic Drawer", description: "Drawer component with magnetic snap-to-anchor points and velocity-based physics.", author: "interaction-lab", authorAvatar: "I", category: "Layout", downloads: 7800, rating: 4.8, tags: ["drawer", "gesture", "physics"], tier: 2, isVerified: true, isFeatured: false, createdAt: "2026-02-25",
  },
  {
    id: "7", name: "morph-icon", title: "Morph Icon", description: "SVG icon component that morphs between shapes with spring animation.", author: "community", authorAvatar: "C", category: "Animations", downloads: 11300, rating: 4.7, tags: ["svg", "morph", "icon"], tier: 1, isVerified: false, isFeatured: false, createdAt: "2026-02-20",
  },
  {
    id: "8", name: "plasma-divider", title: "Plasma Divider", description: "Section divider with animated plasma effect using fragment shaders.", author: "gpu-effects", authorAvatar: "G", category: "Effects", downloads: 4200, rating: 4.4, tags: ["shader", "divider", "effect"], tier: 3, isVerified: false, isFeatured: false, createdAt: "2026-02-15",
  },
  {
    id: "9", name: "hologram-badge", title: "Hologram Badge", description: "Badge component with holographic foil reflection and prismatic color shift.", author: "flexui-team", authorAvatar: "F", category: "Effects", downloads: 5600, rating: 4.6, tags: ["hologram", "badge", "foil"], tier: 2, isVerified: true, isFeatured: true, createdAt: "2026-02-10",
  },
];

const SORT_OPTIONS = [
  { label: "Most Popular", key: "downloads" },
  { label: "Highest Rated", key: "rating" },
  { label: "Newest", key: "createdAt" },
] as const;

/* ── Component ──────────────────────────────────────────────────────────── */

export default function MarketplacePage() {
  const { themeName } = useTheme();
  const currentTheme = themes[themeName];
  const accent = currentTheme?.tokens["--flexui-accent"] ?? "#A78BFA";
  const glowPrimary = currentTheme?.tokens["--flexui-glow-primary"] ?? "167,139,250";

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [sortBy, setSortBy] = useState<string>("downloads");

  const filtered = useMemo(() => {
    let items = SAMPLE_COMPONENTS;
    if (category !== "All") items = items.filter((c) => c.category === category);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.tags.some((t) => t.includes(q))
      );
    }
    items = [...items].sort((a, b) => {
      if (sortBy === "downloads") return b.downloads - a.downloads;
      if (sortBy === "rating") return b.rating - a.rating;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return items;
  }, [category, search, sortBy]);

  const tierLabel = (tier: number) =>
    tier === 1 ? "Basic" : tier === 2 ? "Motion" : "WebGL";
  const tierColor = (tier: number) =>
    tier === 1 ? "#34D399" : tier === 2 ? "#FBBF24" : "#F472B6";

  return (
    <div className="mx-auto max-w-7xl px-6 py-20">
      {/* ── Header ── */}
      <div className="text-center">
        <motion.span
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
          style={{ background: `rgba(${glowPrimary}, 0.12)`, color: accent, border: `1px solid rgba(${glowPrimary}, 0.18)` }}
        >
          Marketplace
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-5 text-4xl font-bold tracking-tight md:text-5xl"
          style={{ color: "var(--flexui-heading)" }}
        >
          Component Marketplace
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-3 max-w-xl text-lg leading-relaxed"
          style={{ color: "var(--flexui-body)" }}
        >
          Discover community-built components, premium effects, and ready-to-use
          building blocks for your next project.
        </motion.p>
      </div>

      {/* ── Search & Filters ── */}
      <div className="mt-12 space-y-4">
        {/* Search */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--flexui-caption)" }}>
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            placeholder="Search components..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl py-3 pl-11 pr-4 text-sm outline-none transition-all duration-200"
            style={{
              background: "var(--flexui-surface)",
              border: "1px solid var(--flexui-border)",
              color: "var(--flexui-heading)",
            }}
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200"
              style={{
                background: category === cat ? `rgba(${glowPrimary}, 0.15)` : "var(--flexui-surface)",
                color: category === cat ? accent : "var(--flexui-body)",
                border: `1px solid ${category === cat ? `rgba(${glowPrimary}, 0.3)` : "var(--flexui-border)"}`,
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort & results count */}
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--flexui-caption)" }}>
            {filtered.length} component{filtered.length !== 1 ? "s" : ""} found
          </p>
          <div className="flex gap-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSortBy(opt.key)}
                className="rounded-md px-2.5 py-1 text-[10px] font-medium transition-all duration-200"
                style={{
                  background: sortBy === opt.key ? "var(--flexui-surface-active)" : "transparent",
                  color: sortBy === opt.key ? "var(--flexui-heading)" : "var(--flexui-caption)",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Component Grid ── */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((comp) => (
            <motion.div
              key={comp.id}
              variants={fadeUp}
              layout
              exit={{ opacity: 0, scale: 0.95 }}
              className="group rounded-xl p-5 transition-all duration-300 hover:scale-[1.01]"
              style={{ background: "var(--flexui-surface)", border: "1px solid var(--flexui-border)" }}
            >
              {/* Top row: tier badge + featured */}
              <div className="flex items-center justify-between">
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: `${tierColor(comp.tier)}15`, color: tierColor(comp.tier), border: `1px solid ${tierColor(comp.tier)}30` }}
                >
                  {tierLabel(comp.tier)}
                </span>
                <div className="flex items-center gap-1.5">
                  {comp.isVerified && (
                    <span className="text-[9px]" title="Verified" style={{ color: "#34D399" }}>✓</span>
                  )}
                  {comp.isFeatured && (
                    <span className="rounded-full px-1.5 py-0.5 text-[8px] font-bold" style={{ background: "rgba(251,191,36,0.1)", color: "#FBBF24" }}>
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Title & description */}
              <h3 className="mt-3 text-sm font-bold" style={{ color: "var(--flexui-heading)" }}>
                {comp.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed line-clamp-2" style={{ color: "var(--flexui-body)" }}>
                {comp.description}
              </p>

              {/* Tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {comp.tags.map((tag) => (
                  <span key={tag} className="rounded-md px-1.5 py-0.5 text-[9px]" style={{ background: "var(--flexui-background)", color: "var(--flexui-caption)", border: "1px solid var(--flexui-border)" }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Bottom row: author, downloads, rating */}
              <div className="mt-4 flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--flexui-border)" }}>
                <div className="flex items-center gap-1.5">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold" style={{ background: `rgba(${glowPrimary}, 0.1)`, color: accent }}>
                    {comp.authorAvatar}
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--flexui-caption)" }}>{comp.author}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px]" style={{ color: "var(--flexui-caption)" }}>
                    {comp.downloads > 1000 ? `${(comp.downloads / 1000).toFixed(1)}k` : comp.downloads} downloads
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: "#FBBF24" }}>
                    ★ {comp.rating}
                  </span>
                </div>
              </div>

              {/* Install button */}
              <button
                className="mt-3 w-full rounded-lg py-2 text-xs font-bold transition-all duration-200 hover:brightness-110"
                style={{
                  background: `rgba(${glowPrimary}, 0.08)`,
                  color: accent,
                  border: `1px solid rgba(${glowPrimary}, 0.15)`,
                }}
              >
                npx flexui add {comp.name}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ── Submit CTA ── */}
      <div className="mt-16 text-center">
        <div
          className="relative mx-auto max-w-2xl overflow-hidden rounded-xl p-8"
          style={{ background: "var(--flexui-surface)", border: "1px solid var(--flexui-border)" }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at center, rgba(${glowPrimary}, 0.2), transparent 70%)` }} />
          <h3 className="relative text-xl font-bold" style={{ color: "var(--flexui-heading)" }}>
            Built something amazing?
          </h3>
          <p className="relative mt-2 text-sm" style={{ color: "var(--flexui-body)" }}>
            Submit your component to the FlexUI marketplace and share it with thousands of developers.
          </p>
          <Link
            href="/marketplace/submit"
            className="relative mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all duration-200 hover:brightness-110"
            style={{ background: accent, color: "var(--flexui-accent-foreground)", boxShadow: "var(--flexui-shadow-glow)" }}
          >
            Submit a Component
            <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
