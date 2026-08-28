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
        border: "var(--border)",
        bg: "var(--border)",
        labelColor: "var(--primary)",
        typeColor: "var(--border)",
        badgeColor: "var(--primary)",
        badgeBg: "var(--border)",
    },
    ELIGIBLE: {
        border: "var(--primary)",
        bg: "var(--border)",
        labelColor: "var(--destructive)",
        typeColor: "var(--border)",
        badgeColor: "var(--destructive)",
        badgeBg: "var(--border)",
    },
    IN_PROGRESS: {
        border: "var(--destructive)",
        bg: "var(--border)",
        labelColor: "var(--destructive)",
        typeColor: "var(--border)",
        badgeColor: "var(--destructive)",
        badgeBg: "var(--border)",
    },
    BLOCKED: {
        border: "var(--border)",
        bg: "var(--border)",
        labelColor: "var(--border)",
        typeColor: "var(--border)",
        badgeColor: "var(--border)",
        badgeBg: "var(--border)",
    },
    INFEASIBLE: {
        border: "var(--color-zinc-800)",
        bg: "var(--color-zinc-950)",
        labelColor: "var(--border)",
        typeColor: "var(--color-zinc-800)",
        badgeColor: "var(--border)",
        badgeBg: "transparent",
    },
    DEPRIORITIZED: {
        border: "var(--border)",
        bg: "var(--border)",
        labelColor: "var(--border)",
        typeColor: "var(--border)",
        badgeColor: "var(--border)",
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
