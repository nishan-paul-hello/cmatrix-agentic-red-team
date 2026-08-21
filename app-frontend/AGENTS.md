# app-frontend

React + Next.js (App Router) + Tailwind CSS project.

## Development Server

```
npm install
npm run dev
```

Runs on http://localhost:3000 by default.

## Project Structure

- `src/app/layout.tsx` - Root layout; sets page metadata (title) and loads global styles
- `src/app/page.tsx` - Root route (`/`); renders `AppShell`, the client-side application
- `src/app/globals.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `src/components/AppShell.tsx` - Primary application component (client component) — the usual starting point for UI work; owns top-level view/navigation state
- `src/components/*` - UI components used by `AppShell`
- `src/lib/*` - Shared constants and data
- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - PostCSS configuration wiring up the Tailwind CSS v4 plugin

## Routing

This app currently renders as a single client-side view (`AppShell`) mounted at `/`, matching its original single-page navigation model (in-memory view state, not URL-based routing). Additional routes can be added under `src/app/` using standard Next.js App Router conventions (e.g. `src/app/missions/page.tsx`) if URL-based routing is introduced later.

## Dependencies

- Runtime: React 19, React DOM 19, Next.js 16 (App Router)
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss`
- Build tooling: TypeScript 5.7
- Linting: ESLint 9 with `eslint-config-next`
- Formatting: oxfmt

## Styling

Tailwind CSS v4 is wired up via `@tailwindcss/postcss` in `postcss.config.mjs`. `src/app/globals.css` imports Tailwind with `@import 'tailwindcss';` and defines the monospace font theme. This scaffold does not need a `tailwind.config.js` file.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.
- Components under `src/components/` that use React state/effects/browser APIs must keep the `"use client"` directive at the top of the file.
