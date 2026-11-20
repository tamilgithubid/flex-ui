# Editorial artwork

Original generated artwork is stored in `public/images/editorial/`. The blog uses four covers on its index and article pages; the design gallery uses six concept previews. The hover-card demo uses a landscape photograph expanded from the original portrait. Gallery images illustrate fictional interface concepts.

All final images were generated with the built-in image generator, then encoded as WebP. Blog and gallery covers retain their original 16:9 composition at a maximum width of 1600px (quality 84). The original portrait retains its full 3:4 composition at 1000px (quality 87). The hover landscape retains its generated 1672×941 composition (quality 86). Image components provide descriptive alt text; blog and gallery covers use responsive sizes and lazy loading, and the featured article cover is prioritized.

## Prompt set

Shared direction: premium cinematic artwork for a dark interface library; tactile glass and metal, restrained studio lighting, full subjects visible with breathing room, no readable microtext, real company branding, browser chrome or watermarks.

| Asset | Final art direction |
| --- | --- |
| `blog-launch.webp` | Emerald frosted-glass interface tiles and silver frames assembling into an illuminated architectural arch over black graphite. Restrained mint and teal rim lighting, fine grain, editorial 3D still life. |
| `blog-intro.webp` | Lilac glass UI cards, a rounded silver toggle, a violet sphere and a translucent folded panel in a charcoal studio. Soft violet and icy blue light, carefully balanced material studies. |
| `blog-spring.webp` | A translucent cyan glass spring between polished chrome spheres, with a subtle curved trail suggesting elastic motion. Deep midnight charcoal, physically plausible glass, fine grain, full objects in frame. |
| `blog-webgl.webp` | A faceted amber and smoky-quartz polyhedron above a delicate wireframe orbital sphere. Warm volumetric light and fine golden edge details against graphite. |
| `showcase-dashboard.webp` | A complete floating charcoal analytics dashboard, three-quarter view, violet chart curves, metric cards and activity rows. Lavender glass accents and subtle studio shadow. Artistic concept, not exact financial data. |
| `showcase-nebula.webp` | A complete floating AI infrastructure landing panel with a cyan constellation globe, abstract heading lines and a pill-shaped action. Sparse cyan and cobalt glass surfaces in a black studio. |
| `showcase-portfolio.webp` | A complete editorial portfolio panel with ivory typographic bars, a flowing chrome and apricot ribbon, and tasteful project tiles. Warm amber illumination and a thin silver frame. |
| `showcase-finance.webp` | A full dark finance dashboard with emerald spending bars, a mint circular balance visualization, a translucent glass payment card and transaction rows. Graphite and silver with soft emerald studio light. |
| `showcase-devtools.webp` | A full floating code editor and terminal panel with violet, cyan and rose syntax-like lines, a command cursor and branch-flow motif. Obsidian surfaces, delicate glass frame and a restrained pink rim. |
| `showcase-commerce.webp` | A full dark commerce panel featuring sculptural ivory headphones, small product thumbnails and violet purchase controls. Refined warm white materials, lavender and silver studio lighting. |
| `hover-portrait.webp` | An original adult woman with short dark hair, a calm expression and charcoal clothing, photographed head and shoulders against a charcoal studio. Full hair, head, chin, neck and shoulders visible with clear margins; natural skin texture, cyan side light and lavender rim light. |
| `hover-landscape.webp` | Edit the original portrait into a seamless horizontal 16:9 editorial photograph. Preserve the fictional adult woman's identity, short dark hair, charcoal blazer, natural skin texture, cyan side light and lavender rim light. Expand the charcoal photographic studio horizontally; place the woman around 62% across the frame with the entire crown, chin, neck and shoulders visible and comfortable headroom. Leave quiet space at lower left for HTML copy. No vertical inset, blurred duplicate panels, borders, letterboxing, text or logos. |

## Presentation

The 3D card uses `imageFit="cover"` by default to fill the frame edge to edge. The homepage and primary documentation demo use the landscape photograph with `imagePosition="65% 40%"`. The homepage keeps a 16:9 frame below the desktop breakpoint. The original portrait remains available as the source artwork. `imageFit="contain"` opts into full-source framing with a blurred backdrop.

The gallery identifies its artwork as concept previews. It does not present generated images as screenshots of real customer projects.
