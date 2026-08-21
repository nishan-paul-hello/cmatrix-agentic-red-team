export interface Report {
    id: string;
    mission: string;
    type: string;
    status: string;
    generated: string;
    findings: number;
    critical: number;
    pages: number;
}

export const REPORTS: Report[] = [
    {
        id: "RPT-0041",
        mission: "CVE-001",
        type: "EXECUTIVE SUMMARY",
        status: "READY",
        generated: "06:31:04",
        findings: 7,
        critical: 1,
        pages: 4,
    },
    {
        id: "RPT-0039",
        mission: "CVE-001",
        type: "TECHNICAL DETAIL",
        status: "GENERATING",
        generated: "—",
        findings: 7,
        critical: 1,
        pages: 0,
    },
    {
        id: "RPT-0031",
        mission: "BENCH-014",
        type: "BENCHMARK REPORT",
        status: "READY",
        generated: "Yesterday 22:14",
        findings: 12,
        critical: 3,
        pages: 9,
    },
    {
        id: "RPT-0028",
        mission: "BENCH-013",
        type: "BENCHMARK REPORT",
        status: "READY",
        generated: "Yesterday 18:07",
        findings: 8,
        critical: 1,
        pages: 7,
    },
    {
        id: "RPT-0022",
        mission: "CVE-003",
        type: "TECHNICAL DETAIL",
        status: "READY",
        generated: "2d ago",
        findings: 3,
        critical: 0,
        pages: 6,
    },
    {
        id: "RPT-0019",
        mission: "CVE-002",
        type: "EXECUTIVE SUMMARY",
        status: "READY",
        generated: "3d ago",
        findings: 5,
        critical: 2,
        pages: 3,
    },
];

export const PREVIEW_SECTIONS = [
    {
        title: "EXECUTIVE SUMMARY",
        content:
            "CMATRIX completed mission CVE-001 against target app.targetcorp.com. 7 vulnerabilities identified, 3 oracle-confirmed. Critical finding: time-based SQL injection in /api/users endpoint grants full database read access.",
    },
    {
        title: "CRITICAL FINDINGS",
        items: [
            {
                sev: "CRITICAL",
                id: "F-001",
                name: "SQL INJECTION",
                target: "/api/users?id=",
                eord: "5/5",
            },
            {
                sev: "HIGH",
                id: "F-002",
                name: "AUTH BYPASS",
                target: "/api/auth/login",
                eord: "4/5",
            },
            {
                sev: "HIGH",
                id: "F-003",
                name: "IDOR",
                target: "/api/users/:id",
                eord: "4/5",
            },
        ],
    },
    {
        title: "ATTACK NARRATIVE",
        content:
            "Agent initiated passive/active recon hybrid, discovering 12 endpoints. JWT authentication was bypassed via HS256 secret brute-force (password123, 48s). Authenticated access enabled SQL injection enumeration. Time-based blind injection confirmed via 4.18s timing delta (>3σ above baseline). Oracle validation: CVE-BENCH FILE ACCESS PASS.",
    },
    {
        title: "RISK ASSESSMENT",
        content:
            "OVERALL RISK: CRITICAL\nPriority remediation: parameterize SQL queries (F-001), rotate JWT secrets with RS256 migration (F-002), implement ownership checks on user endpoints (F-003).\nEstimated remediation effort: 3–5 engineer-days.",
    },
];

export function getReportsData(): Promise<{
    reports: Report[];
    previewSections: typeof PREVIEW_SECTIONS;
}> {
    return Promise.resolve({ reports: REPORTS, previewSections: PREVIEW_SECTIONS });
}
