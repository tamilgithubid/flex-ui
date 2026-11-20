"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { SharedStorage, UserPresence } from "./liveblocks";
import { createDefaultPresence } from "./liveblocks";

/**
 * Collaboration Provider
 *
 * Wraps children with real-time collaboration context.
 * Manages user presence, cursors, and shared state.
 *
 * When Liveblocks is not configured (no API key), operates in
 * standalone mode with no real-time features.
 */

interface CollaborationContextValue {
  /** Whether collaboration is active */
  isConnected: boolean;
  /** Current user's presence */
  myPresence: UserPresence;
  /** All connected users' presence */
  others: UserPresence[];
  /** Update current user's presence */
  updatePresence: (updates: Partial<UserPresence>) => void;
  /** Shared room state */
  sharedState: SharedStorage | null;
  /** Update shared state */
  updateSharedState: (updates: Partial<SharedStorage>) => void;
  /** Room ID */
  roomId: string;
  /** Number of connected users */
  userCount: number;
}

const CollaborationContext = createContext<CollaborationContextValue>({
  isConnected: false,
  myPresence: createDefaultPresence(),
  others: [],
  updatePresence: () => {},
  sharedState: null,
  updateSharedState: () => {},
  roomId: "",
  userCount: 1,
});

export function useCollaboration() {
  return useContext(CollaborationContext);
}

interface CollaborationProviderProps {
  /** Room ID for this collaboration session */
  roomId: string;
  /** Initial user name */
  userName?: string;
  /** Children */
  children: React.ReactNode;
}

export function CollaborationProvider({
  roomId,
  userName,
  children,
}: CollaborationProviderProps) {
  const [myPresence, setMyPresence] = useState<UserPresence>(() => ({
    ...createDefaultPresence(),
    name: userName ?? `User ${Math.floor(Math.random() * 1000)}`,
  }));
  const [others] = useState<UserPresence[]>([]);
  const [sharedState, setSharedState] = useState<SharedStorage | null>(() => ({ code: "", themeTokens: {}, messages: [] }));
  const wsRef = useRef<WebSocket | null>(null);

  // Standalone mode — simulate presence without Liveblocks
  const hasApiKey = typeof process !== "undefined" &&
    process.env?.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

  const updatePresence = useCallback((updates: Partial<UserPresence>) => {
    setMyPresence((prev) => {
      const next = { ...prev, ...updates };
      // Broadcast to WebSocket if connected
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "presence", data: next }));
      }
      return next;
    });
  }, []);

  const updateSharedState = useCallback((updates: Partial<SharedStorage>) => {
    setSharedState((prev) => {
      const next = { ...prev, ...updates } as SharedStorage;
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "storage", data: next }));
      }
      return next;
    });
  }, []);

  // Track mouse position for cursor sharing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      updatePresence({
        cursor: { x: e.clientX, y: e.clientY },
      });
    };

    const handleMouseLeave = () => {
      updatePresence({ cursor: null });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [updatePresence]);

  const isConnected = !hasApiKey;

  const value: CollaborationContextValue = {
    isConnected,
    myPresence,
    others,
    updatePresence,
    sharedState,
    updateSharedState,
    roomId,
    userCount: 1 + others.length,
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
}

