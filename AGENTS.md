<!-- BEGIN:nextjs-agent-rules -->
# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
<!-- END:nextjs-agent-rules -->

# Luxe State: Custom Agent Guidelines

## 1. Tech Stack Overview
- **Framework**: Next.js 16.2+ (App Router)
- **Runtime/UI**: React 19+
- **Styling**: TailwindCSS v4 + PostCSS v4 (TypeScript & Native PostCSS integration)
- **Language**: TypeScript 5+

## 2. TailwindCSS v4 Styling Rules
- **No tailwind.config.js/ts**: TailwindCSS v4 does not use a JavaScript config file. All configuration (theme overrides, custom utilities, fonts) is done inline in [globals.css](app/globals.css) using `@import "tailwindcss";` and `@theme inline { ... }`.
- **Do not create configuration files**: Never generate a `tailwind.config.js` or write CSS modules with old utility declarations.
- **Rich Aesthetics**: Prioritize visual excellence using modern CSS/Tailwind practices (smooth gradients, backdrop-filters, custom animations, curated HSL color schemes) to ensure a premium look.

## 3. Next.js 16 & React 19 Specifics
- **Navigation & Loading States**:
  - Suspense alone is not enough for instant client-side navigations. Always export `unstable_instant` from routes to guarantee instant page rendering. Refer to `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md` for guidelines.
  - Use the new React/Next hooks like `useLinkStatus` for handling transitions and navigation indicators without triggering layout shifts.
- **Client/Server Components**: Be strict with `'use client'` placement. Keep routing metadata in Server Components (`page.tsx` or `layout.tsx`) and isolate interactive parts into Client Components.
