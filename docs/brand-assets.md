# Transparent FlexUI branding

The user-supplied FlexUI image was edited with the built-in image editor to remove its pale background, construction lines and background texture. The extracted artwork retains its blue, cyan and teal monogram, charcoal wordmark and tagline. All delivered files are PNGs with real alpha transparency.

| File | Size | Use |
| --- | --- | --- |
| `public/brand/flexui-logo.png` | 585 × 687 | Complete transparent logo, wordmark and tagline. Charcoal lettering is intended for a light backdrop. |
| `public/brand/flexui-mark.png` | 512 × 512 | Symbol for the navigation, sidebar, footer, call to action and component registry watermark. |
| `public/brand/favicon-32.png` | 32 × 32 | Browser favicon and shortcut icon. |
| `public/brand/favicon-64.png` | 64 × 64 | Larger browser favicon. |
| `public/brand/apple-touch-icon.png` | 180 × 180 | Apple touch icon. |

The symbol and icon sizes are technical crops and resizes of the same complete extracted artwork. Transparent padding protects the pointed edges. The site combines the symbol with its existing HTML wordmark so the name remains readable on the dark theme. PNG compression preserves alpha; no opaque backing is added. New `/brand/` asset URLs avoid reusing the cached white-backed `/logo.png`.

Final extraction prompt:

Use case: background-extraction. Edit target: the supplied FlexUI logo image. Remove ONLY the entire pale white background, all grey construction grids, thin background curves, shadows and background texture. Deliver a genuine transparent PNG with an alpha channel, including transparent negative spaces inside the logo and lettering. Preserve the original blue, cyan and teal interlocking monogram exactly, its silhouette, pointed tips, proportions, gradients and positions. Preserve the exact charcoal wordmark "FLEXUI" and the exact smaller tagline "FLEXIBLE. INTUITIVE. RESPONSIVE." with the same typography, spacing, spelling and hierarchy. Do not redesign, add, move or change any logo element. Keep the complete mark, wordmark and tagline visible, centered with a modest clear transparent margin. Clean precise antialiased edges with no white halo. No checkerboard pixels baked into the image, no opaque backing, no white badge or tile, no mockup.

