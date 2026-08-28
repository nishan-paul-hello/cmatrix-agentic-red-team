import { VDG_NODE_STATUS, type VdgNodeStatus } from "@/types/domain-types";

/**
 * Maps VDG node status to visual style tokens.
 * Covers all six architecture §7.1 statuses:
 * ELIGIBLE, IN_PROGRESS, EXPLOITED, INFEASIBLE, DEPRIORITIZED, BLOCKED
 */
export default function NodeStyle(status: VdgNodeStatus): {
    border: string;
    bg: string;
    labelColor: string;
    typeColor: string;
} {
    switch (status) {
        case VDG_NODE_STATUS.EXPLOITED:
            return {
                border: "var(--border)",
                bg: "var(--border)",
                labelColor: "var(--primary)",
                typeColor: "var(--border)",
            };
        case VDG_NODE_STATUS.ELIGIBLE:
            return {
                border: "var(--primary)",
                bg: "var(--border)",
                labelColor: "var(--destructive)",
                typeColor: "var(--border)",
            };
        case VDG_NODE_STATUS.IN_PROGRESS:
            return {
                border: "var(--destructive)",
                bg: "var(--border)",
                labelColor: "var(--destructive)",
                typeColor: "var(--border)",
            };
        case VDG_NODE_STATUS.INFEASIBLE:
            return {
                border: "var(--border)",
                bg: "var(--background)",
                labelColor: "var(--border)",
                typeColor: "var(--border)",
            };
        case VDG_NODE_STATUS.BLOCKED:
            // Muted-dark adjacent to INFEASIBLE — darker red-tinted background to signal
            // blocked-by-failure-propagation (required for A4 ablation visibility)
            return {
                border: "var(--border)",
                bg: "var(--border)",
                labelColor: "var(--border)",
                typeColor: "var(--border)",
            };
        case VDG_NODE_STATUS.DEPRIORITIZED:
            // Slightly lighter than INFEASIBLE to visually distinguish "low priority" vs "impossible"
            return {
                border: "var(--border)",
                bg: "var(--border)",
                labelColor: "var(--border)",
                typeColor: "var(--border)",
            };
        default:
            return {
                border: "var(--border)",
                bg: "var(--background)",
                labelColor: "var(--border)",
                typeColor: "var(--border)",
            };
    }
}
