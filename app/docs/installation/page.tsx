import { CodeBlock } from "@/components/ui/code-block";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Installation — FlexUI",
  description: "Set up your project to use FlexUI components with shadcn CLI.",
};

export default function InstallationPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <p className="text-sm font-medium text-purple-400">Getting Started</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-white">
          Installation
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-zinc-400">
          Get FlexUI components into your project in under a minute. Works with
          Next.js, Vite, and any React framework.
        </p>
      </div>

      <div className="h-px bg-white/[0.06]" />

      {/* Prerequisites */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Prerequisites</h2>
        <ul className="space-y-2 text-zinc-400">
          {[
            "React 18+ with TypeScript",
            "Tailwind CSS v4 configured",
            "shadcn/ui initialized (npx shadcn@latest init)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-px bg-white/[0.06]" />

      {/* Step 1: Init shadcn */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Step 1: Initialize shadcn/ui
        </h2>
        <p className="leading-relaxed text-zinc-400">
          If you haven&apos;t already, initialize shadcn/ui in your project:
        </p>
        <CodeBlock code="npx shadcn@latest init" filename="Terminal" />
      </section>

      {/* Step 2: Add FlexUI Registry */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Step 2: Add FlexUI Registry
        </h2>
        <p className="leading-relaxed text-zinc-400">
          Add the FlexUI registry to
          your <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-300">components.json</code> file:
        </p>
        <CodeBlock
          code={`"registries": {
  "@flexui": "https://flex-ui-wine.vercel.app/r/{name}.json"
}`}
          filename="components.json"
          language="json"
        />
        <p className="text-sm text-zinc-500">
          This is a one-time setup. Once added, you can install any component
          with the <code className="text-zinc-300">@flexui/</code> prefix.
        </p>
      </section>

      {/* Step 3: Install Components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Step 3: Install Components
        </h2>
        <CodeBlock
          code="npx shadcn@latest add @flexui/magnetic-button"
          filename="Terminal"
        />
        <p className="leading-relaxed text-zinc-400">
          This will fetch the component, install npm dependencies, and write the files
          into your project.
        </p>
        <div className="rounded-lg border border-white/[0.06] bg-zinc-950 p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 mb-2">
            Alternative: Direct URL (no registry config needed)
          </p>
          <CodeBlock
            code="npx shadcn@latest add https://flex-ui-wine.vercel.app/r/magnetic-button.json"
            filename="Terminal"
          />
        </div>
      </section>

      {/* Step 4: Import Animations CSS */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Step 4: Import Animations CSS
        </h2>
        <p className="leading-relaxed text-zinc-400">
          Components that use CSS animations will auto-install
          a <code className="rounded bg-zinc-800 px-1.5 py-0.5 text-sm text-zinc-300">styles/flexui-animations.css</code> file.
          Import it in your app entry point:
        </p>

        {/* Next.js */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-300">Next.js</p>
          <CodeBlock
            code={`// app/layout.tsx
import "@/styles/flexui-animations.css";`}
            filename="app/layout.tsx"
            language="tsx"
          />
        </div>

        {/* Vite / React */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-300">Vite / React</p>
          <CodeBlock
            code={`// src/main.tsx
import "./styles/flexui-animations.css";`}
            filename="src/main.tsx"
            language="tsx"
          />
        </div>

        <p className="text-sm text-zinc-500">
          Skip this step if you only use components with Framer Motion animations
          (they work without extra CSS).
        </p>
      </section>

      {/* Step 5: Use the Component */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Step 5: Use the Component
        </h2>
        <CodeBlock
          code={`import { MagneticButton } from "@/components/flexui/magnetic-button";

export default function Hero() {
  return (
    <section className="flex items-center justify-center min-h-screen">
      <MagneticButton className="px-8 py-4 text-lg">
        Get Started
      </MagneticButton>
    </section>
  );
}`}
          filename="app/page.tsx"
          language="tsx"
        />
      </section>

      <div className="h-px bg-white/[0.06]" />

      {/* Framework Notes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Framework Notes</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-5">
            <p className="text-sm font-semibold text-white">Next.js</p>
            <p className="mt-1.5 text-sm text-zinc-500">
              All FlexUI components work out of the box with Next.js App Router.
              The <code className="text-zinc-300">&quot;use client&quot;</code> directive
              is already included.
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-5">
            <p className="text-sm font-semibold text-white">Vite / React</p>
            <p className="mt-1.5 text-sm text-zinc-500">
              FlexUI components are framework-agnostic React components. Make sure
              your <code className="text-zinc-300">vite.config.ts</code> has
              the <code className="text-zinc-300">@/</code> path alias configured.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-white/[0.06]" />

      {/* Available components */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">
          Popular Components
        </h2>
        <div className="overflow-hidden rounded-xl border border-white/[0.06]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] bg-zinc-950">
                <th className="px-4 py-3 text-left font-medium text-zinc-400">
                  Component
                </th>
                <th className="px-4 py-3 text-left font-medium text-zinc-400">
                  Command
                </th>
                <th className="hidden px-4 py-3 text-left font-medium text-zinc-400 sm:table-cell">
                  Dependencies
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {[
                { name: "Magnetic Button", slug: "magnetic-button", deps: "framer-motion" },
                { name: "Shimmer Button", slug: "shimmer-button", deps: "framer-motion" },
                { name: "Gradient Border Button", slug: "gradient-border-button", deps: "framer-motion" },
                { name: "Floating Panel", slug: "floating-panel", deps: "framer-motion, lucide-react" },
                { name: "Expandable Card", slug: "expandable-card", deps: "framer-motion" },
                { name: "Toast", slug: "toast", deps: "framer-motion" },
                { name: "Animated Tabs", slug: "animated-tabs", deps: "framer-motion" },
                { name: "Spotlight Card", slug: "spotlight-card", deps: "framer-motion" },
                { name: "3D Hover Card", slug: "three-hover-card", deps: "three, @react-three/fiber" },
                { name: "Interactive Globe", slug: "interactive-globe", deps: "three, three-globe" },
              ].map((c) => (
              <tr key={c.slug}>
                <td className="px-4 py-3 font-medium text-white">
                  {c.name}
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs text-purple-400">
                    @flexui/{c.slug}
                  </code>
                </td>
                <td className="hidden px-4 py-3 text-zinc-500 sm:table-cell">
                  {c.deps}
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-zinc-500">
          Browse all 150+ components in the{" "}
          <a href="/docs/components" className="text-purple-400 hover:text-purple-300 underline underline-offset-4">
            Components
          </a>{" "}
          section.
        </p>
      </section>

      <div className="h-px bg-white/[0.06]" />

      {/* Troubleshooting */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Troubleshooting</h2>
        <div className="space-y-3">
          <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-5">
            <h3 className="text-sm font-semibold text-white">
              &quot;Cannot find module @/lib/utils&quot;
            </h3>
            <p className="mt-1.5 text-sm text-zinc-500">
              Run <code className="text-zinc-300">npx shadcn@latest init</code> first.
              This creates the <code className="text-zinc-300">cn()</code> utility that
              FlexUI components depend on.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-5">
            <h3 className="text-sm font-semibold text-white">
              Animations not working
            </h3>
            <p className="mt-1.5 text-sm text-zinc-500">
              Make sure you imported the animations CSS file in your app entry
              point: <code className="text-zinc-300">import &quot;@/styles/flexui-animations.css&quot;</code>.
              See Step 4 above.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-5">
            <h3 className="text-sm font-semibold text-white">
              &quot;Failed to resolve import next/dynamic&quot; (Vite)
            </h3>
            <p className="mt-1.5 text-sm text-zinc-500">
              This error only affects 2 components (Interactive Globe, Cinematic Hero)
              that use Next.js dynamic imports. All other FlexUI components work in both
              Next.js and Vite.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-zinc-950 p-5">
            <h3 className="text-sm font-semibold text-white">
              Three.js peer dependency warnings
            </h3>
            <p className="mt-1.5 text-sm text-zinc-500">
              For WebGL components, the CLI auto-installs{" "}
              <code className="text-zinc-300">three</code>,{" "}
              <code className="text-zinc-300">@react-three/fiber</code>, and{" "}
              <code className="text-zinc-300">@react-three/drei</code>. Peer
              dependency warnings are safe to ignore.
            </p>
          </div>
        </div>
      </section>

      {/* Next step */}
      <div className="rounded-xl border border-purple-500/20 bg-purple-500/[0.04] p-6">
        <p className="text-sm text-zinc-400">
          Want to integrate FlexUI with AI tools?{" "}
          <a
            href="/docs/mcp-server"
            className="font-medium text-purple-400 underline underline-offset-4 hover:text-purple-300"
          >
            Learn about our MCP Server →
          </a>
        </p>
      </div>
    </div>
  );
}
