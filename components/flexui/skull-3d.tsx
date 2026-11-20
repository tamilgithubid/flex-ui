"use client";

import { useRef, useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface Skull3DProps {
  /** Render mode */
  mode?: "solid" | "wireframe" | "xray" | "hologram";
  /** Skull bone color (default: "#e8dcc8") */
  color?: string;
  /** Glow / accent color hex (default: "#A78BFA") */
  glowColor?: string;
  /** Glow intensity 0-2 (default: 0.5) */
  glowIntensity?: number;
  /** Auto-rotate speed (default: 0.3, set 0 to disable) */
  rotateSpeed?: number;
  /** Canvas height in px (default: 500) */
  height?: number;
  /** Additional CSS classes */
  className?: string;
}

// ── Vertex shader ───────────────────────────────────────────────────────

const VERT = `
precision highp float;
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// ── Fragment shader — anatomically accurate raymarched SDF skull ────────

const FRAG = `
precision highp float;
varying vec2 vUv;

uniform float uTime;
uniform vec2  uResolution;
uniform vec3  uColor;
uniform vec3  uGlow;
uniform float uGlowIntensity;
uniform vec2 uRotation;
mat2 yawRotation;
mat2 pitchRotation;
uniform int   uMode;
uniform vec2  uMouse;

/* ── SDF primitives ──────────────────────────────────────────────────── */

float sdSphere(vec3 p, float r) { return length(p) - r; }

float sdEllipsoid(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / max(k1, 0.00001);
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float sdBox(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdCylinder(vec3 p, float h, float r) {
  vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);
  return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float smax(float a, float b, float k) {
  return -smin(-a, -b, k);
}

mat2 rot2(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

/* ── Anatomically accurate skull SDF ─────────────────────────────────── */

float sdSkull(vec3 p) {

  // ─ NEUROCRANIUM (brain case) ─────────────────────────────────────
  // Frontal bone + parietal vault
  float cranium = sdEllipsoid(p - vec3(0.0, 0.32, -0.02), vec3(0.58, 0.54, 0.62));

  // Occipital bone (back of skull — more pronounced bulge)
  float occipital = sdEllipsoid(p - vec3(0.0, 0.18, -0.42), vec3(0.46, 0.40, 0.38));
  cranium = smin(cranium, occipital, 0.18);

  // Temporal fossa (slight indentation on sides)
  float tempFossaL = sdEllipsoid(p - vec3(0.52, 0.18, -0.05), vec3(0.08, 0.30, 0.32));
  float tempFossaR = sdEllipsoid(p - vec3(-0.52, 0.18, -0.05), vec3(0.08, 0.30, 0.32));
  cranium = smin(cranium, tempFossaL, 0.10);
  cranium = smin(cranium, tempFossaR, 0.10);

  // ─ FACIAL SKELETON (viscerocranium) ──────────────────────────────

  // Supraorbital ridge (brow ridge — prominent)
  float browRidge = sdEllipsoid(p - vec3(0.0, 0.14, 0.46), vec3(0.40, 0.055, 0.10));
  cranium = smin(cranium, browRidge, 0.06);

  // Glabella (bridge between brows)
  float glabella = sdEllipsoid(p - vec3(0.0, 0.16, 0.50), vec3(0.08, 0.04, 0.06));
  cranium = smin(cranium, glabella, 0.04);

  // Maxilla (upper jaw)
  float maxilla = sdEllipsoid(p - vec3(0.0, -0.14, 0.22), vec3(0.34, 0.22, 0.28));
  cranium = smin(cranium, maxilla, 0.10);

  // Anterior nasal spine + subnasal area
  float nasalSpine = sdEllipsoid(p - vec3(0.0, -0.18, 0.38), vec3(0.06, 0.04, 0.06));
  cranium = smin(cranium, nasalSpine, 0.03);

  // Nasal bones (bridge of nose)
  float nasalBones = sdBox(p - vec3(0.0, 0.0, 0.50), vec3(0.04, 0.08, 0.04));
  cranium = smin(cranium, nasalBones, 0.04);

  // Zygomatic bones (cheekbones — very prominent)
  float zygoL = sdEllipsoid(p - vec3(0.30, -0.01, 0.26), vec3(0.14, 0.09, 0.16));
  float zygoR = sdEllipsoid(p - vec3(-0.30, -0.01, 0.26), vec3(0.14, 0.09, 0.16));
  cranium = smin(cranium, zygoL, 0.07);
  cranium = smin(cranium, zygoR, 0.07);

  // Zygomatic arches (bridge from cheekbone to ear)
  float archL = sdCapsule(p, vec3(0.36, 0.01, 0.20), vec3(0.48, 0.05, -0.12), 0.03);
  float archR = sdCapsule(p, vec3(-0.36, 0.01, 0.20), vec3(-0.48, 0.05, -0.12), 0.03);
  cranium = smin(cranium, archL, 0.04);
  cranium = smin(cranium, archR, 0.04);

  // Mastoid processes (behind ears)
  float mastoidL = sdEllipsoid(p - vec3(0.40, -0.15, -0.22), vec3(0.07, 0.10, 0.07));
  float mastoidR = sdEllipsoid(p - vec3(-0.40, -0.15, -0.22), vec3(0.07, 0.10, 0.07));
  cranium = smin(cranium, mastoidL, 0.06);
  cranium = smin(cranium, mastoidR, 0.06);

  // Alveolar process (upper teeth ridge — horseshoe shape)
  float alveolarU = sdEllipsoid(p - vec3(0.0, -0.28, 0.26), vec3(0.24, 0.04, 0.14));
  cranium = smin(cranium, alveolarU, 0.03);

  // ─ CAVITIES (boolean subtraction) ───────────────────────────────

  // Orbital cavities (eye sockets — rectangular with rounded edges)
  float orbitL = sdEllipsoid(p - vec3(0.17, 0.06, 0.38), vec3(0.12, 0.11, 0.14));
  float orbitR = sdEllipsoid(p - vec3(-0.17, 0.06, 0.38), vec3(0.12, 0.11, 0.14));
  // Deepen the sockets
  float orbitDeepL = sdEllipsoid(p - vec3(0.17, 0.06, 0.32), vec3(0.09, 0.08, 0.12));
  float orbitDeepR = sdEllipsoid(p - vec3(-0.17, 0.06, 0.32), vec3(0.09, 0.08, 0.12));
  cranium = smax(cranium, -orbitL, 0.02);
  cranium = smax(cranium, -orbitR, 0.02);
  cranium = smax(cranium, -orbitDeepL, 0.01);
  cranium = smax(cranium, -orbitDeepR, 0.01);

  // Piriform aperture (nasal opening — pear-shaped)
  float nasalCav = sdEllipsoid(p - vec3(0.0, -0.08, 0.44), vec3(0.055, 0.08, 0.10));
  float nasalLower = sdEllipsoid(p - vec3(0.0, -0.14, 0.44), vec3(0.045, 0.04, 0.08));
  cranium = smax(cranium, -nasalCav, 0.015);
  cranium = smax(cranium, -nasalLower, 0.01);

  // Temporal fossae (depressions on sides of skull)
  float tfL = sdEllipsoid(p - vec3(0.46, 0.15, 0.0), vec3(0.06, 0.22, 0.22));
  float tfR = sdEllipsoid(p - vec3(-0.46, 0.15, 0.0), vec3(0.06, 0.22, 0.22));
  cranium = smax(cranium, -tfL, 0.04);
  cranium = smax(cranium, -tfR, 0.04);

  // Foramen magnum (hole at base for spinal cord)
  float foramen = sdCylinder(p - vec3(0.0, -0.20, -0.35), 0.12, 0.10);
  cranium = smax(cranium, -foramen, 0.03);

  // ─ MANDIBLE (jawbone) ────────────────────────────────────────────

  // Body of mandible (horseshoe-shaped)
  float jawBody = sdEllipsoid(p - vec3(0.0, -0.38, 0.14), vec3(0.28, 0.08, 0.20));
  float jaw = jawBody;

  // Mental protuberance (chin — the most forward point)
  float chin = sdEllipsoid(p - vec3(0.0, -0.40, 0.30), vec3(0.09, 0.06, 0.07));
  jaw = smin(jaw, chin, 0.04);

  // Mental tubercles (paired bumps on chin)
  float chinBumpL = sdEllipsoid(p - vec3(0.04, -0.41, 0.31), vec3(0.035, 0.025, 0.03));
  float chinBumpR = sdEllipsoid(p - vec3(-0.04, -0.41, 0.31), vec3(0.035, 0.025, 0.03));
  jaw = smin(jaw, chinBumpL, 0.02);
  jaw = smin(jaw, chinBumpR, 0.02);

  // Ramus (vertical part going up to TMJ)
  float ramusL = sdBox(p - vec3(0.26, -0.22, -0.01), vec3(0.035, 0.16, 0.055));
  float ramusR = sdBox(p - vec3(-0.26, -0.22, -0.01), vec3(0.035, 0.16, 0.055));
  jaw = smin(jaw, ramusL, 0.05);
  jaw = smin(jaw, ramusR, 0.05);

  // Coronoid process (upper point of ramus)
  float coronoidL = sdEllipsoid(p - vec3(0.24, -0.06, 0.02), vec3(0.025, 0.04, 0.03));
  float coronoidR = sdEllipsoid(p - vec3(-0.24, -0.06, 0.02), vec3(0.025, 0.04, 0.03));
  jaw = smin(jaw, coronoidL, 0.03);
  jaw = smin(jaw, coronoidR, 0.03);

  // Condylar process (TMJ joint surface)
  float condyleL = sdEllipsoid(p - vec3(0.28, -0.07, -0.06), vec3(0.04, 0.025, 0.025));
  float condyleR = sdEllipsoid(p - vec3(-0.28, -0.07, -0.06), vec3(0.04, 0.025, 0.025));
  jaw = smin(jaw, condyleL, 0.02);
  jaw = smin(jaw, condyleR, 0.02);

  // Gonial angle (corner of jaw)
  float gonionL = sdEllipsoid(p - vec3(0.25, -0.34, -0.05), vec3(0.04, 0.04, 0.04));
  float gonionR = sdEllipsoid(p - vec3(-0.25, -0.34, -0.05), vec3(0.04, 0.04, 0.04));
  jaw = smin(jaw, gonionL, 0.03);
  jaw = smin(jaw, gonionR, 0.03);

  // Alveolar process lower (teeth ridge)
  float alveolarL = sdEllipsoid(p - vec3(0.0, -0.32, 0.22), vec3(0.20, 0.03, 0.10));
  jaw = smin(jaw, alveolarL, 0.02);

  // ─ COMBINE + TEETH ───────────────────────────────────────────────

  // Mouth gap
  float mouthGap = sdBox(p - vec3(0.0, -0.305, 0.24), vec3(0.22, 0.012, 0.14));

  float skull = smin(cranium, jaw, 0.02);
  skull = smax(skull, -mouthGap, 0.004);

  // Upper teeth (7 per side)
  for (float i = -3.0; i <= 3.0; i += 1.0) {
    float x = i * 0.032;
    float z = 0.34 - abs(i) * 0.012; // curved arch
    float w = 0.011 + (1.0 - abs(i) / 3.0) * 0.004;
    float tooth = sdEllipsoid(p - vec3(x, -0.28, z), vec3(w, 0.020, 0.010));
    skull = smin(skull, tooth, 0.003);
  }

  // Lower teeth
  for (float i = -3.0; i <= 3.0; i += 1.0) {
    float x = i * 0.028;
    float z = 0.30 - abs(i) * 0.010;
    float w = 0.010 + (1.0 - abs(i) / 3.0) * 0.003;
    float tooth = sdEllipsoid(p - vec3(x, -0.34, z), vec3(w, 0.018, 0.008));
    skull = smin(skull, tooth, 0.003);
  }

  return skull;
}

/* ── Scene ───────────────────────────────────────────────────────────── */

float map(vec3 p) {
  p.xz *= yawRotation;
  p.yz *= pitchRotation;
  return sdSkull(p);
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.0008, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),
    map(p + e.yxy) - map(p - e.yxy),
    map(p + e.yyx) - map(p - e.yyx)
  ));
}

float calcAO(vec3 p, vec3 n) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 0; i < 3; i++) {
    float h = 0.01 + 0.11 * float(i) / 2.0;
    float d = map(p + h * n);
    occ += (h - d) * sca;
    sca *= 0.95;
  }
  return clamp(1.0 - 3.0 * occ, 0.0, 1.0);
}

float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
  float res = 1.0;
  float t = mint;
  for (int i = 0; i < 24; i++) {
    float h = map(ro + rd * t);
    res = min(res, k * h / t);
    t += clamp(h, 0.005, 0.08);
    if (t > maxt) break;
  }
  return clamp(res, 0.0, 1.0);
}

/* ── Main ────────────────────────────────────────────────────────────── */

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution) / uResolution.y;
  yawRotation = rot2(uRotation.x);
  pitchRotation = rot2(uRotation.y);

  // Camera
  vec3 ro = vec3(0.0, 0.18, 2.65);
  float focalLength = 1.45 * min(1.0, (uResolution.x / uResolution.y) / 0.85);
  vec3 rd = normalize(vec3(uv, -focalLength));

  // Background — dark with subtle glow
  vec3 bgCol = vec3(0.018, 0.018, 0.022);
  float bgGlow = exp(-3.5 * dot(uv, uv));
  bgCol += uGlow * bgGlow * 0.05 * uGlowIntensity;

  vec3 col = bgCol;

  // Intersect a conservative skull bound before evaluating the expensive SDF.
  vec3 centerOffset = ro - vec3(0.0, 0.12, 0.0);
  float projection = dot(centerOffset, rd);
  float discriminant = projection * projection - dot(centerOffset, centerOffset) + 1.1025;
  float t = 0.0;
  bool hit = false;
  if (discriminant > 0.0) {
    float reach = sqrt(discriminant);
    t = max(0.0, -projection - reach);
    float end = -projection + reach;
    for (int i = 0; i < 96; i++) {
      if (t > end) break;
      float distance = map(ro + rd * t);
      if (distance < 0.0012) { hit = true; break; }
      t += max(distance * 0.9, 0.0006);
    }
  }

  if (hit) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);
    float ao = uMode == 0 ? calcAO(p, n) : 1.0;

    // Three-point lighting
    vec3 keyLight   = normalize(vec3(0.5, 0.8, 0.6));
    vec3 fillLight  = normalize(vec3(-0.6, 0.3, 0.7));
    vec3 rimLight   = normalize(vec3(0.0, 0.4, -0.9));
    float keyDiff   = max(dot(n, keyLight), 0.0);
    float fillDiff  = max(dot(n, fillLight), 0.0);
    float rimDiff   = pow(max(1.0 - dot(normalize(ro - p), n), 0.0), 3.0);
    float keyShadow = uMode == 0 ? softShadow(p + n * 0.008, keyLight, 0.01, 2.0, 16.0) : 1.0;

    vec3 viewDir = normalize(ro - p);
    vec3 halfDir = normalize(keyLight + viewDir);
    float spec   = pow(max(dot(n, halfDir), 0.0), 48.0);
    float fresnel = pow(1.0 - max(dot(viewDir, n), 0.0), 3.5);

    if (uMode == 0) {
      // ── SOLID BONE ──────────────────────────────────────────────
      vec3 boneCol = uColor;
      // Ambient
      col = boneCol * 0.10 * ao;
      // Key light + shadow
      col += boneCol * keyDiff * 0.65 * keyShadow;
      // Fill light (cooler)
      col += boneCol * fillDiff * 0.18 * vec3(0.8, 0.85, 1.0);
      // Specular
      col += vec3(1.0) * spec * 0.35 * keyShadow;
      // Rim light
      col += uGlow * rimDiff * 0.12 * uGlowIntensity;
      // Subsurface scattering approximation
      float sss = pow(clamp(dot(viewDir, -keyLight + n * 0.5), 0.0, 1.0), 2.0);
      col += boneCol * sss * 0.06;
      // AO darkening in cavities
      col *= ao;
    }
    else if (uMode == 1) {
      // ── WIREFRAME ───────────────────────────────────────────────
      vec3 wp = p;
      wp.xz *= yawRotation;
      wp.yz *= pitchRotation;
      float gridScale = 22.0;
      vec3 grid = abs(fract(wp * gridScale) - 0.5);
      float line = min(min(grid.x, grid.y), grid.z);
      float wire = 1.0 - smoothstep(0.0, 0.05, line);
      col = uGlow * wire * (0.5 + fresnel * 0.6) * uGlowIntensity;
      col += uGlow * fresnel * 0.08;
      col += uGlow * 0.015 * ao; // subtle fill
    }
    else if (uMode == 2) {
      // ── X-RAY ───────────────────────────────────────────────────
      float edge = 1.0 - abs(dot(viewDir, n));
      edge = pow(edge, 1.8);
      col = uGlow * edge * 0.85 * uGlowIntensity;
      col += uGlow * 0.04 * ao;
      col += vec3(0.015, 0.015, 0.025) * (1.0 - edge);
    }
    else if (uMode == 3) {
      // ── HOLOGRAM ────────────────────────────────────────────────
      float edge = pow(1.0 - abs(dot(viewDir, n)), 2.5);

      // Scanlines
      float scan = sin(p.y * 90.0 + uTime * 3.5) * 0.5 + 0.5;
      scan = smoothstep(0.3, 0.7, scan);

      // Flicker
      float flicker = sin(uTime * 17.0 + p.y * 45.0) * 0.025;

      // Grid overlay
      vec3 wp = p;
      wp.xz *= yawRotation;
      wp.yz *= pitchRotation;
      vec3 grid = abs(fract(wp * 14.0) - 0.5);
      float gridLine = min(min(grid.x, grid.y), grid.z);
      float wire = 1.0 - smoothstep(0.0, 0.06, gridLine);

      col = uGlow * (edge * 0.6 + wire * 0.25 + 0.04) * uGlowIntensity;
      col *= (0.88 + scan * 0.12);
      col += uGlow * flicker;
      col += uGlow * fresnel * 0.15;

      // Glowing eyes
      vec3 rp = p;
      rp.xz *= yawRotation;
      rp.yz *= pitchRotation;
      float eyeL = length(rp - vec3(0.17, 0.06, 0.38));
      float eyeR = length(rp - vec3(-0.17, 0.06, 0.38));
      float eyeGlow = exp(-eyeL * 14.0) + exp(-eyeR * 14.0);
      col += uGlow * eyeGlow * 2.5 * uGlowIntensity;
    }
  }

  // Ground grid
  if (!hit || t > 4.0) {
    float groundY = -0.52;
    float tGround = (groundY - ro.y) / rd.y;
    if (tGround > 0.0) {
      vec3 gp = ro + rd * tGround;
      vec2 grid = abs(fract(gp.xz * 4.0) - 0.5);
      float line = min(grid.x, grid.y);
      float gridLine = 1.0 - smoothstep(0.0, 0.025, line);
      float fade = exp(-length(gp.xz) * 0.5);
      col += uGlow * gridLine * 0.08 * fade * uGlowIntensity;
    }
  }

  // Vignette
  vec2 q = gl_FragCoord.xy / uResolution;
  col *= 0.5 + 0.5 * pow(16.0 * q.x * q.y * (1.0 - q.x) * (1.0 - q.y), 0.15);

  // Tone mapping (ACES-ish)
  col = col / (col + 0.5);
  col = pow(col, vec3(0.88));

  gl_FragColor = vec4(col, 1.0);
}`;

/**
 * Skull 3D
 *
 * Ultra-realistic raymarched human skull rendered via GLSL SDF.
 * 30+ anatomically accurate signed distance functions:
 * neurocranium (frontal, parietal, occipital, temporal bones),
 * facial skeleton (maxilla, zygomatic, nasal, supraorbital ridge),
 * orbital cavities, piriform aperture, zygomatic arches,
 * mastoid processes, mandible with ramus, coronoid & condylar
 * processes, mental protuberance, individual teeth, foramen magnum.
 * PBR lighting with AO, soft shadows, SSS, and 3-point setup.
 * No external 3D model — pure mathematical rendering.
 */
export function Skull3D({
  mode = "solid",
  color = "#e8dcc8",
  glowColor = "#A78BFA",
  glowIntensity = 0.5,
  rotateSpeed = 0.3,
  height = 500,
  className,
}: Skull3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const settingsRef = useRef({ color, glowColor, glowIntensity, rotateSpeed, mode, reducedMotion: false });
  const reducedMotion = useReducedMotion();
  const [unavailable, setUnavailable] = useState(false);
  const [contextVersion, setContextVersion] = useState(0);

  useEffect(() => {
    settingsRef.current = { color, glowColor, glowIntensity, rotateSpeed, mode, reducedMotion };
    wakeRef.current?.();
  }, [color, glowColor, glowIntensity, rotateSpeed, mode, reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let release = () => {};
    let initialFrame = 0;
    const initialize = () => {
      if (disposed) return;
      const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
      if (!gl) { setUnavailable(true); return; }
      const shaders: WebGLShader[] = [];
      const compile = (source: string, type: number) => {
        const shader = gl.createShader(type);
        if (!shader) return null;
        shaders.push(shader);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
      };
      const vertex = compile(VERT, gl.VERTEX_SHADER);
      const fragment = compile(FRAG, gl.FRAGMENT_SHADER);
      const program = gl.createProgram();
      if (!vertex || !fragment || !program) {
        shaders.forEach(shader => gl.deleteShader(shader));
        if (program) gl.deleteProgram(program);
        setUnavailable(true);
        return;
      }
      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.deleteProgram(program);
        shaders.forEach(shader => gl.deleteShader(shader));
        setUnavailable(true);
        return;
      }
      setUnavailable(false);
      gl.useProgram(program);
      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const attribute = gl.getAttribLocation(program, "aPos");
      gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(attribute, 2, gl.FLOAT, false, 0, 0);
      const uniform = (name: string) => gl.getUniformLocation(program, name);
      const uniforms = {
        time: uniform("uTime"), resolution: uniform("uResolution"), color: uniform("uColor"),
        glow: uniform("uGlow"), intensity: uniform("uGlowIntensity"), mode: uniform("uMode"),
        rotation: uniform("uRotation"),
      };
      let frame = 0, previous = 0, elapsed = 0;
      let visible = false, lost = false;
      let bounds = canvas.getBoundingClientRect();
      const target = { x: 0, y: 0 };
      const current = { x: 0, y: 0 };
      const modes = { solid: 0, wireframe: 1, xray: 2, hologram: 3 };
      const colorVector = (value: string): [number, number, number] => {
        const hex = /^#[0-9a-f]{6}$/i.test(value) ? value : "#a78bfa";
        return [parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255];
      };
      const canRender = () => visible && !document.hidden && !disposed && !lost;
      const schedule = () => {
        if (canRender() && !frame) frame = requestAnimationFrame(render);
      };
      const stop = () => { cancelAnimationFrame(frame); frame = 0; previous = 0; };
      function render(now: number) {
        frame = 0;
        if (!canRender()) return;
        const settings = settingsRef.current;
        const delta = previous ? Math.min(0.05, (now - previous) / 1000) : 1 / 60;
        previous = now;
        if (!settings.reducedMotion) elapsed += delta;
        const response = 1 - Math.exp(-14 * delta);
        current.x += (target.x - current.x) * response;
        current.y += (target.y - current.y) * response;
        gl!.viewport(0, 0, canvas!.width, canvas!.height);
        gl!.uniform1f(uniforms.time, settings.reducedMotion ? 0 : elapsed);
        gl!.uniform2f(uniforms.resolution, canvas!.width, canvas!.height);
        gl!.uniform3fv(uniforms.color, colorVector(settings.color));
        gl!.uniform3fv(uniforms.glow, colorVector(settings.glowColor));
        gl!.uniform1f(uniforms.intensity, settings.glowIntensity);
        gl!.uniform1i(uniforms.mode, modes[settings.mode]);
        gl!.uniform2f(uniforms.rotation,
          settings.reducedMotion ? 0 : Math.sin(elapsed * settings.rotateSpeed) * 0.25 + current.x,
          settings.reducedMotion ? 0 : (settings.rotateSpeed ? Math.sin(elapsed * 0.3) * 0.025 : 0) + current.y);
        gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
        const easing = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.0001;
        if (!settings.reducedMotion && (settings.rotateSpeed !== 0 || settings.mode === "hologram" || easing)) schedule();
        else previous = 0;
      }
      const resize = () => {
        bounds = canvas.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        // A bounded render surface avoids millions of expensive raymarches on large displays.
        const scale = Math.min(1, Math.sqrt(240000 / (bounds.width * bounds.height)));
        canvas.width = Math.max(1, Math.floor(bounds.width * scale));
        canvas.height = Math.max(1, Math.floor(bounds.height * scale));
        schedule();
      };
      const move = (event: PointerEvent) => {
        if (settingsRef.current.reducedMotion || event.pointerType === "touch") return;
        target.x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / Math.max(1, bounds.width) * 2 - 1)) * 0.45;
        target.y = Math.max(-1, Math.min(1, 1 - (event.clientY - bounds.top) / Math.max(1, bounds.height) * 2)) * 0.18;
        schedule();
      };
      const enter = () => { bounds = canvas.getBoundingClientRect(); };
      const leave = () => { target.x = 0; target.y = 0; schedule(); };
      const visibility = () => { if (canRender()) schedule(); else stop(); };
      const contextLost = (event: Event) => {
        event.preventDefault(); lost = true; stop(); setUnavailable(true);
      };
      const contextRestored = () => setContextVersion(version => version + 1);
      const intersection = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? false;
        visibility();
      });
      const sizing = new ResizeObserver(resize);
      intersection.observe(canvas);
      sizing.observe(canvas);
      document.addEventListener("visibilitychange", visibility);
      canvas.addEventListener("pointerenter", enter);
      canvas.addEventListener("pointermove", move);
      canvas.addEventListener("pointerleave", leave);
      canvas.addEventListener("pointercancel", leave);
      canvas.addEventListener("webglcontextlost", contextLost);
      canvas.addEventListener("webglcontextrestored", contextRestored);
      wakeRef.current = schedule;
      resize();
      release = () => {
        stop();
        wakeRef.current = null;
        intersection.disconnect();
        sizing.disconnect();
        document.removeEventListener("visibilitychange", visibility);
        canvas.removeEventListener("pointerenter", enter);
        canvas.removeEventListener("pointermove", move);
        canvas.removeEventListener("pointerleave", leave);
        canvas.removeEventListener("pointercancel", leave);
        canvas.removeEventListener("webglcontextlost", contextLost);
        canvas.removeEventListener("webglcontextrestored", contextRestored);
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        shaders.forEach(shader => gl.deleteShader(shader));
      };
    };
    // Delay context allocation and shader compilation until this particular preview is visible.
    const gate = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        gate.disconnect();
        initialFrame = requestAnimationFrame(initialize);
      }
    });
    gate.observe(canvas);
    return () => { disposed = true; gate.disconnect(); cancelAnimationFrame(initialFrame); release(); };
  }, [contextVersion]);

  return (
    <div className={cn("relative w-full overflow-hidden bg-[#050507]", className)} style={{ height }}>
      <canvas ref={canvasRef} role="img" aria-label="Interactive 3D skull"
        className="absolute inset-0 block h-full w-full" />
      {unavailable && <p role="status" className="absolute inset-0 flex items-center justify-center p-8 text-center text-sm text-zinc-400">
        The 3D preview needs WebGL. Enable graphics acceleration or try another browser.
      </p>}
    </div>
  );
}
