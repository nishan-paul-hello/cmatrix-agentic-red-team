# app-frontend

React + Next.js (App Router) + Tailwind CSS project.

## Development Server

```
npm install
npm run dev
```

Runs on http://localhost:3000 by default.

## Project Structure

- `src/app/layout.tsx` - Root layout; wraps the app in `AuthProvider`, sets page metadata (title), and loads global styles
- `src/app/page.tsx` - Root route (`/`); redirects to `/login` or `/dashboard` based on auth state
- `src/app/login/page.tsx` - `/login` route
- `src/app/(app)/layout.tsx` - Shared layout for all authenticated routes: auth guard, `Shell` (sidebar/topbar), and the Cmd+K `CommandPalette`
- `src/app/(app)/*/page.tsx` - One route per nav destination (see Routing below)
- `src/app/globals.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `src/components/*` - UI components rendered by the route pages
- `src/lib/auth-context.tsx` - Mock login state (`useAuth()`), shared across all routes via React context
- `src/lib/mission-context.tsx` - Shared "active mission" state (`useMission()`) so the topbar indicator stays in sync across navigation
- `src/lib/nav-paths.ts` - `NAV_PATHS` (nav id → URL) and `navItemForPath()` (URL → nav id, for sidebar highlighting)
- `src/lib/*` (constants.ts, data.ts) - Shared constants and mock data
- `next.config.ts` - Next.js configuration
- `postcss.config.mjs` - PostCSS configuration wiring up the Tailwind CSS v4 plugin

## Routing

URL-based routing via the Next.js App Router. Routes:

| Path | Renders |
|---|---|
| `/` | Redirects to `/login` or `/dashboard` |
| `/login` | Login screen |
| `/dashboard` | Dashboard |
| `/missions` | Missions list |
| `/missions/new` | New mission wizard |
| `/missions/[missionId]` | Mission workspace (dynamic route) |
| `/memory` | Memory (default tab) |
| `/memory/skill-library` | Memory, Skill Library tab |
| `/memory/failure-memory` | Memory, Failure Memory |
| `/trajectory` | Trajectory browser |
| `/benchmarks` | Benchmarks hub |
| `/research/ablations` | Research Lab, Ablation tab |
| `/research/statistics` | Research Lab, Statistical Evaluation tab |
| `/research/failure-analysis` | Research Lab, Failure Analysis tab |
| `/reports` | Reports |
| `/cost-usage` | Cost dashboard |
| `/audit-log` | Audit log |
| `/settings` | Settings |

All routes under `/dashboard`, `/missions`, `/memory`, etc. live in the `(app)` route group and share `src/app/(app)/layout.tsx`, which redirects to `/login` if the user isn't authenticated (`useAuth()`). Sidebar navigation and the command palette both navigate via `router.push()` against `NAV_PATHS` in `src/lib/nav-paths.ts` — add a new nav destination there and in `Shell.tsx`'s `NAV_GROUPS` together.

Login state is in-memory only (no cookies/persistence) via `AuthProvider`, matching the original app's behavior of always starting at the login screen on a fresh load.

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
- Any route `page.tsx` that renders a component using React state/effects/browser APIs must keep the `"use client"` directive at the top of the file.
