import { COMPONENT_COUNT } from "@/lib/component-stats";
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

      {/* Choose Your Framework */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Works With Your Stack</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Next.js */}
          <div className="group rounded-xl border border-white/[0.06] bg-zinc-950 p-6 text-center transition-all hover:border-purple-500/30 hover:bg-purple-500/[0.03]">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.05]">
              <svg viewBox="0 0 180 180" className="h-8 w-8" fill="none">
                <mask id="nj" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
                  <circle cx="90" cy="90" r="90" fill="black" />
                </mask>
                <g mask="url(#nj)">
                  <circle cx="90" cy="90" r="90" fill="black" />
                  <path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill="url(#nj-a)" />
                  <rect x="115" y="54" width="12" height="72" fill="url(#nj-b)" />
                </g>
                <defs>
                  <linearGradient id="nj-a" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="nj-b" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
                    <stop stopColor="white" /><stop offset="1" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="text-sm font-semibold text-white">Next.js</p>
            <p className="mt-1 text-xs text-zinc-500">
              Works out of the box with App Router
            </p>
          </div>

          {/* Vite */}
          <div className="group rounded-xl border border-white/[0.06] bg-zinc-950 p-6 text-center transition-all hover:border-purple-500/30 hover:bg-purple-500/[0.03]">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.05]">
              <svg viewBox="0 0 410 404" className="h-8 w-8" fill="none">
                <path d="M399.641 59.525l-183.998 327.82c-3.799 6.793-13.559 6.96-17.575.301L17.39 59.525c-4.416-7.221 2.467-15.708 10.566-13.543l177.203 47.291c1.166.311 2.387.303 3.548-.024l175.934-47.291c8.1-2.175 14.978 6.307 10.566 13.543z" fill="url(#vite-a)" />
                <path d="M293.305 1.094L169.691 27.054c-1.637.344-2.843 1.778-2.955 3.454l-7.604 114.246c-.205 3.073 2.601 5.439 5.597 4.722l25.876-6.186c3.228-.772 6.098 2.108 5.305 5.328l-9.07 36.833c-.823 3.343 2.26 6.255 5.552 5.244l20.539-6.307c3.3-1.014 6.384 1.908 5.548 5.26l-14.44 57.83c-1.2 4.806 5.097 7.377 7.608 3.11l1.675-2.848 92.511-186.753c1.756-3.549-1.423-7.504-5.271-6.559l-27.069 6.647c-3.378.83-6.32-2.367-5.28-5.739l17.377-56.318c1.042-3.377-1.913-6.575-5.293-5.728z" fill="url(#vite-b)" />
                <defs>
                  <linearGradient id="vite-a" x1="6.7" y1="32.08" x2="235.02" y2="344.16" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#41D1FF" /><stop offset="1" stopColor="#BD34FE" />
                  </linearGradient>
                  <linearGradient id="vite-b" x1="194.65" y1="8.82" x2="236.08" y2="292.99" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#FFBD4F" /><stop offset="1" stopColor="#FF9640" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <p className="text-sm font-semibold text-white">Vite</p>
            <p className="mt-1 text-xs text-zinc-500">
              Configure <code className="text-zinc-400">@/</code> path alias
            </p>
          </div>

          {/* React */}
          <div className="group rounded-xl border border-white/[0.06] bg-zinc-950 p-6 text-center transition-all hover:border-purple-500/30 hover:bg-purple-500/[0.03]">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-white/[0.05]">
              <svg viewBox="-11.5 -10.232 23 20.463" className="h-8 w-8">
                <circle r="2.05" fill="#61DAFB" />
                <g stroke="#61DAFB" strokeWidth="1" fill="none">
                  <ellipse rx="11" ry="4.2" />
                  <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                  <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                </g>
              </svg>
            </div>
            <p className="text-sm font-semibold text-white">React</p>
            <p className="mt-1 text-xs text-zinc-500">
              Any React 18+ setup with TypeScript
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
          Browse all {COMPONENT_COUNT} components in the{" "}
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

