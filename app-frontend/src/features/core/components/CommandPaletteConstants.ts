export interface PaletteItem {
    id: string;
    label: string;
    sub: string;
    category: "MISSION" | "FINDING" | "SPECIALIST" | "ACTION" | "NAV" | "SETTING";
    kbd?: string;
}

export interface CategoryStyle {
    color: string;
    bg: string;
}

export const ALL_ITEMS: PaletteItem[] = [
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

export const CAT_STYLE: Record<PaletteItem["category"], CategoryStyle> = {
    NAV: { color: "var(--color-hex-a0a0a0)", bg: "var(--color-hex-111111)" },
    MISSION: { color: "var(--color-hex-e31b23)", bg: "var(--color-hex-120608)" },
    FINDING: { color: "var(--color-hex-ff2a32)", bg: "var(--color-hex-1a0608)" },
    SPECIALIST: { color: "var(--color-hex-d29922)", bg: "var(--color-hex-110e00)" },
    ACTION: { color: "var(--color-hex-3fb950)", bg: "var(--color-hex-061a0c)" },
    SETTING: { color: "var(--color-hex-555555)", bg: "var(--color-hex-111111)" },
};

export const HELP_KEYS = [
    { k: "↑↓", v: "navigate" },
    { k: "↵", v: "open" },
    { k: "ESC", v: "close" },
];
