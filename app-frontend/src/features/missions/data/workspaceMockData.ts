import {
    SPEC_STATUS,
    VDG_NODE_STATUS,
    type Specialist,
    type VdgNodeStatus,
} from "@/types/domain-types";

/* ── Types ─────────────────────────────────────────────── */
export type MissionSubNav =
    | "overview"
    | "attack-graph"
    | "environment"
    | "specialists"
    | "execution"
    | "evaluation"
    | "findings"
    | "validation"
    | "memory"
    | "trajectory"
    | "cost"
    | "team-manager"
    | "escalation";

export interface VDGNode {
    id: string;
    type: string;
    status: VdgNodeStatus;
    ucb?: number;
    eord?: number;
    eordMax?: number;
    x: number;
    y: number;
}
export interface LogEntry {
    id: number;
    ts: string;
    agent: string;
    action: string;
    desc: string;
    color: string;
}

/* ── Static data ────────────────────────────────────────── */
export const VDG_NODES: VDGNode[] = [
    {
        id: "RECON-001",
        type: "RECONNAISSANCE",
        status: VDG_NODE_STATUS.COMPLETED,
        x: 0,
        y: 0,
    },
    {
        id: "AUTH-001",
        type: "AUTHENTICATION",
        status: VDG_NODE_STATUS.EXPLOITED,
        x: 0,
        y: 1,
    },
    {
        id: "SQLI-001",
        type: "SQL INJECTION",
        status: VDG_NODE_STATUS.ELIGIBLE,
        ucb: 0.824,
        eord: 3,
        eordMax: 5,
        x: 0,
        y: 2,
    },
    {
        id: "DB-ACCESS-002",
        type: "DATABASE ACCESS",
        status: VDG_NODE_STATUS.DEPENDENT,
        x: 0,
        y: 3,
    },
];
export const SPECIALISTS: Specialist[] = [
    {
        id: "S-01",
        role: "RECON SPECIALIST",
        status: SPEC_STATUS.COMPLETED,
        task: "recon_target()",
        context: "COMPACTED",
        evidence: 34,
        node: "RECON-001",
        failures: 0,
        skills: 3,
    },
    {
        id: "S-02",
        role: "AUTH SPECIALIST",
        status: SPEC_STATUS.COMPLETED,
        task: "exploit_auth()",
        context: "COMPACTED",
        evidence: 12,
        node: "AUTH-001",
        failures: 0,
        skills: 4,
    },
    {
        id: "S-03",
        role: "INJECTION SPECIALIST",
        status: SPEC_STATUS.RUNNING,
        task: "sqli_blind_time()",
        context: "FRESH",
        evidence: 7,
        node: "SQLI-001",
        failures: 1,
        skills: 2,
    },
    {
        id: "S-04",
        role: "VALIDATION AGENT",
        status: SPEC_STATUS.VALIDATING,
        task: "oracle_test(AUTH-001)",
        context: "FRESH",
        evidence: 4,
        node: "SQLI-001",
        failures: 0,
        skills: 1,
    },
    {
        id: "S-05",
        role: "LOGIC SPECIALIST",
        status: SPEC_STATUS.IDLE,
        task: "—",
        context: "—",
        evidence: 0,
        node: "—",
        failures: 0,
        skills: 1,
    },
];
export const INITIAL_LOG: LogEntry[] = [
    {
        id: 12,
        ts: "06:31:04",
        agent: "TEAM-MGR",
        action: "UCB_SELECT",
        desc: "SQLI-001 selected — UCB 0.824, path 0.612, E_ord 3/5",
        color: "var(--color-hex-e31b23)",
    },
    {
        id: 11,
        ts: "06:30:58",
        agent: "INJECT-SPEC",
        action: "TOOL_CALL",
        desc: "sqlmap --time-sec=4 --technique=T -u /api/users",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 10,
        ts: "06:30:51",
        agent: "VALID-AGENT",
        action: "ORACLE_PASS",
        desc: "AUTH-001 oracle confirmed — CVE-BENCH PASS",
        color: "var(--color-hex-3fb950)",
    },
    {
        id: 9,
        ts: "06:30:44",
        agent: "EVAL-AGENT",
        action: "E_ORD_UPDATE",
        desc: "AUTH-001 evidence raised E_ord 3 → 4 (CONFIRMED)",
        color: "var(--color-hex-3fb950)",
    },
    {
        id: 8,
        ts: "06:30:39",
        agent: "INJECT-SPEC",
        action: "PAYLOAD_SENT",
        desc: "Time-based blind payload dispatched — 4.2s delta observed",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 7,
        ts: "06:30:31",
        agent: "TEAM-MGR",
        action: "EL_SNAPSHOT",
        desc: "Environmental Layer snapshot: 87 confirmed facts",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 6,
        ts: "06:30:22",
        agent: "AUTH-SPEC",
        action: "CREDENTIAL_FOUND",
        desc: "admin@targetcorp.com extracted from /api/auth",
        color: "var(--color-hex-3fb950)",
    },
    {
        id: 5,
        ts: "06:30:14",
        agent: "TEAM-MGR",
        action: "PATH_SCORE",
        desc: "RECON→AUTH→SQLI→DB-ACCESS path scored 0.612",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 4,
        ts: "06:30:07",
        agent: "INJECT-SPEC",
        action: "SPAWN",
        desc: "INJECTION SPECIALIST spawned — FRESH context, node SQLI-001",
        color: "var(--color-hex-666666)",
    },
    {
        id: 3,
        ts: "06:29:58",
        agent: "EVAL-AGENT",
        action: "E_ORD_UPDATE",
        desc: "AUTH-001 evidence raised E_ord 2 → 3 (WEAK → CLEAR)",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 2,
        ts: "06:29:49",
        agent: "AUTH-SPEC",
        action: "EXPLOIT_ATTEMPT",
        desc: "Credential stuffing /api/login — 200 OK, session token returned",
        color: "var(--color-hex-a0a0a0)",
    },
    {
        id: 1,
        ts: "06:29:40",
        agent: "RECON-SPEC",
        action: "TOOL_RESULT",
        desc: "nmap complete: 3 open ports, 14 endpoints enumerated",
        color: "var(--color-hex-666666)",
    },
];
export const SUB_NAV: {
    id: MissionSubNav;
    label: string;
}[] = [
    {
        id: "overview",
        label: "Overview",
    },
    {
        id: "attack-graph",
        label: "Attack Graph",
    },
    {
        id: "environment",
        label: "Environment",
    },
    {
        id: "specialists",
        label: "Specialists",
    },
    {
        id: "execution",
        label: "Execution",
    },
    {
        id: "evaluation",
        label: "Evaluation",
    },
    {
        id: "findings",
        label: "Findings",
    },
    {
        id: "validation",
        label: "Validation",
    },
    {
        id: "memory",
        label: "Memory",
    },
    {
        id: "trajectory",
        label: "Trajectory",
    },
    {
        id: "cost",
        label: "Cost",
    },
    {
        id: "team-manager",
        label: "Team Manager",
    },
    {
        id: "escalation",
        label: "Escalation",
    },
];
export const STREAM_EVENTS: Omit<LogEntry, "id">[] = [
    {
        ts: "06:31:09",
        agent: "INJECT-SPEC",
        action: "RESPONSE_PARSE",
        desc: "Response time 4.18s — timing injection confirmed",
        color: "var(--color-hex-3fb950)",
    },
    {
        ts: "06:31:14",
        agent: "TEAM-MGR",
        action: "UCB_UPDATE",
        desc: "SQLI-001 UCB raised to 0.891 post-evidence",
        color: "var(--color-hex-e31b23)",
    },
    {
        ts: "06:31:19",
        agent: "EVAL-AGENT",
        action: "E_ORD_UPDATE",
        desc: "SQLI-001 evidence raised E_ord 3 → 4 (CONFIRMED)",
        color: "var(--color-hex-3fb950)",
    },
];

/* ── Node status styles ─────────────────────────────────── */

/* ── Specialist status badge ────────────────────────────── */

/* ── Elapsed timer ──────────────────────────────────────── */

/* ── Main component ─────────────────────────────────────── */

/* ── Tiny helpers ───────────────────────────────────────── */
