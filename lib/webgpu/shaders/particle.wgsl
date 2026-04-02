// ─── GPU Particle System Compute Shader ─────────────────────────────────────
// Simulates 100K+ particles with gravitational forces, turbulence,
// and spring-damper physics on the GPU via compute shader.

struct Particle {
  pos: vec4<f32>,   // xyz position + w (life)
  vel: vec4<f32>,   // xyz velocity + w (size)
  color: vec4<f32>, // rgba
};

struct Uniforms {
  time: f32,
  deltaTime: f32,
  mouseX: f32,
  mouseY: f32,
  attractorStrength: f32,
  turbulence: f32,
  damping: f32,
  particleCount: u32,
};

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<uniform> uniforms: Uniforms;

// Pseudo-random hash function
fn hash(p: vec3<f32>) -> f32 {
  var p3 = fract(p * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

// Simplex-like noise for turbulence
fn noise3d(p: vec3<f32>) -> vec3<f32> {
  let t = uniforms.time * 0.5;
  return vec3<f32>(
    sin(p.x * 2.1 + t) * cos(p.z * 1.7 + t * 0.8),
    cos(p.y * 1.9 + t * 1.2) * sin(p.x * 2.3 + t * 0.6),
    sin(p.z * 2.5 + t * 0.9) * cos(p.y * 1.3 + t * 1.1)
  );
}

@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) id: vec3<u32>) {
  let idx = id.x;
  if (idx >= uniforms.particleCount) { return; }

  var p = particles[idx];
  let dt = uniforms.deltaTime;

  // Attractor force toward mouse position
  let mousePos = vec3<f32>(uniforms.mouseX, uniforms.mouseY, 0.0);
  let toMouse = mousePos - p.pos.xyz;
  let dist = max(length(toMouse), 0.01);
  let attractForce = normalize(toMouse) * uniforms.attractorStrength / (dist * dist + 1.0);

  // Turbulence noise
  let turbForce = noise3d(p.pos.xyz * 0.5 + uniforms.time) * uniforms.turbulence;

  // Update velocity with forces and damping
  p.vel = vec4<f32>(
    (p.vel.xyz + (attractForce + turbForce) * dt) * uniforms.damping,
    p.vel.w
  );

  // Update position
  p.pos = vec4<f32>(
    p.pos.xyz + p.vel.xyz * dt,
    p.pos.w - dt * 0.1 // decrease life
  );

  // Respawn dead particles
  if (p.pos.w <= 0.0) {
    let seed = vec3<f32>(f32(idx), uniforms.time, f32(idx) * 0.37);
    p.pos = vec4<f32>(
      (hash(seed) - 0.5) * 4.0,
      (hash(seed + vec3<f32>(1.0, 0.0, 0.0)) - 0.5) * 4.0,
      (hash(seed + vec3<f32>(0.0, 1.0, 0.0)) - 0.5) * 2.0,
      1.0 + hash(seed + vec3<f32>(0.0, 0.0, 1.0)) // reset life
    );
    p.vel = vec4<f32>(0.0, 0.0, 0.0, 0.005 + hash(seed) * 0.01);
  }

  // Color based on velocity and life
  let speed = length(p.vel.xyz);
  p.color = vec4<f32>(
    0.65 + speed * 2.0,                    // r: violet base
    0.55 + sin(p.pos.w * 3.14) * 0.3,     // g: pulse with life
    0.98,                                   // b: electric blue
    p.pos.w * 0.8                          // a: fade with life
  );

  particles[idx] = p;
}
