import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaletteItem {
    id: string;
    label: string;
    sub: string;
    category: "MISSION" | "FINDING" | "SPECIALIST" | "ACTION" | "NAV" | "SETTING";
    kbd?: string;
}

interface CategoryStyle {
    color: string;
    bg: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const ALL_ITEMS: PaletteItem[] = [
    {
        id: "go-dashboard",
        label: "Dashboard",
        sub: "Go to command center",
        category: "NAV",
        kbd: "G D",
    },
    {
        id: "go-missions",
        label: "Missions",
        sub: "Go to missions list",
        category: "NAV",
        kbd: "G M",
    },
    { id: "go-benchmarks", label: "Benchmarks", sub: "Go to benchmark results", category: "NAV" },
    { id: "go-reports", label: "Reports", sub: "Go to generated reports", category: "NAV" },
    { id: "go-audit", label: "Audit Log", sub: "View system audit events", category: "NAV" },
    {
        id: "go-settings",
        label: "Settings",
        sub: "Open system settings",
        category: "NAV",
        kbd: "G S",
    },
    { id: "m-cve001", label: "CVE-001", sub: "app.targetcorp.com · ACTIVE", category: "MISSION" },
    {
        id: "m-bench014",
        label: "BENCH-014",
        sub: "CVE-BENCH v2 Full · COMPLETE",
        category: "MISSION",
    },
    {
        id: "m-bench013",
        label: "BENCH-013",
        sub: "PrediQL Reasoning · COMPLETE",
        category: "MISSION",
    },
    {
        id: "f-001",
        label: "F-001 SQL INJECTION",
        sub: "/api/users?id= · CRITICAL",
        category: "FINDING",
    },
    { id: "f-002", label: "F-002 AUTH BYPASS", sub: "/api/auth/login · HIGH", category: "FINDING" },
    { id: "f-003", label: "F-003 IDOR", sub: "/api/users/:id · HIGH", category: "FINDING" },
    {
        id: "s-inject",
        label: "INJECT-SPEC",
        sub: "RUNNING · sqli_blind_time()",
        category: "SPECIALIST",
    },
    { id: "s-auth", label: "AUTH-SPEC", sub: "COMPLETED · exploit_auth()", category: "SPECIALIST" },
    {
        id: "s-recon",
        label: "RECON-SPEC",
        sub: "COMPLETED · recon_target()",
        category: "SPECIALIST",
    },
    {
        id: "act-new",
        label: "New Mission",
        sub: "Start a new VAPT mission",
        category: "ACTION",
        kbd: "N",
    },
    {
        id: "act-pause",
        label: "Pause Mission",
        sub: "Pause active mission agents",
        category: "ACTION",
    },
    {
        id: "act-escalate",
        label: "Human Escalation",
        sub: "Open escalation panel",
        category: "ACTION",
    },
    {
        id: "act-report",
        label: "Generate Report",
        sub: "Generate mission report",
        category: "ACTION",
    },
    { id: "set-roe", label: "ROE Defaults", sub: "Edit rules of engagement", category: "SETTING" },
    {
        id: "set-models",
        label: "Model Settings",
        sub: "Configure LLM assignments",
        category: "SETTING",
    },
];

const CAT_STYLE: Record<PaletteItem["category"], CategoryStyle> = {
    NAV: { color: "var(--color-hex-a0a0a0)", bg: "var(--color-hex-111111)" },
    MISSION: { color: "var(--color-hex-e31b23)", bg: "var(--color-hex-120608)" },
    FINDING: { color: "var(--color-hex-ff2a32)", bg: "var(--color-hex-1a0608)" },
    SPECIALIST: { color: "var(--color-hex-d29922)", bg: "var(--color-hex-110e00)" },
    ACTION: { color: "var(--color-hex-3fb950)", bg: "var(--color-hex-061a0c)" },
    SETTING: { color: "var(--color-hex-555555)", bg: "var(--color-hex-111111)" },
};

const HELP_KEYS = [
    { k: "↑↓", v: "navigate" },
    { k: "↵", v: "open" },
    { k: "ESC", v: "close" },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CommandPaletteProps {
    onClose: () => void;
    onNavigate: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CommandPalette({ onClose, onNavigate }: CommandPaletteProps) {
    const [query, setQuery] = useState("");
    const [cursor, setCursor] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const filtered = query.trim()
        ? ALL_ITEMS.filter(
              (i) =>
                  i.label.toLowerCase().includes(query.toLowerCase()) ||
                  i.sub.toLowerCase().includes(query.toLowerCase()) ||
                  i.category.includes(query.toUpperCase()),
          )
        : ALL_ITEMS;

    // Focus input on mount.
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function updateQuery(value: string) {
        setQuery(value);
        setCursor(0);
    }

    const handleKey = useCallback(
        (e: React.KeyboardEvent) => {
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setCursor((c) => Math.min(c + 1, filtered.length - 1));
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setCursor((c) => Math.max(c - 1, 0));
                    break;
                case "Enter":
                    if (filtered[cursor]) {
                        onNavigate(filtered[cursor].id);
                        onClose();
                    }
                    break;
                case "Escape":
                    onClose();
                    break;
            }
        },
        [filtered, cursor, onNavigate, onClose],
    );

    // Scroll highlighted item into view.
    useEffect(() => {
        const el = listRef.current?.children[cursor] as HTMLElement | undefined;
        el?.scrollIntoView({ block: "nearest" });
    }, [cursor]);

    // Group visible items by category (preserving order of first appearance).
    const cats = Array.from(new Set(filtered.map((i) => i.category)));

    return (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center bg-[var(--color-hex-00000099)] pt-[120px]"
            onClick={onClose}
            role="presentation"
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Command palette"
                className="w-[600px] overflow-hidden rounded-[3px] border border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)]"
                style={{ boxShadow: "0 24px 48px var(--color-hex-000000cc)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search input */}
                <div className="flex h-[48px] items-center gap-3 border-b border-[var(--color-hex-1e1e1e)] px-4">
                    <span className="text-[14px] text-[var(--color-hex-333333)]" aria-hidden="true">
                        ⌘
                    </span>
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => updateQuery(e.target.value)}
                        onKeyDown={handleKey}
                        placeholder="Search missions, findings, actions…"
                        aria-label="Search command palette"
                        aria-autocomplete="list"
                        className="flex-1 border-none bg-transparent text-[12px] tracking-[0.04em] text-[var(--color-hex-f2f2f2)] outline-none"
                    />
                    {query && (
                        <button
                            onClick={() => updateQuery("")}
                            aria-label="Clear search"
                            className="cursor-pointer border-none bg-transparent text-[12px] text-[var(--color-hex-333333)] transition-colors duration-100 hover:text-[var(--color-hex-666666)]"
                        >
                            ✕
                        </button>
                    )}
                    <kbd className="rounded-[2px] border border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[6px] py-[2px] text-[8px] text-[var(--color-hex-333333)]">
                        ESC
                    </kbd>
                </div>

                {/* Results list */}
                <div ref={listRef} className="max-h-[420px] overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <div
                                className="mb-[8px] text-[20px] text-[var(--color-hex-1e1e1e)]"
                                aria-hidden="true"
                            >
                                ◇
                            </div>
                            <div className="text-[10px] tracking-[0.14em] text-[var(--color-hex-333333)]">
                                NO RESULTS
                            </div>
                        </div>
                    ) : (
                        cats.map((cat) => (
                            <div key={cat}>
                                {/* Category header */}
                                <div className="border-t border-[var(--color-hex-111111)] bg-[var(--color-hex-0a0a0a)] px-[16px] py-[6px] pb-[3px] text-[7.5px] tracking-[0.2em] text-[var(--color-hex-333333)]">
                                    {cat}
                                </div>

                                {/* Items */}
                                {filtered
                                    .filter((i) => i.category === cat)
                                    .map((item) => {
                                        const idx = filtered.indexOf(item);
                                        const cc = CAT_STYLE[item.category];
                                        const active = idx === cursor;
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => {
                                                    onNavigate(item.id);
                                                    onClose();
                                                }}
                                                onMouseEnter={() => setCursor(idx)}
                                                role="option"
                                                aria-selected={active}
                                                className={[
                                                    "flex cursor-pointer items-center gap-3 border-l-2 px-[16px] py-[9px] transition-colors duration-75",
                                                    active
                                                        ? "border-[var(--color-hex-e31b23)] bg-[var(--color-hex-141414)]"
                                                        : "border-transparent",
                                                ].join(" ")}
                                            >
                                                {/* Category badge */}
                                                <span
                                                    className="shrink-0 rounded-[2px] px-[6px] py-[1px] text-[9px] font-semibold tracking-[0.1em]"
                                                    style={{
                                                        color: cc.color,
                                                        background: cc.bg,
                                                        border: `1px solid ${cc.color}33`,
                                                    }}
                                                >
                                                    {item.category}
                                                </span>

                                                {/* Label + sub */}
                                                <div className="min-w-0 flex-1">
                                                    <div
                                                        className="overflow-hidden text-[10.5px] tracking-[0.04em] text-ellipsis whitespace-nowrap"
                                                        style={{
                                                            color: active
                                                                ? "var(--color-hex-f2f2f2)"
                                                                : "var(--color-hex-a0a0a0)",
                                                            fontWeight: active ? 700 : 400,
                                                        }}
                                                    >
                                                        {item.label}
                                                    </div>
                                                    <div className="mt-[1px] overflow-hidden text-[8.5px] tracking-[0.04em] text-ellipsis whitespace-nowrap text-[var(--color-hex-444444)]">
                                                        {item.sub}
                                                    </div>
                                                </div>

                                                {/* Keyboard shortcut */}
                                                {item.kbd && (
                                                    <kbd className="shrink-0 rounded-[2px] border border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[6px] py-[2px] text-[8px] text-[var(--color-hex-333333)]">
                                                        {item.kbd}
                                                    </kbd>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-[var(--color-hex-141414)] bg-[var(--color-hex-0a0a0a)] px-4 py-2">
                    <div className="flex items-center gap-4">
                        {HELP_KEYS.map((h) => (
                            <div key={h.k} className="flex items-center gap-1">
                                <kbd className="rounded-[2px] border border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[5px] py-[1px] text-[7.5px] text-[var(--color-hex-333333)]">
                                    {h.k}
                                </kbd>
                                <span className="text-[7.5px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                    {h.v}
                                </span>
                            </div>
                        ))}
                    </div>
                    <span className="text-[7.5px] tracking-[0.12em] text-[var(--color-hex-222222)]">
                        {filtered.length} RESULTS
                    </span>
                </div>
            </div>
        </div>
    );
}
