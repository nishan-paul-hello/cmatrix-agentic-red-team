import { useState } from "react";
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
    LogOut,
    Search,
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
    onOpenCommandPalette,
}: {
    activeNav: NavItem;
    onNavChange: (id: NavItem) => void;
    setMobileMenuOpen: (open: boolean) => void;
    isCollapsed?: boolean;
    toggleCollapse?: () => void;
    onOpenCommandPalette?: () => void;
}) {
    const [showLogoutMenu, setShowLogoutMenu] = useState(false);

    return (
        <>
            {/* Logo and Top Actions */}
            <div
                className={cn(
                    "border-border flex border-b py-4 lg:py-3",
                    isCollapsed ? "flex-col items-center gap-3 px-2" : "items-center justify-between px-4",
                )}
            >
                {/* Logo Area (Interactive when collapsed) */}
                {isCollapsed ? (
                    <button
                        type="button"
                        className="group relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        onClick={toggleCollapse}
                        title="Expand Sidebar"
                        aria-label="Expand Sidebar"
                    >
                        <div className="flex items-center transition-opacity duration-200 group-hover:opacity-0">
                            <GeometricMark size={20} />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <ChevronRight className="text-muted-foreground size-5" />
                        </div>
                    </button>
                ) : (
                    <div className="flex items-center gap-2.5">
                        <GeometricMark size={20} />
                        <span className="text-foreground text-xs font-bold tracking-widest">
                            RedGrid
                        </span>
                    </div>
                )}

                {/* Desktop top actions (Search & Collapse) */}
                <div
                    className={cn(
                        "hidden items-center gap-1 lg:flex",
                        isCollapsed ? "w-full flex-col" : "",
                    )}
                >
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-foreground h-8 w-8"
                        title="Command Palette (⌘K)"
                        onClick={onOpenCommandPalette}
                    >
                        <Search className={cn(isCollapsed ? "size-5" : "size-4")} />
                    </Button>
                    {!isCollapsed && toggleCollapse && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleCollapse}
                            className="text-muted-foreground hover:text-foreground h-8 w-8"
                            title="Collapse Sidebar"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
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
                <div className="relative p-2">
                    {showLogoutMenu && (
                        <div className="border-border bg-popover absolute right-2 bottom-full left-2 mb-1 rounded-md border shadow-md">
                            <Button
                                variant="ghost"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive w-full justify-start gap-2 rounded-sm px-3 py-2 text-sm"
                                onClick={() => setShowLogoutMenu(false)}
                            >
                                <LogOut className="size-4" />
                                Log out
                            </Button>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        onClick={() => setShowLogoutMenu(!showLogoutMenu)}
                        className={cn(
                            "hover:bg-muted flex h-auto w-full items-center px-2 py-2",
                            isCollapsed ? "justify-center" : "justify-start gap-3",
                        )}
                    >
                        <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                            NP
                        </div>
                        {!isCollapsed && (
                            <div className="flex flex-1 flex-col items-start overflow-hidden text-left">
                                <span className="w-full truncate text-sm leading-none font-medium">
                                    Nishan Paul
                                </span>
                                <span className="text-muted-foreground mt-1 text-xs">Free</span>
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
}
