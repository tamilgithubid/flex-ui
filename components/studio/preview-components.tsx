import React from "react";
import * as FramerMotion from "framer-motion";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/flexui/shimmer-button";
import { GlowButton } from "@/components/flexui/glow-button";
import { MagneticButton } from "@/components/flexui/magnetic-button";
import { ConfettiButton } from "@/components/flexui/confetti-button";
import { GradientBorderButton } from "@/components/flexui/gradient-border-button";
import { LiquidButton } from "@/components/flexui/liquid-button";
import { SpotlightCard } from "@/components/flexui/spotlight-card";
import { NeonGlowCard } from "@/components/flexui/neon-glow-card";
import { HolographicCard } from "@/components/flexui/holographic-card";
import { TextReveal } from "@/components/flexui/text-reveal";
import { TypewriterText } from "@/components/flexui/typewriter-text";
import { GradientText } from "@/components/flexui/gradient-text";
import { RotatingText } from "@/components/flexui/rotating-text";
import { NumberTicker } from "@/components/flexui/number-ticker";
import { FlipWords } from "@/components/flexui/flip-words";
import { ChromaticText } from "@/components/flexui/chromatic-text";
import { HandwrittenAnnotation } from "@/components/flexui/handwritten-annotation";
import { WavyText } from "@/components/flexui/wavy-text";
import { BlurText } from "@/components/flexui/blur-text";
import { SplitText } from "@/components/flexui/split-text";
import { TextScramble } from "@/components/flexui/text-scramble";
import { MorphingBlob } from "@/components/flexui/morphing-blob";
import { GlitchTransition } from "@/components/flexui/glitch-transition";
import { AmbientTilt } from "@/components/flexui/ambient-tilt";
import { DisintegrationEffect } from "@/components/flexui/disintegration-effect";
import { AnimatedTabs } from "@/components/flexui/animated-tabs";
import { Marquee } from "@/components/flexui/marquee";
import { MovingBorder } from "@/components/flexui/moving-border";
import { BorderBeam } from "@/components/flexui/border-beam";
import { ProgressRing } from "@/components/flexui/progress-ring";
import { SparklineChart } from "@/components/flexui/sparkline-chart";

import { AuroraBackground } from "@/components/flexui/aurora-background";

import { ParticleField } from "@/components/flexui/particle-field";

import { StarsBackground } from "@/components/flexui/stars-background";

import { RetroGrid } from "@/components/flexui/retro-grid";

import { NeuralNetwork } from "@/components/flexui/neural-network";

import { PortalTransition } from "@/components/flexui/portal-transition";

import { FloatingNavbar } from "@/components/flexui/floating-navbar";

import { DockMenu } from "@/components/flexui/dock-menu";

import { Drawer } from "@/components/flexui/drawer";

import { TypewriterTerminal } from "@/components/flexui/typewriter-terminal";

import * as Toast from "@/components/flexui/toast";

export const previewModules: Record<string, unknown> = {
  "@/components/flexui/aurora-background": { AuroraBackground },
  "@/components/flexui/particle-field": { ParticleField },
  "@/components/flexui/stars-background": { StarsBackground },
  "@/components/flexui/retro-grid": { RetroGrid },
  "@/components/flexui/neural-network": { NeuralNetwork },
  "@/components/flexui/portal-transition": { PortalTransition },
  "@/components/flexui/floating-navbar": { FloatingNavbar },
  "@/components/flexui/dock-menu": { DockMenu },
  "@/components/flexui/drawer": { Drawer },
  "@/components/flexui/typewriter-terminal": { TypewriterTerminal },
  "@/components/flexui/toast": Toast,
  "react": React,
  "framer-motion": FramerMotion,
  "@/lib/utils": { cn },
  "@/components/flexui/shimmer-button": { ShimmerButton },
  "@/components/flexui/glow-button": { GlowButton },
  "@/components/flexui/magnetic-button": { MagneticButton },
  "@/components/flexui/confetti-button": { ConfettiButton },
  "@/components/flexui/gradient-border-button": { GradientBorderButton },
  "@/components/flexui/liquid-button": { LiquidButton },
  "@/components/flexui/spotlight-card": { SpotlightCard },
  "@/components/flexui/neon-glow-card": { NeonGlowCard },
  "@/components/flexui/holographic-card": { HolographicCard },
  "@/components/flexui/text-reveal": { TextReveal },
  "@/components/flexui/typewriter-text": { TypewriterText },
  "@/components/flexui/gradient-text": { GradientText },
  "@/components/flexui/rotating-text": { RotatingText },
  "@/components/flexui/number-ticker": { NumberTicker },
  "@/components/flexui/flip-words": { FlipWords },
  "@/components/flexui/chromatic-text": { ChromaticText },
  "@/components/flexui/handwritten-annotation": { HandwrittenAnnotation },
  "@/components/flexui/wavy-text": { WavyText },
  "@/components/flexui/blur-text": { BlurText },
  "@/components/flexui/split-text": { SplitText },
  "@/components/flexui/text-scramble": { TextScramble },
  "@/components/flexui/morphing-blob": { MorphingBlob },
  "@/components/flexui/glitch-transition": { GlitchTransition },
  "@/components/flexui/ambient-tilt": { AmbientTilt },
  "@/components/flexui/disintegration-effect": { DisintegrationEffect },
  "@/components/flexui/animated-tabs": { AnimatedTabs },
  "@/components/flexui/marquee": { Marquee },
  "@/components/flexui/moving-border": { MovingBorder },
  "@/components/flexui/border-beam": { BorderBeam },
  "@/components/flexui/progress-ring": { ProgressRing },
  "@/components/flexui/sparkline-chart": { SparklineChart },
};
