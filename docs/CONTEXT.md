<!-- BEGIN:nextjs-agent-rules -->
# Next.js: ALWAYS read docs before coding

Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
<!-- END:nextjs-agent-rules -->

# Luxe State: Agent Guidelines & Best Practices

## 1. Development & Build Commands
Use **npm** as the package manager (do not use yarn, pnpm, or bun unless explicitly requested, as `package-lock.json` is present).

- **Start Dev Server**: `npm run dev`
- **Build Production Bundle**: `npm run build`
- **Run Linting**: `npm run lint`
- **Typecheck code**: `npx tsc --noEmit`

## 2. Code Style & Architecture
- **TypeScript**:
  - Always write TypeScript. Avoid `any`; use strict typing.
  - Declare types/interfaces for all components and utility function arguments/returns.
- **Component Conventions**:
  - Use functional components with explicit React return types where appropriate.
  - Use default exports for Next.js file-system routing conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
  - Use named exports for reusable UI components and helper utilities.
  - Keep client interactivity separated. Use `'use client'` strictly at the top of files that require browser APIs or state hooks, keeping the parent pages as Server Components.
- **Import Aliases**:
  - Always use the `@/*` alias for importing modules (defined in `tsconfig.json` as `@/*` mapping to `./*`).
  - Avoid deeply nested relative imports (e.g., use `@/components/Button` instead of `../../components/Button`).

## 3. TailwindCSS v4 Styling Rules
- **No JS/TS Configuration**: TailwindCSS v4 has replaced `tailwind.config.js`. Do not generate or edit a Tailwind config file.
- **CSS-First Theme Config**: Use [app/globals.css](./../luxe-state/app/globals.css) to add variables and customize themes under `@theme inline { ... }` using CSS variables.
- **Utility-First & Rich Aesthetics**: Prioritize visual excellence. Build fully responsive designs with modern aesthetics (glassmorphism, subtle gradients, dark mode support via `dark:`, hover animations) rather than simple bare-bones layouts.

## 4. Next.js 16 & React 19 Specifics
- **Instant Client-Side Navigation**:
  - To optimize navigations, export `unstable_instant` from routes to bypass standard transitions where applicable. Refer to the local guide at `node_modules/next/dist/docs/01-app/02-guides/instant-navigation.md`.
  - Use the React 19 `useLinkStatus` hook for adding grace/loading indicators during slow transitions without causing layout shifts.
- **State Management**:
  - Prioritize React 19 Actions for forms and asynchronous mutations.
  - Keep state localized to the smallest component possible. Use React Context only when state needs to be shared widely.

## 5. Verification Checklist for Tasks
Before completing any task, ensure the following steps are performed:
1. Run `npx tsc --noEmit` to verify there are no TypeScript compile-time errors.
2. Run `npm run lint` to ensure ESLint rules are fully satisfied.
3. If requested, run `npm run build` to confirm the production build completes successfully.
