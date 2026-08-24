export type ActivityEntry = {
    id: number;
    ts: string;
    agent: string;
    action: string;
    desc: string;
    color: string;
};

export const INITIAL_ACTIVITY: ActivityEntry[] = [
    {
        id: 1,
        ts: "14:22:07",
        agent: "RECON-SPEC",
        action: "TOOL_CALL",
        desc: "nmap -sV -p 1-1024 app.targetcorp.com",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 2,
        ts: "14:22:05",
        agent: "TEAM-MGR",
        action: "UCB_SELECT",
        desc: "SQLI-007 selected, UCB=0.824, path=0.612",
        color: "var(--color-hex-e31b23)",
    },
    {
        id: 3,
        ts: "14:21:59",
        agent: "EVAL-AGENT",
        action: "E_ORD_UPDATE",
        desc: "AUTH-003 evidence raised to E_ord 4 (CONFIRMED)",
        color: "var(--color-hex-3fb950)",
    },
    {
        id: 4,
        ts: "14:21:54",
        agent: "SQLI-SPEC",
        action: "EXPLOIT_ATTEMPT",
        desc: "Injecting into /api/users?id= parameter",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 5,
        ts: "14:21:48",
        agent: "VALID-AGENT",
        action: "ORACLE_TEST",
        desc: "CVE-BENCH oracle invoked for SQLI-004",
        color: "var(--color-hex-d29922)",
    },
    {
        id: 6,
        ts: "14:21:41",
        agent: "TEAM-MGR",
        action: "EL_SNAPSHOT",
        desc: "Environmental Layer snapshot: 87 facts",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 7,
        ts: "14:21:38",
        agent: "RECON-SPEC",
        action: "CREDENTIAL_FOUND",
        desc: "Credential extracted: admin@targetcorp.com",
        color: "var(--color-hex-3fb950)",
    },
    {
        id: 8,
        ts: "14:21:30",
        agent: "VALID-AGENT",
        action: "VALIDATED",
        desc: "SQLI-004 ORACLE CONFIRMED — severity CRITICAL",
        color: "var(--color-hex-ff2a32)",
    },
    {
        id: 9,
        ts: "14:21:22",
        agent: "EXEC-AGENT",
        action: "TOOL_RESULT",
        desc: "sqlmap completed: 3 injectable endpoints found",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 10,
        ts: "14:21:14",
        agent: "TEAM-MGR",
        action: "COMPACTION",
        desc: "Context at 81% — scheduling FULLCOMPACT",
        color: "var(--color-hex-d29922)",
    },
    {
        id: 11,
        ts: "14:21:08",
        agent: "SQLI-SPEC",
        action: "SPAWN",
        desc: "Specialist spawned, FRESH context, node SQLI-007",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 12,
        ts: "14:20:59",
        agent: "TEAM-MGR",
        action: "PATH_SCORE",
        desc: "Path RECON→AUTH→SQLI→DB-ACCESS scored 0.61",
        color: "var(--color-hex-a0a0a0)",
    },
];

export const NEW_EVENTS: Omit<ActivityEntry, "id">[] = [
    {
        ts: "14:22:11",
        agent: "SQLI-SPEC",
        action: "PAYLOAD_SENT",
        desc: "Time-based blind injection payload dispatched",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        ts: "14:22:14",
        agent: "EVAL-AGENT",
        action: "RESPONSE_PARSE",
        desc: "Response delta 4.2s — timing confirmed",
        color: "var(--color-hex-3fb950)",
    },
    {
        ts: "14:22:17",
        agent: "TEAM-MGR",
        action: "UCB_UPDATE",
        desc: "SQLI-007 UCB updated to 0.891 post-evidence",
        color: "var(--color-hex-e31b23)",
    },
];

export const KPI_ITEMS = [
    { label: "ACTIVE MISSIONS", value: "03", red: true },
    { label: "COMPLETED MISSIONS", value: "128", red: false },
    { label: "VALIDATED FINDINGS", value: "421", red: true },
    { label: "VDG NODES", value: "8,492", red: false },
    { label: "SUCCESS RATE", value: "27.4%", red: false },
    { label: "TOTAL COST", value: "$184.22", red: true },
] as const;

export const TABLE_HEADERS = [
    "MISSION",
    "TARGET",
    "SURFACE",
    "MODE",
    "STATUS",
    "NODES",
    "FINDINGS",
    "COST",
    "WORKERS",
] as const;
