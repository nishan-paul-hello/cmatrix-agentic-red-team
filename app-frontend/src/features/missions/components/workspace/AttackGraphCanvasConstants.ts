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
        border: "var(--primary)",
        bg: "transparent",
        labelColor: "var(--primary)",
        typeColor: "var(--primary)",
        badgeColor: "var(--primary)",
        badgeBg: "transparent",
    },
    ELIGIBLE: {
        border: "var(--primary)",
        bg: "transparent",
        labelColor: "var(--destructive)",
        typeColor: "var(--destructive)",
        badgeColor: "var(--destructive)",
        badgeBg: "transparent",
    },
    IN_PROGRESS: {
        border: "var(--destructive)",
        bg: "transparent",
        labelColor: "var(--destructive)",
        typeColor: "var(--destructive)",
        badgeColor: "var(--destructive)",
        badgeBg: "transparent",
    },
    BLOCKED: {
        border: "var(--muted-dimmest)",
        bg: "var(--muted)",
        labelColor: "var(--destructive)",
        typeColor: "var(--muted-dimmest)",
        badgeColor: "var(--destructive)",
        badgeBg: "var(--muted)",
    },
    INFEASIBLE: {
        border: "var(--muted-dimmest)",
        bg: "transparent",
        labelColor: "var(--muted-dimmer)",
        typeColor: "var(--muted-dimmest)",
        badgeColor: "var(--muted-dimmer)",
        badgeBg: "transparent",
    },
    DEPRIORITIZED: {
        border: "var(--muted-dimmest)",
        bg: "transparent",
        labelColor: "var(--muted-dim)",
        typeColor: "var(--muted-dimmer)",
        badgeColor: "var(--muted-dim)",
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
