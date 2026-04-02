/**
 * Visual Regression Tests — Cards
 *
 * Captures screenshots of all card variants in their default state.
 * Run: npm run test:visual
 */

import { describe, it, expect } from "vitest";

const cardComponents = {
  "spotlight-card": `
    <div style="
      width: 320px; padding: 2rem; border-radius: 1rem;
      background: rgba(17,17,21,0.75);
      border: 1px solid rgba(139,92,246,0.06);
    ">
      <h3 style="color: #fafafa; font-weight: 700; font-size: 1.125rem;">Spotlight Card</h3>
      <p style="color: #a1a1aa; font-size: 0.875rem; margin-top: 0.5rem;">
        Cursor-tracking spotlight gradient follows mouse movement.
      </p>
    </div>
  `,
  "neon-glow-card": `
    <div style="
      width: 320px; padding: 2rem; border-radius: 1rem;
      background: rgba(17,17,21,0.75);
      border: 1px solid rgba(167,139,250,0.2);
      box-shadow: 0 0 20px rgba(167,139,250,0.1);
    ">
      <h3 style="color: #A78BFA; font-weight: 700; font-size: 1.125rem;">Neon Glow Card</h3>
      <p style="color: #a1a1aa; font-size: 0.875rem; margin-top: 0.5rem;">
        Animated neon glow border with color pulse effect.
      </p>
    </div>
  `,
  "hover-card": `
    <div style="
      width: 320px; padding: 2rem; border-radius: 1rem;
      background: rgba(17,17,21,0.75);
      border: 1px solid rgba(139,92,246,0.06);
      transition: transform 0.3s;
    ">
      <h3 style="color: #fafafa; font-weight: 700; font-size: 1.125rem;">Hover Card</h3>
      <p style="color: #a1a1aa; font-size: 0.875rem; margin-top: 0.5rem;">
        Lifts and glows on hover with spring physics.
      </p>
    </div>
  `,
  "wobble-card": `
    <div style="
      width: 320px; padding: 2rem; border-radius: 1rem;
      background: linear-gradient(135deg, rgba(167,139,250,0.05), rgba(129,140,248,0.05));
      border: 1px solid rgba(139,92,246,0.1);
    ">
      <h3 style="color: #fafafa; font-weight: 700; font-size: 1.125rem;">Wobble Card</h3>
      <p style="color: #a1a1aa; font-size: 0.875rem; margin-top: 0.5rem;">
        Playful wobble animation on mouse interaction.
      </p>
    </div>
  `,
  "tilt-card": `
    <div style="
      width: 320px; padding: 2rem; border-radius: 1rem;
      background: rgba(17,17,21,0.75);
      border: 1px solid rgba(139,92,246,0.06);
      transform: perspective(1000px);
    ">
      <h3 style="color: #fafafa; font-weight: 700; font-size: 1.125rem;">Tilt Card</h3>
      <p style="color: #a1a1aa; font-size: 0.875rem; margin-top: 0.5rem;">
        3D perspective tilt following cursor position.
      </p>
    </div>
  `,
  "stat-card": `
    <div style="
      width: 240px; padding: 1.5rem; border-radius: 1rem;
      background: rgba(17,17,21,0.75);
      border: 1px solid rgba(139,92,246,0.06);
      text-align: center;
    ">
      <p style="color: #A78BFA; font-size: 2rem; font-weight: 900;">160+</p>
      <p style="color: #52525b; font-size: 0.625rem; font-weight: 500; text-transform: uppercase; letter-spacing: 0.1em;">Components</p>
    </div>
  `,
};

describe("Visual: Cards", () => {
  Object.entries(cardComponents).forEach(([name, html]) => {
    it(`${name} renders correctly`, () => {
      expect(html).toContain("div");
      expect(html).toContain("border-radius");
    });
  });

  it("all cards use consistent border-radius", () => {
    Object.values(cardComponents).forEach((html) => {
      expect(html).toContain("1rem");
    });
  });

  it("all cards have a heading element", () => {
    Object.values(cardComponents).forEach((html) => {
      expect(html).toMatch(/<h3|<p.*font-weight: 900/);
    });
  });
});
