# Project: Francisco Catarro Portfolio

Musician portfolio with 6 homepage variants + admin panel.

## Stack

- Vite+ (vite-plus) + React 19 + TypeScript + Tailwind CSS 4
- Convex backend (schema in `convex/schema.ts`)
- GSAP + Framer Motion + Lenis for animations
- React Three Fiber + Three.js for 3D (Guitar variant, HeroScene)

## Architecture

Each homepage variant is a self-contained component in `src/pages/Home*.tsx`.
They are NOT theme CSS swaps — each is a completely different page with its own
layout, sections, fonts, colors, and interactions.

The `ThemeSwitcher` component switches between variants via `ThemeContext`.
Theme names: `dark-electric`, `raw-textured`, `hybrid`, `parallax`, `piano`, `guitar`.

## CSS Note

All base styles in `src/index.css` MUST be inside `@layer base { }` blocks.
Unlayered CSS overrides Tailwind 4's layered utilities (cascade layers).
This was a bug that caused all padding/margin classes to stop working.

## Convex

- Auth is session-based (not @convex-dev/auth). See `convex/auth.ts`.
- Query pattern: use ternary for optional index filtering, not let/reassign
  (Convex types don't allow reassigning QueryInitializer after withIndex).
- Seed: `npx convex run seed:init` creates admin user + default content.
- `convex/_generated/` is gitignored — run `npx convex dev` to regenerate.

## Commands

```
npm run dev       # vp dev (Vite+ dev server)
npm run build     # vp build
npm run lint      # vp lint (Oxlint)
npm run fmt       # vp fmt (Oxfmt)
```
