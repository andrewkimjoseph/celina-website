## Goal
Incorporate the official Celo wordmark SVGs (Onyx = dark, Snow = white) and the Celo brand yellow (`#FCFF52`) into the landing page in a few tasteful, non-overwhelming spots.

## Asset setup
- Save both SVGs to `src/assets/`:
  - `celo-wordmark-onyx.svg` (use on light/cream backgrounds)
  - `celo-wordmark-snow.svg` (use on dark / emerald backgrounds)
- Import as ES6 modules.

## Where the wordmarks appear
1. **Hero — "Built on" line**
   Below the big headline / above the CTAs, add a small inline row:
   `Built on  [Celo wordmark — Onyx]`
   Wordmark height ~20px, muted opacity, sits next to "v0.1 · Live on Celo mainnet" energy. Replaces the need to keep spelling "Celo" in chrome.

2. **Footer band**
   Add a thin footer strip with `[Celo wordmark — Snow]` on the dark emerald CTA block, small, right-aligned, with a "Powered by" label. Anchors the page with an official mark.

## Where Celo yellow shows up
The current palette already uses `--celo-yellow` (gold-ish). Re-tune it to the **official Celo yellow `#FCFF52`** in `src/styles.css` so it matches the brand exactly. Then use it in these specific, restrained places:

- **Hero headline accent** — the highlight behind the word "Celo" in "Give your LLM a wallet on *Celo*" becomes a true Celo-yellow swatch (currently gold).
- **"v0.1 · Live on Celo mainnet" status dot** — switch the dot to Celo yellow.
- **Section eyebrow markers** (`§ Install`, `§ Tools v0.1`) — the `§` glyph in Celo yellow on the dark emerald sections only (skipped on cream sections so contrast stays legible).
- **Hero CTA hover state** — primary button gets a thin Celo-yellow underline / ring on hover for a brand-tied micro-interaction.

Yellow stays an *accent*, never a fill for large surfaces — readability on cream stays intact.

## Out of scope
- No layout restructuring.
- No new sections.
- Tools grid, install cards, demo frame remain untouched aside from the eyebrow color tweak.

## Files touched
- `src/assets/celo-wordmark-onyx.svg` (new)
- `src/assets/celo-wordmark-snow.svg` (new)
- `src/styles.css` (retune `--celo-yellow` to `#FCFF52`)
- `src/routes/index.tsx` (hero "Built on" row, footer wordmark, eyebrow color, status dot)
