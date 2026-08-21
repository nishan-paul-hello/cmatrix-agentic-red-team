import type { ReactNode } from "react";
import GeometricMark from "@/components/ui/GeometricMark";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NavItem =
  | "dashboard"
  | "missions"
  | "memory"
  | "skill-library"
  | "failure-memory"
  | "trajectory"
  | "benchmarks"
  | "ablations"
  | "statistics"
  | "failure-analysis"
  | "reports"
  | "cost-usage"
  | "audit-log"
  | "settings";

// ─── Static data ──────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    label: "OPERATIONS",
    items: [
      { id: "dashboard" as NavItem, label: "Dashboard" },
      { id: "missions" as NavItem, label: "Missions" },
    ],
  },
  {
    label: "KNOWLEDGE",
    items: [
      { id: "memory" as NavItem, label: "Memory" },
      { id: "skill-library" as NavItem, label: "Skill Library" },
      { id: "failure-memory" as NavItem, label: "Failure Memory" },
    ],
  },
  {
    label: "RESEARCH",
    items: [
      { id: "trajectory" as NavItem, label: "Trajectory" },
      { id: "benchmarks" as NavItem, label: "Benchmarks" },
      { id: "ablations" as NavItem, label: "Ablations" },
      { id: "statistics" as NavItem, label: "Statistics" },
      { id: "failure-analysis" as NavItem, label: "Failure Analysis" },
      { id: "reports" as NavItem, label: "Reports" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { id: "cost-usage" as NavItem, label: "Cost & Usage" },
      { id: "audit-log" as NavItem, label: "Audit Log" },
      { id: "settings" as NavItem, label: "Settings" },
    ],
  },
] as const;

/** Icon glyphs keyed by NavItem — typed to catch unknown ids at compile time. */
const NAV_ICONS: Record<NavItem, string> = {
  dashboard: "▪",
  missions: "◈",
  memory: "⊞",
  "skill-library": "⊟",
  "failure-memory": "⊠",
  trajectory: "⤴",
  benchmarks: "≡",
  ablations: "∿",
  statistics: "∑",
  "failure-analysis": "⊗",
  reports: "⊕",
  "cost-usage": "$",
  "audit-log": "≣",
  settings: "⚙",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavIcon({ id }: { id: NavItem }) {
  return (
    <span className="text-[10px] w-[14px] inline-block" aria-hidden="true">
      {NAV_ICONS[id]}
    </span>
  );
}

function TopbarStat({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[8.5px] text-[var(--color-hex-444444)] tracking-[0.14em]">
        {label}
      </span>
      <span
        className="text-[9.5px] tracking-[0.08em]"
        style={{ color: valueColor ?? "var(--color-hex-a0a0a0)" }}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface ShellProps {
  activeNav: NavItem;
  onNavChange: (id: NavItem) => void;
  children: ReactNode;
  missionId?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Shell({
  activeNav,
  onNavChange,
  children,
  missionId = "CVE-001",
}: ShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-hex-080808)] text-[var(--color-hex-f2f2f2)]">
      {/* ── Sidebar ────────────────────────────────────────────────────── */}
      <aside
        className="flex flex-col flex-shrink-0 overflow-y-auto w-[200px] bg-[var(--color-hex-0b0b0b)] relative border-r border-[var(--color-hex-1e1e1e)]"
        aria-label="Main navigation"
      >
        {/* Red accent stripe */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-hex-e31b23)]"
          aria-hidden="true"
        />

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-4 border-b border-[var(--color-hex-1e1e1e)]">
          <GeometricMark size={20} />
          <div className="flex flex-col">
            <span className="font-bold text-[12px] text-[var(--color-hex-f2f2f2)] tracking-[0.2em]">
              CMATRIX
            </span>
            <span className="text-[7px] text-[var(--color-hex-666666)] tracking-[0.2em]">
              AGENTIC RED TEAM
            </span>
          </div>
        </div>

        {/* Nav groups */}
        <nav className="flex flex-col flex-1 py-2" aria-label="Sections">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label}>
              {gi > 0 && (
                <div
                  className="mx-4 my-2 h-[1px] bg-[var(--color-hex-1e1e1e)]"
                  aria-hidden="true"
                />
              )}
              <div className="px-4 pt-2 pb-1 text-[8px] text-[var(--color-hex-444444)] tracking-[0.22em] font-semibold">
                {group.label}
              </div>
              {group.items.map((item) => {
                const active = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavChange(item.id)}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "w-full flex items-center gap-2 px-4 py-1.5 text-left text-[10.5px] cursor-pointer tracking-[0.02em]",
                      "border-l-2 transition-colors duration-100",
                      active
                        ? "bg-[var(--color-hex-1a0a0b)] border-[var(--color-hex-e31b23)] text-[var(--color-hex-f2f2f2)]"
                        : "border-transparent text-[var(--color-hex-666666)] hover:text-[var(--color-hex-a0a0a0)]",
                    ].join(" ")}
                  >
                    <NavIcon id={item.id} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Ctrl+K hint */}
        <div className="flex items-center gap-2 px-4 py-3 border-t border-[var(--color-hex-1e1e1e)]">
          <kbd className="text-[8px] text-[var(--color-hex-333333)] bg-[var(--color-hex-111111)] border border-[var(--color-hex-1e1e1e)] rounded-[2px] py-[1px] px-[5px]">
            ⌘K
          </kbd>
          <span className="text-[8px] text-[var(--color-hex-333333)] tracking-[0.1em]">
            COMMAND PALETTE
          </span>
        </div>
      </aside>

      {/* ── Main column ────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between flex-shrink-0 px-4 h-[36px] bg-[var(--color-hex-0d0d0d)] border-b border-[var(--color-hex-1e1e1e)]"
          aria-label="Mission context bar"
        >
          <span className="text-[10px] text-[var(--color-hex-a0a0a0)] tracking-[0.14em]">
            MISSION /{" "}
            <span className="text-[var(--color-hex-e31b23)] font-bold">
              {missionId}
            </span>
          </span>

          <div className="flex items-center gap-5">
            {/* System status indicator */}
            <div className="flex items-center gap-1.5">
              <div
                className="w-[6px] h-[6px] bg-[var(--color-hex-3fb950)] shrink-0 rounded-full"
                style={{ animation: "pulse 1.4s ease-in-out infinite" }}
                aria-hidden="true"
              />
              <span className="text-[9.5px] text-[var(--color-hex-3fb950)] tracking-[0.14em]">
                SYSTEM ONLINE
              </span>
            </div>

            <TopbarStat
              label="STATUS"
              value="RUNNING"
              valueColor="var(--color-hex-3fb950)"
            />
            <TopbarStat label="MODEL" value="SONNET-5" />
            <TopbarStat label="COST" value="$1.42" />
            <TopbarStat label="TIME" value="00:19:04" />

            {/* User actions */}
            <div className="flex items-center gap-2 ml-2 pl-3 border-l border-[var(--color-hex-1e1e1e)]">
              <button
                aria-label="Settings"
                className="w-[22px] h-[22px] flex items-center justify-center rounded-[2px] bg-[var(--color-hex-191919)] border border-[var(--color-hex-292929)] text-[10px] text-[var(--color-hex-666666)] cursor-pointer hover:text-[var(--color-hex-a0a0a0)] transition-colors duration-100"
              >
                ⚙
              </button>
              <button
                aria-label="User profile"
                className="w-[22px] h-[22px] flex items-center justify-center rounded-full bg-[var(--color-hex-1e1e1e)] border border-[var(--color-hex-292929)] text-[10px] text-[var(--color-hex-a0a0a0)] cursor-pointer hover:text-[var(--color-hex-f2f2f2)] transition-colors duration-100"
              >
                R
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-hidden bg-[var(--color-hex-0d0d0d)]">
          {children}
        </main>
      </div>
    </div>
  );
}