"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { BookOpen, Star, X } from "lucide-react";

export interface BookItem {
  id: string | number;
  title: string;
  author: string;
  rating?: number;
  spineColor: string;
  coverImage: string;
  synopsis: string;
  pagesCount?: number;
  publishedYear?: string;
}

export interface BookshelfShowcaseProps {
  books?: BookItem[];
  className?: string;
}

const animeBooks: BookItem[] = [
  {
    id: 1,
    title: "TOJI FUSHIGURO",
    author: "Jujutsu Kaisen",
    rating: 5.0,
    spineColor: "from-neutral-800 via-neutral-900 to-black border-red-500/40",
    coverImage: "/templates/assets/toji_fushiguro.png",
    synopsis: "The Sorcerer Killer possessing zero cursed energy and physical perfection with the Inverted Spear of Heaven.",
    pagesCount: 240,
    publishedYear: "2026",
  },
  {
    id: 2,
    title: "SATORU GOJO",
    author: "Jujutsu Kaisen",
    rating: 4.9,
    spineColor: "from-cyan-600 via-blue-700 to-indigo-900 border-cyan-400/40",
    coverImage: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    synopsis: "The strongest sorcerer manipulating infinity, Six Eyes perception, and Unlimited Void domain expansion.",
    pagesCount: 320,
    publishedYear: "2026",
  },
  {
    id: 3,
    title: "BAKI HANMA",
    author: "Grappler Baki",
    rating: 4.8,
    spineColor: "from-amber-600 via-orange-700 to-red-900 border-amber-400/40",
    coverImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80",
    synopsis: "Champion of underground martial arts. Awakens the Demon Face back muscle during peak fights.",
    pagesCount: 290,
    publishedYear: "2025",
  },
  {
    id: 4,
    title: "RYOMEN SUKUNA",
    author: "Jujutsu Kaisen",
    rating: 4.9,
    spineColor: "from-purple-700 via-fuchsia-800 to-black border-purple-400/40",
    coverImage: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    synopsis: "King of Curses wielding Cleave, Dismantle, and Malevolent Shrine domain expansion.",
    pagesCount: 310,
    publishedYear: "2026",
  },
];

export function BookshelfShowcase({
  books = animeBooks,
  className,
}: BookshelfShowcaseProps) {
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-6 md:p-12 min-h-[560px] select-none",
        className
      )}
    >
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute h-[450px] w-[700px] rounded-full bg-cyan-500/10 blur-[160px]" />

      {/* 3D Bookshelf Viewport Container */}
      <div className="relative w-full max-w-4xl rounded-3xl border border-neutral-800 bg-neutral-950 p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-8">
          <div>
            <h3 className="text-xl font-black text-white">3D Virtual Manga Library</h3>
            <p className="text-xs text-neutral-400 font-light">
              Hover book spines to pull out in 3D perspective. Click to inspect volume details.
            </p>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-bold text-cyan-400">
            {books.length} Anime Volumes
          </span>
        </div>

        {/* The Wooden / Metallic Shelf Plank */}
        <div className="relative flex items-end justify-center gap-6 md:gap-10 pb-4 pt-14 perspective-[1400px] preserve-3d">
          {books.map((book) => (
            <motion.div
              key={book.id}
              onClick={() => setSelectedBook(book)}
              whileHover={{
                z: 80,
                y: -30,
                rotateY: -15,
                boxShadow: "0 25px 50px rgba(0,0,0,0.9)",
              }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className={cn(
                "group relative h-64 w-16 md:w-20 cursor-pointer rounded-r-xl border bg-gradient-to-b shadow-2xl preserve-3d",
                book.spineColor
              )}
            >
              {/* Spine Accent Line Top */}
              <div className="absolute top-0 inset-x-0 h-1.5 bg-amber-400/80 rounded-t-xl" />

              {/* Spine Text Vertical Right-Side Up */}
              <div className="flex h-full w-full flex-col justify-between p-3 text-center">
                <span className="text-[10px] font-mono font-bold text-white/70">
                  Vol.{book.id}
                </span>

                {/* Vertical Text Displayed Right-Side Up */}
                <div className="my-auto flex items-center justify-center [writing-mode:vertical-rl] rotate-180">
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    {book.title}
                  </span>
                </div>

                <span className="text-[9px] font-medium text-white/60 truncate">
                  {book.author}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Shelf Base Line */}
          <div className="absolute inset-x-0 bottom-0 h-4 rounded-xl border-t border-amber-500/30 bg-gradient-to-r from-neutral-900 via-amber-950/40 to-neutral-900 shadow-inner" />
        </div>
      </div>

      {/* Book Detail Modal Overlay */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative flex flex-col md:flex-row w-full max-w-2xl overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-950 p-6 md:p-8 shadow-2xl"
            >
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Cover Image */}
              <div className="relative h-64 md:h-72 w-full md:w-56 shrink-0 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-xl">
                <img
                  src={selectedBook.coverImage}
                  alt={selectedBook.title}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Content Details */}
              <div className="mt-6 md:mt-0 md:ml-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-bold">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span>{selectedBook.rating} / 5.0</span>
                    <span className="text-neutral-500">• {selectedBook.pagesCount} Pages</span>
                  </div>

                  <h3 className="mt-2 text-2xl font-black text-white leading-tight">
                    {selectedBook.title}
                  </h3>
                  <p className="text-xs font-semibold text-cyan-400 mt-1">
                    {selectedBook.author}
                  </p>

                  <p className="mt-4 text-xs leading-relaxed text-neutral-300 font-light">
                    {selectedBook.synopsis}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-black shadow-lg transition-transform active:scale-95 hover:bg-cyan-400"
                  >
                    <BookOpen className="h-4 w-4" />
                    Read Volume Preview
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
