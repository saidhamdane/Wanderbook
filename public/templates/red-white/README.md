# Red Bold Retro — Canva PNG drop

Drop the Hanover red/white Canva export here as numbered PNGs:

```
1.png   — Cover  (used by rb-cover and as the picker preview)
2.png   — Contents
3.png   — Masthead
4.png   — Main story
8.png   — Feature spread
12.png  — Photo grid
16.png  — Quote page
19.png  — Back cover
```

Other page numbers from the original 19-page export are not currently
referenced — drop them in if you wire more layouts to them later.

Render size: each PNG should be at least 794 × 1123 px (A4 @ 72dpi).
Higher resolution is fine; the renderer scales with `objectFit: cover`.

Until these files exist, the picker chip shows a "PNG pending" tile in
the template's red palette, and each spread renders the empty Canva
template-page area in `palette.background` with the user-photo and
text overlays still in place — handy for tuning zone rectangles.

Photo and text overlay positions for each layout live in:
`components/layouts/red-bold/RB*.tsx`

They're first-pass estimates; once the real PNGs are here, eyeball
each spread and adjust the `top/left/width/height` percentages on
`<PhotoZone>` and `<TextZone>` to land in the right hole on the Canva
page.
