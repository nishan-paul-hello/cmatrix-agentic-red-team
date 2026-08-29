# RedGrid Frontend Audit — 2026-08-29

Scope: `app-frontend/src/`, audited against `audit-prompt.md` sections 1–10. Lint/format/build/type-check were not re-run (confirmed already passing) — this is a manual line-by-line read of the current source. Every finding below was opened and confirmed in context, not flagged from grep alone.

---

## Critical

None. No security, data-loss, or fully-broken-functionality issues were found. The two items that come closest (auth-gate flash, unstackable panes) are filed under High since the app still functions, just degrades badly.

---

## High

### H1 — Two workspace views never stack on mobile; every sibling view does
- **Files:** `features/memory/components/TechnicalActions.tsx` (line ~33), `features/validation/components/ValidationCenter.tsx` (line ~88) + `features/validation/components/OraclePanel.tsx` (line ~34)
- **Quote:**
  ```
  // TechnicalActions.tsx
  <div className="flex min-h-0 flex-1 overflow-hidden">
  ...
  <div className="bg-background border-border flex w-[var(--width-drawer-md)] flex-shrink-0 flex-col overflow-y-auto border-l">
  ```
  ```
  // ValidationCenter.tsx
  <div className="flex min-h-0 flex-1 overflow-hidden">
      <ValidationTable ... />
      {oracleOpen && <OraclePanel onClose={...} />}
  </div>
  // OraclePanel.tsx
  <div className="w-panel-md bg-background border-border flex flex-shrink-0 flex-col overflow-y-auto border-l">
  ```
- **Why it's wrong:** Both containers default to `flex-row` (no `flex-col`) with no `lg:` toggle, and both side panels are hard-coded to a fixed width with no `w-full` mobile base. On a narrow viewport the table and the detail/oracle panel render side-by-side at full fixed width, crushing the table into an unusable sliver. Every other two-pane workspace in the app — `MissionWorkspaceView.tsx`, `TrajectoryPage.tsx`, `AuditLogPage.tsx`, `ReportsPage.tsx`, `HumanEscalation.tsx`, `TeamManagerDashboardView.tsx` — uses the same `flex flex-col overflow-hidden lg:flex-row` outer wrapper plus `w-full lg:w-panel-*` on the side panel. These two files are the only outliers.
- **Fix:** Mirror the established pattern exactly:
  ```tsx
  <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">…table…</div>
      <div className="border-border flex w-full flex-shrink-0 flex-col overflow-y-auto border-t lg:w-drawer-md lg:border-t-0 lg:border-l">
          …drawer/oracle panel content…
      </div>
  </div>
  ```
  (Use the plain `w-drawer-md` / `w-panel-md` token class per L1 below, not the arbitrary form.)

### H2 — Dead `grid-cols-*` classes: `KPIStrip` default variant never sets `display: grid`
- **Files:** `features/core/components/Dashboard.tsx:92`, `features/cost/components/ContextState.tsx:38`, `features/cost/components/CostUsage.tsx:33`, `features/missions/components/workspace/MissionStatusStrip.tsx:40`
- **Quote (`Dashboard.tsx:92`):**
  ```tsx
  <KPIStrip
      className="grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
      items={KPI_ITEMS...}
  />
  ```
  `KPIStrip`'s default-variant base (`components/ui/KPIStrip.tsx`):
  ```tsx
  className={cn(
      "border-border divide-border gap-0 divide-y overflow-hidden rounded-sm border md:divide-x md:divide-y-0",
      className,
  )}
  ```
- **Why it's wrong:** The default variant is a `divide-y`/`divide-x` stacked list, not a CSS grid — there is no `grid` class anywhere in the base. Passing `grid-cols-N` classes as `className` does nothing; `grid-template-columns` only has an effect on an element with `display: grid`. Two sibling call sites do this correctly — `features/research/components/FailureAnalysis.tsx:18` and `features/memory/components/ContextUtilization.tsx:39` — both include the explicit `grid` class alongside `grid-cols-*`. `MissionStatusStrip.tsx:40` has the same bug plus a second one: its base classes are `flex min-w-max flex-1`, so `md:grid-cols-5` is dead on two counts (no `display: grid`, and the parent is explicitly `flex`).
- **Fix:** Add the missing `grid` class at each of the four call sites, e.g.:
  ```tsx
  <KPIStrip className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" ... />
  ```
  For `MissionStatusStrip.tsx`, decide the intended layout first (the surrounding markup — `flex min-w-max flex-1` scrolling row of 5 items — reads as an intentional horizontal scroll strip, not a grid) and drop the `md:grid-cols-5` remnant entirely rather than adding `grid`.

### H3 — Icon-only close buttons with no accessible name (5 instances)
- **Files:** `features/research/components/FailureAnalysis.tsx:86`, `features/validation/components/OraclePanel.tsx:45`, `features/missions/components/workspace/VDGNodeDrawerHeader.tsx:31`, `features/memory/components/TechnicalActions.tsx:113`, `features/execution/components/ExecDrawer.tsx:53`
- **Quote (representative, `OraclePanel.tsx:45`):**
  ```tsx
  <Button variant="ghost" size="icon-sm" onClick={onClose} className="text-muted-foreground">
      ✕
  </Button>
  ```
- **Why it's wrong:** The only "label" is a `✕` glyph rendered as text content with no `aria-label` and no visually-hidden (`sr-only`) span. Screen readers will announce this as "✕, button" (or nothing meaningful), which fails WCAG 4.1.2 (Name, Role, Value). This is not caught by the project's own `jsx-a11y` config because there is no `jsx-a11y/control-has-associated-label` rule in `eslint.config.mjs` — the lint suite passing does not mean this is covered. Three sibling files get this right and should be the reference: `features/audit/components/AuditLogPage.tsx:179` (`aria-label="Close detail drawer"`), `features/core/components/SidebarContent.tsx:88` (`aria-label="Close menu"`), and the shadcn `DialogContent`/`SheetContent` built-in close button, which uses a `<span className="sr-only">Close</span>` instead of a bare glyph.
- **Fix:** Add `aria-label="Close"` (or a more specific label matching the panel, e.g. `"Close oracle panel"`, `"Close action detail"`) to each of the five buttons.

### H4 — Auth-gate blocks rendering after mount, causing a blank-page flash on every navigation
- **File:** `app/(app)/layout.tsx:75` (guard defined in `lib/hooks/useAuthGuard.ts`)
- **Quote:**
  ```tsx
  const isReady = useAuthGuard();
  ...
  if (!isReady) {
      return null;
  }
  ```
  ```ts
  // useAuthGuard.ts
  export function useAuthGuard(): boolean {
      const router = useRouter();
      const { authenticated } = useAuth();
      useEffect(() => {
          if (!authenticated) router.replace("/login");
      }, [authenticated, router]);
      return authenticated;
  }
  ```
- **Why it's wrong:** This is exactly the pattern flagged in the audit prompt: the check runs in a `useEffect` after mount, so `AppLayoutInner` always renders `null` for at least one paint on every route change before `authenticated` resolves, producing a flash-of-blank-page. Compounding this, `app/page.tsx` does the identical `useAuthGuard()` + return-null dance at the root route.
- **Fix (given the current no-backend state):** This can't move to a Server Component or middleware yet because, per the code's own comment in `app/page.tsx`, auth state lives in React context rather than a cookie. Once a real auth/session cookie exists, move the check into `middleware.ts` (redirect before the page ever renders) or a Server Component that reads the cookie directly. Track this alongside the Section 8 route-entry-point finding below (M-equivalent, listed together) — same root cause (no real backend yet).

---

## Medium

### M1 — Breakpoint inconsistency: two panels switch at `md:`, the rest of the app switches at `lg:`
- **Files:** `features/execution/components/ExecutionConsoleView.tsx:26`, `features/execution/components/ExecDrawer.tsx:39`
- **Quote:**
  ```tsx
  <div className="flex h-full min-h-0 flex-col md:flex-row">
  ```
  ```tsx
  className="bg-background border-border flex w-full flex-col overflow-hidden border-l p-0 md:max-w-[var(--width-drawer-lg)]"
  ```
- **Why it's wrong:** The audit prompt fixes `lg:` (≥1024px) as the app shell's desktop threshold, and every other multi-pane view (`Dashboard`, `MissionWorkspaceView`, `TrajectoryPage`, `AuditLogPage`, `ReportsPage`, `TeamManagerDashboardView`, `HumanEscalation`) switches at `lg:`. These two switch to side-by-side 384px earlier (at `md:`, ≥768px), so on a tablet-width viewport this is the only workspace that goes two-pane while everything else is still stacked — an inconsistent, jarring transition point.
- **Fix:** Change both `md:` occurrences to `lg:` to match the rest of the app.

### M2 — Raw pixel width instead of the existing token scale
- **File:** `features/missions/components/workspace/MissionLiveState.tsx:12`
- **Quote:**
  ```tsx
  <div className="bg-background border-border flex w-full flex-shrink-0 flex-col overflow-hidden border-t lg:w-[256px] lg:border-t-0 lg:border-l">
  ```
- **Why it's wrong:** This is a layout-role right rail (correctly `w-full` on mobile, fixed at `lg:`), but `256px` is a raw arbitrary value. `globals.css`'s `@theme` block already defines a panel-width scale, and the closest token, `--width-panel-sm-alt: 260px`, is 4px off — close enough that this was very likely meant to use it and got hand-typed instead.
- **Fix:** Either change to `lg:w-panel-sm-alt` if the 4px difference is not intentional, or if 256px is a deliberate, different value, add it to the `@theme` scale (e.g. `--width-panel-sm-narrow-alt: 256px`) rather than leaving a raw pixel value that doesn't participate in the scale.

### M3 — Hand-rolled table row bypasses the `Table` primitive its own parent uses
- **File:** `features/audit/components/AuditLogRow.tsx:42-66`
- **Quote:**
  ```tsx
  <tr onClick={() => onClick(e)} className={[...]}>
      <td className="text-muted-foreground px-3 py-1.5 text-sm">{e.id}</td>
      ...
  </tr>
  ```
- **Why it's wrong:** `features/audit/components/AuditLogPage.tsx` imports and correctly uses `Table`, `TableHeader`, `TableRow`, `TableCell`, `TableHead` for the header row (`AuditLogPage.tsx:127-139`), but delegates body rows to `AuditLogRow`, which reinvents raw `<tr>`/`<td>` with manually duplicated Tailwind classes instead of `TableRow`/`TableCell`. `TableRow`/`TableCell` (`components/ui/table.tsx`) are plain `React.ComponentProps<"tr"|"td">` wrappers around `cn(...)` — there's no virtualization or ref requirement here that would block using them (this file isn't inside the virtualized list; `AuditLogPage.tsx`'s own virtualized rows already use `TableRow`/`TableCell` directly at lines 142-159).
- **Fix:** Replace `<tr>`/`<td>` with `<TableRow>`/`<TableCell>` from `@/components/ui/table`, keeping the same className strings.

### M4 — Dead/misapplied z-index token on a non-overlapping element
- **File:** `features/trajectory/components/TrajectoryStepRow.tsx:79`
- **Quote:**
  ```tsx
  <div
      className={`z-header h-2.5 w-2.5 shrink-0 rounded-full border border-solid ${tc.border} ${...}`}
  />
  ```
- **Why it's wrong:** This is the small circular dot on a vertical timeline "spine" — a normal-flow flex child, not absolutely/fixed positioned, and not overlapping any sibling (the connector line below it is a separate flex item, not layered underneath). `z-header` (`--z-header: 30`) does nothing here since there's no stacking-context conflict to resolve, and even if there were, this is exactly the "canvas node borrowing the app-chrome header's z-index token because the number happens to work" anti-pattern the audit brief calls out by name — an unrelated future change to the header z-index scale would silently affect this dot for no reason.
- **Fix:** Remove `z-header` entirely; it has no effect and no semantic justification here.

### M5 — Duplicated, drifting static inline animation (should be a shared utility)
- **Files:** `features/core/components/Dashboard.tsx:208`, `features/core/components/Shell.tsx:94,144`, `features/missions/components/workspace/MissionOverviewLogStream.tsx:13`, `features/escalation/components/HumanEscalation.tsx:87`, `features/execution/components/ExecutionConsoleView.tsx:60`
- **Quote (representative):**
  ```tsx
  style={{ animation: "pulse 1.4s ease-in-out infinite" }}   // Dashboard.tsx, Shell.tsx
  style={{ animation: "pulse 1.4s ease infinite" }}          // MissionOverviewLogStream.tsx, ExecutionConsoleView.tsx
  style={{ animation: "pulse 1.2s ease infinite" }}          // HumanEscalation.tsx
  ```
- **Why it's wrong:** This static value (a status-dot pulse) is duplicated inline six times with three slightly different timing functions/durations (`ease-in-out` vs `ease`, `1.4s` vs `1.2s`) — pure drift from copy-pasting rather than any per-instance need. Two other files already do this correctly as a Tailwind arbitrary-value class: `features/missions/components/workspace/MissionStatusStrip.tsx:31` and `features/specialists/components/SpecGrid.tsx:79` both use `animate-[pulse_1.4s_ease_infinite]`.
- **Fix:** Add one `@utility` to `globals.css` (a `pulse` keyframe animation already exists there):
  ```css
  @utility pulse-dot {
      animation: pulse 1.4s ease infinite;
  }
  ```
  and replace all six inline-style occurrences with `className="... pulse-dot"`, standardizing on one timing.

### M6 — `Tooltip` primitive is fully built and mounted, but never used
- **File:** `components/ui/tooltip.tsx`; provider mounted at `app/layout.tsx:72`
- **Why it's wrong:** `TooltipProvider` wraps the whole app, and `Tooltip`/`TooltipTrigger`/`TooltipContent` are implemented and exported, but a repo-wide search finds zero imports of `Tooltip`, `TooltipTrigger`, or `TooltipContent` anywhere under `features/` or `app/`. This is dead code by the letter of the audit rule (a primitive with zero imports outside its own file), and it's a missed opportunity: several truncated cells rely on `cell-truncate`/`text-ellipsis` with no way to see the full value — e.g. `features/missions/components/MissionsPage.tsx:134` (`max-w-[var(--width-cell-max)] ... whitespace-nowrap`, target column) — that's exactly what a `Tooltip` on hover is for.
- **Fix:** Either wire `Tooltip` into at least the truncated-cell use cases, or remove the unused exports and keep only `TooltipProvider` if nothing needs it yet — don't leave a fully-wired, unreachable primitive in limbo.

### M7 — One-off `overflow-visible` override on a table container, unexplained and inconsistent with sibling tables
- **File:** `features/missions/components/MissionsPage.tsx:97-100`
- **Quote:**
  ```tsx
  <div className="flex-1 overflow-auto">
      <Table className="w-full border-collapse text-xs" containerClassName="overflow-visible">
  ```
- **Why it's wrong:** `Table`'s own container defaults to `overflow-x-auto` specifically so a wide table can scroll independently. This is the only `Table` call site in the codebase that overrides it to `overflow-visible`; `Dashboard.tsx:118-119` and `ValidationTable.tsx:22-23` use the identical outer `<div className="flex-1 overflow-auto">` wrapper without the override. Because the outer wrapper already sets `overflow-auto`, this table likely still scrolls in practice (the outer div is the effective scroll container), so this is not a confirmed break — but it's unexplained, inconsistent with two structurally identical sibling files, and worth a second look given the header row is `sticky top-0` (line 100), which depends on which ancestor is actually the scrolling box.
- **Fix:** Remove the `containerClassName="overflow-visible"` override to match the other two tables unless there's a specific, documented reason (e.g. a dropdown/menu inside a cell that needs to escape a clipping ancestor) — if that's the reason, leave a comment saying so.

---

## Low

### L1 — Arbitrary-value long-hand used instead of the plain token class (repeated)
- **Files:** `features/core/components/Shell.tsx:104,116`, `features/validation/components/StateMachineModal.tsx:45`, `features/validation/components/FindingDetailDrawer.tsx:33`, `features/missions/components/wizard/WizardMissionSummary.tsx:27`, `features/missions/components/workspace/VDGNodeDrawerView.tsx:170`, `features/core/components/Dashboard.tsx:204`, `features/specialists/components/UCBModal.tsx:55`, `features/execution/components/ExecDrawer.tsx:39`
- **Quote (representative, `Shell.tsx:116`):**
  ```tsx
  className="border-border bg-background relative hidden w-[var(--width-panel-sm)] flex-shrink-0 flex-col overflow-y-auto border-r lg:flex"
  ```
- **Why it's wrong:** Tailwind v4 auto-generates a plain utility class for every `@theme` token (`--width-panel-sm` → `w-panel-sm`, `--width-panel-lg` → `max-w-panel-lg`, etc.), and the plain form is already proven to work elsewhere in this exact codebase — `features/specialists/components/TeamManagerDashboardView.tsx:65` uses `lg:w-panel-sm`, and `features/core/components/CommandPaletteView.tsx:56` uses `sm:w-panel-xl sm:max-w-panel-xl`. The eight sites above instead spell out the arbitrary-value long-hand `w-[var(--width-panel-sm)]` / `max-w-[var(--width-panel-lg)]` etc., which resolves to the same value but is a code-quality miss per the audit brief's own standard.
- **Fix:** Replace each with its plain-class equivalent, e.g. `w-[var(--width-panel-sm)]` → `w-panel-sm`, `sm:max-w-[var(--width-panel-lg)]` → `sm:max-w-panel-lg`, `lg:w-[var(--width-drawer-sm)]` → `lg:w-drawer-sm`. This is a single, structurally identical find-and-replace across all eight sites.

### L2 — Repeated raw `rounded-[3px]` with no matching token
- **Files:** `features/missions/components/workspace/MissionOverviewAttackGraph.tsx:100`, `features/missions/components/workspace/AttackGraphNode.tsx:55`, `features/core/components/CommandPaletteView.tsx:56`, `features/specialists/components/SpecGrid.tsx:62`, `features/cost/components/CostUsage.tsx:57,59`
- **Why it's wrong:** `rounded-[3px]` appears five separate times (a third-or-later repeat of the same magic number, per the audit brief's own threshold for "add a token"), and none of the existing `--radius-*` tokens (`sm` = 6px, `md` = 8px, `lg` = 10px, ...) equal 3px.
- **Fix:** Add `--radius-xs: 3px;` (or similar) to the `@theme` block in `globals.css` and switch all five sites to `rounded-xs`.

### L3 — Trivial static inline style duplicated where a class already exists
- **Files:** `components/ui/GeometricMark.tsx:22`, `features/missions/components/wizard/FieldBlock.tsx:38`
- **Quote:** `style={{ display: "block" }}` in both.
- **Why it's wrong:** This is a static value with a direct one-to-one Tailwind class (`block`) — no data-driven computation involved, so it belongs as a class per Section 6's own static/dynamic rule.
- **Fix:** Replace `style={{ display: "block" }}` with `className="block"` (merge into the existing `className` string at each site) in both files.

### L4 — Redundant duplicate Escape-key handling inside an already-composed Dialog
- **File:** `features/core/components/CommandPaletteContainer.tsx:58-60`
- **Quote:**
  ```tsx
  case "Escape":
      onClose();
      break;
  ```
- **Why it's wrong:** `CommandPaletteView.tsx` already wraps this in `<Dialog open onOpenChange={...}>` (a Base UI primitive that closes on Escape natively and fires `onOpenChange(false)` → `onClose()`), so this manual case duplicates behavior the primitive already provides. Not currently a visible bug (both paths call the same `onClose`), but it's dead-weight logic that will silently drift if the two paths ever need to diverge.
- **Fix:** Remove the manual `"Escape"` case from the custom keydown handler and rely on the `Dialog`'s built-in handling.

---

## What's already correct (noted only where it's the reference pattern for a fix above)

- ESLint (`eslint.config.mjs`) already sets every `jsx-a11y/*` rule to `"error"`, not `"warn"` — Section 4's config-check finds nothing to escalate.
- Section 9's hygiene sweep (`any`, `console.log`, `key={index}`/`key={i}`, `var`, disallowed loose equality) came back completely clean across the whole `src/` tree. The two `== null`/`!= null` hits in `SpecGrid.tsx` are explicitly allowed by the project's own `eqeqeq` config (`{ null: "ignore" }`) and are not findings.
- Fonts are loaded via `next/font/google` in `app/layout.tsx` (no CSS `@import` from Google Fonts); images use `next/image` everywhere except icon SVGs, which is the correct exception.
- No `role="button"` anywhere in the codebase.
- All modal/drawer call sites use the composed `DialogContent`/`SheetContent` exports — no file reaches past them to the raw `DialogPrimitive`/`SheetPrimitive` sub-parts outside `components/ui/` itself.
- `TableRow`/`TableCell` correctly forward `React.ComponentProps<"tr"|"td">`, so M3's fix is a drop-in swap, not a rewrite.

---

## Recommended execution order

1. **H3** (missing accessible names) — an active accessibility hole, cheapest fix, five one-line additions.
2. **H4** (auth-gate flash) — active UX regression on every navigation; needs a short design note since the full fix depends on a real backend, but the current behavior should at least be tracked.
3. **H1** (non-stacking panes) and **H2** (dead grid classes) — structural, each touches the established cross-file pattern; fix by copying the working pattern from sibling files, then verify no other file drifts the same way in future.
4. **M1–M4, M7** — one-file-at-a-time structural/consistency fixes; M3 and M4 are single-line-shape fixes, M1/M2/M7 are single-line value swaps.
5. **M5, M6** — introduce the shared `pulse-dot` utility and decide Tooltip's fate; these touch multiple files but are mechanical once the decision is made.
6. **L1–L4** — isolated one-file polish; L1's eight sites are the same find-and-replace shape and can be batched.

No visual theme colors, spacing scale, or copy were changed or recommended for change anywhere in this audit — every item above is a mechanism fix (responsiveness, token usage, primitive reuse, accessibility, or hygiene).
