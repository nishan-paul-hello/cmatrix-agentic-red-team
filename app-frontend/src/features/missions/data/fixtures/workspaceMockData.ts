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
        // COMPLETED is not an architecture concept — maps to EXPLOITED (terminal success, §7.1)
        status: VDG_NODE_STATUS.EXPLOITED,
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
        // DEPENDENT is not an architecture concept — prerequisites unmet → INFEASIBLE per §7.3 step 4
        status: VDG_NODE_STATUS.INFEASIBLE,
        x: 0,
        y: 3,
    },
    {
        // BLOCKED status — required for A4 ablation visualization (§13.1). Status propagates when
        // a prerequisite node is marked INFEASIBLE and the dependent path is cut off.
        id: "XSS-002",
        type: "CROSS-SITE SCRIPT",
        status: VDG_NODE_STATUS.BLOCKED,
        ucb: 0.512,
        eord: 2,
        eordMax: 5,
        x: 1,
        y: 2,
    },
    {
        // DEPRIORITIZED status — required for architecture §7.1 completeness.
        // UCB score dropped below threshold after path-score re-evaluation.
        id: "SSTI-003",
        type: "SERVER-SIDE TMPL",
        status: VDG_NODE_STATUS.DEPRIORITIZED,
        ucb: 0.21,
        eord: 1,
        eordMax: 5,
        x: 1,
        y: 3,
    },
];
/** Layer-3 Specialists roster for mission CVE-001 (WEB surface) */
export const SPECIALISTS: Specialist[] = [
    {
        id: "S-01",
        role: "RECON SPECIALIST",
        layer: 3,
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
        layer: 3,
        status: SPEC_STATUS.COMPLETED,
        task: "exploit_auth()",
        context: "COMPACTED",
        evidence: 12,
        node: "AUTH-001",
        failures: 0,
        skills: 4,
    },
    {
        // SQLi Specialist — §9.2: baseline→SLEEP probe→bit-extraction FSM
        id: "S-03a",
        role: "SQLI SPECIALIST",
        layer: 3,
        status: SPEC_STATUS.RUNNING,
        task: "sqli_blind_time()",
        context: "FRESH",
        evidence: 7,
        node: "SQLI-001",
        failures: 1,
        skills: 2,
    },
    {
        // XSS Specialist — §9.3: 5-phase canary→context→mutation→verify→webhook pipeline
        id: "S-03b",
        role: "XSS SPECIALIST",
        layer: 3,
        status: SPEC_STATUS.WAITING,
        task: "xss_phase3_mutation()",
        context: "FRESH",
        evidence: 3,
        node: "XSS-002",
        failures: 0,
        skills: 2,
        phase: 3,
        phaseTotal: 5,
    },
    {
        id: "S-05",
        role: "LOGIC SPECIALIST",
        layer: 3,
        status: SPEC_STATUS.IDLE,
        task: "—",
        context: "—",
        evidence: 0,
        node: "—",
        failures: 0,
        skills: 1,
    },
    {
        // VALIDATION AGENT — Layer 4 per §8.4. Structurally separate from Layer-3 specialists.
        // Runs Diagnosis-Adapt-Cap retry loop (≤3 retries) on oracle confirmation.
        id: "S-04",
        role: "VALIDATION AGENT",
        layer: 4,
        status: SPEC_STATUS.VALIDATING,
        task: "oracle_test(AUTH-001)",
        context: "FRESH",
        evidence: 4,
        node: "AUTH-001",
        failures: 0,
        skills: 1,
    },
];

/**
 * Second mock mission (GRAPHQL surface) specialist fixture.
 * Ensures all 6 named Layer-3 specialists (§8, §9) exist somewhere in the mockup:
 * Recon, SQLi, XSS, GraphQL, Auth/Session, Lateral-Movement.
 */
export const GRAPHQL_MISSION_SPECIALISTS: Specialist[] = [
    {
        id: "GM-01",
        role: "RECON SPECIALIST",
        layer: 3,
        status: SPEC_STATUS.COMPLETED,
        task: "graphql_introspect()",
        context: "COMPACTED",
        evidence: 28,
        node: "SCHEMA-001",
        failures: 0,
        skills: 3,
    },
    {
        // GraphQL Specialist — §9.4: schema-coverage + batching attack pipeline
        id: "GM-02",
        role: "GRAPHQL SPECIALIST",
        layer: 3,
        status: SPEC_STATUS.RUNNING,
        task: "gql_nested_query_abuse()",
        context: "FRESH",
        evidence: 11,
        node: "GQL-IDOR-003",
        failures: 0,
        skills: 4,
    },
    {
        id: "GM-03",
        role: "AUTH SPECIALIST",
        layer: 3,
        status: SPEC_STATUS.IDLE,
        task: "—",
        context: "—",
        evidence: 0,
        node: "—",
        failures: 0,
        skills: 2,
    },
    {
        id: "GM-04",
        role: "VALIDATION AGENT",
        layer: 4,
        status: SPEC_STATUS.IDLE,
        task: "—",
        context: "—",
        evidence: 0,
        node: "—",
        failures: 0,
        skills: 1,
    },
];

/**
 * Third mock mission (MULTI-HOST surface) specialist fixture.
 * Adds Lateral-Movement Specialist to complete the §9 roster.
 */
export const MULTIHOST_MISSION_SPECIALISTS: Specialist[] = [
    {
        id: "MH-01",
        role: "RECON SPECIALIST",
        layer: 3,
        status: SPEC_STATUS.COMPLETED,
        task: "nmap_topology_scan()",
        context: "COMPACTED",
        evidence: 42,
        node: "HOST-001",
        failures: 0,
        skills: 3,
    },
    {
        // Lateral-Movement Specialist — §9.6
        id: "MH-02",
        role: "LATERAL-MOVEMENT SPECIALIST",
        layer: 3,
        status: SPEC_STATUS.RUNNING,
        task: "pivot_credential_reuse()",
        context: "FRESH",
        evidence: 14,
        node: "HOST-003",
        failures: 1,
        skills: 3,
    },
    {
        id: "MH-03",
        role: "AUTH SPECIALIST",
        layer: 3,
        status: SPEC_STATUS.COMPLETED,
        task: "privesc_sudo_abuse()",
        context: "COMPACTED",
        evidence: 18,
        node: "HOST-002",
        failures: 0,
        skills: 2,
    },
    {
        id: "MH-04",
        role: "VALIDATION AGENT",
        layer: 4,
        status: SPEC_STATUS.VALIDATING,
        task: "oracle_test(HOST-003)",
        context: "FRESH",
        evidence: 6,
        node: "HOST-003",
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
        color: "var(--color-brand)",
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
        color: "var(--color-success)",
    },
    {
        id: 9,
        ts: "06:30:44",
        agent: "EVAL-AGENT",
        action: "E_ORD_UPDATE",
        desc: "AUTH-001 evidence raised E_ord 3 → 4 (CONFIRMED)",
        color: "var(--color-success)",
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
        color: "var(--color-success)",
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
        color: "var(--color-success)",
    },
    {
        ts: "06:31:14",
        agent: "TEAM-MGR",
        action: "UCB_UPDATE",
        desc: "SQLI-001 UCB raised to 0.891 post-evidence",
        color: "var(--color-brand)",
    },
    {
        ts: "06:31:19",
        agent: "EVAL-AGENT",
        action: "E_ORD_UPDATE",
        desc: "SQLI-001 evidence raised E_ord 3 → 4 (CONFIRMED)",
        color: "var(--color-success)",
    },
];

/* ── Node status styles ─────────────────────────────────── */

/* ── Specialist status badge ────────────────────────────── */

/* ── Elapsed timer ──────────────────────────────────────── */

/* ── Main component ─────────────────────────────────────── */

/* ── Tiny helpers ───────────────────────────────────────── */
