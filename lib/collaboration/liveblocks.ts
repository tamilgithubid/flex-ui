/**
 * Liveblocks Configuration
 *
 * Real-time collaboration infrastructure for FlexUI Studio.
 * Provides live cursors, presence awareness, and collaborative editing.
 *
 * Setup:
 * 1. Create a Liveblocks account at https://liveblocks.io
 * 2. Get your public API key
 * 3. Set NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY in .env.local
 */

/**
 * Liveblocks client instance (lazy-loaded).
 * Install @liveblocks/client to enable: npm install @liveblocks/client
 */
export const liveblocksClient = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@liveblocks/client");
    return createClient({
      publicApiKey: process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY ?? "",
      throttle: 16,
    });
  } catch {
    // @liveblocks/client not installed — collaboration runs in standalone mode
    return null;
  }
})();

/** Room IDs for different collaboration contexts */
export const ROOM_IDS = {
  /** AI Studio collaborative session */
  studio: "flexui-studio",
  /** Theme editor collaborative session */
  themeEditor: "flexui-theme-editor",
  /** Component playground collaborative session */
  playground: "flexui-playground",
} as const;

/** User presence data shape */
export interface UserPresence {
  /** Display name */
  name: string;
  /** Avatar URL or initials */
  avatar: string;
  /** Cursor position (relative to viewport) */
  cursor: { x: number; y: number } | null;
  /** Active tab in Studio */
  activeTab: string;
  /** Currently editing component */
  editingComponent: string | null;
  /** User color (for cursor/avatar ring) */
  color: string;
}

/** Random colors for new users */
const PRESENCE_COLORS = [
  "#A78BFA", "#818CF8", "#F472B6", "#34D399",
  "#FBBF24", "#60A5FA", "#FB923C", "#2DD4BF",
  "#C084FC", "#F87171", "#4ADE80", "#38BDF8",
];

/** Get a random presence color */
export function getRandomPresenceColor(): string {
  return PRESENCE_COLORS[Math.floor(Math.random() * PRESENCE_COLORS.length)];
}

/** Default presence for new users */
export function createDefaultPresence(): UserPresence {
  return {
    name: `User ${Math.floor(Math.random() * 1000)}`,
    avatar: "",
    cursor: null,
    activeTab: "generate",
    editingComponent: null,
    color: getRandomPresenceColor(),
  };
}

/** Storage shape for shared room state */
export interface SharedStorage {
  /** Shared code in the editor */
  code: string;
  /** Shared theme tokens */
  themeTokens: Record<string, string>;
  /** Chat messages */
  messages: Array<{
    id: string;
    userId: string;
    text: string;
    timestamp: number;
  }>;
}
