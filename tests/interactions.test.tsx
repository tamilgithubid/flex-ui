import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ParallaxDepthCard } from "@/components/flexui/parallax-depth-card";
import { Popover } from "@/components/flexui/popover";
import { DropdownMenu } from "@/components/flexui/dropdown-menu";

describe("Parallax Depth Card", () => {
  it("can add and remove layers without changing the parent's hook order", () => {
    const card = (count: number) => (
      <ParallaxDepthCard>
        {Array.from({ length: count }, (_, index) => (
          <ParallaxDepthCard.Layer key={index} depth={index + 1}>
            Layer {index + 1}
          </ParallaxDepthCard.Layer>
        ))}
      </ParallaxDepthCard>
    );
    const { rerender } = render(card(1));
    rerender(card(3));
    expect(screen.getByText("Layer 3")).toBeInTheDocument();
    rerender(card(0));
    expect(screen.queryByText("Layer 1")).not.toBeInTheDocument();
    rerender(card(1));
    expect(screen.getByText("Layer 1")).toBeInTheDocument();
  });
});

describe("Popover", () => {
  it("keeps interactive portal content open and dismisses outside clicks", () => {
    render(<Popover trigger={<span>Open popover</span>}><input aria-label="Example" /></Popover>);
    const trigger = screen.getByRole("button", { name: "Open popover" });
    fireEvent.click(trigger);
    const input = screen.getByRole("textbox");
    fireEvent.mouseDown(input);
    fireEvent.change(input, { target: { value: "hello" } });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveValue("hello");
    fireEvent.mouseDown(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("supports keyboard activation and restores focus on Escape", () => {
    render(<Popover trigger={<span>Open popover</span>}>Content</Popover>);
    const trigger = screen.getByRole("button", { name: "Open popover" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });
});

describe("Dropdown Menu", () => {
  it.each(["Enter", " ", "ArrowDown"])("opens with %s and focuses the first item", (key) => {
    render(<DropdownMenu trigger={<span>Actions</span>} items={[{ label: "First" }, { label: "Second" }]} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    fireEvent.keyDown(trigger, { key });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("menuitem", { name: "First" })).toHaveFocus();
  });

  it("moves DOM focus, wraps arrow navigation, and activates the selected item once", () => {
    const action = vi.fn();
    render(<DropdownMenu trigger={<span>Actions</span>} items={[{ label: "First" }, { label: "Second", onClick: action }]} />);
    const trigger = screen.getByRole("button", { name: "Actions" });
    fireEvent.keyDown(trigger, { key: "ArrowUp" });
    const first = screen.getByRole("menuitem", { name: "First" });
    const second = screen.getByRole("menuitem", { name: "Second" });
    expect(second).toHaveFocus();
    fireEvent.keyDown(second, { key: "ArrowDown" });
    expect(first).toHaveFocus();
    fireEvent.keyDown(first, { key: "End" });
    expect(second).toHaveFocus();
    fireEvent.keyDown(second, { key: "Enter" });
    expect(action).toHaveBeenCalledTimes(1);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("restores focus to a native child trigger on Escape", () => {
    render(<DropdownMenu trigger={<button type="button">Actions</button>} items={[{ label: "First" }]} />);
    const trigger = screen.getByText("Actions");
    expect(screen.getAllByRole("button", { name: "Actions" })).toHaveLength(1);
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(screen.getByRole("menuitem"), { key: "Escape" });
    expect(trigger).toHaveFocus();
  });

  it("does not submit its containing form when an action is clicked", () => {
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(<form onSubmit={submit}><DropdownMenu trigger={<span>Actions</span>} items={[{ label: "First" }]} /></form>);
    fireEvent.click(screen.getByRole("button", { name: "Actions" }));
    fireEvent.click(screen.getByRole("menuitem"));
    expect(submit).not.toHaveBeenCalled();
  });
});
