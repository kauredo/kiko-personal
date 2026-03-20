# Francisco Catarro — Musician Portfolio

Portfolio website for Francisco Catarro, a guitarist, pianist, musical director, and producer.

## 6 Homepage Variants

The site ships with 6 completely distinct homepage designs, switchable via the theme picker icons in the nav:

| Variant | Concept | Font | Hero |
|---------|---------|------|------|
| **Electric** | Brutalist concert poster | Syne 800 | Massive name, red CTA, horizontal media strip |
| **Analog** | Vinyl sleeve editorial | DM Serif Display | Split-screen (portrait + info), dark media breakout |
| **Editorial** | Magazine lookbook | Instrument Serif | Centered stately, stats bar, services grid |
| **Parallax** | Cinematic scroll-driven | Syne 700 | Name scales on scroll, text zoom, horizontal gallery |
| **Piano** | Interactive keyboard | DM Serif Display | Playable piano (Web Audio API), 3D press effects |
| **Guitar** | 3D instrument showcase | Instrument Serif | React Three Fiber guitar, studio lighting |

## Stack

- **Vite+** (`vite-plus`) — unified toolchain
- **React 19** + TypeScript
- **Tailwind CSS 4**
- **Convex** — backend (DB, auth, file storage, real-time)
- **GSAP** + Framer Motion + Lenis — animations
- **React Three Fiber** + Three.js — 3D scenes

## Getting Started

```bash
npm install
npx convex dev          # starts Convex backend (creates .env.local)
npm run dev             # starts Vite dev server
```

Open `http://localhost:5173` (or the port Vite assigns).

## Admin Panel

Navigate to `/admin/login`. Default credentials (from seed):

```
Email:    admin@franciscocatarro.com
Password: changeme123
```

Seed the admin user after first Convex deploy:

```bash
npx convex run seed:init
```

The admin panel manages: bio, media (photos/videos/music), resume, testimonials, events, contact messages, and site settings.

## Project Structure

```
src/
  pages/
    Home.tsx              # Router — picks variant based on theme
    HomeElectric.tsx       # Variant 1: Electric
    HomeAnalog.tsx         # Variant 2: Analog
    HomeEditorial.tsx      # Variant 3: Editorial
    HomeParallax.tsx       # Variant 4: Parallax
    HomePiano.tsx          # Variant 5: Piano
    HomeGuitar.tsx         # Variant 6: Guitar
    admin/                 # Admin panel pages
  components/
    ui/                    # Shared UI (cursor, buttons, theme switcher)
    three/                 # 3D scenes and shaders
    sections/              # Original section components
    admin/                 # Admin layout and providers
  context/                 # Theme + Lenis providers
  hooks/                   # Custom hooks
  lib/                     # Utils, GSAP setup, animation factories
convex/
  schema.ts                # Full data schema
  auth.ts                  # Session-based admin auth
  seed.ts                  # Bootstrap admin + defaults
  *.ts                     # Domain CRUD (bio, media, resume, etc.)
```

## Deploy

```bash
npx convex deploy         # deploy Convex to production
npm run build             # build frontend
# Deploy dist/ to Vercel, Netlify, etc.
```
