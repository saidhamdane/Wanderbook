# Modern Editorial — Canva PNG drop

Drop the ICONA green/beige Canva export here as numbered PNGs:

```
1.png   — Cover  (used by gb-cover and as the picker preview)
2.png   — Contents + editorial box
3.png   — Letter from editor
6.png   — Article 1
10.png  — Article 2
14.png  — Photo collage
17.png  — Memories
20.png  — Back cover
```

Render size: each PNG should be at least 794 × 1123 px (A4 @ 72dpi).
Higher resolution is fine; the renderer scales with `objectFit: cover`.

Until these files exist, the picker chip shows a "PNG pending" tile in
the template's green palette, and each spread renders the empty Canva
template-page area in `palette.background` with the user-photo and
text overlays still in place — handy for tuning zone rectangles.

Photo and text overlay positions for each layout live in:
`components/layouts/green-beige/GB*.tsx`

They're first-pass estimates; once the real PNGs are here, eyeball
each spread and adjust the `top/left/width/height` percentages on
`<PhotoZone>` and `<TextZone>` to land in the right hole on the Canva
page.
