// Generated from scripts/ogl-examples.json by sync-ogl-examples.mjs.
export const OGL_UPSTREAM_REVISION = "385ce65c352c70734a36dc98c787fdd1d30ddb3b";
export const OGL_EXAMPLES = [
  {
    "id": "skydome",
    "title": "Skydome",
    "component": "OGLSkydome",
    "category": "Shading",
    "description": "A textured mountain panorama wrapped around a sky sphere, with a smaller globe at its center.",
    "interaction": "Drag to look around the panorama."
  },
  {
    "id": "cube-map",
    "title": "Cube Map",
    "component": "OGLCubeMap",
    "category": "Shading",
    "description": "Six original cubemap faces surround a reflective scene with orbit and zoom controls.",
    "interaction": "Drag to orbit; scroll to zoom. Switch between dolly and field-of-view zoom."
  },
  {
    "id": "normal-maps",
    "title": "Normal Maps",
    "component": "OGLNormalMaps",
    "category": "Shading",
    "description": "The original granite material with tangent-space normal mapping and moving illumination.",
    "interaction": "Drag to orbit around the granite object."
  },
  {
    "id": "point-lighting",
    "title": "Point Lighting",
    "component": "OGLPointLighting",
    "category": "Shading",
    "description": "A textured Earth with clouds, point lighting and specular highlights.",
    "interaction": "Watch the lighting move across the globe."
  },
  {
    "id": "pbr",
    "title": "PBR",
    "component": "OGLPBR",
    "category": "Shading",
    "description": "The original physically based car scene, including its material textures, environment and ground shadow.",
    "interaction": "Drag to orbit and scroll to zoom around the car."
  },
  {
    "id": "shadow-maps",
    "title": "Shadow Maps",
    "component": "OGLShadowMaps",
    "category": "Shading",
    "description": "The original airplane scene rendered with a shadow map over the water surface.",
    "interaction": "Drag to orbit and inspect the projected shadow."
  },
  {
    "id": "gpgpu-particles",
    "title": "GPGPU Particles",
    "component": "OGLGPGPUParticles",
    "category": "Particles",
    "description": "GPU particle position and velocity simulation using the original ping-pong render targets.",
    "interaction": "Move your pointer to attract and disturb the particles."
  },
  {
    "id": "skinning",
    "title": "Skinning",
    "component": "OGLSkinning",
    "category": "Animation",
    "description": "The original Snout character, skinned mesh, skeletal animation and ground shadow.",
    "interaction": "Drag to orbit around the animated character."
  },
  {
    "id": "load-json",
    "title": "Load JSON",
    "component": "OGLLoadJSON",
    "category": "Geometry",
    "description": "The original textured fox mesh loaded from the OGL JSON geometry format.",
    "interaction": "Watch the fox rotate."
  },
  {
    "id": "particles",
    "title": "Particles",
    "component": "OGLParticles",
    "category": "Particles",
    "description": "The original animated particle geometry, point sprites and shader colors.",
    "interaction": "Watch the particle field animate."
  },
  {
    "id": "polylines",
    "title": "Polylines",
    "component": "OGLPolylines",
    "category": "Geometry",
    "description": "The original colored polylines, curve geometry and interactive movement.",
    "interaction": "Move your pointer across the preview."
  },
  {
    "id": "tube",
    "title": "Tube",
    "component": "OGLTube",
    "category": "Geometry",
    "description": "The original tube geometry generated along curved paths.",
    "interaction": "Drag to orbit and scroll to zoom."
  },
  {
    "id": "load-gltf",
    "title": "Load GLTF",
    "component": "OGLLoadGLTF",
    "category": "Geometry",
    "description": "The original Hershel model, glTF materials and environment lighting.",
    "interaction": "Drag to orbit and scroll to zoom around the model."
  },
  {
    "id": "gltf-ktx2-basis",
    "title": "GLTF KTX2 Basis",
    "component": "OGLGLTFKTX2Basis",
    "category": "Geometry",
    "description": "The original painterly cottage loaded with KTX2 Basis compressed textures and its local transcoder.",
    "interaction": "Drag to orbit and scroll to zoom around the cottage."
  },
  {
    "id": "sort-transparency",
    "title": "Sort Transparency",
    "component": "OGLSortTransparency",
    "category": "Scene",
    "description": "The original transparent leaf meshes and OGL transparent-object sorting.",
    "interaction": "Inspect the intersecting transparent surfaces as they rotate."
  },
  {
    "id": "frustum-culling",
    "title": "Frustum Culling",
    "component": "OGLFrustumCulling",
    "category": "Scene",
    "description": "The original forest scene with camera frustum culling and its live visibility counter.",
    "interaction": "Drag to move the camera; watch the visibility counter update."
  },
  {
    "id": "orbit-controls",
    "title": "Orbit Controls",
    "component": "OGLOrbitControls",
    "category": "Interaction",
    "description": "The original textured macaw with mouse and touch orbit controls and two zoom modes.",
    "interaction": "Drag to orbit, scroll to zoom, and use the zoom-style selector."
  },
  {
    "id": "mouse-flowmap",
    "title": "Mouse Flowmap",
    "component": "OGLMouseFlowmap",
    "category": "Interaction",
    "description": "The original water texture distorted by a mouse-driven flowmap simulation.",
    "interaction": "Move your pointer or touch and drag across the water."
  }
] as const;

export type OGLExampleId = (typeof OGL_EXAMPLES)[number]["id"];
export function getOGLExample(id: string) { return OGL_EXAMPLES.find(example => example.id === id); }
export function oglSourceUrl(id: OGLExampleId) { return "https://github.com/oframe/ogl/blob/" + OGL_UPSTREAM_REVISION + "/examples/" + id + ".html"; }
