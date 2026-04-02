// ─── Fluid Simulation Fragment Shader ────────────────────────────────────────
// Real-time Navier-Stokes inspired fluid simulation rendered as a
// background effect. Uses advection, diffusion, and vorticity fields.

struct Uniforms {
  time: f32,
  mouseX: f32,
  mouseY: f32,
  resolution_x: f32,
  resolution_y: f32,
  viscosity: f32,
  speed: f32,
  colorIntensity: f32,
};

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@group(0) @binding(0) var<uniform> uniforms: Uniforms;

// Vertex shader — fullscreen quad
@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var positions = array<vec2<f32>, 6>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>( 1.0,  1.0),
  );

  var output: VertexOutput;
  output.position = vec4<f32>(positions[vertexIndex], 0.0, 1.0);
  output.uv = (positions[vertexIndex] + 1.0) * 0.5;
  return output;
}

// Hash-based noise
fn hash22(p: vec2<f32>) -> vec2<f32> {
  let n = sin(dot(p, vec2<f32>(41.0, 289.0)));
  return fract(vec2<f32>(262144.0, 32768.0) * n) * 2.0 - 1.0;
}

// Simplex-like 2D noise
fn noise(p: vec2<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash22(i), f), dot(hash22(i + vec2<f32>(1.0, 0.0)), f - vec2<f32>(1.0, 0.0)), u.x),
    mix(dot(hash22(i + vec2<f32>(0.0, 1.0)), f - vec2<f32>(0.0, 1.0)),
        dot(hash22(i + vec2<f32>(1.0, 1.0)), f - vec2<f32>(1.0, 1.0)), u.x),
    u.y
  );
}

// Fractional Brownian Motion (fbm) for fluid-like patterns
fn fbm(p: vec2<f32>) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var pos = p;
  for (var i = 0; i < 6; i++) {
    value += amplitude * noise(pos);
    pos *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Vorticity field
fn vorticity(p: vec2<f32>, t: f32) -> vec2<f32> {
  let eps = 0.01;
  let dx = fbm(p + vec2<f32>(eps, 0.0) + t * 0.1) - fbm(p - vec2<f32>(eps, 0.0) + t * 0.1);
  let dy = fbm(p + vec2<f32>(0.0, eps) + t * 0.1) - fbm(p - vec2<f32>(0.0, eps) + t * 0.1);
  return vec2<f32>(dy, -dx) / (2.0 * eps);
}

// Fragment shader
@fragment
fn fs_main(input: VertexOutput) -> @location(0) vec4<f32> {
  let uv = input.uv;
  let t = uniforms.time * uniforms.speed;
  let mouse = vec2<f32>(uniforms.mouseX, 1.0 - uniforms.mouseY);

  // Advect UV coordinates through velocity field
  var p = uv * 3.0;
  let v = vorticity(p, t);
  p += v * uniforms.viscosity;

  // Mouse interaction — add swirl near cursor
  let toMouse = uv - mouse;
  let mouseDist = length(toMouse);
  if (mouseDist < 0.3) {
    let swirl = vec2<f32>(-toMouse.y, toMouse.x) * (0.3 - mouseDist) * 2.0;
    p += swirl;
  }

  // Layer multiple noise octaves for fluid effect
  let n1 = fbm(p + vec2<f32>(t * 0.13, t * 0.07));
  let n2 = fbm(p * 1.5 + vec2<f32>(-t * 0.09, t * 0.11) + n1 * 0.5);
  let n3 = fbm(p * 0.8 + vec2<f32>(t * 0.05, -t * 0.08) + n2 * 0.3);

  // Color mapping — FlexUI violet/indigo palette
  let ci = uniforms.colorIntensity;
  let col1 = vec3<f32>(0.65 * ci, 0.36 * ci, 0.98 * ci); // violet
  let col2 = vec3<f32>(0.51 * ci, 0.55 * ci, 0.97 * ci); // indigo
  let col3 = vec3<f32>(0.04, 0.04, 0.04);                  // near-black

  var color = mix(col3, col1, smoothstep(-0.3, 0.5, n2));
  color = mix(color, col2, smoothstep(0.0, 0.8, n3));

  // Vignette
  let vignette = 1.0 - dot(uv - 0.5, uv - 0.5) * 1.5;
  color *= vignette;

  return vec4<f32>(color, 1.0);
}
