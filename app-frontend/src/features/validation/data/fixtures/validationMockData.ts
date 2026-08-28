export type VStatus = "PENDING" | "RETRY" | "VALIDATED" | "RULED_OUT" | "ORACLE_CONFIRMED";
export interface VFinding {
    id: string;
    type: string;
    evidence: string;
    retry: number;
    status: VStatus;
    oracle: string;
}
export const FINDINGS: VFinding[] = [
    {
        id: "F-001",
        type: "SQL INJECTION",
        evidence: "E_ord 4/5",
        retry: 0,
        status: "VALIDATED",
        oracle: "CVE-BENCH",
    },
    {
        id: "F-002",
        type: "AUTHENTICATION BYPASS",
        evidence: "E_ord 3/5",
        retry: 2,
        status: "RETRY",
        oracle: "CVE-BENCH",
    },
    {
        id: "F-003",
        type: "IDOR",
        evidence: "E_ord 4/5",
        retry: 0,
        status: "VALIDATED",
        oracle: "PREDIQL",
    },
    {
        id: "F-004",
        type: "XSS REFLECTED",
        evidence: "E_ord 2/5",
        retry: 0,
        status: "PENDING",
        oracle: "—",
    },
    {
        id: "F-005",
        type: "SSRF",
        evidence: "E_ord 1/5",
        retry: 3,
        status: "RULED_OUT",
        oracle: "CVE-BENCH",
    },
    {
        id: "F-006",
        type: "CSRF",
        evidence: "E_ord 2/5",
        retry: 1,
        status: "PENDING",
        oracle: "—",
    },
    {
        id: "F-007",
        type: "PATH TRAVERSAL",
        evidence: "E_ord 3/5",
        retry: 0,
        status: "PENDING",
        oracle: "—",
    },
    {
        id: "F-008",
        type: "SQL INJECTION",
        evidence: "E_ord 4/5",
        retry: 1,
        status: "RETRY",
        oracle: "CVE-BENCH",
    },
];
export const SB: Record<
    VStatus,
    {
        color: string;
        bg: string;
        border: string;
    }
> = {
    PENDING: {
        color: "var(--warning)",
        bg: "var(--border)",
        border: "var(--border)",
    },
    RETRY: {
        color: "var(--destructive)",
        bg: "var(--border)",
        border: "var(--border)",
    },
    VALIDATED: {
        color: "var(--success)",
        bg: "var(--border)",
        border: "var(--border)",
    },
    RULED_OUT: {
        color: "var(--color-zinc-600)",
        bg: "var(--color-zinc-900)",
        border: "var(--border)",
    },
    ORACLE_CONFIRMED: {
        color: "var(--border)",
        bg: "var(--border)",
        border: "var(--border)",
    },
};

/* B4: State machine modal with active state highlight based on finding.status */
