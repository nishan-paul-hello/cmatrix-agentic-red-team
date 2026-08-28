import { useEffect, useState, type ReactNode } from "react";
import FocusTrap from "focus-trap-react";
import { Menu, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import GeometricMark from "@/components/ui/GeometricMark";
import { SidebarContent } from "@/features/core/components/SidebarContent";
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

// ─── Sub-components ───────────────────────────────────────────────────────────

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
            <span className="text-muted-foreground text-xs tracking-widest sm:text-sm">
                {label}
            </span>
            <span
                className="text-sm tracking-tight sm:text-base"
                style={{ color: valueColor ?? "var(--muted-foreground)" }}
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
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close mobile menu on escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && mobileMenuOpen) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [mobileMenuOpen]);

    return (
        <div className="bg-background text-foreground flex h-screen flex-col overflow-hidden lg:flex-row">
            {/* ── Mobile Header ──────────────────────────────────────────────── */}
            <header className="border-border bg-background flex h-14 flex-shrink-0 items-center justify-between border-b px-4 lg:hidden">
                <div className="flex items-center gap-2.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground -ml-2 h-8 w-8"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Open menu"
                    >
                        <Menu className="size-5" />
                    </Button>
                    <GeometricMark size={20} />
                    <span className="text-foreground text-xs font-bold tracking-widest">
                        RedGrid
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className="bg-success h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ animation: "pulse 1.4s ease-in-out infinite" }}
                        aria-hidden="true"
                    />
                </div>
            </header>

            {/* ── Mobile Off-Canvas Drawer ───────────────────────────────────── */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        aria-hidden="true"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <FocusTrap active={mobileMenuOpen}>
                        <aside
                            className="border-border bg-background animate-in slide-in-from-left relative z-50 flex h-full w-[280px] max-w-[80vw] flex-col overflow-y-auto border-r shadow-2xl"
                            aria-label="Mobile navigation"
                        >
                            <SidebarContent
                                activeNav={activeNav}
                                onNavChange={onNavChange}
                                setMobileMenuOpen={setMobileMenuOpen}
                            />
                        </aside>
                    </FocusTrap>
                </div>
            )}

            {/* ── Desktop Sidebar ────────────────────────────────────────────── */}
            <aside
                className="border-border bg-background relative hidden w-[240px] flex-shrink-0 flex-col overflow-y-auto border-r lg:flex"
                aria-label="Main navigation"
            >
                <SidebarContent
                    activeNav={activeNav}
                    onNavChange={onNavChange}
                    setMobileMenuOpen={setMobileMenuOpen}
                />
            </aside>

            {/* ── Main column ────────────────────────────────────────────────── */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header
                    className="border-border bg-background flex flex-shrink-0 flex-col justify-between gap-2 overflow-x-auto border-b px-4 py-2 sm:h-12 sm:flex-row sm:items-center sm:gap-4 sm:py-0"
                    aria-label="Mission context bar"
                >
                    <div className="flex shrink-0 items-center">
                        <span className="text-muted-foreground text-xs tracking-widest whitespace-nowrap">
                            MISSION / <span className="text-primary font-bold">{missionId}</span>
                        </span>
                    </div>

                    <div className="flex scrollbar-none items-center gap-4 overflow-x-auto pb-1 sm:gap-5 sm:pb-0">
                        {/* System status indicator (hidden on mobile, shown in mobile header instead) */}
                        <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
                            <div
                                className="bg-success h-1.5 w-1.5 shrink-0 rounded-full"
                                style={{ animation: "pulse 1.4s ease-in-out infinite" }}
                                aria-hidden="true"
                            />
                            <span className="text-success text-sm tracking-widest whitespace-nowrap lg:text-base">
                                SYSTEM ONLINE
                            </span>
                        </div>

                        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
                            <TopbarStat
                                label="STATUS"
                                value={MISSION_STATUS.RUNNING}
                                valueColor="var(--success)"
                            />
                            <TopbarStat label="MODEL" value="SONNET-5" />
                            <TopbarStat label="COST" value="$1.42" />
                            <TopbarStat label="TIME" value="00:19:04" />
                        </div>

                        {/* User actions */}
                        <div className="border-border ml-auto flex shrink-0 items-center gap-2 sm:ml-2 sm:border-l sm:pl-3">
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="Settings"
                                className="bg-muted text-muted-foreground hover:text-muted-foreground h-6 w-6 sm:h-7 sm:w-7"
                            >
                                <Settings className="size-3.5" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="User profile"
                                className="bg-muted text-muted-foreground hover:text-foreground h-6 w-6 rounded-full text-xs font-bold sm:h-7 sm:w-7"
                            >
                                R
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="bg-background relative flex min-h-0 flex-1 flex-col overflow-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
}
