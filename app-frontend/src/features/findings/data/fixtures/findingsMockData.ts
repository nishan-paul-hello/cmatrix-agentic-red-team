import { FINDING_STATUS, type Finding, type Severity } from "@/types/domain-types";

export type Tab = "OVERVIEW" | "EVIDENCE" | "ATTACK PATH" | "VALIDATION" | "TRAJECTORY";

export const DATA: Finding[] = [
    {
        id: "F-001",
        type: "SQL INJECTION",
        target: "/api/users?id=",
        severity: "CRITICAL",
        eord: 5,
        status: FINDING_STATUS.ORACLE_CONFIRMED,
        first: "06:29:58",
        validated: "06:30:42",
        path: ["RECON-001", "AUTH-001", "SQLI-001", "DB-ACCESS-002"],
    },
    {
        id: "F-002",
        type: "AUTHENTICATION BYPASS",
        target: "/api/auth/login",
        severity: "HIGH",
        eord: 4,
        status: FINDING_STATUS.ORACLE_CONFIRMED,
        first: "06:22:14",
        validated: "06:30:42",
        path: ["RECON-001", "AUTH-001"],
    },
    {
        id: "F-003",
        type: "IDOR",
        target: "/api/users/:id",
        severity: "HIGH",
        eord: 4,
        status: FINDING_STATUS.ORACLE_CONFIRMED,
        first: "06:25:33",
        validated: "06:31:01",
        path: ["RECON-001", "AUTH-001", "IDOR-008"],
    },
    {
        id: "F-004",
        type: "XSS REFLECTED",
        target: "/search?q=",
        severity: "MEDIUM",
        eord: 3,
        status: FINDING_STATUS.PENDING,
        first: "06:28:47",
        validated: "—",
        path: ["RECON-001", "XSS-002"],
    },
    {
        id: "F-005",
        type: "SENSITIVE DATA EXPOSURE",
        target: "/static/config.json",
        severity: "MEDIUM",
        eord: 4,
        status: FINDING_STATUS.VALIDATED,
        first: "06:16:07",
        validated: "06:28:11",
        path: ["RECON-001"],
    },
    {
        id: "F-006",
        type: "CSRF",
        target: "/api/users/:id",
        severity: "MEDIUM",
        eord: 2,
        status: FINDING_STATUS.PENDING,
        first: "06:29:44",
        validated: "—",
        path: ["RECON-001", "AUTH-001", "CSRF-003"],
    },
    {
        id: "F-007",
        type: "PATH TRAVERSAL",
        target: "/api/upload",
        severity: "LOW",
        eord: 3,
        status: FINDING_STATUS.PENDING,
        first: "06:30:11",
        validated: "—",
        path: ["RECON-001", "AUTH-001"],
    },
];
export const SEV_C: Record<
    Severity,
    {
        color: string;
        bg: string;
    }
> = {
    CRITICAL: {
        color: "var(--color-danger)",
        bg: "var(--color-hex-1a0608)",
    },
    HIGH: {
        color: "var(--color-brand)",
        bg: "var(--color-hex-150608)",
    },
    MEDIUM: {
        color: "var(--color-warning)",
        bg: "var(--color-hex-1a1200)",
    },
    LOW: {
        color: "var(--color-hex-666666)",
        bg: "var(--color-hex-111111)",
    },
};
export const STATUS_C: Record<string, string> = {
    [FINDING_STATUS.ORACLE_CONFIRMED]: "var(--color-danger)",
    [FINDING_STATUS.VALIDATED]: "var(--color-success)",
    [FINDING_STATUS.PENDING]: "var(--color-warning)",
    [FINDING_STATUS.RULED_OUT]: "var(--color-hex-555555)",
};
