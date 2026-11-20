"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

interface VolumetricTextProps {
  /** Text to render with volumetric lighting */
  text: string;
  /** Font size in pixels (default: 72) */
  fontSize?: number;
  /** Font weight (default: 900) */
  fontWeight?: number;
  /** Light color [r, g, b] 0-1 (default: violet) */
  lightColor?: [number, number, number];
  /** Light angle in degrees (default: 45) */
  lightAngle?: number;
  /** Volumetric ray density (default: 0.3) */
  rayDensity?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Volumetric Text
 *
 * 3D text rendered with volumetric (god ray) lighting via WebGPU fragment shader.
 * Light rays emanate from behind the text, creating a dramatic cinematic effect.
 * Falls back to CSS text-shadow when WebGPU is unavailable.
 *
 * @example
 * ```tsx
 * <VolumetricText
 *   text="FlexUI"
 *   fontSize={96}
 *   lightColor={[0.65, 0.55, 0.98]}
 * />
 * ```
 */
export function VolumetricText({
  text,
  fontSize = 72,
  fontWeight = 900,
  lightColor = [0.65, 0.55, 0.98],
  lightAngle = 45,
  rayDensity = 0.3,
  className,
}: VolumetricTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const [supported, setSupported] = React.useState<boolean | null>(null);

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

        // Create text mask texture using 2D canvas
        const maskCanvas = document.createElement("canvas");
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        maskCanvas.width = w;
        maskCanvas.height = h;
        const ctx2d = maskCanvas.getContext("2d")!;
        ctx2d.fillStyle = "#000";
        ctx2d.fillRect(0, 0, w, h);
        ctx2d.fillStyle = "#fff";
        ctx2d.font = `${fontWeight} ${fontSize}px system-ui, -apple-system, sans-serif`;
        ctx2d.textAlign = "center";
        ctx2d.textBaseline = "middle";
        ctx2d.fillText(text, w / 2, h / 2);

        // Upload mask to GPU texture
        const maskBitmap = await createImageBitmap(maskCanvas);
        const maskTexture = device.createTexture({
          size: [w, h],
          format: "rgba8unorm",
          usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        });
        device.queue.copyExternalImageToTexture(
          { source: maskBitmap },
          { texture: maskTexture },
          [w, h]
        );

        const sampler = device.createSampler({ magFilter: "linear", minFilter: "linear" });
        const uniformBuffer = device.createBuffer({ size: 48, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });

        const gpuModule = device.createShaderModule({
          code: `
            struct Uniforms { time: f32, lightAngle: f32, rayDensity: f32, lc_r: f32, lc_g: f32, lc_b: f32, res_x: f32, res_y: f32 };
            struct VSOut { @builtin(position) pos: vec4<f32>, @location(0) uv: vec2<f32> };
            @group(0) @binding(0) var<uniform> u: Uniforms;
            @group(0) @binding(1) var maskTex: texture_2d<f32>;
            @group(0) @binding(2) var maskSamp: sampler;

            @vertex fn vs(@builtin(vertex_index) i: u32) -> VSOut {
              let p = array<vec2<f32>, 6>(vec2(-1,-1),vec2(1,-1),vec2(-1,1),vec2(-1,1),vec2(1,-1),vec2(1,1));
              var o: VSOut; o.pos = vec4(p[i],0,1); o.uv = (p[i]+1)*0.5; o.uv.y = 1.0 - o.uv.y; return o;
            }

            @fragment fn fs(in: VSOut) -> @location(0) vec4<f32> {
              let uv = in.uv;
              let mask = textureSample(maskTex, maskSamp, uv).r;
              let angleRad = u.lightAngle * 3.14159 / 180.0;
              let lightDir = vec2(cos(angleRad), sin(angleRad));
              let center = vec2(0.5, 0.5);

              // God rays — sample along light direction
              var rays = 0.0;
              let steps = 64;
              for (var i = 0; i < steps; i++) {
                let t = f32(i) / f32(steps);
                let samplePos = uv - lightDir * t * u.rayDensity;
                let s = textureSample(maskTex, maskSamp, samplePos).r;
                rays += s * (1.0 - t) * 0.02;
              }

              // Glow around text
              var glow = 0.0;
              for (var i = 0; i < 8; i++) {
                let angle = f32(i) * 3.14159 * 2.0 / 8.0;
                let offset = vec2(cos(angle), sin(angle)) * 0.008;
                glow += textureSample(maskTex, maskSamp, uv + offset).r;
              }
              glow = glow / 8.0 * 0.5;

              let lc = vec3(u.lc_r, u.lc_g, u.lc_b);
              let bg = vec3(0.035, 0.035, 0.043);
              let rayColor = lc * rays * 2.0;
              let glowColor = lc * glow * 0.5;
              let textColor = vec3(1.0) * mask;

              // Time-based shimmer
              let shimmer = 1.0 + sin(u.time * 2.0 + uv.x * 10.0) * 0.05;
              var col = bg + rayColor * shimmer + glowColor + textColor;

              // Vignette
              col *= 1.0 - dot(uv - 0.5, uv - 0.5) * 1.2;

              return vec4(col, 1.0);
            }
          `,
        });

        const pipeline = device.createRenderPipeline({
          layout: "auto",
          vertex: { module: gpuModule, entryPoint: "vs" },
          fragment: { module: gpuModule, entryPoint: "fs", targets: [{ format }] },
          primitive: { topology: "triangle-list" },
        });

        const bindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: uniformBuffer } },
            { binding: 1, resource: maskTexture.createView() },
            { binding: 2, resource: sampler },
          ],
        });

        function frame() {
          if (destroyed) return;
          const cw = canvas!.clientWidth;
          const ch = canvas!.clientHeight;
          if (canvas!.width !== cw || canvas!.height !== ch) {
            canvas!.width = cw;
            canvas!.height = ch;
          }
          const data = new Float32Array([performance.now() / 1000, lightAngle, rayDensity, lightColor[0], lightColor[1], lightColor[2], cw, ch]);
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
    return () => {
      destroyed = true;
      cancelAnimationFrame(frameRef.current);
    };
  }, [text, fontSize, fontWeight, lightColor, lightAngle, rayDensity]);

  // CSS fallback
  if (supported === false) {
    return (
      <div className={cn("flex items-center justify-center py-16", className)}>
        <h1
          style={{
            fontSize: `${fontSize}px`,
            fontWeight,
            color: "#fafafa",
            textShadow: `0 0 40px rgba(${lightColor.map((c) => Math.round(c * 255)).join(",")}, 0.5),
                         0 0 80px rgba(${lightColor.map((c) => Math.round(c * 255)).join(",")}, 0.3),
                         0 0 120px rgba(${lightColor.map((c) => Math.round(c * 255)).join(",")}, 0.15)`,
          }}
        >
          {text}
        </h1>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("block w-full", className)}
      style={{ height: `${fontSize * 2.5}px` }}
    />
  );
}
