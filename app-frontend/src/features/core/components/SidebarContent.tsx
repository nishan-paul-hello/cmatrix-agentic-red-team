import {
    Activity,
    AlertTriangle,
    BarChart2,
    Beaker,
    Bug,
    ChevronLeft,
    ChevronRight,
    Database,
    DollarSign,
    FileText,
    LayoutDashboard,
    LineChart,
    List,
    Settings,
    Target,
    Wrench,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import GeometricMark from "@/components/ui/GeometricMark";
import { type NavItem } from "@/features/core/components/Shell";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
    {
        label: "OPERATIONS",
        items: [
            { id: "dashboard" as NavItem, label: "Dashboard", icon: LayoutDashboard },
            { id: "missions" as NavItem, label: "Missions", icon: Target },
        ],
    },
    {
        label: "KNOWLEDGE",
        items: [
            { id: "memory" as NavItem, label: "Memory", icon: Database },
            { id: "skill-library" as NavItem, label: "Skill Library", icon: Wrench },
            { id: "failure-memory" as NavItem, label: "Failure Memory", icon: AlertTriangle },
        ],
    },
    {
        label: "RESEARCH",
        items: [
            { id: "trajectory" as NavItem, label: "Trajectory", icon: Activity },
            { id: "benchmarks" as NavItem, label: "Benchmarks", icon: LineChart },
            { id: "ablations" as NavItem, label: "Ablations", icon: Beaker },
            { id: "statistics" as NavItem, label: "Statistics", icon: BarChart2 },
            { id: "failure-analysis" as NavItem, label: "Failure Analysis", icon: Bug },
            { id: "reports" as NavItem, label: "Reports", icon: FileText },
        ],
    },
    {
        label: "SYSTEM",
        items: [
            { id: "cost-usage" as NavItem, label: "Cost & Usage", icon: DollarSign },
            { id: "audit-log" as NavItem, label: "Audit Log", icon: List },
            { id: "settings" as NavItem, label: "Settings", icon: Settings },
        ],
    },
] as const;

export function SidebarContent({
    activeNav,
    onNavChange,
    setMobileMenuOpen,
    isCollapsed = false,
    toggleCollapse,
}: {
    activeNav: NavItem;
    onNavChange: (id: NavItem) => void;
    setMobileMenuOpen: (open: boolean) => void;
    isCollapsed?: boolean;
    toggleCollapse?: () => void;
}) {
    return (
        <>

            {/* Logo */}
            <div
                className={cn(
                    "border-border flex items-center border-b py-4 lg:py-3",
                    isCollapsed ? "justify-center px-2" : "justify-between gap-2.5 px-4",
                )}
            >
                <div
                    className={cn(
                        "flex items-center gap-2.5",
                        isCollapsed && "w-full justify-center",
                    )}
                >
                    <GeometricMark size={20} />
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="text-foreground text-xs font-bold tracking-widest">
                                RedGrid
                            </span>
                        </div>
                    )}
                </div>
                {/* Mobile close button inside drawer */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground h-8 w-8 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <X className="size-4" />
                </Button>
            </div>

            {/* Nav groups */}
            <nav
                className="flex flex-1 scrollbar-none flex-col overflow-x-hidden overflow-y-auto py-2"
                aria-label="Sections"
            >
                {NAV_GROUPS.map((group, gi) => (
                    <div key={group.label}>
                        {gi > 0 && <div className="bg-muted mx-4 my-2 h-px" aria-hidden="true" />}

                        {!isCollapsed ? (
                            <div className="text-muted-foreground px-4 pt-2 pb-1 text-sm font-semibold tracking-widest whitespace-nowrap">
                                {group.label}
                            </div>
                        ) : (
                            <div className="pt-2 pb-1" />
                        )}

                        {group.items.map((item) => {
                            const active = activeNav === item.id;
                            const Icon = item.icon;
                            return (
                                <Button
                                    key={item.id}
                                    variant="ghost"
                                    onClick={() => {
                                        onNavChange(item.id);
                                        setMobileMenuOpen(false);
                                    }}
                                    title={isCollapsed ? item.label : undefined}
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "flex w-full items-center gap-2.5 rounded-none py-1.5 text-xs tracking-tighter uppercase",
                                        "border-l-2 transition-colors duration-100",
                                        isCollapsed
                                            ? "justify-center px-0"
                                            : "justify-start px-4 text-left",
                                        active
                                            ? "border-primary bg-muted text-foreground"
                                            : "text-muted-foreground hover:text-muted-foreground border-transparent hover:bg-transparent",
                                    )}
                                >
                                    <Icon
                                        className={cn(
                                            "shrink-0",
                                            isCollapsed ? "size-5" : "size-3.5",
                                        )}
                                        aria-hidden="true"
                                    />
                                    {!isCollapsed && (
                                        <span className="whitespace-nowrap">{item.label}</span>
                                    )}
                                </Button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="border-border bg-background flex flex-col border-t">
                {toggleCollapse && (
                    <Button
                        variant="ghost"
                        onClick={toggleCollapse}
                        className={cn(
                            "text-muted-foreground hover:text-foreground hidden h-auto w-full items-center gap-2.5 rounded-none px-4 py-3 lg:flex",
                            isCollapsed ? "justify-center px-0" : "justify-start",
                        )}
                        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                    >
                        {isCollapsed ? (
                            <ChevronRight className="size-5" />
                        ) : (
                            <>
                                <ChevronLeft className="size-4" />{" "}
                                <span className="text-xs font-bold tracking-widest">COLLAPSE</span>
                            </>
                        )}
                    </Button>
                )}
                {!isCollapsed && (
                    <div className="border-border flex items-center gap-2 border-t px-4 py-3">
                        <kbd className="border-border bg-card text-muted-foreground rounded-sm border px-1 py-px text-sm">
                            ⌘K
                        </kbd>
                        <span className="text-muted-foreground text-xs tracking-normal whitespace-nowrap sm:text-sm">
                            COMMAND PALETTE
                        </span>
                    </div>
                )}
            </div>
        </>
    );
}
