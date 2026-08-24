export type VStatus =
    "PENDING" | "RETRY" | "VALIDATED" | "RULED_OUT" | "ORACLE_CONFIRMED";
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
        color: "var(--color-hex-d29922)",
        bg: "var(--color-hex-1a1200)",
        border: "var(--color-hex-d2992244)",
    },
    RETRY: {
        color: "var(--color-hex-ff2a32)",
        bg: "var(--color-hex-1a0608)",
        border: "var(--color-hex-ff2a3244)",
    },
    VALIDATED: {
        color: "var(--color-hex-3fb950)",
        bg: "var(--color-hex-0a1a10)",
        border: "var(--color-hex-3fb95044)",
    },
    RULED_OUT: {
        color: "var(--color-hex-555555)",
        bg: "var(--color-hex-111111)",
        border: "var(--color-hex-33333344)",
    },
    ORACLE_CONFIRMED: {
        color: "var(--color-hex-a371f7)",
        bg: "var(--color-hex-1a0f2e)",
        border: "var(--color-hex-a371f744)",
    },
};

/* B4: State machine modal with active state highlight based on finding.status */
