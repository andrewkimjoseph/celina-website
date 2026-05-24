## Overhaul plan — Celina landing page

### Direction
- **Palette (Emerald Prestige):** deep emerald `#064e3b`, emerald `#0d7a5f`, gold `#c9a84c`, warm cream `#f5f0e0` — replace the current teal/navy tokens in `src/styles.css`.
- **Type:** Space Grotesk (display) + DM Sans (body) via `@fontsource` packages, applied at root.
- **Layout:** Magazine — bold centered hero headline, **Claude demo video as the featured hero artifact** inside a macOS-style browser window, then editorial grid sections.
- **Vibe:** Premium, on-chain editorial — less "AI landing page," more product page for a serious dev tool.

### Asset
- Copy `user-uploads://Claude.mp4` → `public/claude-demo.mp4`. Autoplay, muted, loop, playsInline; poster derived from an early frame or fallback to existing banner.

### Sections (rebuild `src/routes/index.tsx`)
1. **Nav** — slim, cream background, gold underline on hover, emerald `npm` pill.
2. **Hero (Magazine)** — eyebrow tag, oversized Space Grotesk headline with gold highlight on "Celina", short sub, two CTAs. Below: **macOS browser-frame wrapping the Claude.mp4** (traffic lights, fake URL bar showing `claude.ai`, emerald shadow, gold corner accent). Caption: "Claude using Celina to read & send on Celo mainnet."
3. **Install one-liner** — emerald terminal pill, gold `$` prompt.
4. **Three feature tiles** — emerald icons in gold-tinted squares, editorial copy.
5. **Install configs** — Cursor + Claude Desktop cards, emerald borders, gold accent tab.
6. **Remote endpoint** — dashed gold card.
7. **Security note** — gold lock chip.
8. **Tools grid** — 12 tools, monospace names, write tools tagged gold, reads tagged emerald-outline.
9. **CTA band** — deep emerald background with gold headline accent.
10. **Footer** — cream, minimal.

### Files
- `src/styles.css` — swap palette tokens (`--background`, `--foreground`, `--primary`, `--accent`, `--celo-*`, `--gradient-hero`, `--shadow-pop`) to Emerald Prestige values in oklch; add Space Grotesk + DM Sans `font-family` to body and a `--font-display` token.
- `package.json` — add `@fontsource/space-grotesk`, `@fontsource/dm-sans`; import in `src/routes/__root.tsx`.
- `public/claude-demo.mp4` — copied from upload.
- `src/routes/index.tsx` — full rewrite around the new layout; add `<BrowserFrame>` subcomponent for the video.

### Out of scope
- No backend, no MCP logic changes, no new routes. Pure UI overhaul + video embed.