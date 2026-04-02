"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface GPUParticleFieldProps {
  /** Number of particles (default: 100000) */
  count?: number;
  /** Attractor strength toward mouse (default: 2.0) */
  attractorStrength?: number;
  /** Turbulence intensity (default: 0.5) */
  turbulence?: number;
  /** Velocity damping (0-1, default: 0.98) */
  damping?: number;
  /** Particle color [r, g, b] 0-1 range (default: FlexUI violet) */
  color?: [number, number, number];
  /** Additional CSS classes */
  className?: string;
  /** Canvas width (default: "100%") */
  width?: string | number;
  /** Canvas height (default: 400) */
  height?: string | number;
  /** Show fallback when WebGPU unavailable */
  fallback?: React.ReactNode;
}

/**
 * GPU Particle Field
 *
 * 100K+ particle system powered by WebGPU compute shaders.
 * Particles respond to mouse position with gravitational attraction
 * and turbulent noise forces. Falls back to a CSS animation if
 * WebGPU is not available.
 *
 * @example
 * ```tsx
 * <GPUParticleField
 *   count={100000}
 *   attractorStrength={2.0}
 *   turbulence={0.5}
 *   className="rounded-xl"
 * />
 * ```
 */
export function GPUParticleField({
  count = 100000,
  attractorStrength = 2.0,
  turbulence = 0.5,
  damping = 0.98,
  color,
  className,
  width = "100%",
  height = 400,
  fallback,
}: GPUParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);
  const [supported, setSupported] = React.useState<boolean | null>(null);
  const gpuRef = useRef<{
    device: GPUDevice;
    pipeline: GPURenderPipeline;
    computePipeline: GPUComputePipeline;
    particleBuffer: GPUBuffer;
    uniformBuffer: GPUBuffer;
    bindGroup: GPUBindGroup;
    context: GPUCanvasContext;
  } | null>(null);
  const supportedRef = useRef<boolean | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
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

        // Create particle buffer
        const particleSize = 48; // 3 * vec4<f32> = 48 bytes
        const bufferSize = count * particleSize;
        const initialData = new Float32Array(count * 12);
        for (let i = 0; i < count; i++) {
          const offset = i * 12;
          initialData[offset] = (Math.random() - 0.5) * 4;     // pos.x
          initialData[offset + 1] = (Math.random() - 0.5) * 4; // pos.y
          initialData[offset + 2] = (Math.random() - 0.5) * 2; // pos.z
          initialData[offset + 3] = Math.random() * 2;          // life
          initialData[offset + 4] = 0; // vel.x
          initialData[offset + 5] = 0; // vel.y
          initialData[offset + 6] = 0; // vel.z
          initialData[offset + 7] = 0.005 + Math.random() * 0.01; // size
          // color initialized to violet
          initialData[offset + 8] = color?.[0] ?? 0.65;
          initialData[offset + 9] = color?.[1] ?? 0.55;
          initialData[offset + 10] = color?.[2] ?? 0.98;
          initialData[offset + 11] = 0.8;
        }

        const particleBuffer = device.createBuffer({
          size: bufferSize,
          usage: GPUBufferUsage.STORAGE | GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
          mappedAtCreation: true,
        });
        new Float32Array(particleBuffer.getMappedRange()).set(initialData);
        particleBuffer.unmap();

        // Uniform buffer
        const uniformBuffer = device.createBuffer({
          size: 32, // 8 * f32
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        // Render pipeline for point sprites
        const renderModule = device.createShaderModule({
          code: `
            struct Particle { pos: vec4<f32>, vel: vec4<f32>, color: vec4<f32> };
            @group(0) @binding(0) var<storage, read> particles: array<Particle>;

            struct VSOut { @builtin(position) pos: vec4<f32>, @location(0) color: vec4<f32>, @location(1) @interpolate(flat) size: f32 };

            @vertex fn vs(@builtin(vertex_index) vid: u32, @builtin(instance_index) iid: u32) -> VSOut {
              let p = particles[iid];
              let pointSize = p.vel.w * 200.0;
              let offsets = array<vec2<f32>, 6>(
                vec2(-1.0, -1.0), vec2(1.0, -1.0), vec2(-1.0, 1.0),
                vec2(-1.0, 1.0), vec2(1.0, -1.0), vec2(1.0, 1.0)
              );
              let offset = offsets[vid] * pointSize * 0.001;
              var out: VSOut;
              out.pos = vec4<f32>(p.pos.xy + offset, p.pos.z * 0.1, 1.0);
              out.color = p.color;
              out.size = pointSize;
              return out;
            }

            @fragment fn fs(in: VSOut) -> @location(0) vec4<f32> {
              return vec4<f32>(in.color.rgb, in.color.a * 0.6);
            }
          `,
        });

        const pipeline = device.createRenderPipeline({
          layout: "auto",
          vertex: { module: renderModule, entryPoint: "vs" },
          fragment: {
            module: renderModule,
            entryPoint: "fs",
            targets: [{
              format,
              blend: {
                color: { srcFactor: "src-alpha", dstFactor: "one", operation: "add" },
                alpha: { srcFactor: "one", dstFactor: "one", operation: "add" },
              },
            }],
          },
          primitive: { topology: "triangle-list" },
        });

        // Compute pipeline for particle simulation
        const computeModule = device.createShaderModule({
          code: `
            struct Particle { pos: vec4<f32>, vel: vec4<f32>, color: vec4<f32> };
            struct Uniforms { time: f32, deltaTime: f32, mouseX: f32, mouseY: f32, attractorStrength: f32, turbulence: f32, damping: f32, particleCount: u32 };
            @group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
            @group(0) @binding(1) var<uniform> uniforms: Uniforms;

            fn hash(p: vec3<f32>) -> f32 {
              var p3 = fract(p * 0.1031);
              p3 += dot(p3, p3.yzx + 33.33);
              return fract((p3.x + p3.y) * p3.z);
            }

            @compute @workgroup_size(256)
            fn main(@builtin(global_invocation_id) id: vec3<u32>) {
              let idx = id.x;
              if (idx >= uniforms.particleCount) { return; }
              var p = particles[idx];
              let dt = uniforms.deltaTime;
              let mousePos = vec3<f32>(uniforms.mouseX, uniforms.mouseY, 0.0);
              let toMouse = mousePos - p.pos.xyz;
              let dist = max(length(toMouse), 0.01);
              let attract = normalize(toMouse) * uniforms.attractorStrength / (dist * dist + 1.0);
              let t = uniforms.time;
              let turb = vec3<f32>(sin(p.pos.x*2.1+t)*cos(p.pos.z*1.7+t), cos(p.pos.y*1.9+t)*sin(p.pos.x*2.3+t), sin(p.pos.z*2.5+t)*cos(p.pos.y*1.3+t)) * uniforms.turbulence;
              p.vel = vec4<f32>((p.vel.xyz + (attract + turb) * dt) * uniforms.damping, p.vel.w);
              p.pos = vec4<f32>(p.pos.xyz + p.vel.xyz * dt, p.pos.w - dt * 0.1);
              if (p.pos.w <= 0.0) {
                let s = vec3<f32>(f32(idx), t, f32(idx)*0.37);
                p.pos = vec4<f32>((hash(s)-0.5)*4.0, (hash(s+vec3(1.0,0.0,0.0))-0.5)*4.0, (hash(s+vec3(0.0,1.0,0.0))-0.5)*2.0, 1.0+hash(s+vec3(0.0,0.0,1.0)));
                p.vel = vec4<f32>(0.0,0.0,0.0, 0.005+hash(s)*0.01);
              }
              let speed = length(p.vel.xyz);
              p.color = vec4<f32>(0.65+speed*2.0, 0.55+sin(p.pos.w*3.14)*0.3, 0.98, p.pos.w*0.8);
              particles[idx] = p;
            }
          `,
        });

        const computePipeline = device.createComputePipeline({
          layout: "auto",
          compute: { module: computeModule, entryPoint: "main" },
        });

        // Bind groups
        const computeBindGroup = device.createBindGroup({
          layout: computePipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: particleBuffer } },
            { binding: 1, resource: { buffer: uniformBuffer } },
          ],
        });

        const renderBindGroup = device.createBindGroup({
          layout: pipeline.getBindGroupLayout(0),
          entries: [
            { binding: 0, resource: { buffer: particleBuffer } },
          ],
        });

        gpuRef.current = { device, pipeline, computePipeline, particleBuffer, uniformBuffer, bindGroup: computeBindGroup, context };

        // Animation loop
        let lastTime = performance.now();
        function frame() {
          if (destroyed || !gpuRef.current) return;
          const now = performance.now();
          const dt = Math.min((now - lastTime) / 1000, 0.05);
          lastTime = now;

          const uniforms = new Float32Array([
            now / 1000,
            dt,
            mouseRef.current.x,
            mouseRef.current.y,
            attractorStrength,
            turbulence,
            damping,
          ]);
          const uniformsWithCount = new ArrayBuffer(32);
          const f32View = new Float32Array(uniformsWithCount);
          const u32View = new Uint32Array(uniformsWithCount);
          f32View.set(uniforms);
          u32View[7] = count;
          device.queue.writeBuffer(uniformBuffer, 0, uniformsWithCount);

          const commandEncoder = device.createCommandEncoder();

          // Compute pass
          const computePass = commandEncoder.beginComputePass();
          computePass.setPipeline(computePipeline);
          computePass.setBindGroup(0, computeBindGroup);
          computePass.dispatchWorkgroups(Math.ceil(count / 256));
          computePass.end();

          // Render pass
          const textureView = context!.getCurrentTexture().createView();
          const renderPass = commandEncoder.beginRenderPass({
            colorAttachments: [{
              view: textureView,
              clearValue: { r: 0.035, g: 0.035, b: 0.043, a: 1 },
              loadOp: "clear" as GPULoadOp,
              storeOp: "store" as GPUStoreOp,
            }],
          });
          renderPass.setPipeline(pipeline);
          renderPass.setBindGroup(0, renderBindGroup);
          renderPass.draw(6, count);
          renderPass.end();

          device.queue.submit([commandEncoder.finish()]);
          frameRef.current = requestAnimationFrame(frame);
        }

        frameRef.current = requestAnimationFrame(frame);
      } catch (err) {
        console.warn("WebGPU Particle Field initialization failed:", err);
        setSupported(false);
      }
    }

    init();
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      destroyed = true;
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      gpuRef.current?.device.destroy();
      gpuRef.current = null;
    };
  }, [count, attractorStrength, turbulence, damping, color, handleMouseMove]);

  // CSS fallback for browsers without WebGPU
  const cssFallback = fallback ?? (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{
        width,
        height: typeof height === "number" ? `${height}px` : height,
        background: "radial-gradient(ellipse at center, rgba(167,139,250,0.08) 0%, #09090b 70%)",
      }}
    >
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-pulse"
          style={{
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `rgba(167, 139, 250, ${0.2 + Math.random() * 0.5})`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );

  return (
    <>
      <canvas
        ref={canvasRef}
        className={cn("block", className)}
        style={{
          width,
          height: typeof height === "number" ? `${height}px` : height,
          display: supported === false ? "none" : "block",
        }}
      />
      {supported === false && cssFallback}
    </>
  );
}
