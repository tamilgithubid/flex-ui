import { COMPONENT_COUNT } from "@/lib/component-stats";
import { EditorialCover } from "@/components/marketing/editorial-cover";
import { editorialAssets } from "@/lib/editorial-assets";
import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "@/components/ui/code-block";

export const metadata: Metadata = {
  title: "FlexUI is Live: " + COMPONENT_COUNT + " Cinematic Components, One Command Away",
  description:
    "FlexUI is now production-ready and deployed. Install " + COMPONENT_COUNT + " animated React components with a single CLI command. Works with Next.js, Vite, and any React framework.",
};

export default function FlexUIRegistryLaunch() {
  return (
    <div className="min-h-screen bg-black text-white">
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <Link
          href="/blog"
          className="text-sm text-zinc-500 transition-colors hover:text-white"
        >
          &larr; Back to Blog
        </Link>

        <header className="mt-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            FlexUI is Live: {COMPONENT_COUNT} Cinematic Components, One Command Away
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-zinc-500">
            <span>FlexUI Team</span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <time dateTime="2026-03-29">March 29, 2026</time>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span>8 min read</span>
          </div>
        </header>
        <EditorialCover asset={editorialAssets.blogLaunch} priority className="mt-10 rounded-2xl border border-white/10" sizes="(max-width: 768px) 100vw, 720px" />

        <div className="mt-12 space-y-8 text-lg leading-relaxed text-zinc-300">

          {/* ── Intro ─────────────────────────────────────── */}
          <p>
            Today we are making FlexUI publicly available as a production-ready
            component registry. {COMPONENT_COUNT} cinematic React components — spring-physics
            buttons, WebGL shaders, 3D hover cards, full page templates — installable
            with a single CLI command, owned entirely by you.
          </p>

          <p>
            No npm package to depend on. No version lock-in. No bloated bundle. You
            run one command, the source code lands in your project, and you ship it
            however you want.
          </p>

          {/* ── The Problem ───────────────────────────────── */}
          <h2 className="text-2xl font-bold text-white pt-4">
            The Problem We Solved
          </h2>

          <p>
            Every production app eventually needs polish — a button that feels
            magnetic, a card that catches light, a hero section that commands attention.
            But building these from scratch takes days. Pulling in a UI library means
            inheriting someone else&apos;s opinions about styling, bundling, and
            architecture.
          </p>

          <p>
            We wanted a third option: a curated collection of components where you
            get the source code, not a dependency. Where every animation is
            GPU-accelerated, every component is fully typed, and you can modify
            anything without ejecting from a framework.
          </p>

          <p>
            That third option is FlexUI.
          </p>

          {/* ── How It Works ──────────────────────────────── */}
          <h2 className="text-2xl font-bold text-white pt-4">
            How It Works
          </h2>

          <p>
            FlexUI is a <strong className="text-white">shadcn-compatible registry</strong>.
            If you have used shadcn/ui, the workflow is identical. Add our registry URL
            to your project config, then install any component by name:
          </p>

          <CodeBlock
            code={`// Add to your components.json (one-time setup)
"registries": {
  "@flexui": "https://flex-ui-wine.vercel.app/r/{name}.json"
}

// Then install any component
npx shadcn@latest add @flexui/magnetic-button`}
            filename="Terminal"
          />

          <p>
            The CLI fetches the component JSON, reads the source code and dependency
            list, installs what is needed (like framer-motion or three.js), and writes
            the <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">.tsx</code> files
            directly into your project. No package.json entry for FlexUI itself. No
            version to track. The code is yours.
          </p>

          {/* ── What's Inside ─────────────────────────────── */}
          <h2 className="text-2xl font-bold text-white pt-4">
            What&apos;s Inside: {COMPONENT_COUNT} Components
          </h2>

          <p>
            The registry spans three tiers of complexity:
          </p>

          <div className="space-y-4">
            <div className="rounded-xl border border-green-500/20 bg-green-500/[0.04] p-5">
              <p className="text-sm font-bold text-green-400">Tier 1 — Enhanced Primitives</p>
              <p className="mt-1 text-sm text-zinc-400">
                Accordion, Badge, Avatar, Breadcrumb, Calendar, Tooltip, Switch, Slider,
                Progress Bar, Rating, OTP Input, Tag Input, and more. Foundational
                components with polished animations and full accessibility.
              </p>
            </div>

            <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-5">
              <p className="text-sm font-bold text-blue-400">Tier 2 — Cinematic Blocks</p>
              <p className="mt-1 text-sm text-zinc-400">
                Magnetic Button, Shimmer Button, Spotlight Card, Floating Panel,
                Morphing Dialog, Dock Menu, Marquee, Animated Tabs, Command Menu,
                Toast, Drawer, Expandable Card, and dozens more. Complex interactive
                components with spring physics and rich motion design.
              </p>
            </div>

            <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.04] p-5">
              <p className="text-sm font-bold text-orange-400">Tier 3 — WebGL Experiences</p>
              <p className="mt-1 text-sm text-zinc-400">
                Interactive Globe, Cosmic Eye, Shader Blob, 3D Hover Card, Particle
                Field, Neural Network, Infinite Canvas, Splash Cursor. GPU-accelerated,
                shader-driven components for immersive experiences.
              </p>
            </div>
          </div>

          <p>
            On top of individual components, FlexUI ships <strong className="text-white">7
            full page templates</strong>: SaaS Landing, Portfolio, Dashboard, E-commerce,
            Blog, Pricing, and Auth Login. Each template is a single install that
            bundles all the blocks it depends on.
          </p>

          <CodeBlock
            code={`npx shadcn@latest add @flexui/page:saas-landing
npx shadcn@latest add @flexui/page:pricing
npx shadcn@latest add @flexui/page:dashboard`}
            filename="Terminal"
          />

          {/* ── Framework Agnostic ────────────────────────── */}
          <h2 className="text-2xl font-bold text-white pt-4">
            Framework-Agnostic: Next.js, Vite, or Plain React
          </h2>

          <p>
            Every FlexUI component is a standard React component. There are no
            Next.js-specific imports — no <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">next/dynamic</code>,
            no <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">next/image</code>.
            Components use <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">React.lazy</code> for
            code splitting and standard <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">&lt;img&gt;</code> tags
            for images.
          </p>

          <p>
            If you are using Vite, configure
            the <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">@/</code> path
            alias in your <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">vite.config.ts</code> and
            you are good to go. If you are on Next.js, everything works out of the box.
          </p>

          {/* ── Animations That Actually Work ─────────────── */}
          <h2 className="text-2xl font-bold text-white pt-4">
            Animations That Actually Work After Install
          </h2>

          <p>
            One of the biggest pain points with component registries is animations
            breaking after install. The component file copies over, but the CSS
            keyframes it depends on stay behind.
          </p>

          <p>
            FlexUI solves this by <strong className="text-white">bundling everything
            a component needs</strong> into its registry JSON. When you install a
            component that uses CSS animations — like Shimmer Button, Marquee, or
            Gradient Border Button — the CLI also writes
            a <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">styles/flexui-animations.css</code> file
            containing all the keyframes. Components that depend on custom hooks
            like <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">useReducedMotion</code> get
            that hook file too. No manual copying, no missing dependencies.
          </p>

          {/* ── Performance ───────────────────────────────── */}
          <h2 className="text-2xl font-bold text-white pt-4">
            Built for Performance
          </h2>

          <p>
            Every animation in FlexUI is GPU-accelerated. We use CSS transforms
            and opacity for transitions instead of layout-triggering properties.
            Framer Motion handles spring physics with hardware-accelerated compositing.
            WebGL components lazy-load their canvas contexts and clean up on unmount.
          </p>

          <p>
            The entire FlexUI documentation site — 189 static pages — builds and
            deploys in under 2 minutes. The site scores 95+ on Lighthouse performance.
            Individual components add minimal bundle weight because they are
            tree-shakeable and only install the dependencies they actually use.
          </p>

          {/* ── MCP Server ────────────────────────────────── */}
          <h2 className="text-2xl font-bold text-white pt-4">
            AI-Native: MCP Server for Claude, Cursor, and Windsurf
          </h2>

          <p>
            FlexUI ships with
            an <strong className="text-white">MCP (Model Context Protocol) server</strong> that
            lets AI coding assistants discover, search, and install components
            directly. Ask Claude &quot;add a magnetic button&quot; and it knows exactly
            which component to fetch, what dependencies to install, and where to
            put the file.
          </p>

          <p>
            The MCP server exposes four tools: <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">list_components</code>,{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">get_component</code>,{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">search_components</code>, and{" "}
            <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-200">add_component</code>.
            It works with Claude Desktop, Cursor, VS Code, and Windsurf.
          </p>

          {/* ── Tech Stack ────────────────────────────────── */}
          <h2 className="text-2xl font-bold text-white pt-4">
            Tech Stack
          </h2>

          <div className="overflow-hidden rounded-xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-white/[0.04]">
                {[
                  ["Framework", "React 18+ / Next.js 16"],
                  ["Styling", "Tailwind CSS v4"],
                  ["Animations", "Framer Motion + CSS Keyframes"],
                  ["3D / WebGL", "Three.js + React Three Fiber + OGL"],
                  ["Types", "Full TypeScript coverage"],
                  ["Registry", "shadcn-compatible JSON format"],
                  ["CI/CD", "GitHub Actions + Vercel"],
                  ["AI Integration", "MCP Server (Claude, Cursor, Windsurf)"],
                ].map(([label, value]) => (
                  <tr key={label}>
                    <td className="px-4 py-2.5 font-medium text-zinc-400">{label}</td>
                    <td className="px-4 py-2.5 text-white">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Get Started ───────────────────────────────── */}
          <h2 className="text-2xl font-bold text-white pt-4">
            Get Started in 60 Seconds
          </h2>

          <CodeBlock
            code={`# 1. Init shadcn (if you haven't)
npx shadcn@latest init

# 2. Install your first FlexUI component
npx shadcn@latest add https://flex-ui-wine.vercel.app/r/magnetic-button.json

# 3. Use it
import { MagneticButton } from "@/components/flexui/magnetic-button";

<MagneticButton>Get Started</MagneticButton>`}
            filename="Terminal"
            language="bash"
          />

          <p>
            Or set up the registry for cleaner commands:
          </p>

          <CodeBlock
            code={`// components.json
"registries": {
  "@flexui": "https://flex-ui-wine.vercel.app/r/{name}.json"
}

// Then install by name
npx shadcn@latest add @flexui/magnetic-button
npx shadcn@latest add @flexui/spotlight-card
npx shadcn@latest add @flexui/page:saas-landing`}
            filename="components.json"
          />

          {/* ── CTA ───────────────────────────────────────── */}
          <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/[0.04] p-8 text-center">
            <p className="text-xl font-bold text-white">
              Ready to build something cinematic?
            </p>
            <p className="mt-2 text-zinc-400">
              Browse all {COMPONENT_COUNT} components, try the interactive playground, and start shipping.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a
                href="/docs/components"
                className="inline-flex items-center rounded-lg bg-purple-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500"
              >
                Browse Components
              </a>
              <a
                href="/docs/installation"
                className="inline-flex items-center rounded-lg border border-white/[0.1] bg-white/[0.03] px-6 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/[0.06]"
              >
                Installation Guide
              </a>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

