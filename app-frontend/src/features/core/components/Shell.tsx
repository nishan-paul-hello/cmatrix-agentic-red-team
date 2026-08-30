import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import GeometricMark from "@/components/ui/GeometricMark";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { SidebarContent } from "@/features/core/components/SidebarContent";
import { cn } from "@/lib/utils";
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
        <div className="flex flex-col justify-center gap-0.5">
            <span className="text-muted-foreground text-[10px] font-bold tracking-widest">
                {label}
            </span>
            <span
                className={`text-sm font-medium tracking-tight ${valueColor ?? "text-foreground"}`}
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
    onOpenCommandPalette?: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Shell({
    activeNav,
    onNavChange,
    children,
    missionId = "CVE-001",
    onOpenCommandPalette,
}: ShellProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="bg-background text-foreground flex h-dvh flex-col overflow-hidden lg:flex-row">
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
                        className="bg-success pulse-dot h-1.5 w-1.5 shrink-0 rounded-full"

                        aria-hidden="true"
                    />
                </div>
            </header>

            {/* ── Mobile Off-Canvas Drawer ───────────────────────────────────── */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetContent
                    side="left"
                    className="bg-background flex w-[200px] max-w-[80vw] flex-col border-r p-0"
                >
                    <SidebarContent
                        activeNav={activeNav}
                        onNavChange={onNavChange}
                        setMobileMenuOpen={setMobileMenuOpen}
                        onOpenCommandPalette={onOpenCommandPalette}
                    />
                </SheetContent>
            </Sheet>

            {/* ── Desktop Sidebar ────────────────────────────────────────────── */}
            <aside
                className={cn(
                    "border-border bg-background relative hidden flex-shrink-0 flex-col border-r transition-all duration-300 lg:flex",
                    isSidebarCollapsed ? "w-[64px]" : "w-[200px]",
                )}
                aria-label="Main navigation"
            >
                <SidebarContent
                    activeNav={activeNav}
                    onNavChange={onNavChange}
                    setMobileMenuOpen={setMobileMenuOpen}
                    isCollapsed={isSidebarCollapsed}
                    toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    onOpenCommandPalette={onOpenCommandPalette}
                />
            </aside>

            {/* ── Main column ────────────────────────────────────────────────── */}
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
                {/* Top bar */}
                <header
                    className="border-border bg-background flex flex-shrink-0 flex-col justify-between gap-2 overflow-x-auto border-b px-4 py-2 sm:h-14 sm:flex-row sm:items-center sm:gap-4 sm:py-0"
                    aria-label="Mission context bar"
                >
                    <div className="flex shrink-0 items-center">
                        <span className="text-muted-foreground text-xs tracking-widest whitespace-nowrap">
                            MISSION / <span className="text-primary font-bold">{missionId}</span>
                        </span>
                    </div>

                    <div className="flex scrollbar-none items-center gap-5 overflow-x-auto pb-1 sm:pb-0">
                        {/* System status indicator (hidden on mobile, shown in mobile header instead) */}
                        <div className="hidden shrink-0 items-center gap-1.5 lg:flex">
                            <div
                                className="bg-success pulse-dot h-1.5 w-1.5 shrink-0 rounded-full"

                                aria-hidden="true"
                            />
                            <span className="text-success text-sm tracking-widest whitespace-nowrap">
                                SYSTEM ONLINE
                            </span>
                        </div>

                        {/* Divider */}
                        <div className="bg-border hidden h-8 w-px lg:block" />

                        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
                            <TopbarStat
                                label="STATUS"
                                value={MISSION_STATUS.RUNNING}
                                valueColor="text-success"
                            />
                            <TopbarStat label="TARGET" value="app.targetcorp.com" />
                            <TopbarStat label="MODE" value="ONE-DAY" />
                            <TopbarStat label="SURFACE" value="WEB APP" />

                            {/* Inner Divider */}
                            <div className="bg-border h-6 w-px" />

                            <TopbarStat label="MODEL" value="SONNET-5" />
                            <TopbarStat label="COST" value="$1.42" />
                            <TopbarStat label="TIME" value="00:19:04" />
                        </div>

                        {/* User actions */}
                        <div className="border-border ml-auto flex shrink-0 items-center gap-2 sm:ml-2 sm:border-l sm:pl-3">
                            {/* Icons removed as per user request */}
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
