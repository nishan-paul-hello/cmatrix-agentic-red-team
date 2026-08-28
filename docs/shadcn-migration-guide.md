# UI Component Library + Tailwind/CSS Best-Practice Migration — Agent Instructions

## 0. Mandate

Rebuild the frontend's component and styling layer to Tailwind/CSS/UI-library **best practice**. Visual fidelity to the current app is a *secondary* concern — where the current implementation conflicts with best practice, best practice wins. This applies to the design-token system, the component architecture, and the choice of UI library (shadcn/ui, Radix-based).

Deviation is expected and desired in at least these areas: type scale, color token structure, spacing, and any component that was hand-built where an accessible primitive already exists.

---

## 1. Stack

Next.js 16, React 19, TypeScript, Tailwind CSS v4, path alias `@/*` → `./src/*`. No `tailwind.config.js` — theme lives in `@theme` blocks in `src/app/globals.css`. Adopt **shadcn/ui** (Radix-based, code-owned, not an npm black box) as the component library.

---

## 2. Design tokens — rebuild these, don't preserve them

The current token system has three specific anti-patterns to fix:

### a) Px-locked scale → rem
Every current type/spacing token (`--text-2xs: 6.5px` ... `--text-huge: 72px`, tracking, leading) is hardcoded in px. Fix: define all font-size, spacing, and radius tokens in `rem`. This is the single most important change — px values don't respond to a user's browser/OS font-size preference, which is a real accessibility regression, not a style nitpick.

### b) Hijacked Tailwind utility names → real scale or namespaced scale
`text-sm` has been redefined from Tailwind's default 14px to 8px project-wide. Don't do this. Pick one:
- Use Tailwind's actual default type scale (`text-xs` through `text-9xl`) and fit the UI to it, or
- If a genuinely different scale is needed for density reasons, namespace it (`text-density-xs`, `text-density-sm`...) so it's never confused with standard Tailwind semantics by anyone reading the code (including future agents).

Either is acceptable; silently redefining standard names is not.

### c) Ad-hoc hex-named tokens → semantic scale
Replace `--color-hex-e31b23`, `--color-hex-9e1118`, etc. with a proper semantic palette: a base neutral scale (`--color-neutral-50` … `--color-neutral-950`) plus semantic roles (`primary`, `destructive`, `success`, `warning`, `border`, `muted`, `ring`, `card`, `popover`) generated with consistent lightness steps, not one-off hex captures per component. Consolidate near-duplicate shades (there are currently ~15 near-identical dark neutrals — `#0a0a0a`, `#0b0b0b`, `#0c0c0c`, `#0d0d0d`... — collapse these to a proper 8–10 step scale).

### d) Adopt shadcn's CSS variable convention directly
Rather than bridging shadcn's expected variables (`--background`, `--foreground`, `--primary`, `--radius`, etc.) onto the old hex tokens, replace the old tokens with shadcn's convention outright. This is the standard, well-documented approach and every shadcn component + community theme works with it out of the box.

Run `npx shadcn@latest init`, accept its generated theme structure, then set the actual color/radius *values* to whatever fits the product (brand red as `--primary`, current radius preference, etc.) — don't fight the convention.

---

## 3. Component library: shadcn/ui, applied broadly

Given best-practice is now the goal (not minimal footprint), use shadcn more broadly than "only where there's complex interaction":

**Replace with shadcn:**
- All modals/drawers → `Dialog`, `Sheet`
- All dropdowns/menus/selects → `DropdownMenu`, `Select`, `Combobox`
- Tooltips → `Tooltip`
- Tabs → `Tabs`
- Command palette → `Command`
- Forms (`Login.tsx`, `GeneralSettings.tsx`) → `Form` + `Input` + `Label`, wired to a schema validator (`zod`) via `react-hook-form` if not already using one — this is standard practice for form state/validation in this stack and worth adopting alongside the component swap
- Badges, tags, status pills (`StatusBadge`) → `Badge`, with status colors passed as variant props via `class-variance-authority` (already a shadcn dependency) instead of inline `style={{ background, color }}` — inline styles for themeable values are themselves a best-practice smell; CVA variants keep it in Tailwind/CSS-variable land
- Cards/tiles (`MetricTile`) → `Card` composition (`CardHeader`, `CardContent`) rather than a single component branching on a `variant` string prop

**Keep custom, no shadcn equivalent needed:**
- Layout shell/grid structure (`Shell.tsx`), domain-specific visualizations (`HostTopologyDiagram`, attack graph canvas) — these aren't generic UI patterns

---

## 4. General Tailwind/CSS practice to apply throughout

- No inline `style={{...}}` for anything expressible as a Tailwind class or CSS variable — several current components (`MetricTile`, `StatusBadge`) mix arbitrary-value Tailwind (`text-[var(--color-hex-444444)]`) with inline `style` for the same kind of value. Pick one mechanism (Tailwind classes referencing theme tokens) and use it consistently.
- Avoid arbitrary-value bracket syntax (`text-[var(--color-hex-444444)]`, `rounded-[2px]`) once the token above is a first-class theme value — if it's a real design token, it should be a plain utility (`text-muted-foreground`, `rounded-sm`), not an arbitrary-value escape hatch. Reserve `[...]` syntax for genuine one-offs.
- Component variants (the `variant="dashboard" | "card" | "inline"` pattern in `MetricTile`) should use `class-variance-authority` rather than if/else branches returning different JSX blocks — this is the shadcn-standard pattern and scales better as variants grow.
- Co-locate variant styles with the component, not scattered across a large shared `globals.css` — move component-specific `@utility` blocks (`filter-btn`, `cell-truncate`) into the components that use them, or into CVA variant definitions, keeping `globals.css` for truly global concerns (base resets, font import, animations).

---

## 5. Responsive layer

Mobile-first as standard practice: base (unprefixed) classes target mobile, `md:`/`lg:` layer up. No existing responsive classes exist in the codebase (218 components, zero `sm:`/`md:`/`lg:` usage) — this is being added fresh, not preserved from anything, so there's no legacy layout to reconcile against. Design each view's mobile layout on its own merits (stacked cards, simplified summaries, or horizontal-scroll tables with sticky first column for dense data views), using the new semantic tokens and a readable minimum body size (14px+) and touch target size (44×44px) at the base breakpoint.

---

## 6. Process

1. Land the token rebuild (§2) first — everything downstream depends on it.
2. Run `npx shadcn@latest init`, install components incrementally as each is migrated (`npx shadcn@latest add dialog sheet dropdown-menu tooltip tabs command form badge card`).
3. Migrate component-by-component (§3), converting inline styles/arbitrary values to token-based classes and CVA variants as you go (§4).
4. Add responsive classes per view as each is migrated, rather than as a separate bolt-on pass.
5. It's fine — expected — for spacing, exact colors, and type sizes to shift somewhat from the current build as a result of steps 1–4. Sanity-check for functional regressions (nothing overlapping, nothing unreadable, all interactive states present), not pixel parity.

---

## 7. Verification checklist — run before calling this done

Don't treat the migration as finished until every item below is actually checked, not assumed. Run these as literal commands where given.

### Token cleanup
- [ ] `grep -rn "color-hex-" src` returns nothing (or only in a documented, intentional one-off) — all old hex-named tokens removed from `globals.css` and no component still references one directly.
- [ ] `grep -rnE "text-(2xs|sm-tight|base-tight|lg-tight|xl-tight|[0-9]+xl)" src` — none of the old custom px-scale utility names remain; every font-size class resolves through the new rem-based scale or shadcn's default scale.
- [ ] No remaining `px` values in the `@theme` block for font-size, spacing, or radius tokens (border-width px is fine, see earlier note).
- [ ] `--primary`, `--background`, `--foreground`, `--border`, `--muted`, `--destructive`, `--radius` (and other shadcn-convention variables) are defined once in `globals.css` and nowhere else duplicated.

### Inline styles / arbitrary values
- [ ] `grep -rn "style={{" src` — every remaining hit is justified (e.g. a truly dynamic runtime value like a computed graph-node position), not a themeable color/size that should be a class.
- [ ] `grep -rnE "\[(var\(--color|#[0-9a-fA-F]{3,8})" src` — no arbitrary-value bracket syntax referencing colors directly; these should now be plain utility classes (`bg-primary`, `text-muted-foreground`, etc.).

### Component migration completeness
- [ ] Every modal/drawer in the app is a shadcn `Dialog`/`Sheet` — spot check `StateMachineModal`, `UCBModal`, `VDGNodeDrawer*`, `FindingDetailDrawer`.
- [ ] Every dropdown/select/tooltip/tab group uses the corresponding shadcn primitive — no remaining hand-rolled open/close-state component doing the same job.
- [ ] `focus-trap-react` is no longer imported anywhere (`grep -rn "focus-trap-react" src`) — Radix's built-in focus management replaces it. If it's still imported somewhere, that component wasn't actually migrated.
- [ ] `StatusBadge` and `MetricTile` (or their replacements) use `class-variance-authority` for variants — `grep -rn "cva(" src` should show them.
- [ ] Forms (`Login.tsx`, `GeneralSettings.tsx`) use `react-hook-form` + a schema validator, not manual `useState` per field with manual validation branching.

### Responsive
- [ ] `grep -rlE "sm:|md:|lg:|xl:" src --include="*.tsx" | wc -l` is no longer 0, and spot-checking a few dense views (dashboard, benchmark table, cost browser) confirms an actual different mobile layout — not just the desktop layout with smaller padding.
- [ ] Minimum body text at the base (mobile) breakpoint is 14px/0.875rem or larger, and interactive targets are at least 44×44px, in the views checked above.

### Functional regression
- [ ] Every migrated modal/drawer/dropdown opens, closes on Escape, closes on outside-click, and traps focus while open.
- [ ] No component that previously had a loading/error/empty state lost that state during migration.
- [ ] App builds and lints clean (`npm run build`, `npm run lint`) with no new type errors introduced by the migration.

If any box can't be checked, that item goes back into the migration — don't mark the pass complete with known stragglers; list them explicitly instead.

---

## 8. Second pass — consistency audit (run after §7 passes, as a separate step)

The migration in §1–§7 gets the app functionally and structurally on shadcn. This section closes the remaining gap toward looking like it was built on shadcn from day one. Do not merge this into the first pass — run it only after every item in §7 is checked, as a distinct, reviewable step.

### 8.1 Write the convention spec
Before touching more code, write a short internal spec (a markdown file in the repo, e.g. `docs/component-conventions.md`) documenting the patterns actually used during migration:
- Variant prop naming (e.g. always `variant`, never `type`/`kind`/`mode` interchangeably)
- CVA config shape and where `cva()` calls live relative to the component
- Import order/grouping convention
- How compound components are composed (e.g. `Card` + `CardHeader` + `CardContent` pattern vs. a single component with slots)

This spec becomes the standard the rest of this section checks against.

### 8.2 Pick a reference component
Choose the single cleanest migrated component as the reference implementation. Diff every other migrated component's structure (not visual output — code shape) against it: same prop patterns, same variant setup, same file organization. Fix outliers to match the reference, not the other way around.

### 8.3 Clean up preserved legacy prop interfaces
The first pass intentionally kept old prop shapes to avoid rewriting call sites (§6). Now do that rewrite: update each migrated component's public props to a clean, idiomatic shape per the §8.1 spec, and update every call site accordingly. This is more invasive than §1–§7 — touches usage sites across the 218 components, not just the component definitions — so run it as its own commit/PR, reviewed on its own, not folded into the earlier migration silently.

### 8.4 Component catalog
Stand up a lightweight, browsable catalog of the shadcn-based components (Storybook, or a simple internal `/dev/components` route rendering each component with its variants) so the current state of the design system is visible in one place, not just discoverable by reading source files. This doesn't change correctness but is part of what makes the codebase legible as a properly built shadcn project rather than a migrated one — and it's the fastest way for a human reviewer to spot remaining inconsistencies at a glance.

### 8.5 Final check
Have a second, independent read-through (a different reviewer, or the agent re-reading with fresh context rather than continuing from migration state) compare a handful of migrated components side by side and confirm they'd be indistinguishable in style from a component written fresh against the §8.1 spec.
