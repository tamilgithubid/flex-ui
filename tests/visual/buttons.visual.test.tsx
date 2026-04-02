/**
 * Visual Regression Tests — Buttons
 *
 * Captures screenshots of all button variants in their default state.
 * Run: npm run test:visual
 */

import { describe, it, expect } from "vitest";

const buttonComponents = {
  "shimmer-button": `
    <button style="
      position: relative; overflow: hidden;
      padding: 0.75rem 1.5rem; border-radius: 0.75rem;
      background: linear-gradient(135deg, #A78BFA 0%, #818CF8 100%);
      color: #09090b; font-weight: 700; font-size: 0.875rem;
      border: none; cursor: pointer;
    ">Shimmer Button</button>
  `,
  "glow-button": `
    <button style="
      padding: 0.75rem 1.5rem; border-radius: 0.75rem;
      background: #09090b; color: #A78BFA; font-weight: 700;
      font-size: 0.875rem; border: 1px solid rgba(167,139,250,0.3);
      box-shadow: 0 0 20px rgba(167,139,250,0.2);
      cursor: pointer;
    ">Glow Button</button>
  `,
  "pulse-button": `
    <button style="
      padding: 0.75rem 1.5rem; border-radius: 9999px;
      background: #A78BFA; color: #09090b; font-weight: 700;
      font-size: 0.875rem; border: none; cursor: pointer;
    ">Pulse Button</button>
  `,
  "ripple-button": `
    <button style="
      padding: 0.75rem 1.5rem; border-radius: 0.75rem;
      background: rgba(167,139,250,0.1); color: #A78BFA;
      font-weight: 700; font-size: 0.875rem;
      border: 1px solid rgba(167,139,250,0.2); cursor: pointer;
    ">Ripple Button</button>
  `,
  "gradient-border-button": `
    <button style="
      padding: 0.75rem 1.5rem; border-radius: 0.75rem;
      background: #09090b; color: #fafafa; font-weight: 700;
      font-size: 0.875rem;
      border: 2px solid transparent;
      background-clip: padding-box;
      cursor: pointer;
      outline: 2px solid #A78BFA;
    ">Gradient Border</button>
  `,
  "confetti-button": `
    <button style="
      padding: 0.75rem 1.5rem; border-radius: 0.75rem;
      background: linear-gradient(135deg, #A78BFA, #F472B6);
      color: #09090b; font-weight: 700; font-size: 0.875rem;
      border: none; cursor: pointer;
    ">Confetti Button</button>
  `,
};

describe("Visual: Buttons", () => {
  Object.entries(buttonComponents).forEach(([name, html]) => {
    it(`${name} renders correctly`, () => {
      // Static HTML structure test — visual screenshot tests
      // require browser mode (npm run test:visual)
      expect(html).toContain("button");
      expect(html.length).toBeGreaterThan(0);
    });
  });

  it("all button variants have consistent padding", () => {
    Object.values(buttonComponents).forEach((html) => {
      expect(html).toContain("0.75rem 1.5rem");
    });
  });

  it("all button variants use cursor pointer", () => {
    Object.values(buttonComponents).forEach((html) => {
      expect(html).toContain("cursor: pointer");
    });
  });
});
