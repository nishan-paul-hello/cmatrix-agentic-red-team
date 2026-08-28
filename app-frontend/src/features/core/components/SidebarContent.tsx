import {
    Activity,
    AlertTriangle,
    BarChart2,
    Beaker,
    Bug,
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
}: {
    activeNav: NavItem;
    onNavChange: (id: NavItem) => void;
    setMobileMenuOpen: (open: boolean) => void;
}) {
    return (
        <>
            {/* Red accent stripe */}
            <div className="bg-primary absolute top-0 bottom-0 left-0 w-0.5" aria-hidden="true" />

            {/* Logo */}
            <div className="border-border flex items-center justify-between gap-2.5 border-b px-4 py-4 lg:py-3">
                <div className="flex items-center gap-2.5">
                    <GeometricMark size={20} />
                    <div className="flex flex-col">
                        <span className="text-foreground text-xs font-bold tracking-widest">
                            RedGrid
                        </span>
                    </div>
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
            <nav className="flex flex-1 flex-col py-2" aria-label="Sections">
                {NAV_GROUPS.map((group, gi) => (
                    <div key={group.label}>
                        {gi > 0 && <div className="bg-muted mx-4 my-2 h-px" aria-hidden="true" />}
                        <div className="text-muted-foreground px-4 pt-2 pb-1 text-sm font-semibold tracking-widest">
                            {group.label}
                        </div>
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
                                    aria-current={active ? "page" : undefined}
                                    className={cn(
                                        "flex w-full items-center justify-start gap-2.5 rounded-none px-4 py-1.5 text-left text-xs tracking-tighter uppercase",
                                        "border-l-2 transition-colors duration-100",
                                        active
                                            ? "border-primary bg-muted text-foreground"
                                            : "text-muted-foreground hover:text-muted-foreground border-transparent hover:bg-transparent",
                                    )}
                                >
                                    <Icon className="size-3.5" aria-hidden="true" />
                                    {item.label}
                                </Button>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Ctrl+K hint */}
            <div className="border-border flex items-center gap-2 border-t px-4 py-3">
                <kbd className="border-border bg-card text-muted-foreground rounded-sm border px-1 py-px text-sm">
                    ⌘K
                </kbd>
                <span className="text-muted-foreground text-xs tracking-normal sm:text-sm">
                    COMMAND PALETTE
                </span>
            </div>
        </>
    );
}
