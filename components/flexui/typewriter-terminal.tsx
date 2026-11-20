"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface Command {
  input: string;
  output?: string;
  delay?: number;
}

interface TypewriterTerminalProps {
  commands: Command[];
  className?: string;
  theme?: "dark" | "matrix";
  typingSpeed?: number;
  loop?: boolean;
  title?: string;
}

interface TerminalLine {
  type: "input" | "output";
  text: string;
}

export function TypewriterTerminal({
  commands,
  className,
  theme = "dark",
  typingSpeed = 50,
  loop = false,
  title = "terminal",
}: TypewriterTerminalProps) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const themeStyles = {
    dark: {
      text: "text-zinc-300",
      prompt: "text-green-400",
      output: "text-zinc-400",
    },
    matrix: {
      text: "text-green-400",
      prompt: "text-green-300",
      output: "text-green-500/80",
    },
  };

  const colors = themeStyles[theme];

  // Blink cursor
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [lines, currentInput]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const sleep = (ms: number) => new Promise<void>((resolve) => {
      const finish = () => { clearTimeout(timer); signal.removeEventListener("abort", finish); resolve(); };
      const timer = setTimeout(finish, ms);
      signal.addEventListener("abort", finish, { once: true });
      if (signal.aborted) finish();
    });
    const run = async () => {
      do {
        setLines([]);
        setCurrentInput("");
        setIsTyping(true);
        for (const command of commands) {
          if (command.delay) await sleep(command.delay);
          for (let i = 0; i <= command.input.length && !signal.aborted; i++) {
            setCurrentInput(command.input.slice(0, i));
            await sleep(typingSpeed);
          }
          if (signal.aborted) return;
          setLines(prev => [...prev, { type: "input", text: command.input }]);
          setCurrentInput("");
          if (command.output) {
            await sleep(150);
            for (const text of command.output.split("\n")) {
              if (signal.aborted) return;
              setLines(prev => [...prev, { type: "output", text }]);
              await sleep(30);
            }
          }
          await sleep(300);
          if (signal.aborted) return;
        }
        setIsTyping(false);
        if (loop) await sleep(2000);
      } while (loop && !signal.aborted);
    };
    const first = setTimeout(() => { void run(); }, 0);
    return () => { clearTimeout(first); controller.abort(); };
  }, [commands, typingSpeed, loop]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-white/[0.06] bg-zinc-950",
        className
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-green-500/80" />
        </div>
        <span className="ml-2 text-xs font-medium text-zinc-500">{title}</span>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className={cn(
          "max-h-[400px] min-h-[200px] overflow-y-auto p-4 font-mono text-sm leading-relaxed",
          theme === "matrix" ? "bg-black" : "bg-zinc-950"
        )}
      >
        {/* Completed lines */}
        {lines.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line.type === "input" ? (
              <span>
                <span className={colors.prompt}>$ </span>
                <span className={colors.text}>{line.text}</span>
              </span>
            ) : (
              <span className={colors.output}>{line.text}</span>
            )}
          </div>
        ))}

        {/* Current typing line */}
        {(isTyping || currentInput) && (
          <div className="whitespace-pre-wrap">
            <span className={colors.prompt}>$ </span>
            <span className={colors.text}>{currentInput}</span>
            <span
              className={cn(
                "inline-block h-[1.1em] w-[0.5em] translate-y-[0.15em] align-text-bottom",
                showCursor ? (theme === "matrix" ? "bg-green-400" : "bg-zinc-300") : "bg-transparent"
              )}
            />
          </div>
        )}

        {/* Idle cursor after sequence ends */}
        {!isTyping && !currentInput && lines.length > 0 && !loop && (
          <div className="whitespace-pre-wrap">
            <span className={colors.prompt}>$ </span>
            <span
              className={cn(
                "inline-block h-[1.1em] w-[0.5em] translate-y-[0.15em] align-text-bottom",
                showCursor ? (theme === "matrix" ? "bg-green-400" : "bg-zinc-300") : "bg-transparent"
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
