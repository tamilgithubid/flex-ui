"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/flexui/theme-provider";
import { themes } from "@/lib/themes";
import Link from "next/link";

/* ── Animations ─────────────────────────────────────────────────────────── */
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] as const } },
};

/* ── Data ───────────────────────────────────────────────────────────────── */
const skills = [
  {
    name: "Component Discovery",
    desc: "AI knows all 160+ FlexUI components — names, props, dependencies, tiers, and categories. Instant lookup for any component in the registry.",
    icon: "M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z",
    example: '"What FlexUI components have glow effects?"',
  },
  {
    name: "Animation Patterns",
    desc: "Spring physics configs, Framer Motion best practices, easing curves, stagger patterns, and scroll-triggered animations.",
    icon: "M12 3c-1.2 0-2.4.6-3 1.5A4.5 4.5 0 005 9c0 6 7 12 7 12s7-6 7-12a4.5 4.5 0 00-4-4.5C14.4 3.6 13.2 3 12 3z",
    example: '"Add a spring-physics stagger animation to my list"',
  },
  {
    name: "3D Integration",
    desc: "Three.js, React Three Fiber patterns, WebGL shader snippets, and performance budgets for GPU-intensive components.",
    icon: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z",
    example: '"Create a 3D card with holographic tilt effect"',
  },
  {
    name: "Theming System",
    desc: "CSS variable tokens, 6 theme presets, design token architecture, and dynamic theme switching with OKLCH color support.",
    icon: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.8-.1 2.6-.4.5-.2.8-.7.6-1.3-.2-.5-.3-.9-.3-1.3 0-1.1.9-2 2-2h2.4c3 0 5.4-2.4 5.4-5.4C24.7 5.8 19.2 2 12 2z",
    example: '"Switch to the aurora theme and show me the tokens"',
  },
  {
    name: "Registry & CLI",
    desc: "npx flexui add workflow, dependency resolution, manual install fallbacks, and registry JSON format for custom components.",
    icon: "M4 17l6-6-6-6M12 19h8",
    example: '"Install the magnetic-button with all dependencies"',
  },
  {
    name: "MCP Server",
    desc: "AI-assisted component discovery, natural language search, auto-installation, and config for Claude, Cursor, and Windsurf.",
    icon: "M5 12h14M12 5v14M3 3l18 18",
    example: '"Set up the FlexUI MCP server for Cursor"',
  },
  {
    name: "Accessibility",
    desc: "Reduced motion detection, ARIA patterns, keyboard navigation, focus management, and screen reader optimization.",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    example: '"Make this animation respect prefers-reduced-motion"',
  },
];

const installSnippets = {
  pnpm: { label: "pnpm", cmd: "pnpm dlx skills add flexui" },
  npm: { label: "npm", cmd: "npx skills add flexui" },
  yarn: { label: "yarn", cmd: "yarn dlx skills add flexui" },
  bun: { label: "bun", cmd: "bunx skills add flexui" },
};

type PkgKey = keyof typeof installSnippets;

const steps = [
  { step: "1", title: "Install", desc: "Add FlexUI skills to your AI coding tool via the CLI" },
  { step: "2", title: "Context", desc: "AI loads component registry, animation patterns, and theme tokens" },
  { step: "3", title: "Ask", desc: "Describe what you need in natural language" },
  { step: "4", title: "Build", desc: "AI generates FlexUI-native code with correct imports and animations" },
];

const categories = [
  { name: "Code Generation", color: "#A78BFA" },
  { name: "Debugging & Testing", color: "#F472B6" },
  { name: "Deployment", color: "#34D399" },
  { name: "Prompt Engineering", color: "#FBBF24" },
  { name: "Agent Orchestration", color: "#60A5FA" },
  { name: "Vibe Coding", color: "#C084FC" },
  { name: "AI Literacy", color: "#FB923C" },
  { name: "MCP Integration", color: "#2DD4BF" },
];

const learnMore = [
  { title: "Installation", desc: "Get FlexUI set up in your project", href: "/docs/installation" },
  { title: "MCP Server", desc: "AI-powered component discovery", href: "/docs/mcp-server" },
  { title: "Theme Preview", desc: "Explore 6 built-in theme presets", href: "/docs/theme-preview" },
  { title: "All Components", desc: "Browse the full 160+ registry", href: "/docs/components" },
];

/* ── Copy Button ────────────────────────────────────────────────────────── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="absolute right-3 top-3 rounded-md px-2 py-1 text-[10px] font-medium transition-all duration-200 hover:brightness-125"
      style={{ background: "var(--flexui-surface-hover)", color: "var(--flexui-caption)", border: "1px solid var(--flexui-border)" }}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────────── */
export default function SkillsPage() {
  const { themeName } = useTheme();
  const currentTheme = themes[themeName];
  const accent = currentTheme?.tokens["--flexui-accent"] ?? "#A78BFA";
  const secondary = currentTheme?.tokens["--flexui-secondary"] ?? "#818CF8";
  const glowPrimary = currentTheme?.tokens["--flexui-glow-primary"] ?? "167,139,250";
  const [activePkg, setActivePkg] = useState<PkgKey>("pnpm");

  return (
    <div className="min-w-0 flex-1 space-y-14">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider"
            style={{ background: `rgba(${glowPrimary}, 0.12)`, color: accent, border: `1px solid rgba(${glowPrimary}, 0.18)` }}
          >
            Skills
          </span>
          <motion.span
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
            style={{ background: "rgba(52, 211, 153, 0.12)", color: "#34D399", border: "1px solid rgba(52, 211, 153, 0.2)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            New
          </motion.span>
        </div>

        <h1
          className="mt-5 text-4xl font-bold tracking-tight"
          style={{ color: "var(--flexui-heading)" }}
        >
          Skills
        </h1>
        <p
          className="mt-3 max-w-2xl text-lg leading-relaxed"
          style={{ color: "var(--flexui-body)" }}
        >
          Give your AI assistant deep knowledge of FlexUI&apos;s{" "}
          <strong style={{ color: accent }}>160+ components</strong>,
          animation patterns, and best practices — so it writes{" "}
          <strong style={{ color: "var(--flexui-heading)" }}>production-ready code</strong>{" "}
          from the first prompt.
        </p>
      </div>

      <div className="h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.2 }} />

      {/* ── What Are Skills? ── */}
      <section>
        <h2 id="what-are-skills" className="text-2xl font-bold" style={{ color: "var(--flexui-heading)" }}>
          What Are Skills?
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: "var(--flexui-body)" }}>
          Skills are packaged knowledge files — structured markdown that teaches AI coding assistants
          about FlexUI&apos;s component library, animation engine, theming system, and development patterns.
          Instead of hallucinating props or inventing APIs, your AI gets{" "}
          <strong style={{ color: "var(--flexui-heading)" }}>real, current, accurate</strong>{" "}
          documentation injected into its context.
        </p>
        <p className="mt-3 max-w-2xl leading-relaxed" style={{ color: "var(--flexui-body)" }}>
          Built on the open{" "}
          <strong style={{ color: accent }}>Agent Skills Standard</strong>{" "}
          — compatible with Claude Code, Cursor, Windsurf, VS Code, and any tool
          that supports the skills specification. One install, every AI tool.
        </p>
      </section>

      {/* ── Installation ── */}
      <section>
        <h2 id="installation" className="text-2xl font-bold" style={{ color: "var(--flexui-heading)" }}>
          Installation
        </h2>
        <p className="mt-3 leading-relaxed" style={{ color: "var(--flexui-body)" }}>
          Add FlexUI skills to your project with a single command:
        </p>

        {/* Tab switcher */}
        <div className="mt-6 flex gap-1 rounded-lg p-1" style={{ background: "var(--flexui-surface)", border: "1px solid var(--flexui-border)" }}>
          {(Object.keys(installSnippets) as PkgKey[]).map((key) => (
            <button
              key={key}
              onClick={() => setActivePkg(key)}
              className="relative rounded-md px-4 py-2 text-xs font-semibold transition-all duration-200"
              style={{
                color: activePkg === key ? "var(--flexui-heading)" : "var(--flexui-body)",
                background: activePkg === key ? "var(--flexui-surface-active)" : "transparent",
              }}
            >
              {activePkg === key && (
                <motion.div
                  layoutId="pkg-tab"
                  className="absolute inset-0 rounded-md"
                  style={{ background: "var(--flexui-surface-active)", border: "1px solid var(--flexui-border-hover)" }}
                  transition={{ type: "spring" as const, stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{installSnippets[key].label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePkg}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="relative mt-4 overflow-hidden rounded-xl"
            style={{ background: "var(--flexui-surface)", border: "1px solid var(--flexui-border)" }}
          >
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: "1px solid var(--flexui-border)" }}>
              <span className="text-[11px] font-medium" style={{ color: "var(--flexui-caption)" }}>
                Terminal
              </span>
              <CopyBtn text={installSnippets[activePkg].cmd} />
            </div>
            <pre className="overflow-x-auto p-4 text-sm leading-relaxed" style={{ color: accent }}>
              {installSnippets[activePkg].cmd}
            </pre>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── What's Included ── */}
      <section>
        <h2 id="whats-included" className="mb-6 text-2xl font-bold" style={{ color: "var(--flexui-heading)" }}>
          What&apos;s Included
        </h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skills.map((skill) => (
            <motion.div
              key={skill.name}
              variants={fadeUp}
              className="group rounded-xl p-5 transition-all duration-300 hover:scale-[1.01]"
              style={{ background: "var(--flexui-surface)", border: "1px solid var(--flexui-border)" }}
            >
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110"
                  style={{ background: `rgba(${glowPrimary}, 0.1)`, color: accent }}
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <path d={skill.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="text-sm font-bold" style={{ color: accent }}>{skill.name}</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--flexui-body)" }}>{skill.desc}</p>
              <p
                className="mt-2.5 rounded-md px-2.5 py-1.5 text-[10px] italic"
                style={{ background: "var(--flexui-background)", color: "var(--flexui-caption)", border: "1px solid var(--flexui-border)" }}
              >
                {skill.example}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section>
        <h2 id="how-it-works" className="text-2xl font-bold" style={{ color: "var(--flexui-heading)" }}>
          How It Works
        </h2>
        <p className="mt-3 mb-6 max-w-2xl leading-relaxed" style={{ color: "var(--flexui-body)" }}>
          FlexUI skills inject structured knowledge into your AI assistant&apos;s context,
          enabling accurate code generation without hallucinated APIs or props.
        </p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((s) => (
            <motion.div
              key={s.step}
              variants={fadeUp}
              className="rounded-xl p-5 transition-all duration-300"
              style={{ background: "var(--flexui-surface)", border: "1px solid var(--flexui-border)" }}
            >
              <div
                className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black"
                style={{ background: `rgba(${glowPrimary}, 0.12)`, color: accent }}
              >
                {s.step}
              </div>
              <h3 className="text-sm font-bold" style={{ color: "var(--flexui-heading)" }}>{s.title}</h3>
              <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--flexui-body)" }}>{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Trending Skill Categories ── */}
      <section>
        <h2 id="skill-categories" className="text-2xl font-bold" style={{ color: "var(--flexui-heading)" }}>
          Trending Skill Categories
        </h2>
        <p className="mt-3 mb-6 max-w-2xl leading-relaxed" style={{ color: "var(--flexui-body)" }}>
          The AI skills ecosystem is exploding — with{" "}
          <strong style={{ color: accent }}>700,000+ skills</strong>{" "}
          available across marketplaces like SkillsMP, SkillHub, and SkillsLLM.
          Here are the categories dominating in 2026:
        </p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="flex flex-wrap gap-2.5"
        >
          {categories.map((cat) => (
            <motion.span
              key={cat.name}
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 hover:scale-105"
              style={{
                background: `${cat.color}10`,
                color: cat.color,
                border: `1px solid ${cat.color}25`,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: cat.color }}
              />
              {cat.name}
            </motion.span>
          ))}
        </motion.div>
      </section>

      {/* ── Ecosystem Stats ── */}
      <section>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid gap-3 sm:grid-cols-4"
        >
          {[
            { label: "Components", value: "160+" },
            { label: "AI Skills", value: "7" },
            { label: "Theme Presets", value: "6" },
            { label: "Skills Ecosystem", value: "700K+" },
          ].map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              className="rounded-xl p-5 text-center"
              style={{ background: "var(--flexui-surface)", border: "1px solid var(--flexui-border)" }}
            >
              <p className="text-2xl font-black" style={{ color: accent }}>{s.value}</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider" style={{ color: "var(--flexui-caption)" }}>{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── Learn More ── */}
      <section>
        <h2 id="learn-more" className="mb-6 text-2xl font-bold" style={{ color: "var(--flexui-heading)" }}>
          Learn More
        </h2>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid gap-3 sm:grid-cols-2"
        >
          {learnMore.map((item) => (
            <motion.div key={item.href} variants={fadeUp}>
              <Link
                href={item.href}
                className="group flex items-center gap-4 rounded-xl p-5 transition-all duration-300 hover:scale-[1.01]"
                style={{ background: "var(--flexui-surface)", border: "1px solid var(--flexui-border)" }}
              >
                <div className="flex-1">
                  <h3 className="text-sm font-bold transition-colors duration-200" style={{ color: "var(--flexui-heading)" }}>
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs" style={{ color: "var(--flexui-body)" }}>{item.desc}</p>
                </div>
                <svg
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  style={{ color: accent }}
                >
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section>
        <div
          className="relative overflow-hidden rounded-xl p-8 text-center"
          style={{ background: "var(--flexui-surface)", border: "1px solid var(--flexui-border)" }}
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{ background: `radial-gradient(ellipse at center, rgba(${glowPrimary}, 0.2), transparent 70%)` }}
          />
          <h3 className="relative text-xl font-bold" style={{ color: "var(--flexui-heading)" }}>
            Supercharge your AI workflow
          </h3>
          <p className="relative mx-auto mt-2 max-w-md text-sm" style={{ color: "var(--flexui-body)" }}>
            Install FlexUI skills once and let your AI assistant generate
            production-ready components with correct animations, theming, and accessibility.
          </p>
          <div className="relative mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="/docs/installation"
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all duration-200 hover:brightness-110"
              style={{ background: accent, color: "var(--flexui-accent-foreground)", boxShadow: "var(--flexui-shadow-glow)" }}
            >
              Get Started
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="/docs/mcp-server"
              className="inline-flex items-center rounded-lg px-5 py-2.5 text-xs font-semibold transition-all duration-200"
              style={{ color: accent, border: `1px solid ${accent}` }}
            >
              Explore MCP Server
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
