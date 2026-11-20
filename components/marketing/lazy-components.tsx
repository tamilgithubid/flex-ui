"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ComponentProps } from "react";

export const LazyThreeHoverCard = dynamic(
  () =>
    import("@/components/flexui/three-hover-card").then((m) => ({
      default: m.ThreeHoverCard,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full animate-pulse rounded-2xl bg-zinc-900" />
    ),
  }
);

const InteractiveGlobe = dynamic(
  () =>
    import("@/components/flexui/interactive-globe").then((m) => ({
      default: m.InteractiveGlobe,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[380px] w-full animate-pulse rounded-2xl bg-zinc-900" />
    ),
  }
);



// Avoid compiling a WebGL scene while the above-the-fold headline is animating.
export function LazyInteractiveGlobe(props: ComponentProps<typeof InteractiveGlobe>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.35)) {
        setReady(true);
        observer.disconnect();
      }
    }, { threshold: 0.35 });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={containerRef} className="w-full" style={{ minHeight: 380 }}>
      {ready ? <InteractiveGlobe {...props} /> : <div aria-hidden="true" className="h-[380px] w-full rounded-2xl bg-zinc-950" />}
    </div>
  );
}
