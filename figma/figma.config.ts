/**
 * Figma Code Connect Configuration
 *
 * Maps FlexUI components to their Figma component counterparts.
 * Run `npx figma connect publish` to sync with Figma.
 *
 * Prerequisites:
 * 1. Install: npm install -D @figma/code-connect
 * 2. Set FIGMA_ACCESS_TOKEN environment variable
 * 3. Link your Figma file ID below
 */

export const FIGMA_CONFIG = {
  /** Your Figma file URL */
  fileUrl: "https://www.figma.com/design/YOUR_FILE_ID/FlexUI-Components",

  /** Component library mapping */
  components: {
    // Buttons
    "shimmer-button": "ShimmerButton",
    "glow-button": "GlowButton",
    "magnetic-button": "MagneticButton",
    "ripple-button": "RippleButton",
    "pulse-button": "PulseButton",
    "gradient-border-button": "GradientBorderButton",
    "confetti-button": "ConfettiButton",
    "liquid-button": "LiquidButton",

    // Cards
    "spotlight-card": "SpotlightCard",
    "neon-glow-card": "NeonGlowCard",
    "hover-card": "HoverCard",
    "tilt-card": "TiltCard",
    "wobble-card": "WobbleCard",
    "reveal-card": "RevealCard",
    "holographic-card": "HolographicCard",
    "three-hover-card": "ThreeHoverCard",

    // Text
    "gradient-text": "GradientText",
    "typewriter-text": "TypewriterText",
    "glow-text": "GlowText",
    "blur-text": "BlurText",
    "split-text": "SplitText",

    // Data Viz
    "sparkline-chart": "SparklineChart",
    "progress-bar": "ProgressBar",
    "progress-ring": "ProgressRing",
    "stat-card": "StatCard",
    "number-ticker": "NumberTicker",
  },

  /** Design token mapping from Figma Variables → FlexUI tokens */
  tokenMapping: {
    colors: {
      "color/background": "--flexui-background",
      "color/foreground": "--flexui-foreground",
      "color/surface": "--flexui-surface",
      "color/accent": "--flexui-accent",
      "color/accent-foreground": "--flexui-accent-foreground",
      "color/secondary": "--flexui-secondary",
      "color/success": "--flexui-success",
      "color/warning": "--flexui-warning",
      "color/error": "--flexui-error",
      "color/info": "--flexui-info",
    },
    typography: {
      "font/heading": "--flexui-heading",
      "font/body": "--flexui-body",
      "font/caption": "--flexui-caption",
    },
    radii: {
      "radius/sm": "--flexui-radius-sm",
      "radius/md": "--flexui-radius-md",
      "radius/lg": "--flexui-radius-lg",
      "radius/xl": "--flexui-radius-xl",
    },
  },
};
