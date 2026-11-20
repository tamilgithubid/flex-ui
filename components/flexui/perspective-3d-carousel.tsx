"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ArrowUpRight, X } from "lucide-react";

export interface PerspectiveCardItem {
  id: string | number;
  title: string;
  category?: string;
  image: string;
  description?: string;
  stats?: string;
}

export interface Perspective3DCarouselProps {
  items?: PerspectiveCardItem[];
  className?: string;
}

const animeItems: PerspectiveCardItem[] = [
  {
    id: 1,
    title: "Toji Fushiguro",
    category: "Heavenly Restriction",
    image: "/templates/assets/toji_fushiguro.png",
    description: "The Sorcerer Killer. Zero cursed energy with superhuman physical speed and Inverted Spear of Heaven.",
    stats: "Sorcerer Killer • 0 Cursed Energy",
  },
  {
    id: 2,
    title: "Satoru Gojo",
    category: "Limitless & Six Eyes",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    description: "The strongest Jujutsu sorcerer. Manipulates spatial infinity and unleashes Hollow Purple.",
    stats: "Domain: Unlimited Void",
  },
  {
    id: 3,
    title: "Baki Hanma",
    category: "Demon Back Warrior",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    description: "Champion of underground martial arts. Awakens the Demon Face muscle back in peak combat.",
    stats: "Peak Martial Arts",
  },
  {
    id: 4,
    title: "Ryomen Sukuna",
    category: "King of Curses",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    description: "Ancient King of Curses wielding Cleave, Dismantle, and Malevolent Shrine domain expansion.",
    stats: "Domain: Malevolent Shrine",
  },
];

export function Perspective3DCarousel({
  items = animeItems,
  className,
}: Perspective3DCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeModal, setActiveModal] = useState<PerspectiveCardItem | null>(null);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-6 md:p-12 min-h-[540px] overflow-hidden select-none",
        className
      )}
    >
      <div className="mb-6 flex items-center gap-2 z-20">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(idx)}
            className={cn(
              "rounded-full px-3.5 py-1 text-xs font-bold transition-all",
              idx === activeIndex
                ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white"
            )}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div className="relative flex h-[380px] w-full max-w-4xl items-center justify-center perspective-[1200px] preserve-3d">
        {items.map((item, index) => {
          const offset = index - activeIndex;
          const absOffset = Math.abs(offset);
          const isCenter = offset === 0;

          const rotateY = offset * -28;
          const translateX = offset * 220;
          const translateZ = isCenter ? 120 : -140 * absOffset;
          const scale = isCenter ? 1 : 0.84 - absOffset * 0.08;
          const opacity = isCenter ? 1 : Math.max(0.3, 0.7 - absOffset * 0.25);
          const zIndex = items.length - absOffset;

          return (
            <motion.div
              key={item.id}
              onClick={() => {
                if (isCenter) {
                  setActiveModal(item);
                } else {
                  setActiveIndex(index);
                }
              }}
              animate={{
                rotateY,
                x: translateX,
                z: translateZ,
                scale,
                opacity,
              }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              style={{ zIndex }}
              className={cn(
                "group absolute h-[340px] w-[270px] md:w-[310px] cursor-pointer overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 p-4 shadow-2xl transition-all duration-300",
                isCenter && "border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)] ring-1 ring-cyan-500/40"
              )}
            >
              <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
                <span className="absolute left-3 top-3 rounded-full border border-neutral-700 bg-neutral-950/80 px-3 py-1 text-[10px] font-bold text-cyan-400 backdrop-blur-md">
                  {item.category}
                </span>
              </div>

              <div className="mt-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {item.title}
                  </h4>
                  <ArrowUpRight className="h-4 w-4 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {item.description && (
                  <p className="mt-1 text-xs leading-relaxed text-neutral-400 line-clamp-2 font-light">
                    {item.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center gap-4 z-20">
        <button
          onClick={prevSlide}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-cyan-500/40 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "h-2.5 rounded-full transition-all duration-300",
                i === activeIndex ? "w-8 bg-cyan-400" : "w-2.5 bg-neutral-700"
              )}
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-cyan-500/40 hover:text-white transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl"
            >
              <button
                onClick={() => setActiveModal(null)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 mb-4">
                <img src={activeModal.image} alt={activeModal.title} className="h-full w-full object-cover object-top" />
              </div>

              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
                {activeModal.category}
              </span>
              <h3 className="mt-2 text-xl font-bold text-white">{activeModal.title}</h3>
              <p className="mt-2 text-xs text-neutral-300 leading-relaxed font-light">{activeModal.description}</p>
              <p className="mt-3 text-xs font-mono font-semibold text-cyan-400">{activeModal.stats}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
