/**
 * FlexUI Figma Plugin — UI
 *
 * Renders in an iframe inside Figma. Provides:
 * - Component browser with search
 * - Token extraction from Figma styles
 * - Component detail view with install instructions
 */

import React, { useState, useEffect, useCallback } from "react";
import { createRoot } from "react-dom/client";

// ─── Types ─────────────────────────────────────────────────────────────────

interface RegistryComponent {
  name: string;
  title: string;
  description: string;
  tier: number;
  category: string;
  tags: string[];
  dependencies: string[];
}

interface ComponentDetail {
  name: string;
  title: string;
  description: string;
  dependencies: string[];
  files: Array<{ path: string; content: string }>;
}

// ─── App ───────────────────────────────────────────────────────────────────

function App() {
  const [tab, setTab] = useState<"browse" | "tokens">("browse");
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<RegistryComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentDetail | null>(null);
  const [tokens, setTokens] = useState<{ colors: Record<string, string>; typography: Record<string, unknown> } | null>(null);
  const [loading, setLoading] = useState(false);

  // Listen for messages from plugin backend
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const msg = event.data.pluginMessage;
      if (!msg) return;

      switch (msg.type) {
        case "search-results":
          setResults(msg.payload);
          setLoading(false);
          break;
        case "component-data":
          setSelectedComponent(msg.payload);
          setLoading(false);
          break;
        case "tokens-extracted":
          setTokens(msg.payload);
          setLoading(false);
          break;
        case "error":
          console.error("Plugin error:", msg.payload);
          setLoading(false);
          break;
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const handleSearch = useCallback(() => {
    if (!search.trim()) return;
    setLoading(true);
    parent.postMessage({ pluginMessage: { type: "search-components", payload: { query: search } } }, "*");
  }, [search]);

  const handleSelectComponent = useCallback((name: string) => {
    setLoading(true);
    parent.postMessage({ pluginMessage: { type: "get-component", payload: { name } } }, "*");
  }, []);

  const handleExtractTokens = useCallback(() => {
    setLoading(true);
    parent.postMessage({ pluginMessage: { type: "extract-tokens" } }, "*");
  }, []);

  const handleInsert = useCallback((name: string) => {
    parent.postMessage({ pluginMessage: { type: "insert-frame", payload: { name, width: 320, height: 200 } } }, "*");
  }, []);

  const tierLabel = (tier: number) => tier === 1 ? "Basic" : tier === 2 ? "Motion" : "WebGL";
  const tierColor = (tier: number) => tier === 1 ? "#34D399" : tier === 2 ? "#FBBF24" : "#F472B6";

  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", background: "#1e1e1e", color: "#e0e0e0", minHeight: "100vh", fontSize: "12px" }}>
      {/* Header */}
      <div style={{ padding: "12px 16px", borderBottom: "1px solid #333", display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontWeight: 700, fontSize: "14px", color: "#A78BFA" }}>FlexUI</span>
        <span style={{ fontSize: "10px", color: "#666" }}>160+ components</span>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #333" }}>
        {(["browse", "tokens"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "8px", fontSize: "11px", fontWeight: 600,
              background: tab === t ? "#2a2a2a" : "transparent",
              color: tab === t ? "#A78BFA" : "#888",
              border: "none", cursor: "pointer",
              borderBottom: tab === t ? "2px solid #A78BFA" : "2px solid transparent",
            }}
          >
            {t === "browse" ? "Browse Components" : "Extract Tokens"}
          </button>
        ))}
      </div>

      {/* Browse Tab */}
      {tab === "browse" && (
        <div style={{ padding: "12px" }}>
          {/* Search */}
          <div style={{ display: "flex", gap: "6px" }}>
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              style={{
                flex: 1, padding: "8px 10px", borderRadius: "6px",
                background: "#2a2a2a", border: "1px solid #444",
                color: "#e0e0e0", fontSize: "11px", outline: "none",
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                padding: "8px 14px", borderRadius: "6px",
                background: "#A78BFA", color: "#1e1e1e",
                fontWeight: 700, fontSize: "11px", border: "none", cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>

          {/* Results */}
          {loading && <p style={{ padding: "16px", textAlign: "center", color: "#666" }}>Loading...</p>}

          {!selectedComponent && results.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              {results.map((comp) => (
                <button
                  key={comp.name}
                  onClick={() => handleSelectComponent(comp.name)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "10px", marginBottom: "4px", borderRadius: "6px",
                    background: "#2a2a2a", border: "1px solid #333",
                    cursor: "pointer", color: "#e0e0e0",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: 600, fontSize: "12px" }}>{comp.title}</span>
                    <span style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "99px", background: `${tierColor(comp.tier)}20`, color: tierColor(comp.tier) }}>
                      {tierLabel(comp.tier)}
                    </span>
                  </div>
                  <p style={{ fontSize: "10px", color: "#888", marginTop: "3px", lineHeight: 1.4 }}>
                    {comp.description}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Component Detail */}
          {selectedComponent && (
            <div style={{ marginTop: "12px" }}>
              <button
                onClick={() => setSelectedComponent(null)}
                style={{ background: "none", border: "none", color: "#A78BFA", fontSize: "11px", cursor: "pointer", marginBottom: "8px" }}
              >
                ← Back to results
              </button>
              <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                {selectedComponent.title}
              </h3>
              <p style={{ fontSize: "11px", color: "#888", marginTop: "4px", lineHeight: 1.5 }}>
                {selectedComponent.description}
              </p>

              {/* Install command */}
              <div style={{ marginTop: "12px", padding: "10px", borderRadius: "6px", background: "#111", border: "1px solid #333" }}>
                <p style={{ fontSize: "9px", color: "#666", marginBottom: "4px" }}>Install</p>
                <code style={{ fontSize: "11px", color: "#A78BFA" }}>
                  npx flexui add {selectedComponent.name}
                </code>
              </div>

              {/* Dependencies */}
              {selectedComponent.dependencies.length > 0 && (
                <div style={{ marginTop: "8px" }}>
                  <p style={{ fontSize: "9px", color: "#666" }}>Dependencies</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "4px" }}>
                    {selectedComponent.dependencies.map((dep) => (
                      <span key={dep} style={{ fontSize: "9px", padding: "2px 6px", borderRadius: "4px", background: "#333", color: "#aaa" }}>
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div style={{ marginTop: "16px", display: "flex", gap: "6px" }}>
                <button
                  onClick={() => handleInsert(selectedComponent.name)}
                  style={{
                    flex: 1, padding: "10px", borderRadius: "6px",
                    background: "#A78BFA", color: "#1e1e1e",
                    fontWeight: 700, fontSize: "11px", border: "none", cursor: "pointer",
                  }}
                >
                  Insert Frame
                </button>
                <button
                  onClick={() => {
                    const code = selectedComponent.files?.[0]?.content ?? `npx flexui add ${selectedComponent.name}`;
                    navigator.clipboard.writeText(code);
                  }}
                  style={{
                    padding: "10px 16px", borderRadius: "6px",
                    background: "#333", color: "#e0e0e0",
                    fontWeight: 600, fontSize: "11px", border: "none", cursor: "pointer",
                  }}
                >
                  Copy Code
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tokens Tab */}
      {tab === "tokens" && (
        <div style={{ padding: "12px" }}>
          <p style={{ fontSize: "11px", color: "#888", lineHeight: 1.5 }}>
            Extract design tokens from your Figma file&apos;s local styles
            and convert them to FlexUI theme format.
          </p>
          <button
            onClick={handleExtractTokens}
            style={{
              width: "100%", marginTop: "12px", padding: "10px",
              borderRadius: "6px", background: "#A78BFA", color: "#1e1e1e",
              fontWeight: 700, fontSize: "11px", border: "none", cursor: "pointer",
            }}
          >
            {loading ? "Extracting..." : "Extract Tokens"}
          </button>

          {tokens && (
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>Colors ({Object.keys(tokens.colors).length})</h4>
              <div style={{ marginTop: "8px" }}>
                {Object.entries(tokens.colors).map(([name, value]) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 0" }}>
                    <div style={{ width: "16px", height: "16px", borderRadius: "4px", background: value, border: "1px solid #444" }} />
                    <span style={{ fontSize: "10px", color: "#aaa", flex: 1 }}>{name}</span>
                    <code style={{ fontSize: "9px", color: "#666" }}>{value}</code>
                  </div>
                ))}
              </div>

              {/* Copy as FlexUI theme */}
              <button
                onClick={() => {
                  const themeJson = JSON.stringify(tokens, null, 2);
                  navigator.clipboard.writeText(themeJson);
                }}
                style={{
                  width: "100%", marginTop: "12px", padding: "8px",
                  borderRadius: "6px", background: "#333", color: "#A78BFA",
                  fontWeight: 600, fontSize: "11px", border: "1px solid #444", cursor: "pointer",
                }}
              >
                Copy as JSON
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Mount ─────────────────────────────────────────────────────────────────

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
