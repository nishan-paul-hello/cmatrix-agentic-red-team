import { type ReactNode } from "react";

import GeometricMark from "@/components/ui/GeometricMark";
import { MISSION_STATUS } from "@/types/domain-types";

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
        <span className="inline-block w-[14px] text-[10px]" aria-hidden="true">
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
            <span className="text-[8.5px] tracking-[0.14em] text-[var(--color-hex-444444)]">
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
                className="relative flex w-[200px] flex-shrink-0 flex-col overflow-y-auto border-r border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0b0b0b)]"
                aria-label="Main navigation"
            >
                {/* Red accent stripe */}
                <div
                    className="absolute top-0 bottom-0 left-0 w-[2px] bg-[var(--color-hex-e31b23)]"
                    aria-hidden="true"
                />

                {/* Logo */}
                <div className="flex items-center gap-2.5 border-b border-[var(--color-hex-1e1e1e)] px-4 py-4">
                    <GeometricMark size={20} />
                    <div className="flex flex-col">
                        <span className="text-[12px] font-bold tracking-[0.2em] text-[var(--color-hex-f2f2f2)]">
                            RedGrid
                        </span>
                    </div>
                </div>

                {/* Nav groups */}
                <nav className="flex flex-1 flex-col py-2" aria-label="Sections">
                    {NAV_GROUPS.map((group, gi) => (
                        <div key={group.label}>
                            {gi > 0 && (
                                <div
                                    className="mx-4 my-2 h-[1px] bg-[var(--color-hex-1e1e1e)]"
                                    aria-hidden="true"
                                />
                            )}
                            <div className="px-4 pt-2 pb-1 text-[8px] font-semibold tracking-[0.22em] text-[var(--color-hex-444444)]">
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
                                            "flex w-full cursor-pointer items-center gap-2 px-4 py-1.5 text-left text-[10.5px] tracking-[0.02em] uppercase",
                                            "border-l-2 transition-colors duration-100",
                                            active
                                                ? "border-[var(--color-hex-e31b23)] bg-[var(--color-hex-1a0a0b)] text-[var(--color-hex-f2f2f2)]"
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
                <div className="flex items-center gap-2 border-t border-[var(--color-hex-1e1e1e)] px-4 py-3">
                    <kbd className="rounded-[2px] border border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[5px] py-[1px] text-[8px] text-[var(--color-hex-333333)]">
                        ⌘K
                    </kbd>
                    <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                        COMMAND PALETTE
                    </span>
                </div>
            </aside>

            {/* ── Main column ────────────────────────────────────────────────── */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header
                    className="flex h-[36px] flex-shrink-0 items-center justify-between border-b border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-4"
                    aria-label="Mission context bar"
                >
                    <span className="text-[10px] tracking-[0.14em] text-[var(--color-hex-a0a0a0)]">
                        MISSION /{" "}
                        <span className="font-bold text-[var(--color-hex-e31b23)]">
                            {missionId}
                        </span>
                    </span>

                    <div className="flex items-center gap-5">
                        {/* System status indicator */}
                        <div className="flex items-center gap-1.5">
                            <div
                                className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--color-hex-3fb950)]"
                                style={{ animation: "pulse 1.4s ease-in-out infinite" }}
                                aria-hidden="true"
                            />
                            <span className="text-[9.5px] tracking-[0.14em] text-[var(--color-hex-3fb950)]">
                                SYSTEM ONLINE
                            </span>
                        </div>

                        <TopbarStat
                            label="STATUS"
                            value={MISSION_STATUS.RUNNING}
                            valueColor="var(--color-hex-3fb950)"
                        />
                        <TopbarStat label="MODEL" value="SONNET-5" />
                        <TopbarStat label="COST" value="$1.42" />
                        <TopbarStat label="TIME" value="00:19:04" />

                        {/* User actions */}
                        <div className="ml-2 flex items-center gap-2 border-l border-[var(--color-hex-1e1e1e)] pl-3">
                            <button
                                aria-label="Settings"
                                className="flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-[2px] border border-[var(--color-hex-292929)] bg-[var(--color-hex-191919)] text-[10px] text-[var(--color-hex-666666)] transition-colors duration-100 hover:text-[var(--color-hex-a0a0a0)]"
                            >
                                ⚙
                            </button>
                            <button
                                aria-label="User profile"
                                className="flex h-[22px] w-[22px] cursor-pointer items-center justify-center rounded-full border border-[var(--color-hex-292929)] bg-[var(--color-hex-1e1e1e)] text-[10px] text-[var(--color-hex-a0a0a0)] transition-colors duration-100 hover:text-[var(--color-hex-f2f2f2)]"
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
