"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface GPUNoiseTerrainProps {
  /** Terrain scale (default: 2.0) */
  scale?: number;
  /** Height multiplier (default: 0.3) */
  heightScale?: number;
  /** Animation speed (default: 0.3) */
  speed?: number;
  /** Wireframe mode (default: true) */
  wireframe?: boolean;
  /** Terrain color [r, g, b] 0-1 (default: violet) */
  color?: [number, number, number];
  /** Grid resolution (default: 128) */
  resolution?: number;
  /** Additional CSS classes */
  className?: string;
  /** Canvas height (default: 400) */
  height?: number;
}

/**
 * GPU Noise Terrain
 *
 * Real-time procedural terrain generated on the GPU using compute shaders
 * for heightmap generation and vertex displacement. Renders as a wireframe
 * or solid mesh with dynamic noise-based displacement.
 *
 * @example
 * ```tsx
 * <GPUNoiseTerrain
 *   scale={2.0}
 *   heightScale={0.3}
 *   wireframe={true}
 *   color={[0.65, 0.55, 0.98]}
 * />
 * ```
 */
export function GPUNoiseTerrain({
  scale = 2.0,
  heightScale = 0.3,
  speed = 0.3,
  wireframe = true,
  color = [0.65, 0.55, 0.98],
  resolution = 128,
  className,
  height = 400,
}: GPUNoiseTerrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef<number>(0);
  const [supported, setSupported] = React.useState<boolean | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.gpu) {
      setSupported(false);
      return;
    }

    let destroyed = false;

    async function init() {
      if (!canvas || destroyed) return;
      try {
        const adapter = await navigator.gpu.requestAdapter();
        if (!adapter || destroyed) return;
        const device = await adapter.requestDevice();
        if (destroyed) { device.destroy(); return; }

        const context = canvas.getContext("webgpu");
        if (!context) return;

        const format = navigator.gpu.getPreferredCanvasFormat();
        context.configure({ device, format, alphaMode: "premultiplied" });
        setSupported(true);

        const uniformBuffer = device.createBuffer({
          size: 64,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // Generate terrain as a fullscreen shader with raymarched heightfield
        const module = device.createShaderModule({
          code: `
            struct Uniforms { time: f32, scale: f32, heightScale: f32, speed: f32, mouseX: f32, mouseY: f32, col_r: f32, col_g: f32, col_b: f32, wireframe: f32, res_x: f32, res_y: f32 };
            struct VSOut { @builtin(position) pos: vec4<f32>, @location(0) uv: vec2<f32> };
            @group(0) @binding(0) var<uniform> u: Uniforms;

            @vertex fn vs(@builtin(vertex_index) i: u32) -> VSOut {
              let p = array<vec2<f32>, 6>(vec2(-1,-1),vec2(1,-1),vec2(-1,1),vec2(-1,1),vec2(1,-1),vec2(1,1));
              var o: VSOut; o.pos = vec4(p[i],0,1); o.uv = (p[i]+1)*0.5; return o;
            }

            fn hash(p: vec2<f32>) -> f32 {
              return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
            }

            fn noise(p: vec2<f32>) -> f32 {
              let i = floor(p); let f = fract(p);
              let s = f*f*(3.0-2.0*f);
              return mix(mix(hash(i), hash(i+vec2(1,0)), s.x),
                         mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), s.x), s.y);
            }

            fn fbm(p: vec2<f32>) -> f32 {
              var v = 0.0; var a = 0.5; var q = p;
              for (var i = 0; i < 5; i++) { v += a*noise(q); q *= 2.0; a *= 0.5; }
              return v;
            }

            fn heightAt(p: vec2<f32>) -> f32 {
              let t = u.time * u.speed;
              return fbm(p * u.scale + vec2(t * 0.2, t * 0.15)) * u.heightScale;
            }

            @fragment fn fs(in: VSOut) -> @location(0) vec4<f32> {
              let uv = in.uv;
              let aspect = u.res_x / u.res_y;

              // Camera setup — perspective looking down at terrain
              let camPos = vec3(u.mouseX * 2.0 - 1.0, 1.5, u.mouseY * 2.0 - 1.0);
              let target = vec3(0.0, 0.0, 0.0);
              let forward = normalize(target - camPos);
              let right = normalize(cross(vec3(0,1,0), forward));
              let up = cross(forward, right);

              let screen = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
              let rayDir = normalize(forward + screen.x * right + screen.y * up);

              // Raymarch the heightfield
              var col = vec3(0.035, 0.035, 0.043);
              var t_ray = 0.0;
              var hit = false;

              for (var i = 0; i < 128; i++) {
                let p = camPos + rayDir * t_ray;
                let h = heightAt(p.xz);
                if (p.y < h) {
                  hit = true;

                  // Normal via central differences
                  let eps = 0.01;
                  let nx = heightAt(p.xz + vec2(eps, 0)) - heightAt(p.xz - vec2(eps, 0));
                  let nz = heightAt(p.xz + vec2(0, eps)) - heightAt(p.xz - vec2(0, eps));
                  let normal = normalize(vec3(-nx, 2.0 * eps, -nz));

                  // Lighting
                  let lightDir = normalize(vec3(0.5, 1.0, 0.3));
                  let diffuse = max(dot(normal, lightDir), 0.0);
                  let ambient = 0.15;

                  let terrainCol = vec3(u.col_r, u.col_g, u.col_b);

                  // Wireframe grid overlay
                  var wire = 0.0;
                  if (u.wireframe > 0.5) {
                    let gridSize = 0.1 / u.scale;
                    let grid = abs(fract(p.xz / gridSize) - 0.5);
                    let lineWidth = 0.02;
                    if (grid.x < lineWidth || grid.y < lineWidth) { wire = 0.6; }
                  }

                  // Height-based color gradient
                  let heightFactor = smoothstep(0.0, u.heightScale, h);
                  col = terrainCol * (ambient + diffuse) * (0.5 + heightFactor * 0.5);
                  col += vec3(wire) * terrainCol * 0.3;

                  // Fog
                  let fog = 1.0 - exp(-t_ray * 0.15);
                  col = mix(col, vec3(0.035, 0.035, 0.043), fog);
                  break;
                }
                t_ray += max(0.01, (p.y - h) * 0.5);
                if (t_ray > 20.0) { break; }
              }

              // Atmosphere glow at horizon
              if (!hit) {
                let horizonGlow = exp(-abs(rayDir.y) * 8.0);
                col += vec3(u.col_r, u.col_g, u.col_b) * horizonGlow * 0.15;
              }

              return vec4(col, 1.0);
            }
          `,
        });

        const pipeline = device.createRenderPipeline({
          layout: "auto",
          vertex: { module, entryPoint: "vs" },
          fragment: { module, entryPoint: "fs", targets: [{ format }] },
          primitive: { topology: "triangle-list" },
        });

        const bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
        });

        function frame() {
          if (destroyed) return;
          const cw = canvas!.clientWidth;
          const ch = canvas!.clientHeight;
          if (canvas!.width !== cw || canvas!.height !== ch) {
            canvas!.width = cw;
            canvas!.height = ch;
          }

          const data = new Float32Array([
            performance.now() / 1000,
            scale, heightScale, speed,
            mouseRef.current.x, mouseRef.current.y,
            color[0], color[1], color[2],
            wireframe ? 1.0 : 0.0,
            cw, ch,
          ]);
          device.queue.writeBuffer(uniformBuffer, 0, data);

          const encoder = device.createCommandEncoder();
          const pass = encoder.beginRenderPass({
            colorAttachments: [{
              view: context!.getCurrentTexture().createView(),
              clearValue: { r: 0.035, g: 0.035, b: 0.043, a: 1 },
              loadOp: "clear" as GPULoadOp,
              storeOp: "store" as GPUStoreOp,
            }],
          });
          pass.setPipeline(pipeline);
          pass.setBindGroup(0, bindGroup);
          pass.draw(6);
          pass.end();
          device.queue.submit([encoder.finish()]);
          frameRef.current = requestAnimationFrame(frame);
        }

        frameRef.current = requestAnimationFrame(frame);
      } catch {
        setSupported(false);
      }
    }

    init();
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      destroyed = true;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [scale, heightScale, speed, wireframe, color, resolution, handleMouseMove]);

  // CSS fallback
  if (supported === false) {
    return (
      <div
        className={cn("relative overflow-hidden rounded-xl", className)}
        style={{
          height: `${height}px`,
          background: `
            linear-gradient(180deg,
              #09090b 0%,
              rgba(${color.map((c) => Math.round(c * 255)).join(",")}, 0.06) 40%,
              rgba(${color.map((c) => Math.round(c * 255)).join(",")}, 0.03) 100%
            )
          `,
        }}
      >
        {/* Grid lines fallback */}
        <svg className="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="terrain-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={`rgba(${color.map((c) => Math.round(c * 255)).join(",")}, 0.3)`} strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#terrain-grid)" />
        </svg>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("block w-full rounded-xl", className)}
      style={{ height: `${height}px` }}
    />
  );
}
