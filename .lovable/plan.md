## Color overhaul — Celo Native

Current theme is "Midnight + Yellow" (slate midnight + golden yellow). The
palette you picked is the real Celo brand: bright Celo yellow `#FCFF52`,
forest green `#476520`, pure black `#000000`, pure white `#FFFFFF`. We move
the design system to that, keep Space Grotesk + Manrope/DM Sans typography
untouched, and keep the full-width section structure of the home page.

### What changes

**1. `src/styles.css` — rewrite the token layer**

Light mode
- `--background`: pure white `#FFFFFF`
- `--foreground`: pure black `#000000`
- `--card`: white, with forest-tinted borders
- `--primary`: forest `#476520` (buttons, links, structural accents)
- `--accent`: Celo yellow `#FCFF52` (highlights, pills, hover states)
- `--muted`: very pale yellow-tinted neutral
- `--border`: soft black at low alpha

Dark mode
- `--background`: pure black `#000000`
- `--foreground`: pure white `#FFFFFF`
- `--card`: near-black with white border at low alpha
- `--primary`: Celo yellow `#FCFF52` (yellow is the hero in dark)
- `--accent`: yellow (hover stays yellow per your earlier rule)
- `--muted-foreground`: warm off-white

Brand tokens (kept for compatibility with existing class usage)
- `--celo-yellow`: `#FCFF52` (was a duller golden yellow)
- `--celo-forest`: `#476520` (currently slate — restored to actual forest)
- `--celo-deep`: black
- `--celo-ink`: black
- `--celo-cream`: white (light) / near-white (dark)

Supporting tokens
- `--gradient-hero`: yellow glow top-right, forest glow bottom-left
- `--shadow-pop`: solid 6px offset shadow in forest (light) / yellow (dark)
- `--shadow-soft`: soft drop using forest at low alpha

**2. Audit token usage in components**

Walk each file that references the old palette and re-verify after the swap.
No behavior changes — just confirm contrast still works once forest replaces
slate and pure black replaces midnight:
- `src/routes/index.tsx` — hero, feature cards, "Sending transactions" note,
  pill, footer
- `src/routes/tools.index.tsx` — category pills, write/read badges, hover
  ring
- `src/routes/tools.$toolSlug.tsx` — page chrome
- `src/components/theme-toggle.tsx` — icon contrast on both themes

If any spot uses raw hex/`text-white`/`bg-black` instead of a token, switch
it to the semantic token in the same pass.

**3. Keep untouched**

- Typography (Space Grotesk display + Manrope body)
- Page layout, section order, copy, components, animations
- Favicon, logo, routes, all tool data

### Visual feel after

Brighter, higher-contrast Celo identity. Light mode reads like the celo.org
marketing site (white canvas, forest type, yellow pops). Dark mode keeps
yellow-on-black as the signature, but black is now true black instead of
slate midnight. Hover-to-yellow behavior in dark mode is preserved.
