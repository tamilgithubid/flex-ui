"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Navbar } from "@/components/marketing/navbar";
import {
  ArrowRight,
  Layout,
  ShoppingBag,
  Briefcase,
  BarChart3,
  BookOpen,
  CreditCard,
  Lock,
} from "lucide-react";

const templates = [
  {
    name: "SaaS Landing",
    slug: "saas-landing",
    description:
      "Complete SaaS landing page with animated hero, features grid, stats counter, testimonials, FAQ accordion, and newsletter.",
    icon: Layout,
    image: "/templates/saas-landing.jpg",
    gradient: "from-blue-500 to-cyan-500",
    glow: "rgba(59, 130, 246, 0.15)",
    tags: ["Hero", "Features", "Stats", "FAQ"],
  },
  {
    name: "Portfolio",
    slug: "portfolio",
    description:
      "Creative developer portfolio with letter-by-letter hero, bento project grid, animated timeline, and skills showcase.",
    icon: Briefcase,
    image: "/templates/portfolio.jpg",
    gradient: "from-violet-500 to-fuchsia-500",
    glow: "rgba(139, 92, 246, 0.15)",
    tags: ["Hero", "Projects", "Timeline", "Skills"],
  },
  {
    name: "Dashboard",
    slug: "dashboard",
    description:
      "Premium admin dashboard with animated KPI cards, revenue chart, circular progress rings, and activity feed.",
    icon: BarChart3,
    image: "/templates/dashboard.jpg",
    gradient: "from-emerald-500 to-teal-500",
    glow: "rgba(16, 185, 129, 0.15)",
    tags: ["Sidebar", "Charts", "KPIs", "Activity"],
  },
  {
    name: "E-Commerce",
    slug: "ecommerce",
    description:
      "Luxury shopping experience with floating product showcase, brand marquee, gradient product cards, and category filters.",
    icon: ShoppingBag,
    image: "/templates/ecommerce.jpg",
    gradient: "from-orange-500 to-amber-500",
    glow: "rgba(249, 115, 22, 0.15)",
    tags: ["Products", "Cart", "Filters", "Marquee"],
  },
  {
    name: "Blog",
    slug: "blog",
    description:
      "Modern blog layout with featured post hero, category-colored cards, sticky sidebar, and tag cloud.",
    icon: BookOpen,
    image: "/templates/blog.jpg",
    gradient: "from-rose-500 to-pink-500",
    glow: "rgba(244, 63, 94, 0.15)",
    tags: ["Featured", "Grid", "Categories", "Tags"],
  },
  {
    name: "Pricing",
    slug: "pricing",
    description:
      "Three-tier pricing with animated toggle, rotating gradient borders, comparison table, and FAQ accordion.",
    icon: CreditCard,
    image: "/templates/pricing.jpg",
    gradient: "from-indigo-500 to-violet-500",
    glow: "rgba(99, 102, 241, 0.15)",
    tags: ["Toggle", "Cards", "Compare", "FAQ"],
  },
  {
    name: "Auth Login",
    slug: "auth-login",
    description:
      "Split-layout auth page with animated gradient orbs, social login, password toggle, and testimonial panel.",
    icon: Lock,
    image: "/templates/auth-login.jpg",
    gradient: "from-sky-500 to-blue-500",
    glow: "rgba(14, 165, 233, 0.15)",
    tags: ["Social Auth", "Form", "Split Layout"],
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 32, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 0.4, 0.25, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/[0.07] blur-[150px]" />
        <div className="absolute right-1/4 top-1/3 h-[500px] w-[500px] rounded-full bg-violet-500/[0.05] blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-36 pb-24">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] as const }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            7 Templates
          </span>
          <h1 className="mt-8 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Production-Ready{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Page Templates
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Cinematic full-page layouts with Framer Motion animations,
            glassmorphic UI, and premium design. Each template is self-contained
            and ready to ship.
          </p>
        </motion.div>

        {/* Template Grid */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {templates.map((t) => (
            <motion.div key={t.slug} variants={fadeUp}>
              <Link
                href={`/templates/${t.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-zinc-950/80 backdrop-blur-md transition-all duration-500 hover:border-white/[0.2] hover:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)]"
              >
                {/* Browser Mockup Header */}
                <div className="relative overflow-hidden border-b border-white/[0.08] bg-zinc-900/90">
                  {/* macOS Browser Controls bar */}
                  <div className="flex items-center justify-between px-3.5 py-2.5 bg-zinc-950/70 border-b border-white/[0.05]">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-[#27c93f]/80" />
                    </div>
                    {/* Simulated URL pill */}
                    <div className="flex items-center gap-1.5 rounded-md bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-mono text-zinc-400 border border-white/[0.05]">
                      <span className="text-zinc-600">https://</span>
                      <span>flexui.dev/templates/{t.slug}</span>
                    </div>
                    <div className="w-8" />
                  </div>

                  {/* Template Image with Zoom Effect */}
                  <div className="relative h-52 w-full overflow-hidden bg-zinc-950">
                    <Image
                      src={t.image}
                      alt={`${t.name} template preview`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Gradient Overlay for bottom transition */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
                  </div>

                  {/* Glowing Top Accent Line */}
                  <div className={`absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r ${t.gradient}`} />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-6">
                  {/* Icon & Title Row */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.gradient} shadow-lg ring-1 ring-white/20`}
                    >
                      <t.icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white transition-colors group-hover:text-cyan-300">
                      {t.name}
                    </h3>
                  </div>

                  <p className="flex-1 text-sm leading-relaxed text-zinc-400">
                    {t.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {t.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-white/[0.06] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.06] pt-4 text-sm font-semibold text-zinc-400 transition-colors group-hover:text-cyan-400">
                    <span>Explore Template</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </div>
                </div>

                {/* Hover Glow */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(600px circle at 50% 0%, ${t.glow}, transparent 60%)`,
                  }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-zinc-500">
            All templates are fully responsive, animated, and built with
            Framer Motion + Tailwind CSS.
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            View the source code at{" "}
            <code className="rounded bg-white/[0.05] px-1.5 py-0.5 text-xs text-zinc-400">
              components/flexui/pages/
            </code>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
