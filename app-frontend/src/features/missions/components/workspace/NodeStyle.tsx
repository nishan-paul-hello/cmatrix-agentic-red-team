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
                border: "var(--primary)",
                bg: "transparent",
                labelColor: "var(--primary)",
                typeColor: "var(--primary)",
            };
        case VDG_NODE_STATUS.ELIGIBLE:
            return {
                border: "var(--primary)",
                bg: "transparent",
                labelColor: "var(--destructive)",
                typeColor: "var(--destructive)",
            };
        case VDG_NODE_STATUS.IN_PROGRESS:
            return {
                border: "var(--destructive)",
                bg: "transparent",
                labelColor: "var(--destructive)",
                typeColor: "var(--destructive)",
            };
        case VDG_NODE_STATUS.INFEASIBLE:
            return {
                border: "var(--muted-dimmest)",
                bg: "transparent",
                labelColor: "var(--muted-dimmer)",
                typeColor: "var(--muted-dimmest)",
            };
        case VDG_NODE_STATUS.BLOCKED:
            return {
                border: "var(--muted-dimmest)",
                bg: "var(--muted)",
                labelColor: "var(--destructive)",
                typeColor: "var(--muted-dimmest)",
            };
        case VDG_NODE_STATUS.DEPRIORITIZED:
            return {
                border: "var(--muted-dimmest)",
                bg: "transparent",
                labelColor: "var(--muted-dim)",
                typeColor: "var(--muted-dimmer)",
            };
        default:
            return {
                border: "var(--muted-dimmest)",
                bg: "transparent",
                labelColor: "var(--muted-dimmer)",
                typeColor: "var(--muted-dimmest)",
            };
    }
}
