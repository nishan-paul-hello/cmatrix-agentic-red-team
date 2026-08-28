# RedGrid Frontend — Refactor Review (Round 2)

**Audience:** AI coding agent
**Context:** Follow-up to `REDGRID_FRONTEND_REMEDIATION.md`. That brief listed 16 numbered items
(P0–P6). This reviews the new `app-frontend.zip` against each one. Same hard constraint as before:
**no visual or behavioral change** unless explicitly noted as an intentional bug fix.

Verdict up front: most items were done well and match the brief's intent. One change introduced
a real visual regression that must be fixed before anything else (item R1). A few items were
started but not finished (typography scale, memoization, large components, tests, aria). Details
below, same P0→P6 ordering as before, plus a new "Regressions" section at the top.

---

## R0 — Regression introduced by the refactor (fix first)

### R1. `StateMachineModal` lost its panel wrapper — modal now renders without a bounded box
Compare to `UCBModal.tsx`, which correctly nests its content in a panel div
(`className="w-[540px] rounded-[2px] border-[1px] border-solid border-[...] bg-[...]"`) inside the
full-screen overlay. `StateMachineModal.tsx`'s overlay div
(`className="fixed inset-0 z-[60] flex items-center justify-center bg-[...]"`) now goes straight to
its header (`<div className="mb-5 flex justify-between">`) and canvas (`<div className="relative
h-[530px]">`) as direct children — there is no intermediate `w-[620px]` (or equivalent) panel
div with background/border/padding. This looks like exactly the kind of loss the previous brief's
item 8 warned about: when migrating a fixed pixel dimension to a token, the wrapping element
itself was dropped instead of just having its width class swapped.
**Fix:** reintroduce the panel wrapper div around the header + canvas content, at the original
620px width (or its now-tokenized equivalent, confirming the token maps to exactly 620px), with
whatever background/border/padding the modal had before this pass. Verify by rendering the
Validation State Machine modal and confirming it now appears as a bounded card again, matching
`UCBModal`'s visual pattern, not a borderless full-bleed panel.

---

## P0 — Correctness bugs

### 1. Undefined color tokens (`--color-hex-a371f7`, `--color-hex-1a0f2e`, etc.) — **Fixed.**
All previously-undefined tokens referenced from `statusColors.ts` now resolve; no dangling
`--color-hex-*` references remain anywhere in `src/`. Confirmed by diffing every referenced token
against `globals.css`'s `@theme` block — zero mismatches.

### 2. Static mutable repository state — **Fixed, with one follow-up gap.**
Both `MissionRepository` and `SpecialistRepository` now hold `mockData` as an instance field
seeded in the constructor, and the old `static seed()` correctly warns that it's obsolete rather
than silently no-op'ing. Good.

However, the fix is incomplete: `ServicesProvider` (`src/lib/services-context.tsx`) now correctly
creates one `missionRepository`/`specialistRepository` pair per session via `useMemo` and exposes
them through `useServices()` — but **`MissionWorkspaceContainer.tsx` doesn't use it.** It still
does `const missionRepo = new MissionRepository(); const specialistRepo = new
SpecialistRepository();` directly inside its data-fetching `useEffect`, bypassing the shared
context entirely and creating a fresh, empty-of-any-prior-mutations instance on every mount/dep
change. Likewise, the `static getMissions()`/`getMissionById()` helpers on both repositories still
instantiate `new MissionRepository()` internally, so **any `create`/`update`/`delete` performed
through the context-provided singleton is invisible to code that calls the static helpers or to
`MissionWorkspaceContainer`.** You now have three independent copies of "the mock database" that
can silently disagree. Route `MissionWorkspaceContainer` (and any other direct `new
MissionRepository()`/`new SpecialistRepository()` call site — grep for `new MissionRepository\|new
SpecialistRepository` to find them all) through `useServices()` instead, and either remove the
static helpers or have them delegate to the same shared instance.

### 3. Unsafe `as unknown as U[]` cast in `fetchAll` — **Fixed.**
`fetchAll` is no longer generic; it returns the concrete type directly with no cast. Confirmed in
both repositories.

---

## P1 — Duplication / single-source-of-truth

### 4. Status-color duplication between `StatusBadge` and `statusColors.ts` — **Fixed.**
`StatusBadge` now imports `getStatusColor` from `statusColors.ts` instead of maintaining its own
`STATUS_MAP`. One source of truth, confirmed.

### 5. Semantic token adoption (`--color-success`/`--color-danger`/`--color-warning`) — **Fixed
for status colors.** `statusColors.ts` now uses the semantic aliases wherever the status is
unambiguously success/danger/warning (e.g. `SUCCESS`, `FAILED`, `TIMEOUT`), leaving true one-off
shades on `--color-hex-*`. This was scoped correctly per the original instruction (only convert
where the semantic meaning already matches). Note the consolidation had to pick one value for
statuses that previously disagreed between the two duplicate tables — e.g. `PAUSED` now resolves
to the warning color that `StatusBadge` used to use, not the neutral grey `statusColors.ts` used to
use. That's an expected side effect of merging two disagreeing sources into one, not a bug, but
worth a screenshot check on the Missions page to confirm the paused-state color reads correctly
to a human.

### 6. Duplicated inline conditional status→class logic elsewhere — **Fixed.**
No remaining instances of the `status === "RUNNING" ? ... : status === "FAILED" ? ...` pattern
found outside the shared helper.

---

## P2 — Typography / dimension token discipline

### 7. Arbitrary pixel Tailwind values — **Substantial progress, not complete.**
A real type scale now exists in `globals.css` (`--text-2xs` through `--text-13xl`, plus a
`--tracking-*` scale that wasn't even asked for but is a good addition), and the bulk of
`text-[Npx]`/`tracking-[Nem]` usages have been migrated to it — arbitrary bracket usage dropped
from ~1,190 to 332. The remaining 332 are now almost entirely `w-[…]`/`h-[…]` on small
decorative elements (divider lines, icon boxes: `h-[1px]`, `w-[6px]`, `h-[0px]`, etc.) and a
handful of fixed panel widths (`w-[600px]`, `w-[280px]`, `w-[300px]`). These weren't in scope of
"typography scale" strictly, so this is fine as a stopping point for item 7 specifically, but see
item 8 below — the dimension-token pass (which *does* cover these) wasn't done.

One naming nit worth raising rather than silently fixing: the new scale names
(`--text-sm-tight`, `--text-base-tight`, `--text-lg-tight`, `--text-xl-tight` interleaved with
`--text-sm`, `--text-base`, etc. at half-step increments) read more like an auto-generated
enumeration of every distinct value found than a deliberately designed scale, and `--text-huge:
72px` sitting 44px above the next step down is an odd outlier — confirm that value is real and
used, not a stray leftover.

### 8. Fixed-pixel modal/panel dimensions → shared tokens — **Not done, and see R1 above.**
`w-[600px]`, `w-[540px]`, `w-[300px]`, `w-[280px]` etc. are still raw arbitrary values, not tokens.
This item was the source of the R1 regression, so when it's picked back up, do it panel-by-panel
with a visual check after each one rather than in a single sweep.

---

## P3 — Type-safety / API cleanliness

### 9. Unused `collection` option on `DataSource.fetchAll` — **Fixed.**
Removed from the interface and both implementations; signature is now
`fetchAll(options?: { page?: number; limit?: number })` everywhere.

### 10. Silent `catch` in `getMissionById` — **Fixed.**
Now logs via `console.error("MissionRepository.getMissionById failed", err)` before returning
`null`, matching the pattern used elsewhere. Confirm `SpecialistRepository`'s equivalent method
(if one exists) got the same treatment — it wasn't checked in this pass since the original brief
only named the Mission one explicitly.

### 11. Unguarded `window.__EVENT_BUS__` debug hook — **Fixed.**
Now gated behind `process.env.NODE_ENV !== "production"`.

---

## P4 — React/Next.js best practices

### 12. `useEffect` dependency audit — **Not verifiable in this pass; needs a live check.**
No `node_modules` were present in the delivered zip, so `eslint`/`tsc` couldn't be run here to
confirm `react-hooks/exhaustive-deps` compliance. Please run `npm install && npm run lint && npx
tsc --noEmit` yourselves and paste/fix any findings — don't treat this item as verified just
because no other regressions were found by inspection.

### 13. Memoization pass on list/canvas-heavy views — **Not done.**
`React.memo` usage is unchanged (9 components), and `useMemo`/`useCallback` count is essentially
flat (40 → 42). The specific targets named in the original brief
(`TrajectoryStepRow.tsx`, `AttackGraphCanvasView.tsx`/`AttackGraphCanvasContainer.tsx`,
`AuditLogPage.tsx`) don't show new memoization. Still open.

### 14. Large component decomposition — **Mixed: one clear win, otherwise flat.**
`BenchmarkOverviewTab.tsx` was properly decomposed from 630 lines down to 39, with the bulk of its
logic moved into a new `BenchmarkTierViews.tsx` (518 lines) — a good, real split, though note the
new file is itself now the largest in the codebase and a candidate for a second pass. Outside of
that one file, the overall count of components over 150 lines is essentially unchanged (50 → 51),
so this item is not broadly addressed yet — it's fine as a first slice, but say so rather than
marking the item done.

---

## P5 — Testing

### 15. No test runner — **Started, not close to the scope asked for.**
Vitest is now installed and wired up (`npm test` → `vitest run`), which is the right foundation.
But only one test file exists (`tests/utils.test.ts`) with two assertions, both against
`getStatusColor`. The brief specifically asked for `FSM.ts`'s transition functions to be tested
first (as the highest-value, purest logic in the codebase) — that's still completely untested,
along with `sanitizeInput` and `navItemForPath`. No component smoke tests were added either.
Also: the new test uses `getStatusColor("UNKNOWN_STATUS" as any)` — the codebase's own standard
(confirmed via the original audit: zero `any` usage anywhere in `src/`) has just been broken in
the one place meant to demonstrate best practice. Use a real invalid-but-typed string, or if the
point is to test invalid input specifically, widen `getStatusColor`'s parameter type intentionally
rather than casting around it.

### 16. Accessibility pass — **Good partial progress.**
`focus-trap-react` was added and wired into the modal/drawer components
(`StateMachineModal`, `UCBModal`, `FindingDetailDrawer`, `VDGNodeDrawerView`, `ExecDrawer`), with
Escape-to-close handling — this directly addresses the focus-trap concern the original brief
raised. However, none of those five components have `role="dialog"` or `aria-modal="true"` — only
`CommandPaletteView.tsx` has proper dialog semantics. A screen reader user still won't be told
these are modal dialogs. Add `role="dialog"` and `aria-modal="true"` to the panel element in each
of the five components, plus `aria-labelledby` pointing at each modal's visible title, to finish
what this item started.

---

## Summary for next pass

**Do first:** R1 (modal regression — visual bug), then finish item 2's follow-up (route
`MissionWorkspaceContainer` and the static repository helpers through the shared `useServices()`
instances so there's truly one mock datastore).

**Then, in order:** finish item 8 (dimension tokens, carefully, one component at a time with a
visual check after each), item 16's remaining `role="dialog"`/`aria-modal` additions, item 15's
test coverage (start with `FSM.ts`), item 13 (memoization), item 14 (remaining large components).

**Needs a decision, not a guess:** the new typography scale's naming (`-tight` suffixes,
`--text-huge`) — confirm this naming is intentional before it spreads to more components, since
renaming a design token later is a much bigger diff than naming it well now.
