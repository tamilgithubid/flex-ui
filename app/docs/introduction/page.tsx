import { COMPONENT_COUNT } from "@/lib/component-stats";
import { CodeBlock } from "@/components/ui/code-block";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Introduction — FlexUI",
  description: "Learn about FlexUI, a cinematic component registry with " + COMPONENT_COUNT + " animated React components.",
};

export default function IntroductionPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <p className="text-sm font-medium text-purple-400">Getting Started</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
          Introduction
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-400">
          FlexUI is an open-source component registry with{" "}
          <span className="text-white">{COMPONENT_COUNT} cinematic React components</span> —
          spring-physics animations, WebGL 3D effects, and full page templates.
          One command install. Zero lock-in.
        </p>
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* What is FlexUI */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">What is FlexUI?</h2>
        <p className="leading-relaxed text-zinc-400">
          FlexUI is <strong className="text-white">not an npm package</strong>.
          It&apos;s a{" "}
          <a
            href="https://ui.shadcn.com"
            className="text-purple-400 underline underline-offset-4 hover:text-purple-300"
            target="_blank"
            rel="noopener"
          >
            shadcn-compatible
          </a>{" "}
          component registry. You run one CLI command, the source code lands in
          your project, and you own every line.
        </p>
        <p className="leading-relaxed text-zinc-400">
          No black-box dependencies. No version conflicts. No vendor lock-in.
          Just clean, typed React code that lives in your codebase — ready to
          customize, extend, or ship as-is.
        </p>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">How It Works</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "01",
              title: "Run the CLI",
              desc: "Use the shadcn CLI with our registry to add any component.",
            },
            {
              step: "02",
              title: "Auto-install deps",
              desc: "The CLI installs framer-motion, three.js, CSS animations — whatever the component needs.",
            },
            {
              step: "03",
              title: "Own the code",
              desc: "The .tsx files are written into your project. Customize freely.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-white/[0.06] bg-zinc-950 p-5"
            >
              <span className="text-xs font-bold text-purple-400">
                STEP {item.step}
              </span>
              <h3 className="mt-2 text-base font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Quick Start</h2>
        <CodeBlock
          code={`npx shadcn@latest add https://flex-ui-wine.vercel.app/r/magnetic-button.json`}
          filename="Terminal"
        />
        <p className="leading-relaxed text-zinc-400">
          Or set up the registry for cleaner commands:
        </p>
        <CodeBlock
          code={`// Add to components.json (one-time)
"registries": {
  "@flexui": "https://flex-ui-wine.vercel.app/r/{name}.json"
}

// Then install by name
npx shadcn@latest add @flexui/magnetic-button`}
          filename="components.json"
        />
        <p className="leading-relaxed text-zinc-400">
          Use it in your code:
        </p>
        <CodeBlock
          code={`import { MagneticButton } from "@/components/flexui/magnetic-button";

export default function Page() {
  return (
    <MagneticButton className="px-8 py-4 text-lg">
      Get Started
    </MagneticButton>
  );
}`}
          filename="app/page.tsx"
          language="tsx"
        />
      </section>

      {/* Framework support */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Framework Support</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { name: "Next.js", desc: "Works out of the box with App Router" },
            { name: "Vite", desc: "Configure @/ path alias in vite.config.ts" },
            { name: "React", desc: "Any React 18+ setup with TypeScript" },
          ].map((fw) => (
            <div key={fw.name} className="rounded-xl border border-white/[0.06] bg-zinc-950 p-5 text-center">
              <p className="text-sm font-semibold text-white">{fw.name}</p>
              <p className="mt-1 text-xs text-zinc-500">{fw.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Component tiers */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">{COMPONENT_COUNT} Components Across 3 Tiers</h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-green-500/20 bg-green-500/[0.04] p-5">
            <h3 className="text-sm font-bold text-green-400">Tier 1 — Enhanced Primitives</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Accordion, Badge, Avatar, Tooltip, Switch, Calendar, Rating, OTP Input, Breadcrumb, and more.
              Foundational components with polished animations.
            </p>
            <p className="mt-2 text-xs text-zinc-600">
              Deps: <code className="text-green-400/80">framer-motion</code>
            </p>
          </div>

          <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.04] p-5">
            <h3 className="text-sm font-bold text-blue-400">Tier 2 — Cinematic Blocks</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Magnetic Button, Spotlight Card, Floating Panel, Morphing Dialog, Dock Menu, Marquee,
              Command Menu, Toast, Drawer, Expandable Card, and 50+ more. Rich motion design with spring physics.
            </p>
            <p className="mt-2 text-xs text-zinc-600">
              Deps: <code className="text-blue-400/80">framer-motion, lucide-react</code>
            </p>
          </div>

          <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.04] p-5">
            <h3 className="text-sm font-bold text-orange-400">Tier 3 — WebGL Experiences</h3>
            <p className="mt-1 text-sm text-zinc-500">
              Interactive Globe, Cosmic Eye, Shader Blob, 3D Hover Card, Particle Field,
              Neural Network, Splash Cursor. GPU-accelerated, shader-driven immersive components.
            </p>
            <p className="mt-2 text-xs text-zinc-600">
              Deps: <code className="text-orange-400/80">three, @react-three/fiber, ogl</code>
            </p>
          </div>
        </div>
      </section>

      {/* Page templates */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Full Page Templates</h2>
        <p className="leading-relaxed text-zinc-400">
          Install complete pages with one command — all blocks bundled automatically:
        </p>
        <CodeBlock
          code={`npx shadcn@latest add @flexui/page:saas-landing
npx shadcn@latest add @flexui/page:pricing
npx shadcn@latest add @flexui/page:dashboard
npx shadcn@latest add @flexui/page:portfolio
npx shadcn@latest add @flexui/page:ecommerce
npx shadcn@latest add @flexui/page:auth-login`}
          filename="Terminal"
        />
      </section>

      {/* Component Studio */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Component Studio</h2>
        <p className="leading-relaxed text-zinc-400">
          FlexUI Studio is an AI-powered component workspace for generating, analyzing,
          and previewing components in real-time.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { title: "Generate Component", desc: "Describe in natural language, get production code", status: "Coming Soon" },
            { title: "Analyze", desc: "Paste any component for performance analysis", status: "Coming Soon" },
            { title: "Live Playground", desc: "Adjust props in real-time with instant preview", status: "Available" },
          ].map((item) => (
            <div key={item.title} className="rounded-xl border border-white/[0.06] bg-zinc-950 p-5">
              <h3 className="text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-1 text-xs text-zinc-500">{item.desc}</p>
              <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                item.status === "Available"
                  ? "bg-green-500/10 text-green-400"
                  : "bg-zinc-800 text-zinc-500"
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* MCP Server */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">AI Integration — MCP Server</h2>
        <p className="leading-relaxed text-zinc-400">
          FlexUI ships with an MCP server that lets AI coding assistants (Claude, Cursor, Windsurf)
          discover, search, and install components directly.
        </p>
        <CodeBlock
          code={`// Claude Desktop / Cursor config
{
  "mcpServers": {
    "flexui": { "command": "npx", "args": ["-y", "@flexui/mcp-server"] }
  }
}`}
          filename="mcp-config.json"
          language="json"
        />
      </section>

      {/* Tech stack */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Tech Stack</h2>
        <div className="overflow-hidden rounded-xl border border-white/[0.06]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-zinc-950">
                <th className="px-4 py-3 text-left font-medium text-zinc-400">Technology</th>
                <th className="px-4 py-3 text-left font-medium text-zinc-400">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {[
                ["React 18+ / Next.js 16", "UI framework + SSR"],
                ["Tailwind CSS v4", "Utility-first styling"],
                ["Framer Motion", "Spring physics, gestures, layout transitions"],
                ["Three.js + R3F + OGL", "WebGL 3D experiences + shaders"],
                ["shadcn Protocol", "Registry-based component distribution"],
                ["TypeScript", "End-to-end type safety"],
                ["GitHub Actions + Vercel", "CI/CD + production hosting"],
                ["MCP Server", "AI integration (Claude, Cursor, Windsurf)"],
              ].map(([tech, purpose]) => (
                <tr key={tech}>
                  <td className="px-4 py-3 font-medium text-white">{tech}</td>
                  <td className="px-4 py-3 text-zinc-500">{purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Next step */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.04] p-6">
        <p className="text-sm text-zinc-400">
          Ready to get started?{" "}
          <a
            href="/docs/installation"
            className="font-medium text-purple-400 underline underline-offset-4 hover:text-purple-300"
          >
            Follow the installation guide →
          </a>
        </p>
      </div>
    </div>
  );
}

