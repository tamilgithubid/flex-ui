"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, RotateCcw } from "lucide-react";

export interface BookPageSpread {
  id: number;
  leftPageNum?: number;
  rightPageNum?: number;
  leftTitle?: string;
  leftSubtitle?: string;
  rightChapterTitle?: string;
  rightQuotes?: string[];
  isEndPage?: boolean;
}

export interface InteractiveBook3DProps {
  bookTitle?: string;
  bookAuthor?: string;
  coverImage?: string;
  pages?: BookPageSpread[];
  className?: string;
}

const defaultPages: BookPageSpread[] = [
  {
    id: 1,
    leftTitle: "Toji Fushiguro Chronicles",
    leftSubtitle: "HEAVENLY RESTRICTION",
    rightPageNum: 1,
    rightChapterTitle: "Chapter 1: The Sorcerer Killer",
    rightQuotes: [
      `"Zero cursed energy. Absolute physical perfection. The Sorcerer Killer who bypassed all Jujutsu barriers."`,
      `"With the Inverted Spear of Heaven, even the strongest infinity of Satoru Gojo is nullified."`,
    ],
  },
  {
    id: 2,
    leftPageNum: 2,
    rightPageNum: 3,
    rightChapterTitle: "Chapter 2: Satoru Gojo - Six Eyes",
    rightQuotes: [
      `"Throughout Heaven and Earth, I alone am the honored one. Unlimited Void expands your perception to infinity."`,
      `"Infinity is the convergence of an infinite series. When anything tries to touch me, it slows down infinitely."`,
    ],
  },
  {
    id: 3,
    leftPageNum: 4,
    rightPageNum: 5,
    rightChapterTitle: "Chapter 3: Baki Hanma - Demon Back",
    rightQuotes: [
      `"True strength is not just muscle density, but the relentless will to overcome any titan standing in your path."`,
      `"When the muscle fibers on the back form the face of a grinning demon, victory is already sealed."`,
    ],
  },
  {
    id: 4,
    leftPageNum: 6,
    isEndPage: true,
  },
];

export function InteractiveBook3D({
  bookTitle = "Toji Fushiguro",
  bookAuthor = "HEAVENLY RESTRICTION ARCHIVES",
  coverImage = "/templates/assets/toji_fushiguro.png",
  pages = defaultPages,
  className,
}: InteractiveBook3DProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  const currentPage = pages[currentPageIndex];

  const turnNext = () => {
    if (isFlipping || currentPageIndex >= pages.length - 1) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPageIndex((prev) => prev + 1);
      setIsFlipping(false);
    }, 380);
  };

  const turnPrev = () => {
    if (isFlipping || currentPageIndex <= 0) return;
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentPageIndex((prev) => prev - 1);
      setIsFlipping(false);
    }, 380);
  };

  const resetBook = () => {
    setCurrentPageIndex(0);
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-4 md:p-10 min-h-[560px] select-none",
        className
      )}
    >
      <div className="relative flex flex-col items-center justify-center w-full max-w-4xl min-h-[500px] rounded-3xl border border-neutral-800/80 bg-[#0c0d10] p-6 md:p-12 shadow-2xl overflow-hidden">
        
        {/* ================= CLOSED BOOK STATE (Screenshot 1) ================= */}
        {!isOpen && (
          <div className="flex flex-col items-center justify-center space-y-6">
            <motion.div
              whileHover={{ scale: 1.03, rotateY: -8 }}
              onClick={() => setIsOpen(true)}
              className="relative h-[440px] w-[300px] cursor-pointer overflow-hidden rounded-2xl border border-neutral-700/80 bg-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-500 hover:shadow-[0_25px_60px_rgba(0,0,0,0.95)]"
            >
              <img
                src={coverImage}
                alt={bookTitle}
                className="h-full w-full object-cover object-top brightness-90 transition-all duration-500 hover:brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 to-transparent" />

              <div className="absolute bottom-0 inset-x-0 p-6 space-y-1 text-white">
                <h3 className="font-serif text-xl md:text-2xl font-bold leading-tight">
                  {bookTitle}
                </h3>
                <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-neutral-400">
                  {bookAuthor}
                </p>
              </div>
            </motion.div>

            <span className="font-sans text-xs font-medium tracking-widest text-neutral-400 uppercase">
              CLICK TO OPEN
            </span>
          </div>
        )}

        {/* ================= OPENED DUAL-PAGE SPREAD STATE (Screenshots 2 & 3) ================= */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex flex-col items-center justify-center w-full max-w-3xl"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-10 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors z-40"
              title="Close Book"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex w-full h-[400px] md:h-[450px] shadow-[0_25px_60px_rgba(0,0,0,0.9)] rounded-lg overflow-hidden perspective-[1400px]">
              
              {/* LEFT PAGE */}
              <div
                onClick={turnPrev}
                className={cn(
                  "relative flex-1 bg-[#faf8f5] p-8 text-neutral-900 border-r border-neutral-300/60 flex flex-col justify-between shadow-[inset_-15px_0_20px_rgba(0,0,0,0.06)]",
                  currentPageIndex > 0 && "cursor-pointer"
                )}
              >
                {currentPage.leftPageNum && (
                  <span className="text-xs font-serif text-neutral-400 self-start">
                    {currentPage.leftPageNum}
                  </span>
                )}

                {currentPage.leftTitle ? (
                  <div className="my-auto text-center space-y-4 px-4">
                    <h2 className="font-serif text-2xl md:text-3xl font-semibold text-neutral-800 leading-tight">
                      {currentPage.leftTitle}
                    </h2>
                    <div className="h-0.5 w-12 bg-neutral-400/50 mx-auto" />
                    <p className="font-sans text-[11px] uppercase tracking-widest text-neutral-500 font-medium">
                      {currentPage.leftSubtitle}
                    </p>
                  </div>
                ) : (
                  <div className="my-auto flex items-center justify-center">
                    <span className="font-serif text-8xl font-bold text-neutral-200/60 select-none">
                      {currentPage.leftPageNum}
                    </span>
                  </div>
                )}
                <div />
              </div>

              {/* SPINE CREASE */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none bg-gradient-to-r from-black/15 via-black/30 to-black/15 z-20" />

              {/* RIGHT PAGE */}
              <div
                onClick={turnNext}
                className={cn(
                  "relative flex-1 bg-[#fdfbf7] p-8 text-neutral-900 flex flex-col justify-between shadow-[inset_15px_0_20px_rgba(0,0,0,0.04)]",
                  currentPageIndex < pages.length - 1 && "cursor-pointer"
                )}
              >
                {currentPage.rightPageNum && (
                  <span className="text-xs font-serif text-neutral-400 self-end">
                    {currentPage.rightPageNum}
                  </span>
                )}

                {!currentPage.isEndPage && (
                  <div className="my-auto space-y-6 px-2">
                    <h3 className="font-serif text-xl font-bold text-neutral-800 text-center">
                      {currentPage.rightChapterTitle}
                    </h3>
                    <div className="space-y-4">
                      {currentPage.rightQuotes?.map((q, idx) => (
                        <p
                          key={idx}
                          className="font-serif text-xs md:text-sm text-neutral-700 leading-relaxed italic"
                        >
                          {q}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {currentPage.isEndPage && (
                  <div className="my-auto flex flex-col items-center justify-center space-y-6 text-center">
                    <span className="font-serif text-lg italic text-neutral-500">
                      The End
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetBook();
                      }}
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-5 py-2 text-xs font-sans text-neutral-700 shadow-sm transition-all hover:bg-neutral-100"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      Read Again
                    </button>
                  </div>
                )}
                <div />
              </div>

              {/* PAGE FLIP SHADOW */}
              <AnimatePresence>
                {isFlipping && (
                  <motion.div
                    initial={{ rotateY: 0 }}
                    animate={{ rotateY: -180 }}
                    transition={{ duration: 0.38, ease: "easeInOut" }}
                    style={{ transformOrigin: "left center" }}
                    className="absolute inset-y-0 left-1/2 w-1/2 bg-[#fdfbf7] p-8 border-l border-neutral-300/60 shadow-2xl z-30 preserve-3d"
                  >
                    <div className="h-full w-full bg-gradient-to-r from-black/10 to-transparent opacity-40" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
