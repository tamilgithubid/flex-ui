"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Sliders, X } from "lucide-react";

export interface DiagonalCard {
  id: string | number;
  title: string;
  category: string;
  image: string;
  tag?: string;
  desc?: string;
}

export interface DiagonalParallaxCarouselProps {
  cards?: DiagonalCard[];
  className?: string;
  defaultAngle?: number;
}

const animeCards: DiagonalCard[] = [
  {
    id: 1,
    title: "Satoru Gojo",
    category: "Jujutsu Kaisen",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    tag: "Limitless",
    desc: "Unlimited Void & Six Eyes spatial technique.",
  },
  {
    id: 2,
    title: "Baki Hanma",
    category: "Grappler Baki",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    tag: "Demon Back",
    desc: "Unstoppable muscle back warrior of underground arena.",
  },
  {
    id: 3,
    title: "Toji Fushiguro",
    category: "Jujutsu Kaisen",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80",
    tag: "Sorcerer Killer",
    desc: "Heavenly restriction with inverted spear of heaven.",
  },
  {
    id: 4,
    title: "Ryomen Sukuna",
    category: "Jujutsu Kaisen",
    image: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    tag: "King of Curses",
    desc: "Malevolent Shrine domain expansion.",
  },
  {
    id: 5,
    title: "Yuta Okkotsu",
    category: "Jujutsu Kaisen",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80",
    tag: "Queen Rika",
    desc: "Special grade sorcerer with boundless cursed energy.",
  },
];

export function DiagonalParallaxCarousel({
  cards = animeCards,
  className,
  defaultAngle = -10,
}: DiagonalParallaxCarouselProps) {
  const [angle, setAngle] = useState(defaultAngle);
  const [selectedCard, setSelectedCard] = useState<DiagonalCard | null>(null);

  const marqueeList = [...cards, ...cards, ...cards];

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden py-16 min-h-[500px] bg-neutral-950 select-none",
        className
      )}
    >
      <div className="absolute top-4 right-4 z-20 flex items-center gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/90 px-4 py-2 text-xs text-neutral-300 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <span>Angle: {angle}°</span>
          <input
            type="range"
            min="-20"
            max="20"
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-20 accent-cyan-400"
          />
        </div>
      </div>

      <div
        className="flex flex-col gap-8 transition-transform duration-500 ease-out"
        style={{ transform: `rotate(${angle}deg) scale(1.12)` }}
      >
        <div className="flex w-full overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, ease: "linear", repeat: Infinity }}
            className="flex shrink-0 gap-6"
          >
            {marqueeList.map((card, idx) => (
              <div
                key={`r1-${card.id}-${idx}`}
                onClick={() => setSelectedCard(card)}
                className="group relative h-52 w-80 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/90 transition-all duration-500 hover:border-cyan-500/60 hover:scale-105"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

                <div className="absolute inset-0 flex flex-col justify-between p-5 z-10">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold text-cyan-400">
                      {card.category}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 opacity-0 transition-opacity group-hover:opacity-100">
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {card.title}
                    </h4>
                    {card.desc && (
                      <p className="mt-1 text-xs text-neutral-400 line-clamp-1 font-light">
                        {card.desc}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {selectedCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl"
            >
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 mb-4">
                <img src={selectedCard.image} alt={selectedCard.title} className="h-full w-full object-cover" />
              </div>

              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400">
                {selectedCard.category}
              </span>
              <h3 className="mt-2 text-xl font-bold text-white">{selectedCard.title}</h3>
              <p className="mt-2 text-xs text-neutral-300 leading-relaxed font-light">{selectedCard.desc}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
