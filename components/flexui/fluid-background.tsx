"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface FluidBackgroundProps {
  /** Fluid viscosity (default: 0.3) */
  viscosity?: number;
  /** Animation speed (default: 0.4) */
  speed?: number;
  /** Color intensity (default: 1.0) */
  colorIntensity?: number;
  /** Primary color [r, g, b] normalized (default: violet) */
  primaryColor?: [number, number, number];
  /** Secondary color [r, g, b] normalized (default: indigo) */
  secondaryColor?: [number, number, number];
  /** Additional CSS classes */
  className?: string;
  /** Children rendered on top of the fluid */
  children?: React.ReactNode;
}

/**
 * Fluid Background
 *
 * Real-time Navier-Stokes inspired fluid simulation rendered via WebGPU.
 * Mouse movement creates swirl disturbances in the flow field.
 * Falls back to a CSS gradient animation when WebGPU is unavailable.
 *
 * @example
 * ```tsx
 * <FluidBackground viscosity={0.3} speed={0.4}>
 *   <h1>Content over fluid</h1>
 * </FluidBackground>
 * ```
 */
export function FluidBackground({
  viscosity = 0.3,
  speed = 0.4,
  colorIntensity = 1.0,
  primaryColor,
  secondaryColor,
  className,
  children,
}: FluidBackgroundProps) {
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
        const adapter = await navigator.gpu.requestAdapter({ powerPreference: "high-performance" });
        if (!adapter || destroyed) return;

        const device = await adapter.requestDevice();
        if (destroyed) { device.destroy(); return; }

        const context = canvas.getContext("webgpu");
        if (!context) return;

        const format = navigator.gpu.getPreferredCanvasFormat();
        context.configure({ device, format, alphaMode: "premultiplied" });
        setSupported(true);

        const pc = primaryColor ?? [0.65, 0.36, 0.98];
        const sc = secondaryColor ?? [0.51, 0.55, 0.97];

        // Uniform buffer
        const uniformBuffer = device.createBuffer({
          size: 64, // room for uniforms
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // Shader module — fullscreen fluid
        const module = device.createShaderModule({
          code: `
            struct Uniforms { time: f32, mouseX: f32, mouseY: f32, res_x: f32, res_y: f32, viscosity: f32, speed: f32, colorIntensity: f32, pc_r: f32, pc_g: f32, pc_b: f32, sc_r: f32, sc_g: f32, sc_b: f32 };
            struct VSOut { @builtin(position) pos: vec4<f32>, @location(0) uv: vec2<f32> };
            @group(0) @binding(0) var<uniform> u: Uniforms;

            @vertex fn vs(@builtin(vertex_index) i: u32) -> VSOut {
              let p = array<vec2<f32>, 6>(vec2(-1,-1),vec2(1,-1),vec2(-1,1),vec2(-1,1),vec2(1,-1),vec2(1,1));
              var o: VSOut; o.pos = vec4(p[i], 0, 1); o.uv = (p[i]+1)*0.5; return o;
            }

            fn hash22(p: vec2<f32>) -> vec2<f32> {
              let n = sin(dot(p, vec2(41.0, 289.0)));
              return fract(vec2(262144.0, 32768.0) * n) * 2.0 - 1.0;
            }

            fn noise(p: vec2<f32>) -> f32 {
              let i = floor(p); let f = fract(p);
              let s = f*f*(3.0-2.0*f);
              return mix(mix(dot(hash22(i),f), dot(hash22(i+vec2(1,0)),f-vec2(1,0)), s.x),
                         mix(dot(hash22(i+vec2(0,1)),f-vec2(0,1)), dot(hash22(i+vec2(1,1)),f-vec2(1,1)), s.x), s.y);
            }

            fn fbm(p: vec2<f32>) -> f32 {
              var v = 0.0; var a = 0.5; var q = p;
              for (var i = 0; i < 6; i++) { v += a*noise(q); q *= 2.0; a *= 0.5; }
              return v;
            }

            @fragment fn fs(in: VSOut) -> @location(0) vec4<f32> {
              let uv = in.uv; let t = u.time * u.speed;
              let mouse = vec2(u.mouseX, 1.0 - u.mouseY);
              var p = uv * 3.0;
              let toM = uv - mouse; let md = length(toM);
              if (md < 0.3) { p += vec2(-toM.y, toM.x) * (0.3 - md) * 2.0; }
              let n1 = fbm(p + vec2(t*0.13, t*0.07));
              let n2 = fbm(p*1.5 + vec2(-t*0.09, t*0.11) + n1*0.5);
              let n3 = fbm(p*0.8 + vec2(t*0.05, -t*0.08) + n2*0.3);
              let ci = u.colorIntensity;
              let c1 = vec3(u.pc_r*ci, u.pc_g*ci, u.pc_b*ci);
              let c2 = vec3(u.sc_r*ci, u.sc_g*ci, u.sc_b*ci);
              let c3 = vec3(0.04, 0.04, 0.04);
              var col = mix(c3, c1, smoothstep(-0.3, 0.5, n2));
              col = mix(col, c2, smoothstep(0.0, 0.8, n3));
              col *= 1.0 - dot(uv-0.5, uv-0.5)*1.5;
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
          const w = canvas!.clientWidth;
          const h = canvas!.clientHeight;
          if (canvas!.width !== w || canvas!.height !== h) {
            canvas!.width = w;
            canvas!.height = h;
          }

          const data = new Float32Array([
            performance.now() / 1000,
            mouseRef.current.x,
            mouseRef.current.y,
            w, h,
            viscosity,
            speed,
            colorIntensity,
            pc[0], pc[1], pc[2],
            sc[0], sc[1], sc[2],
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
  }, [viscosity, speed, colorIntensity, primaryColor, secondaryColor, handleMouseMove]);

  // CSS fallback
  const cssFallback = (
    <div
      className={cn("absolute inset-0", className)}
      style={{
        background: `
          radial-gradient(ellipse at 30% 40%, rgba(167,139,250,0.12) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 60%, rgba(129,140,248,0.08) 0%, transparent 50%),
          #09090b
        `,
      }}
    />
  );

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ display: supported === false ? "none" : "block" }}
      />
      {supported === false && cssFallback}
      {children && (
        <div className="relative z-10">{children}</div>
      )}
    </div>
  );
}
