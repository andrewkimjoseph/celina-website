## Mobile Navbar Optimization

### Problem
The site header now has 7 nav links plus an npm button and theme toggle. On small screens the links overflow or wrap awkwardly.

### Solution
Collapse the nav links into a hamburger-drawer on mobile while keeping the logo and theme toggle visible at all times.

### What will change

**1. Desktop (sm and above)** — unchanged horizontal nav with all links visible.

**2. Mobile (below sm)** — only the logo, theme toggle, and a hamburger button are shown in the header row. Tapping the hamburger opens a right-side Sheet panel listing all nav links plus the npm button.

### Implementation details
- Import `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle`, `SheetClose` from `@/components/ui/sheet`.
- Import `Menu` and `X` icons from `lucide-react`.
- In `SiteHeader`, use Tailwind responsive classes:
  - Nav links wrapper: `hidden sm:flex` on desktop, removed on mobile.
  - Add a hamburger trigger button: `flex sm:hidden`.
- The Sheet panel will contain:
  - A header with "Menu" title and close button
  - Stacked `Link` items for each route (same routes as desktop)
  - The npm external link at the bottom of the list
  - Active link styling preserved
- Keep the `ThemeToggle` outside the drawer so it stays accessible without opening the menu.

### Files to modify
- `src/components/site-header.tsx`