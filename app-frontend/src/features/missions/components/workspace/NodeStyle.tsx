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
                border: "var(--muted-dimmest)",
                bg: "var(--background)",
                labelColor: "var(--muted-dimmer)",
                typeColor: "var(--muted-dimmest)",
            };
        case VDG_NODE_STATUS.BLOCKED:
            // Dark muted red tint to indicate blocked-by-failure-propagation
            return {
                border: "var(--muted-dimmest)",
                bg: "var(--muted)",
                labelColor: "var(--destructive)",
                typeColor: "var(--muted-dimmest)",
            };
        case VDG_NODE_STATUS.DEPRIORITIZED:
            // Visually distinguishable from impossible
            return {
                border: "var(--muted-dimmest)",
                bg: "var(--background)",
                labelColor: "var(--muted-dim)",
                typeColor: "var(--muted-dimmer)",
            };
        default:
            return {
                border: "var(--muted-dimmest)",
                bg: "var(--background)",
                labelColor: "var(--muted-dimmer)",
                typeColor: "var(--muted-dimmest)",
            };
    }
}
