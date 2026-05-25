## Goal
Repaint Celina with a Midnight + Yellow palette, swap the avatar for a custom "C-lady" logo (a C glyph that doubles as a stylized woman silhouette), and rework the hero + tool cards so the new mood feels intentional. Fonts stay exactly as they are.

## 1. New palette (Midnight + Yellow)

Replace the green/cream Celo tokens with a near-black + slate system. Yellow stays as the single hero accent.

New token values (semantic names kept so we don't touch every component):

```text
--celo-ink     #0a0a14   deepest near-black, page bg in dark mode
--celo-deep    #161622   surface / cards in dark mode
--celo-forest  #2a2a3a   muted slate, used where green was (borders, secondary accents)
--celo-cream   #f5f5fa   off-white text on dark, page bg in light mode
--celo-yellow  #facc15   unchanged accent (kept per request)
```

- Default theme flips to **dark-first** (midnight is the brand). Light mode keeps the same yellow accent on a cool off-white background using the same tokens inverted.
- Rebuild `--gradient-hero`, `--shadow-soft`, `--shadow-pop` against the new ink/yellow so glows, grid overlays, and brutalist offset shadows read against midnight.
- shadcn semantic tokens (`--background`, `--foreground`, `--primary`, `--ring`, `--border`, `--muted`, `--accent`) re-mapped to the new palette so every shadcn component picks up the change for free.

Files: `src/styles.css` only.

## 2. New "C-lady" logo

A C-shaped mark whose negative space silhouettes a woman's profile (Celina). One PNG asset, used everywhere the current avatar logo appears.

- Generate `src/assets/celina-logo-clady.png` with `imagegen` (transparent background, midnight + yellow palette, monoline geometric, modern editorial — works at 32px and 256px).
- Replace all four existing logo references:
  - `src/routes/index.tsx` — `celinaLogoGreen` / `celinaLogoYellow` in the sticky header (drop the light/dark swap, use one mark on both themes since it's drawn for midnight + yellow).
  - `src/routes/tools.$toolSlug.tsx` and `src/routes/tools.index.tsx` — header avatar.
  - `index.html` / favicon set — out of scope unless requested (call it out, don't auto-swap).
- Keep `celina-banner.png` for the hero portrait slot but recolor-tint via CSS overlay if it clashes; do NOT regenerate the banner in this pass.

## 3. Hero redesign

Current hero is a centered editorial column with a radial green wash and grid overlay. New direction matches midnight energy:

- **Split layout**: left column = oversized display headline + sub + primary CTA (yellow on ink); right column = a contained "agent panel" mock — a stylized terminal/chat card showing a sample Celina prompt + response, rendered in tokens (no screenshot).
- Background: pure ink with a single yellow radial spotlight top-right, a faint slate dot-grid (not lines), and a thin yellow horizon line under the headline for editorial punch.
- Live status pill keeps its dot but switches dot color to yellow on a slate chip.
- Drop the gradient mesh — midnight wants restraint.

Files: `src/routes/index.tsx` hero `<section id="top">` block only.

## 4. Tool cards redesign

Current cards are pale rounded rectangles with hover lift. New cards lean into the midnight + yellow contrast:

- Card surface = `--celo-deep` (slate) on midnight bg, 1px slate border, no shadow at rest.
- Hover: border turns yellow, a 2px yellow left rail slides in, slight translate-y. No drop shadow.
- Tool name in monospace cream; kind badge (`read`/`write`) becomes a tiny uppercase pill — yellow fill for `write`, outline-yellow for `read` (today both have separate styling; this unifies them).
- Two-row layout: name + badge top row, summary bottom — same as today, just retuned spacing for the denser dark look.
- Apply the same card treatment to the `/tools` index page category grid so both pages match.

Files: `src/routes/index.tsx` (tools section), `src/routes/tools.index.tsx`.

## 5. Bleed-through cleanup

Touch-ups so the rest of the page doesn't look stranded next to the redesigned hero + cards:

- CTA section at the bottom of `index.tsx` already uses `--celo-deep` — recheck contrast against the new midnight value and adjust the two blurred radial blobs (currently yellow + green) to yellow + slate.
- Install section code blocks: ensure code background uses `--celo-deep` not raw `bg-secondary` if contrast drops.
- Theme toggle keeps working — both modes will be repainted, default lands on dark.

## 6. Out of scope (call out, don't do)

- Favicon set + `celina-banner.png` regeneration (separate request).
- Font changes (explicitly excluded).
- Copy rewrites.
- The Celo wordmark SVGs in `src/assets/` (those are official brand assets and untouched).

## Technical notes

- All color changes flow through `src/styles.css` tokens — components are not edited for color, only for layout (hero, cards). This keeps the diff focused and means the dark/light toggle keeps working.
- The C-lady logo generation will be a single `imagegen--generate_image` call with `transparent_background: true`, premium tier (logo legibility matters), 1024×1024.
- After implementation: capture the new hero + `/tools` page and verify the yellow reads as the only accent, slate reads as structural, midnight reads as canvas.

## Build order
1. Repaint tokens in `styles.css` (everything shifts at once — verify visually).
2. Generate the C-lady logo asset.
3. Swap logo references in the three route files.
4. Rebuild hero in `index.tsx`.
5. Rebuild tool cards in `index.tsx` + `tools.index.tsx`.
6. Sweep CTA + install section for contrast tweaks.