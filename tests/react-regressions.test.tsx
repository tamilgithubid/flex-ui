import { MorphingBlob } from "@/components/flexui/morphing-blob";
import { OTPInput } from "@/components/flexui/otp-input";
import { SearchSpotlight } from "@/components/flexui/search-spotlight";
import { ThemeProvider, useTheme } from "@/components/flexui/theme-provider";
import { TypewriterTerminal } from "@/components/flexui/typewriter-terminal";
import { TypewriterText } from "@/components/flexui/typewriter-text";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("React behavior regressions", () => {
  it("selects the displayed next search result across categories and resets selection on a new query", () => {
    Element.prototype.scrollIntoView = vi.fn();
    const first = vi.fn(), second = vi.fn(), third = vi.fn();
    render(<SearchSpotlight items={[
      { id: "one", title: "Alpha", category: "A", onSelect: first },
      { id: "two", title: "Beta", category: "B", onSelect: second },
      { id: "three", title: "Alpine", category: "A", onSelect: third },
    ]} />);
    fireEvent.click(screen.getByRole("button", { name: /Search/ }));
    const input = screen.getByRole("textbox", { name: "Search" });
    fireEvent.keyDown(input, { key: "ArrowDown" });
    expect(screen.getAllByRole("option").map(item => item.textContent?.trim())).toEqual(["Alpha", "Alpine", "Beta"]);
    expect(screen.getByRole("option", { name: "Alpine" })).toHaveAttribute("aria-selected", "true");
    fireEvent.change(input, { target: { value: "Beta" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(second).toHaveBeenCalledOnce();
    expect(first).not.toHaveBeenCalled();
    expect(third).not.toHaveBeenCalled();
  });

  it("clears OTP values and completion state when the length changes", () => {
    const complete = vi.fn();
    const view = render(<OTPInput length={2} onComplete={complete} />);
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "1" } });
    fireEvent.change(screen.getAllByRole("textbox")[1], { target: { value: "2" } });
    expect(complete).toHaveBeenCalledWith("12");
    view.rerender(<OTPInput length={4} onComplete={complete} />);
    expect(screen.getAllByRole("textbox")).toHaveLength(4);
    screen.getAllByRole("textbox").forEach(input => expect(input).toHaveValue(""));
  });

  it("hydrates the blob with a stable SVG ID and keeps that ID on prop updates", async () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    container.innerHTML = renderToString(<MorphingBlob />);
    const errors: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, <MorphingBlob />, { onRecoverableError: error => errors.push(error) });
    });
    const id = container.querySelector("linearGradient")?.id;
    expect(id).toBeTruthy();
    await act(async () => { root.render(<MorphingBlob color="#ff0000" />); });
    expect(container.querySelector("linearGradient")?.id).toBe(id);
    expect(container.querySelector("path")?.getAttribute("fill")).toBe(`url(#${id})`);
    expect(errors).toEqual([]);
    await act(async () => { root.unmount(); });
    container.remove();
  });

  it("loads persisted themes, honors forced theme changes, and reacts to storage changes", () => {
    function CurrentTheme() {
      const { themeName, setTheme } = useTheme();
      return <button onClick={() => setTheme("forest")}>{themeName}</button>;
    }
    localStorage.setItem("flexui-theme", "ocean");
    const view = render(<ThemeProvider><CurrentTheme /></ThemeProvider>);
    expect(screen.getByRole("button")).toHaveTextContent("ocean");
    fireEvent.click(screen.getByRole("button"));
    expect(localStorage.getItem("flexui-theme")).toBe("forest");
    view.rerender(<ThemeProvider forcedTheme="neon"><CurrentTheme /></ThemeProvider>);
    expect(screen.getByRole("button")).toHaveTextContent("neon");
    view.rerender(<ThemeProvider forcedTheme="sunset"><CurrentTheme /></ThemeProvider>);
    expect(screen.getByRole("button")).toHaveTextContent("sunset");
    view.rerender(<ThemeProvider><CurrentTheme /></ThemeProvider>);
    act(() => {
      localStorage.setItem("flexui-theme", "corporate");
      window.dispatchEvent(new StorageEvent("storage", { key: "flexui-theme" }));
    });
    expect(screen.getByRole("button")).toHaveTextContent("corporate");
    expect(document.documentElement).toHaveAttribute("data-flexui-theme", "corporate");
  });

  it("cancels terminal typing timers on unmount", async () => {
    vi.useFakeTimers();
    const view = render(<TypewriterTerminal commands={[{ input: "npm install flexui", output: "Done" }]} typingSpeed={10} loop />);
    await act(async () => { await vi.advanceTimersByTimeAsync(100); });
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    view.unmount();
    await act(async () => { await vi.advanceTimersByTimeAsync(100); });
    expect(vi.getTimerCount()).toBe(0);
  });

  it("renders the configured typewriter cursor and handles empty words", async () => {
    vi.useFakeTimers();
    render(<TypewriterText words={[]} cursor="_" />);
    expect(screen.getByText("_")).toBeVisible();
    await act(async () => { await vi.advanceTimersByTimeAsync(10000); });
    expect(screen.getByText("_")).toBeVisible();
  });
});
