"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Folder, FolderOpen, FileText, Image as ImageIcon, Code, ArrowUpRight, Search, Filter, X } from "lucide-react";

export interface FolderFileItem {
  id: string | number;
  name: string;
  type: "document" | "image" | "code";
  size: string;
  updated: string;
  image?: string;
  tags?: string[];
}

export interface MorphingFolderPreviewProps {
  folderName?: string;
  files?: FolderFileItem[];
  className?: string;
}

const defaultFiles: FolderFileItem[] = [
  {
    id: 1,
    name: "Neural_Cluster_Config.json",
    type: "code",
    size: "4.2 KB",
    updated: "2 mins ago",
    image: "/templates/assets/blog_cover_ai.jpg",
    tags: ["AI", "JSON"],
  },
  {
    id: 2,
    name: "Design_Tokens_v2.fig",
    type: "image",
    size: "18.6 MB",
    updated: "1 hour ago",
    image: "/templates/assets/blog_cover_design.jpg",
    tags: ["Figma", "UI"],
  },
  {
    id: 3,
    name: "Aurum_SpecSheet_2026.pdf",
    type: "document",
    size: "2.8 MB",
    updated: "Yesterday",
    image: "/templates/assets/ecom_watch.jpg",
    tags: ["PDF", "Specs"],
  },
  {
    id: 4,
    name: "Audio_Spatial_DSP.cpp",
    type: "code",
    size: "12.4 KB",
    updated: "3 days ago",
    image: "/templates/assets/ecom_headphones.jpg",
    tags: ["C++", "Audio"],
  },
];

export function MorphingFolderPreview({
  folderName = "Spatial UI Assets & Core Specs",
  files = defaultFiles,
  className,
}: MorphingFolderPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "code" | "image" | "document">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<FolderFileItem | null>(null);

  const filteredFiles = files.filter((f) => {
    const matchesTab = activeTab === "all" || f.type === activeTab;
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center p-6 md:p-12 min-h-[520px] select-none",
        className
      )}
    >
      {/* Background Radial Glow */}
      <div className="pointer-events-none absolute h-[400px] w-[600px] rounded-full bg-emerald-500/10 blur-[160px]" />

      {/* Morphing Folder Window */}
      <motion.div
        layout
        className={cn(
          "relative overflow-hidden rounded-3xl border border-white/15 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500",
          isOpen ? "w-full max-w-2xl border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.25)]" : "w-80 cursor-pointer hover:border-white/30 hover:scale-105"
        )}
      >
        {/* Header Bar */}
        <div
          onClick={() => !isOpen && setIsOpen(true)}
          className="flex items-center justify-between border-b border-white/10 pb-4"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-500/10 text-cyan-400">
              {isOpen ? <FolderOpen className="h-6 w-6" /> : <Folder className="h-6 w-6" />}
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white leading-snug">
                {folderName}
              </h4>
              <p className="text-xs text-zinc-400 font-light">
                {files.length} items • Click header to {isOpen ? "collapse" : "expand"}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="rounded-full border border-white/10 bg-zinc-900 px-3.5 py-1.5 text-xs font-mono font-bold text-cyan-400 hover:border-cyan-500/40 transition-colors"
          >
            {isOpen ? "Collapse" : "Expand Stack"}
          </button>
        </div>

        {/* Closed Stacked Preview */}
        {!isOpen && (
          <div
            onClick={() => setIsOpen(true)}
            className="relative mt-5 h-32 w-full flex items-center justify-center cursor-pointer"
          >
            {files.map((file, idx) => (
              <div
                key={file.id}
                style={{
                  transform: `translateY(${idx * 10}px) scale(${1 - idx * 0.05})`,
                  zIndex: files.length - idx,
                }}
                className="absolute inset-x-2 top-0 flex items-center justify-between rounded-2xl border border-white/15 bg-zinc-900/90 p-4 shadow-xl backdrop-blur-md"
              >
                <span className="text-xs font-bold text-zinc-200 truncate">
                  {file.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">{file.size}</span>
              </div>
            ))}
          </div>
        )}

        {/* Expanded Grid & Controls */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 space-y-5"
            >
              {/* Category Filter Tabs & Search */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-zinc-900 p-1">
                  {(["all", "code", "image", "document"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "rounded-lg px-3 py-1 text-xs font-bold capitalize transition-colors",
                        activeTab === tab
                          ? "bg-cyan-500 text-black shadow-md"
                          : "text-zinc-400 hover:text-white"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-48">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Grid Items */}
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => setPreviewFile(file)}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/80 p-4 transition-all hover:border-cyan-500/50 hover:bg-zinc-900 cursor-pointer"
                  >
                    {file.image && (
                      <div className="relative h-28 w-full overflow-hidden rounded-xl bg-zinc-950 border border-white/5 mb-3">
                        <img
                          src={file.image}
                          alt={file.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        {file.type === "code" && <Code className="h-4 w-4 shrink-0 text-cyan-400" />}
                        {file.type === "image" && <ImageIcon className="h-4 w-4 shrink-0 text-purple-400" />}
                        {file.type === "document" && <FileText className="h-4 w-4 shrink-0 text-amber-400" />}
                        <span className="text-xs font-bold text-white truncate">
                          {file.name}
                        </span>
                      </div>

                      <ArrowUpRight className="h-4 w-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500">
                      <span>{file.size}</span>
                      <span>{file.updated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Quick Look Preview Drawer */}
      <AnimatePresence>
        {previewFile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl"
            >
              <button
                onClick={() => setPreviewFile(null)}
                className="absolute right-4 top-4 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {previewFile.image && (
                <div className="relative h-48 w-full overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 mb-4">
                  <img src={previewFile.image} alt={previewFile.name} className="h-full w-full object-cover" />
                </div>
              )}

              <h4 className="text-lg font-bold text-white">{previewFile.name}</h4>
              <p className="text-xs text-zinc-400 mt-1">Size: {previewFile.size} • Updated: {previewFile.updated}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
