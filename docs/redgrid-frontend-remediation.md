# RedGrid Frontend — Code Quality Remediation Brief

**Audience:** AI coding agent
**Scope:** `app-frontend` (Next.js 16 / React 19 / Tailwind 4, UI/UX mockup, no backend)
**Hard constraint: DO NOT change any visual output, layout, spacing, colors, copy, or interaction behavior.**
Every item below is a code-quality / architecture / correctness fix. If a fix would change what
a user sees or how it behaves, stop and flag it instead of applying it. Work item-by-item, run
`npm run lint` and `npx tsc --noEmit` after each item, and commit separately per numbered item so
changes are reviewable in isolation.

Codebase snapshot at audit time: 307 TS/TSX files, ~28k lines, 202 components, strict TypeScript,
no `any` usage, ESLint with `typescript-eslint` recommended-type-checked already enabled, no test
runner installed. The codebase is already in reasonably good shape (typed repositories, an FSM,
an event bus, feature flags) — this is a refinement pass, not a rewrite.

---

## P0 — Correctness bugs (fix first; these are real defects, not style)

### 1. Undefined CSS custom properties silently break the purple "ORACLE_CONFIRMED" accent
`src/utils/statusColors.ts` references `--color-hex-a371f7`, `--color-hex-1a0f2e` and their
alpha variants (`a371f744`, `3fb95022`, `3fb95033`), but these tokens are **not defined** in the
`@theme` block in `src/app/globals.css`. Any element relying on them currently resolves to an
invalid/empty color. Cross-reference every `var(--color-hex-*)` used anywhere under `src/` against
the token list in `globals.css`, add the missing definitions with the exact hex values already
implied by the variable names, and re-render the affected views (`AblationLabTable`,
`BenchmarkOverviewTab`, `BenchmarkDetail`, validation mock data consumers) to confirm the intended
purple accent now actually appears. This is a bug fix that *restores* intended visuals, not a
design change.

### 2. `MissionRepository` / `SpecialistRepository` hold mutable state in `static` class fields
Both repositories keep their mock dataset in a `private static` array mutated by `create`,
`update`, and `delete`. In a Next.js server-rendered context, module-level static state is shared
across requests and across users/sessions on the same server process, and it also does not reset
between navigations in the same client session the way a real per-user datastore would. Refactor
both repositories so mock state lives in a single in-memory store that is explicitly scoped
(e.g. instantiated once per `ServicesProvider`/root client boundary, or moved into a context) rather
than a bare class-level `static`. Keep the `DataSource<T>` interface and public method signatures
unchanged so no call sites need to change behavior.

### 3. Type-unsafe cast in `fetchAll`
`return data as unknown as U[]` in both repositories defeats the generic `<U = Mission>` /
`<U = Specialist>` parameter entirely — it will happily "type" a `Mission[]` as anything. Since
every current call site actually wants `Mission`/`Specialist` (grep call sites to confirm), drop
the generic override and the unsafe cast; if a genuine projection use case exists, replace it with
an explicit mapper function instead of a cast.

---

## P1 — Duplication / single-source-of-truth violations

### 4. Status-to-color mapping is defined in at least two disagreeing places
`src/utils/statusColors.ts` (`STATUS_COLORS`) and `src/components/ui/StatusBadge.tsx`
(`STATUS_MAP`) both hardcode overlapping status→color tables (`RUNNING`, `PAUSED`, `FAILED`,
`COMPLETED`, `QUEUED`, etc.) independently, using different key sets and different border/bg
pairings. Consolidate into one exported table (suggest keeping it in `statusColors.ts` since it
already covers the superset of statuses including `VDG_NODE_STATUS` and `FINDING_STATUS` values)
and have `StatusBadge` and every other consumer import from it. Search the whole codebase for
other ad-hoc status-color `Record<...>` literals (there appear to be more, e.g. inside individual
feature components) and fold them into the same table. Preserve exact current hex/token values per
status so no visual changes occur.

### 5. Rename `--color-hex-*` tokens toward semantic tokens where a semantic meaning already exists
`globals.css` already defines semantic aliases (`--color-danger`, `--color-success`,
`--color-warning`, `--color-brand`, `--color-fg`, `--color-bg`) pointing at hex tokens, with a
comment saying "prefer these in new code" — but most components still reference the raw
`--color-hex-XXXXXX` form directly (e.g. `var(--color-hex-3fb950)` for what is semantically
"success/green" in a dozen files). Wherever a hex token's usage context is unambiguously one of
the existing semantic roles (danger/success/warning/brand/fg/bg), replace the raw-hex reference
with the semantic variable. Leave genuinely one-off/rare shades on their `--color-hex-*` name as
the existing comment intends. This is a pure find-and-replace against variables that resolve to
identical values — zero visual delta, easily verifiable with a visual diff or screenshot check.

### 6. Duplicated per-status/per-severity Tailwind class strings
Search for repeated inline conditional class logic of the shape `status === "RUNNING" ? "..." :
status === "FAILED" ? "..." : ...` across components (several `features/*/components/*.tsx` files
follow this pattern independently instead of calling the shared `getStatusColor`/`StatusBadge`
helpers). Replace with the consolidated helper from item 4 so status styling has exactly one
implementation.

---

## P2 — Design-token discipline (typography scale)

### 7. Replace arbitrary pixel Tailwind values with a defined type scale
There are ~1,190 arbitrary-bracket Tailwind values in the codebase (`text-[9px]`, `text-[8.5px]`,
`text-[10.5px]`, `w-[620px]`, `h-[530px]`, etc.), heavily concentrated in
`src/features/validation/**`, `src/components/ui/MetricTile.tsx`, and similar dense/dashboard-style
views. Arbitrary values bypass Tailwind's design-token system entirely, meaning there is no
enforced scale and near-duplicate sizes (`8px`, `8.5px`, `9px`, `9.5px`, `10px`, `10.5px`) proliferate
where a handful of deliberate steps would do.
- Extract every distinct arbitrary `text-[…]`, `w-[…]`, `h-[…]`, `gap-[…]`, `top-[…]`, `left-[…]`
  value currently in use into the `@theme` block in `globals.css` as named scale tokens (e.g.
  `--text-2xs: 8px; --text-2xs-plus: 8.5px; …` or, if you determine the values cluster into an
  existing implicit scale, collapse near-duplicates that differ by design accident rather than
  intent — but only after visually confirming with the person that any collapsed value renders
  identically, since collapsing changes output even if by a fraction of a pixel).
- Update the component classes to use the new scale tokens instead of raw brackets.
- Do this file-by-file behind visual review; do NOT batch-guess which near-duplicates are
  "close enough" to merge without confirmation — flag ambiguous clusters in your summary instead
  of silently merging them.

### 8. Fixed pixel widths/heights on modals and panels (`w-[620px]`, `h-[530px]`, etc.)
Several modal/drawer components hardcode fixed pixel dimensions rather than referencing a shared
`--modal-width-*` token set. Once the scale from item 7 exists, migrate these the same way. Do not
change any current rendered size — only the mechanism producing it.

---

## P3 — Type-safety / API cleanliness

### 9. `DataSource<T>.fetchAll` accepts a `collection` option that is unused
`fetchAll(options?: { page?: number; limit?: number; collection?: string })` declares
`collection` in both repositories but neither implementation reads it. Either wire it up (filter
by collection) or remove the dead parameter from the interface and both implementations — dead,
unused public API surface is misleading to future maintainers (including the next AI agent that
touches this file).

### 10. Silent `catch` swallowing errors
`SpecialistRepository.getMissionById`-equivalent (`MissionRepository.getMissionById`) catches and
discards the error, returning `null` with no logging. Since this is a mock layer that stands in
for a future real API, keep the `null` return contract (callers already treat `null` as "not
found") but log the underlying error via the same pattern already used elsewhere
(`console.error("Failed to …", err)`) so failures aren't invisible during development.

### 11. Global `window.__EVENT_BUS__` debug hook has no environment guard
`src/utils/EventBus.ts` attaches the bus to `window` unconditionally whenever `window` exists,
including production builds. Gate this behind `process.env.NODE_ENV !== "production"` so the
debug hook doesn't ship to a production bundle.

---

## P4 — React/Next.js best practices

### 12. Audit `useEffect` usage for missing/incorrect dependency arrays
There are 62 files using `useEffect`. Run `eslint` with `react-hooks/exhaustive-deps` (confirm
it's enabled in `eslint.config.mjs`'s Next core-web-vitals set — verify, don't assume) across all
of them and fix any reported violations. Pay particular attention to
`src/features/missions/hooks/useWorkspaceData.ts`, `useWizardData.ts`, and
`AttackGraphCanvasContainer.tsx`, which all fetch data in an effect and already log errors —
confirm their dependency arrays and cleanup/cancellation (e.g. an `AbortController` or an
`ignore` flag) correctly prevent state updates after unmount, adding one if missing.

### 13. Memoization pass on list-heavy and canvas/graph views
Only 9 components use `React.memo` and 40 total `useMemo`/`useCallback` call sites exist across
202 components. Given several views render large lists (audit log, trajectory steps, VDG canvas
nodes) and already opt into `@tanstack/react-virtual` for virtualization in some places
(confirm via `FEATURE_FLAGS.ENABLE_VIRTUALIZATION`), audit the row/node-level child components
in `TrajectoryStepRow.tsx`, `AttackGraphCanvasView.tsx`/`AttackGraphCanvasContainer.tsx`, and
`AuditLogPage.tsx` for missing memoization that would cause full-list re-renders on unrelated
state changes (e.g. a drawer opening). Add `React.memo`/`useMemo`/`useCallback` only where a
measurable re-render exists — don't cargo-cult memoize components with trivial render cost.

### 14. Large components should be decomposed
50 `.tsx` files exceed 150 lines, with several (`BenchmarkOverviewTab.tsx` at 630 lines,
`Shell.tsx` at 264, `MissionOverview.tsx` at 290) mixing data-shaping, layout, and presentational
concerns in one file. Where a component clearly has independently reusable or independently
testable sub-sections (e.g. a table body, a header, a stat strip), extract them into
sibling files in the same feature folder, following the pattern the codebase already uses
elsewhere (e.g. `VDGNodeDrawerSections.tsx` already exists as a precedent for splitting a drawer
into a sections file). Do not extract just to hit a line-count target — only where it improves
actual readability or reuse.

---

## P5 — Testing (currently absent)

### 15. No test runner is installed at all
There is no Jest/Vitest/Playwright/Testing-Library dependency and no `*.test.*`/`*.spec.*` file
anywhere in the repo, despite `FSM.ts` containing pure, easily-testable state-transition logic and
`sanitize.ts`, `nav-paths.ts`, and `statusColors.ts` being pure functions ideal for unit tests.
- Add Vitest + `@testing-library/react` (lighter weight than Jest for a Next 16/React 19/Turbopack
  stack; confirm compatibility with the installed Next/React versions before committing to it).
- Write unit tests for the pure utilities first: `canTransitionMission`/`canTransitionTask`/etc.
  in `FSM.ts` (test every legal and illegal transition per status), `sanitizeInput`,
  `navItemForPath`, and `getStatusColor`.
- Add a small number of component smoke tests (render without throwing, correct status badge
  color for a given status) for `StatusBadge` and `MetricTile` as a template other agents/devs can
  follow — do not attempt full coverage in this pass.
- Wire `test`/`test:watch` scripts into `package.json` and add the test job to whatever CI
  configuration exists (check for one under `.github/`; if none exists, note that as a gap but
  don't invent a CI platform choice unprompted).

---

## P6 — Accessibility (light pass, no visual change)

### 16. Sparse ARIA coverage on interactive custom controls
Only 39 `aria-*` attribute usages exist across 202 components. Interactive custom elements that
are not native `<button>`/`<input>` (custom dropdowns, the command palette in
`CommandPaletteView.tsx`, modal/drawer overlays like `UCBModal.tsx`, `StateMachineModal.tsx`,
`ExecDrawer.tsx`, `EscalationDetailPane.tsx`) should have appropriate `role`, `aria-modal`,
`aria-label`/`aria-labelledby`, and focus-trap/return-focus behavior on open/close. This changes
no visual output — only what assistive technology and keyboard users perceive. Flag (don't
silently fix) any case where adding a focus trap would alter tab order behavior noticeably, since
that borders on interaction-behavior change and should be confirmed first.

---

## Reporting format

For each numbered item, produce:
1. A short "before/after" code diff.
2. A one-line confirmation of what was verified unchanged (visual screenshot comparison, `tsc`
   passing, `eslint` passing, or a specific manual check).
3. Anything you chose to flag instead of fix (ambiguous pixel-scale merges, focus-trap behavior
   changes, etc.) — list these explicitly at the end under **"Needs human decision"** rather than
   guessing.

Do not batch unrelated items into a single commit. Do not fix items out of the P0→P6 order without
calling out why in your response.
