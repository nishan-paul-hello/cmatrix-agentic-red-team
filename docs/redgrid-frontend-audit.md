# RedGrid Frontend Audit

Audit of `app-frontend/src/` against the standing audit prompt. Every check below was verified by opening the file and reading the surrounding context — not inferred from grep hits alone.

---

## Critical

None found. There is no data loss, security hole, or fully-broken interaction in this codebase.

---

## High

### H1. Duplicated / drifting `@keyframes` injected via raw `<style>` tags instead of using the global animation

**Files:**
- `src/app/globals.css:102-110` (the canonical definition)
- `src/features/missions/components/workspace/MissionOverviewAttackGraph.tsx:173-176`
- `src/features/missions/components/workspace/AttackGraphCanvasView.tsx:224-226`
- `src/features/specialists/components/SpecGrid.tsx:215`
- `src/features/escalation/components/HumanEscalation.tsx:107`

`globals.css` already defines the canonical animation and exposes it as a reusable utility:

```css
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
@utility pulse-dot { animation: pulse 1.4s ease infinite; }
```

9 call sites correctly use `pulse-dot`. But four components instead inject their own `<style>{...}</style>` tag that **redeclares the exact same `pulse` keyframe** a second (and third, and fourth) time:

```tsx
// MissionOverviewAttackGraph.tsx:173-176
<style>{`
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes nodeRing { 0%,100%{opacity:.4;transform:scale(1)} 50%{opacity:.1;transform:scale(1.02)} }
`}</style>
```
```tsx
// AttackGraphCanvasView.tsx:224-226
<style>{`
    @keyframes nodeRing { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:.1;transform:scale(1.03)} }
    @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:.3} }
`}</style>
```
```tsx
// SpecGrid.tsx:215
<style>{`@keyframes ring{0%,100%{opacity:.5}50%{opacity:.1}} @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
```
```tsx
// HumanEscalation.tsx:107
<style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
```

**Why it's wrong:** This isn't just style duplication — the "pulsing ring" effect has organically forked into **three non-identical implementations** with no shared source of truth:
- `nodeRing` in `MissionOverviewAttackGraph.tsx`: `opacity .4→.1, scale 1→1.02, 2s`
- `nodeRing` in `AttackGraphCanvasView.tsx`: `opacity .5→.1, scale 1→1.03, 2.2s`
- `ring` in `SpecGrid.tsx`: `opacity .5→.1`, no scale

These are visually supposed to be "the same effect" (a pulsing attention ring around an eligible/active node) but will render with different intensity and timing depending on which screen you're on, and nobody editing one will know the other two exist. On top of that, `pulse` is redeclared three times verbatim, shipping redundant CSS and creating three extra places someone could edit and get out of sync with the real one in `globals.css`.

**Fix:** Delete all four `<style>` blocks. Move `nodeRing`, `ring`, and `blink` into `globals.css` next to `pulse` as single canonical `@keyframes`, each exposed via an `@utility` (e.g. `@utility node-ring-pulse { animation: node-ring 2s ease infinite; }`), and pick one set of opacity/scale/duration values for the "ring" effect so `MissionOverviewAttackGraph.tsx` and `AttackGraphCanvasView.tsx` render identically. Replace the inline `animation: "..."` styles with the new utility classes.

---

### H2. Execution console rows have no horizontal-overflow protection, and column widths are duplicated as magic numbers between the header and the rows

**Files:** `src/features/execution/components/ExecutionEntryRow.tsx:23-48`, `src/features/execution/components/ExecutionConsoleView.tsx:62-86`

`ExecutionEntryRow.tsx` lays out each log entry as a row of `shrink-0` fixed-width columns:

```tsx
<div className="text-muted-foreground w-[80px] shrink-0 px-3 py-1.5 ...">{e.ts}</div>
<div className="text-primary w-[108px] shrink-0 px-3 py-1.5 ...">{e.specialist}</div>
<div className="text-muted-foreground w-[160px] shrink-0 overflow-hidden ... text-ellipsis whitespace-nowrap">{formatCommand(e.command)}</div>
<div className="text-muted-foreground w-[72px] shrink-0 px-3 py-1.5 ...">{e.command.tool.id}</div>
...
<div className="w-[72px] shrink-0 px-3 py-1.5">...</div>
```

The header row in `ExecutionConsoleView.tsx` independently re-specifies the same widths as a separate array:

```tsx
style={{
    width: [48, 80, 108, 160, 72, 64, 72, undefined][i],
    flex: i === 7 ? 1 : undefined,
}}
```

The scroll container around all of this is `overflow-y-auto` only (`ExecutionConsoleView.tsx:62`) — there is no `overflow-x-auto` anywhere in the ancestor chain.

**Why it's wrong:** Two separate problems:
1. This is exactly the "fixed-column row that behaves like a table" case Section 10 warns about. The columns sum to well over 600px before the flexible output column even starts. On a narrow viewport this **silently clips** instead of scrolling or truncating — the failure mode the audit explicitly calls out as unacceptable.
2. The same seven magic-number widths (`80, 108, 160, 72, 64, 72`) exist in two files with no shared source. If one is changed, the header and the data columns will silently misalign.

**Fix:**
- Wrap the scrolling region in `ExecutionConsoleView.tsx` with an additional `overflow-x-auto` (or apply it to the same element that has `overflow-y-auto`, if a single scroll container is intended), and give the row/header a `min-w-[...]` so they scroll together as a unit on narrow screens.
- Extract the column widths into one shared constant (e.g. `EXEC_COLUMN_WIDTHS = [48, 80, 108, 160, 72, 64, 72] as const` in a shared file) and reference it from both `ExecutionEntryRow.tsx` and `ExecutionConsoleView.tsx` instead of hand-typing the numbers twice.
- For reference, `ReportPreviewPane.tsx:125` (`grid-cols-[auto_auto_1fr_auto_auto] ... sm:grid-cols-[60px_50px_1fr_auto_auto]` with `truncate` on the flexible cell) already does this pattern correctly — it never needs horizontal scroll because it uses `1fr` + `truncate` instead of a fully fixed-width row. Consider mirroring that shape here instead of `overflow-x-auto` if a non-scrolling fix is preferred.

---

## Medium

### M1. `MissionSubNavPanel.tsx` active nav item has no `aria-current`, inconsistent with the app's own primary nav

**File:** `src/features/missions/components/workspace/MissionSubNavPanel.tsx:29-36`

```tsx
const active = subNav === item.id;
return (
    <Button
        key={item.id}
        variant="ghost"
        onClick={() => dispatch({ type: "SET_SUB_NAV", payload: item.id })}
        className={`... ${active ? "text-primary" : "text-muted-foreground ..."}`}
    >
```

**Why it's wrong:** The active state is communicated by color only. Compare with `SidebarContent.tsx:116`, which does this correctly for the app's primary nav:

```tsx
aria-current={active ? "page" : undefined}
```

Screen reader users get no indication of which workspace sub-section is currently open in this secondary nav, even though the exact same pattern is already solved correctly one file away.

**Fix:** Add `aria-current={active ? "page" : undefined}` to the `Button` in `MissionSubNavPanel.tsx`, mirroring `SidebarContent.tsx`.

---

### M2. `OraclePanel.tsx` uses a manual, unscoped `window` Escape listener instead of the `Sheet` primitive

**File:** `src/features/validation/components/OraclePanel.tsx:5-15`

```tsx
useEffect(() => {
    function onKey(e: KeyboardEvent) {
        if (e.key === "Escape") {
            onClose();
        }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
}, [onClose]);
```

**Why it's wrong:** This is a dismissible panel with its own close button and its own hand-rolled Escape handling — exactly the pattern Section 3 asks to check for. It's not a true full-screen overlay (it's docked inline via `w-full lg:w-panel-md`, similar to `EscalationHistorySidebar.tsx`, which has no Escape handling at all), so migrating it wholesale to `Sheet` would change its visual behavior. But the listener as written is global and unscoped: it fires on every Escape keypress anywhere in the app for as long as this panel is mounted, with no awareness of whether some other dialog is currently on top and should claim the keypress instead. Two stacked dismissible surfaces will both react to one Escape press.

**Fix:** Either (a) migrate this panel to `Sheet`, which already implements scoped Escape handling, focus trap, and scroll lock for free, or (b) if the inline-docked visual is intentional, at minimum guard the handler so it only acts when nothing "more modal" is open (e.g. check `document.activeElement` is within the panel, or track a shared top-of-stack ref), rather than a bare `window` listener.

---

### M3. Same "grid dot-pattern" decorative background duplicated across 4 files, 3 of which hardcode an approximation of `--border` instead of referencing the token

**Files:**
- `src/app/not-found.tsx:22-24`
- `src/features/auth/components/Login.tsx:52-56` (the one correct version)
- `src/features/missions/components/workspace/MissionOverviewAttackGraph.tsx:22-26`
- `src/features/missions/components/workspace/AttackGraphCanvasView.tsx:126-130`

```tsx
// not-found.tsx — hardcoded rgba
backgroundImage: "linear-gradient(rgba(41,41,41,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(41,41,41,0.18) 1px, transparent 1px)",
backgroundSize: "48px 48px",
```
```tsx
// Login.tsx — correctly references the token
backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
backgroundSize: "48px 48px",
```
```tsx
// MissionOverviewAttackGraph.tsx — hardcoded rgba, different opacity/size
backgroundImage: "linear-gradient(rgba(30,30,30,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30,30,30,0.4) 1px, transparent 1px)",
backgroundSize: "32px 32px",
```
```tsx
// AttackGraphCanvasView.tsx — hardcoded rgba, yet another opacity/size
backgroundImage: "linear-gradient(rgba(28,28,28,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(28,28,28,0.5) 1px,transparent 1px)",
backgroundSize: "40px 40px",
```

**Why it's wrong:** Same static, non-dynamic combination repeated 4 times (Section 6: 3+ repeats of a static combination should become a shared utility), and 3 of the 4 copies hardcode `rgb(30,30,30)`/`rgb(28,28,28)`/`rgb(41,41,41)` as stand-ins for `--border` (`#1e1e1e`) instead of referencing the variable the way `Login.tsx` already does correctly. If the theme's border color ever changes, this grid background will silently stop matching it in three places.

**Fix:** Add one `@utility grid-bg` (or a couple of size variants) to `globals.css` that references `var(--border)`, e.g.:
```css
@utility grid-bg {
    background-image: linear-gradient(var(--border) 1px, transparent 1px),
        linear-gradient(90deg, var(--border) 1px, transparent 1px);
    background-size: 40px 40px;
}
```
and use it (with an opacity utility on the wrapping element, as `Login.tsx` already does with `opacity-20`) in all four places instead of inline styles.

---

### M4. `select.tsx` reuses the `z-header` token for an unrelated purpose

**File:** `src/components/ui/select.tsx:153, 171`

```tsx
"bg-popover z-header top-0 flex w-full cursor-default items-center justify-center py-1 ..." // scroll-up arrow
"bg-popover z-header bottom-0 flex w-full cursor-default items-center justify-center py-1 ..." // scroll-down arrow
```

**Why it's wrong:** `--z-header: 30` is named and intended for the app's top header bar. Here it's applied to the scroll-up/scroll-down arrow buttons inside a select popup that is *already* stacked via `z-modal` (50) and `isolate` on its parent — the arrows don't need to escape any z-index layer at all, since they're just DOM children of an already-isolated popup. Reusing `z-header` here works today purely by coincidence of the number, not because these arrows have anything semantically to do with the app header. If the header's z-index is ever changed independently (e.g. lowered below the popup's local stacking order for an unrelated reason), this would silently break — a textbook case of the false-coupling risk called out in Section 5.

**Fix:** Drop the z-index utility entirely on these two elements (they don't need one inside an already-isolated popup), or if a stacking value is genuinely required, use a low local value like `z-node-base`/no scale token at all rather than `z-header`.

---

### M5. Raw `z-10` not tied to the app's z-index scale

**File:** `src/features/validation/components/EvaluationScreen.tsx:76`

```tsx
<div key={lbl} className="z-10 flex flex-col items-center">
```

**Why it's wrong:** `globals.css` defines a full z-index scale (`z-tooltip`, `z-modal`, `z-drawer`, `z-header`, `z-sticky`, `z-node-hover`, `z-node-base`), and this raw `z-10` happens to numerically match `--z-node-hover: 10` but has nothing to do with graph-node hover state — it's just lifting a tick-mark dot above an absolutely-positioned track line within an unrelated "evidence level indicator" widget. Using the actual `z-node-hover` class here would be exactly the kind of unrelated-token-borrowing Section 5 warns against.

**Fix:** Either remove the z-index (the ticks are likely already visually above the 1px track line due to DOM order without needing it — worth checking), or add a small generic token for this "lift local sibling above an absolutely-positioned line" pattern (e.g. `--z-raised: 1`) if it recurs.

---

### M6. `MissionOverviewAttackGraph.tsx` hand-rolls its own attack-graph node card instead of reusing `AttackGraphNode`

**Files:** `src/features/missions/components/workspace/MissionOverviewAttackGraph.tsx:61-160` vs. `src/features/missions/components/workspace/AttackGraphNode.tsx`

The mission overview's mini attack-graph renders its own `<button>` node card from scratch — its own status-to-color mapping, its own pulse-ring markup, its own badge markup — rather than reusing the `AttackGraphNode` component that the full-bleed `AttackGraphCanvasView.tsx` uses for the same concept ("a node in the attack graph, colored by status").

**Why it's wrong:** This is the direct cause of finding H1's `nodeRing` fork — two independent node renderers for the same domain concept will drift in styling over time (as they already have). It's not one of the four named "hand-rolled primitive" patterns in Section 3, but it's the same underlying reinvention problem the section is guarding against, just at the feature-component level instead of the primitive level.

**Fix:** Extract a shared, size-agnostic `AttackGraphNodeCard` (or extend `AttackGraphNode` with a `compact`/`variant` prop) that both the mini overview and the full canvas render, so there is one place that owns "what does a node in state X look like."

---

### M7. Every route entry point under `(app)/` is a Client Component, and data loading happens via `useEffect` against mock repositories

**Files:** all 14 files under `src/app/(app)/**/page.tsx` (e.g. `dashboard/page.tsx`, `missions/page.tsx`, `missions/[missionId]/page.tsx`, `benchmarks/page.tsx`, `reports/page.tsx`, `settings/page.tsx`, `trajectory/page.tsx`, `audit-log/page.tsx`, `cost-usage/page.tsx`, `memory/page.tsx`, `memory/skill-library/page.tsx`, `memory/failure-memory/page.tsx`, `research/ablations/page.tsx`, `research/failure-analysis/page.tsx`, `research/statistics/page.tsx`), plus the `useEffect`-driven fetch pattern seen in `Dashboard.tsx:57-78`, `CostBrowser.tsx`, `CostDashboard.tsx`, `Specialists.tsx`, `BenchmarksHub.tsx`, etc.

```tsx
useEffect(() => {
    void Promise.all([
        missionRepository.fetchAll({ limit: 1000 }),
        specialistRepository.fetchAll(),
    ])
        .then(([missionData, specsData]) => { ... })
        .catch(console.error);
}, [missionRepository, specialistRepository]);
```

`MissionRepository.fetchAll` (confirmed in `src/repositories/MissionRepository.ts`) reads from an in-memory fixture array with an artificial `setTimeout` delay — there is currently no real backend.

**Why this is (currently) acceptable, but flagged:** Per the audit's own carve-out, `"use client"` at a route entry is acceptable only when there's no server-fetchable data yet — which is true here, since everything is local fixture data. This is a forward-looking finding, not a bug today.

**Fix (when a real backend replaces the mock repositories):** Route-level `page.tsx`/`layout.tsx` files should become Server Components that fetch initial data server-side and pass it down as props, with `"use client"` pushed down only to the interactive leaf components that actually need state/handlers. The `useEffect`-based fetch pattern in `Dashboard.tsx` and siblings should move to server-side fetching at that point too. No action is required until the mock repositories are replaced, but this pattern will need to be revisited across all 14 routes at once — worth tracking as a single tracked migration rather than 14 one-off fixes.

---

## Low

### L1. `max-w-[var(--width-cell-max)]` used instead of the generated token class

**Files:** `src/features/missions/components/MissionsPage.tsx:132`, `src/features/core/components/Dashboard.tsx:163`

```tsx
<TableCell className="cell-truncate text-muted-foreground max-w-[var(--width-cell-max)] px-4 py-2 whitespace-nowrap">
```

**Why it's wrong:** `globals.css` already defines `--width-cell-max: 180px` in the `@theme` block, which Tailwind generates a plain `max-w-cell-max` utility for (the same way `--width-panel-sm` generates `w-panel-sm`, used correctly elsewhere, e.g. `Shell.tsx:116`). The arbitrary-value long-hand resolves to the same pixel value but is a code-quality miss per the audit's own guidance.

**Fix:** Replace `max-w-[var(--width-cell-max)]` with `max-w-cell-max` in both files.

---

### L2. `components/ui/toggle.tsx`'s `Toggle` component is dead code

**File:** `src/components/ui/toggle.tsx:30-43`

Only `toggleVariants` (the class-name generator) is imported anywhere in `src/features` or `src/app` — by `toggle-group.tsx`, itself part of `components/ui`. The `Toggle` component (a standalone single-toggle-button) has zero consumers outside its own file.

**Fix:** Either remove the unused `Toggle` export and keep just `toggleVariants`, or wire it into an actual use case if one is planned. Don't leave it in limbo.

---

### L3. Trivial static inline styles that should be Tailwind utility classes

Static values (Section 6) — the same on every render, expressible directly as classes:

- `src/features/validation/components/StateMachineModal.tsx:59-61` — `style={{ inset: 0 }}` → `inset-0`
- `src/features/missions/components/wizard/MetaRow.tsx:7-9` — `style={{ minWidth: 0 }}` → `min-w-0`
- `src/features/missions/components/workspace/EOrdIndicator.tsx:20-22` — `style={{ zIndex: 1 }}` → `z-node-base` or plain `z-1` if that's really all that's meant (see M5 for the broader z-index scale point)
- `src/features/missions/components/workspace/MissionOverviewLogStream.tsx:24-26, 32-34, 40-42` — `style={{ paddingTop: 1 }}` repeated 3× in one file → `pt-px`
- `src/features/escalation/components/HumanEscalation.tsx:114-120` — `style={{ borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}` → `rounded-full flex items-center justify-center`
- `src/features/benchmarks/components/BenchmarkSuites.tsx:51-54` — `style={{ display: "flex", gap: 8 }}` → `flex gap-2`
- `src/features/benchmarks/components/BenchmarkSuites.tsx:88-90` — `style={{ textOverflow: "ellipsis" }}` (paired with existing `overflow-hidden whitespace-nowrap` classes) → this is literally what the existing `cell-truncate` utility in `globals.css` already does; use `cell-truncate` (already used correctly elsewhere, e.g. `MissionsPage.tsx:132`) instead of hand-assembling the same three properties.

**Fix:** Replace each with the equivalent Tailwind class(es) noted above. None of these are data-driven, so none should be inline styles.

---

## Recommended execution order

1. **H2 — execution console horizontal overflow.** This is the one active regression in the strict sense: on a narrow viewport, content is silently clipped today. Fix first.
2. **M1 — missing `aria-current` on the mission sub-nav.** A currently-unusable-for-screen-reader-users gap on a control that's otherwise fully functional; quick, isolated fix.
3. **M2 — `OraclePanel` unscoped Escape listener.** Accessibility/robustness gap on a dismissible surface.
4. **H1 — duplicated/drifting keyframes.** Structural, touches 5 files (4 components + globals.css), and is the root cause of M6's node-card duplication as well — fix the animation system once, then the M6 dedup becomes easier.
5. **M6 — unify the two attack-graph node renderers.** Do this right after H1 since it depends on the same animation cleanup.
6. **M3 — shared `grid-bg` utility.** Structural, touches 4 files, same "extract to globals.css" shape as H1.
7. **M4, M5 — z-index token misuse.** Isolated, one file each.
8. **L1, L2, L3 — one-file polish items.** Lowest priority, no user-facing effect.
9. **M7 — Server Component migration.** Not a current bug; track as a single future migration once a real backend exists rather than touching 14 files now.

No visual theme colors, spacing scale, or copy were changed or recommended to change anywhere in this audit — every item above is a mechanism fix (responsiveness, token usage, primitive reuse, accessibility, or hygiene).
