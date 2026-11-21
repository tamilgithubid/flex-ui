# OGL examples in FlexUI

The collection contains all 18 requested examples: Skydome, Cube Map, Normal Maps, Point Lighting, PBR, Shadow Maps, GPGPU Particles, Skinning, Load JSON, Particles, Polylines, Tube, Load GLTF, GLTF KTX2 Basis, Sort Transparency, Frustum Culling, Orbit Controls and Mouse Flowmap.

Open /docs/components/ogl for the live gallery. Every scene has a dedicated page at /docs/components/ogl-{example}, a named React component, complete local scene source, API documentation and a registry entry.

## Fidelity and hosting

Upstream: https://github.com/oframe/ogl

Pinned revision: 385ce65c352c70734a36dc98c787fdd1d30ddb3b, OGL 1.0.11.

The complete engine under public/ogl/src is unchanged. Exact original HTML is retained under vendor/ogl/examples. The live copies under public/ogl/examples add only the lifecycle script, configurable pixel ratio and working external links to related upstream examples. Shaders, geometry, materials, texture bytes, camera setup and native scene interactions are preserved. The provenance file records SHA-256 hashes for the original scenes, adapted scenes and all engine modules.

React hosts each scene in its own local rendering document because upstream examples own their window, document, canvas and controls. This keeps their original behavior isolated from the application. The preview is a real interactive WebGL canvas, with locally hosted models, textures, fonts and the Basis JavaScript/WebAssembly decoder. It is not a screenshot or an embed of the remote OGL website.

## Installation

Run the FlexUI component command shown on a scene's documentation page, followed by its asset installer command. For example:

    npx flexui add ogl-skydome
    node scripts/flexui-ogl-assets.mjs skydome

The registry includes the React host, OGL ES modules, scene HTML, attribution, licenses, asset manifest and installer. The installer downloads only that example's pinned assets from upstream, checks their exact sizes and SHA-256 hashes, rejects unsafe paths and symlinks, and skips files that already match. It does not execute downloaded assets during installation.

Multiple example IDs may be passed to the asset installer. A local FlexUI checkout can provide the same verified bytes with the optional --source /path/to/flexui argument. Existing files with different bytes are rejected unless --overwrite is explicitly supplied.

Development, builds and tests automatically prepare all 56 pinned assets in the local public folder. The checksum-verified cache is reused on later runs and kept out of Git. The first preparation needs an internet connection; after it completes, scene rendering makes no external asset requests.

## Playback and resource use

The default pixel ratio is 1.5, with a 2× option matching the upstream rendering resolution. Gallery cards use 1×. All ratios are clamped between 0.5 and 2.

Only previews near the viewport create rendering documents. Scrolling away unloads their frames and releases their contexts; the adapter terminates its decoder workers and loses its own rendering contexts on disposal. Tab visibility pauses scheduling. Play/pause preserves the canvas and scene state, Restart recreates the rendering document, and Full screen uses the browser fullscreen API.

Reduced-motion preferences show a rendered still frame until Play is explicitly pressed. Texture, model and decoder completion can invalidate that frame while paused. Pointer interaction and resizing also redraw a paused scene, so controls and responsive layouts remain usable.

Runtime errors, missing assets, shader failures, context loss and load timeouts appear as visible reloadable errors. Messages are accepted only from the expected rendering frame and origin.

## Attribution

OGL code uses the upstream Unlicense. Original on-screen model and texture credits are retained and collected in public/ogl/ATTRIBUTION.md. The included Raleway font has its SIL Open Font License, and the Basis Universal decoder has its Apache 2.0 license under public/ogl/licenses. Original assets retain their creators' terms.

## Updating the pinned collection

Clone the upstream repository at the pinned revision, then run:

    node scripts/sync-ogl-examples.mjs --source /path/to/ogl
    npm run registry:build

The sync command verifies the Git revision, recopies the engine and scene assets, regenerates provenance and the asset manifest, and updates the typed example catalog. The FlexUI lifecycle adapter, React host, installer and license copies are maintained separately.

## Verification

Unit checks compare every shader against the original scene, verify the engine and asset hashes, exercise fresh-consumer asset installation, reject unsafe paths and corrupted assets, and check viewport and message lifecycles. Registry checks include a fresh consumer type check.

The production browser suite visits all 18 documentation pages, requires real draw calls and nonblank canvas output, verifies that asset requests succeed, and captures each scene. Additional checks cover pause, restart, orbit interaction, fullscreen, mobile layout, gallery filtering and offscreen disposal.
