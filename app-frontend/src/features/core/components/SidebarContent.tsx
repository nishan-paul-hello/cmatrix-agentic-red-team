import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
    Power,
    Search,
    Settings,
    Target,
    Wrench,
    X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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
    const router = useRouter();

    return (
        <>
            {/* Logo and Top Actions */}
            <div
                className={cn(
                    "border-border flex h-14 shrink-0 items-center border-b",
                    isCollapsed ? "justify-center px-2" : "justify-between px-4",
                )}
            >
                {/* Logo Area (Interactive when collapsed) */}
                {isCollapsed ? (
                    <button
                        type="button"
                        className="group hover:bg-muted focus-visible:ring-ring relative flex h-8 w-8 cursor-pointer items-center justify-center rounded-md focus-visible:ring-1 focus-visible:outline-none"
                        onClick={toggleCollapse}
                        title="Expand Sidebar"
                        aria-label="Expand Sidebar"
                    >
                        <div className="flex items-center transition-opacity duration-200 group-hover:opacity-0">
                            <Image
                                src="/logo-brand.svg"
                                alt="Logo"
                                width={20}
                                height={20}
                                className="h-5 w-5"
                            />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <ChevronRight className="text-muted-foreground size-5" />
                        </div>
                    </button>
                ) : (
                    <Link href="/" className="group flex items-center gap-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
                        <Image
                            src="/logo-brand.svg"
                            alt="Logo"
                            width={20}
                            height={20}
                            className="h-5 w-5"
                        />
                        <span className="text-foreground transition-colors group-hover:text-red-500 text-base font-bold tracking-wide">
                            RedGrid
                        </span>
                    </Link>
                )}

                {/* Desktop top actions (Search & Collapse) */}
                {!isCollapsed && (
                    <div className="hidden items-center gap-1 lg:flex">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground h-6 w-6"
                            title="Command Palette (⌘K)"
                            onClick={onOpenCommandPalette}
                        >
                            <Search className="size-3.5" />
                        </Button>
                        {toggleCollapse && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleCollapse}
                                className="text-muted-foreground/70 hover:bg-muted/50 hover:text-foreground h-6 w-6"
                                title="Collapse Sidebar"
                            >
                                <ChevronLeft className="size-3.5" />
                            </Button>
                        )}
                    </div>
                )}

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
                        <div className="border-border bg-popover absolute bottom-full left-2 z-50 mb-1 flex w-max min-w-52 flex-col rounded-md border shadow-md">
                            <div className="flex flex-col px-3 py-3">
                                <span className="text-foreground text-sm leading-none font-medium">
                                    Nishan Paul
                                </span>
                                <span className="text-muted-foreground mt-1.5 text-xs">
                                    nishan.paul@example.com
                                </span>
                            </div>
                            <div className="bg-border h-px w-full" />
                            <div className="p-1">
                                <Button
                                    variant="ghost"
                                    className="text-destructive hover:bg-destructive/10 hover:text-destructive h-auto w-full justify-start gap-2 rounded-sm px-2 py-1.5 text-sm"
                                    onClick={() => {
                                        setShowLogoutMenu(false);
                                        document.cookie = "auth=; max-age=0; path=/";
                                        router.push("/");
                                        router.refresh();
                                    }}
                                >
                                    <Power className="size-4" />
                                    Log out
                                </Button>
                            </div>
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
                            </div>
                        )}
                    </Button>
                </div>
            </div>
        </>
    );
}
