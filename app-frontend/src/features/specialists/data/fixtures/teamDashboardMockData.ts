import { SPEC_STATUS } from "@/types/domain-types";

export interface VDGEntry {
    id: string;
    type: string;
    status: "ELIGIBLE" | "IN_PROGRESS" | "EXPLOITED" | "BLOCKED" | "DEPRIORITIZED";
    ucb: number;
    exploit: number;
    explore: number;
    visits: number;
    eord: number;
    cost: string;
    specialist: string | null;
}

export const VDG: VDGEntry[] = [
    {
        id: "SQLI-001",
        type: "SQL INJECTION",
        status: "IN_PROGRESS",
        ucb: 0.891,
        exploit: 0.712,
        explore: 0.179,
        visits: 4,
        eord: 4,
        cost: "$0.084",
        specialist: "INJECT-SPEC",
    },
    {
        id: "AUTH-001",
        type: "AUTH BYPASS",
        status: "EXPLOITED",
        ucb: 0.0,
        exploit: 0.91,
        explore: 0.0,
        visits: 9,
        eord: 5,
        cost: "$0.054",
        specialist: null,
    },
    {
        id: "IDOR-008",
        type: "ACCESS CONTROL",
        status: "EXPLOITED",
        ucb: 0.0,
        exploit: 0.78,
        explore: 0.0,
        visits: 3,
        eord: 4,
        cost: "$0.019",
        specialist: null,
    },
    {
        id: "DB-ACCESS-002",
        type: "DATABASE ACCESS",
        status: "ELIGIBLE",
        ucb: 0.762,
        exploit: 0.68,
        explore: 0.082,
        visits: 0,
        eord: 0,
        cost: "—",
        specialist: null,
    },
    {
        id: "RCE-007",
        type: "REMOTE CODE EXEC",
        status: "ELIGIBLE",
        ucb: 0.721,
        exploit: 0.64,
        explore: 0.081,
        visits: 0,
        eord: 0,
        cost: "—",
        specialist: null,
    },
    {
        id: "XSS-002",
        type: "CROSS SITE SCRIPTING",
        status: "ELIGIBLE",
        ucb: 0.644,
        exploit: 0.52,
        explore: 0.124,
        visits: 1,
        eord: 2,
        cost: "$0.008",
        specialist: null,
    },
    {
        id: "CSRF-003",
        type: "CSRF",
        status: "ELIGIBLE",
        ucb: 0.598,
        exploit: 0.49,
        explore: 0.108,
        visits: 1,
        eord: 2,
        cost: "$0.006",
        specialist: null,
    },
    {
        id: "PATH-005",
        type: "PATH TRAVERSAL",
        status: "DEPRIORITIZED",
        ucb: 0.312,
        exploit: 0.31,
        explore: 0.002,
        visits: 2,
        eord: 1,
        cost: "$0.004",
        specialist: null,
    },
    {
        id: "XXE-009",
        type: "XXE INJECTION",
        status: "BLOCKED",
        ucb: 0.0,
        exploit: 0.21,
        explore: 0.0,
        visits: 0,
        eord: 0,
        cost: "—",
        specialist: null,
    },
];

export const SPECIALISTS = [
    {
        id: "S-01",
        role: "RECON-SPEC",
        status: SPEC_STATUS.COMPLETED,
        task: "recon_target()",
        node: "RECON-001",
        score: 0.94,
        failures: 0,
        skills: 3,
        context: "COMPACTED",
        evidence: 34,
    },
    {
        id: "S-02",
        role: "AUTH-SPEC",
        status: SPEC_STATUS.COMPLETED,
        task: "exploit_auth()",
        node: "AUTH-001",
        score: 0.91,
        failures: 0,
        skills: 4,
        context: "COMPACTED",
        evidence: 12,
    },
    {
        id: "S-03",
        role: "INJECT-SPEC",
        status: SPEC_STATUS.RUNNING,
        task: "sqli_blind_time()",
        node: "SQLI-001",
        score: 0.891,
        failures: 1,
        skills: 2,
        context: "FRESH",
        evidence: 7,
    },
    {
        id: "S-04",
        role: "VALID-AGENT",
        status: SPEC_STATUS.WAITING,
        task: "oracle_test(AUTH-001)",
        node: "SQLI-001",
        score: 0.762,
        failures: 0,
        skills: 1,
        context: "FRESH",
        evidence: 4,
    },
    {
        id: "S-05",
        role: "NETWORK-SPEC",
        status: SPEC_STATUS.IDLE,
        task: "—",
        node: "—",
        score: 0.0,
        failures: 0,
        skills: 1,
        context: "—",
        evidence: 0,
    },
];

export const SCHED = [
    {
        step: "NEXT",
        node: "DB-ACCESS-002",
        ucb: 0.762,
        eta: "~2min",
        reason: "SQLI-001 EXPLOITED → dependency unlocked",
    },
    {
        step: "QUEUED",
        node: "RCE-007",
        ucb: 0.721,
        eta: "~5min",
        reason: "Depends on DB-ACCESS-002",
    },
    {
        step: "QUEUED",
        node: "XSS-002",
        ucb: 0.644,
        eta: "~7min",
        reason: "Parallel — no dependency",
    },
];

export function getTeamDashboardData(): Promise<{
    vdg: typeof VDG;
    specialists: typeof SPECIALISTS;
    sched: typeof SCHED;
}> {
    return Promise.resolve({ vdg: VDG, specialists: SPECIALISTS, sched: SCHED });
}

export type SpecialistEntry = (typeof SPECIALISTS)[0];
export type SchedEntry = (typeof SCHED)[0];
