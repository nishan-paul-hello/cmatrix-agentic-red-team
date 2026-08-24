import {
    type FilterStatus,
    type NodeStatus,
    type VulnFilter,
} from "@/features/missions/data/fixtures/attackGraphMockData";

export const NODE_STYLE: Record<
    NodeStatus,
    {
        border: string;
        bg: string;
        labelColor: string;
        typeColor: string;
        badgeColor: string;
        badgeBg: string;
    }
> = {
    EXPLOITED: {
        border: "var(--color-hex-9e1118)",
        bg: "var(--color-hex-130508)",
        labelColor: "var(--color-hex-e31b23)",
        typeColor: "var(--color-hex-6f171b)",
        badgeColor: "var(--color-hex-e31b23)",
        badgeBg: "var(--color-hex-1a0608)",
    },
    ELIGIBLE: {
        border: "var(--color-hex-e31b23)",
        bg: "var(--color-hex-120608)",
        labelColor: "var(--color-hex-ff2a32)",
        typeColor: "var(--color-hex-9e1118)",
        badgeColor: "var(--color-hex-ff2a32)",
        badgeBg: "var(--color-hex-1a0608)",
    },
    IN_PROGRESS: {
        border: "var(--color-hex-ff2a32)",
        bg: "var(--color-hex-180a0b)",
        labelColor: "var(--color-hex-ff2a32)",
        typeColor: "var(--color-hex-9e1118)",
        badgeColor: "var(--color-hex-ff2a32)",
        badgeBg: "var(--color-hex-200a0b)",
    },
    BLOCKED: {
        border: "var(--color-hex-2a1010)",
        bg: "var(--color-hex-0d0808)",
        labelColor: "var(--color-hex-4a1a1a)",
        typeColor: "var(--color-hex-2a1010)",
        badgeColor: "var(--color-hex-4a1a1a)",
        badgeBg: "var(--color-hex-0d0808)",
    },
    INFEASIBLE: {
        border: "var(--color-hex-1e1e1e)",
        bg: "var(--color-hex-0a0a0a)",
        labelColor: "var(--color-hex-2a2a2a)",
        typeColor: "var(--color-hex-1e1e1e)",
        badgeColor: "var(--color-hex-2a2a2a)",
        badgeBg: "transparent",
    },
    DEPRIORITIZED: {
        border: "var(--color-hex-252525)",
        bg: "var(--color-hex-0c0c0c)",
        labelColor: "var(--color-hex-363636)",
        typeColor: "var(--color-hex-252525)",
        badgeColor: "var(--color-hex-363636)",
        badgeBg: "transparent",
    },
};

export const STATUS_FILTERS: FilterStatus[] = [
    "ALL",
    "ELIGIBLE",
    "IN_PROGRESS",
    "EXPLOITED",
    "BLOCKED",
    "INFEASIBLE",
    "DEPRIORITIZED",
];

export const VULN_FILTERS: VulnFilter[] = [
    "ALL",
    "SQLi",
    "XSS",
    "CSRF",
    "SSRF",
    "SSTI",
    "IDOR",
    "RCE",
    "AUTH",
    "GRAPHQL",
    "LATERAL",
];
