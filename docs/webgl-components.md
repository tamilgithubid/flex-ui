# FlexUI WebGL components

All 18 requested scenes are first-class FlexUI React components: Skydome, Cube Map, Normal Maps, Point Lighting, PBR, Shadow Maps, GPGPU Particles, Skinning, Load JSON, Particles, Polylines, Tube, Load GLTF, GLTF KTX2 Basis, Sort Transparency, Frustum Culling, Orbit Controls and Mouse Flowmap.

Open `/docs/components/webgl` for the gallery. Each component has a normal `/docs/components/{id}` page, live canvas, copyable React usage, API table, complete rendering/shader source and registry entry. Desktop navigation, mobile navigation, search and the sitemap use the same local routes. Previews contain no external page, iframe, original-site banner or navigation to upstream examples.

## Installation

For example:

    npx flexui add skydome
    node scripts/flexui-webgl-assets.mjs skydome

The registry supplies the React component, JavaScript scene module, type declarations, shared canvas runtime, pinned `ogl@1.0.11` dependency, asset manifest, installer and licenses. Only the selected component's rendering code is installed. Its models and textures are downloaded by the second command, checked against pinned byte sizes and SHA-256 hashes, and served from the application's own `public/webgl/assets` folder.

The installer accepts multiple component IDs, `--all`, and `--source /path/to/local/flexui` for offline copying. It rejects corrupt assets, unsafe paths and symlinks. Existing mismatched files require an explicit `--overwrite`.

Development, production builds and tests automatically prepare all 51 required assets. Later runs verify the local cache. The first installation needs network access; previews then use local models, textures and the Basis JavaScript/WebAssembly decoder. Assets are cached outside Git.

## Native rendering lifecycle

`WebGLCanvas` mounts each scene directly into the React component's own DOM container. Scene modules retain their rendering math, geometry, shaders, materials and camera setup. A shared runtime scopes dimensions, pointer coordinates, controls, async loading and animation to that container. Each glTF loader has its own decoder state, so concurrent previews remain independent.

The default drawing pixel ratio is 1.5; gallery cards use 1. Ratios are clamped to 0.5–2. `height`, `className`, `dpr`, `autoPlay`, `showControls` and `assetPath` are customizable.

Intersection observation creates canvases only near the viewport. Leaving the viewport or unmounting disposes controls, observers, scheduled frames, pending asset requests, workers, object URLs and the component's graphics context. Hidden browser tabs stop scheduling. Pause preserves scene state; Restart recreates it. Fullscreen expands the component, including its controls.

Reduced-motion preferences render a complete still frame. Async model, texture and decoder completion triggers redraws while paused, so readiness never depends on continuous playback. Manual pointer interaction and container resizing can redraw a paused component. Runtime failures, missing assets, context loss and timeouts display an actionable reload state.

## Source and attribution

Rendering code is adapted from OGL 1.0.11 at revision `385ce65c352c70734a36dc98c787fdd1d30ddb3b`. OGL code uses the Unlicense. The original source snapshots in `vendor/ogl/examples` make shader fidelity reviewable. Models and textures retain their creators' terms; their credits are in `public/webgl/ATTRIBUTION.md`. Engine and decoder licenses remain in `public/webgl/UNLICENSE.txt` and `public/webgl/licenses`.

Credits stay in those files rather than over the component canvas. FlexUI does not claim authorship of the underlying library or assets.

To regenerate scene ports from the pinned upstream checkout:

    node scripts/sync-webgl.mjs --source /path/to/ogl
    npm run registry:build

The generator verifies the pinned revision and clean source, extracts native scene functions, preserves every GLSL string, scopes assets and async lifecycle boundaries, and regenerates wrappers, declarations, metadata, checksums and provenance. The canvas runtime and React API are maintained separately.

## Verification

Unit checks compare all GLSL strings and source hashes, verify every asset, test fresh consumer installation and type checking, reject tampered manifests and unsafe destinations, and exercise viewport disposal, pause, restart and stale callbacks. Browser checks require successful local asset requests, real drawing, nonblank pixels and no upstream links or iframes for every component. Additional checks cover reduced-motion gallery readiness, filtering, offscreen disposal, independent previews, interaction, fullscreen and mobile layout.
