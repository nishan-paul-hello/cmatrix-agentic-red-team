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
                border: "var(--color-hex-9e1118)",
                bg: "var(--color-hex-150608)",
                labelColor: "var(--color-brand)",
                typeColor: "var(--color-hex-6f171b)",
            };
        case VDG_NODE_STATUS.ELIGIBLE:
            return {
                border: "var(--color-brand)",
                bg: "var(--color-hex-120608)",
                labelColor: "var(--color-danger)",
                typeColor: "var(--color-hex-9e1118)",
            };
        case VDG_NODE_STATUS.IN_PROGRESS:
            return {
                border: "var(--color-danger)",
                bg: "var(--color-hex-180a0b)",
                labelColor: "var(--color-danger)",
                typeColor: "var(--color-hex-9e1118)",
            };
        case VDG_NODE_STATUS.INFEASIBLE:
            return {
                border: "var(--color-hex-1e1e1e)",
                bg: "var(--color-hex-0a0a0a)",
                labelColor: "var(--color-hex-2a2a2a)",
                typeColor: "var(--color-hex-1e1e1e)",
            };
        case VDG_NODE_STATUS.BLOCKED:
            // Muted-dark adjacent to INFEASIBLE — darker red-tinted background to signal
            // blocked-by-failure-propagation (required for A4 ablation visibility)
            return {
                border: "var(--color-hex-2a1010)",
                bg: "var(--color-hex-0d0808)",
                labelColor: "var(--color-hex-4a1a1a)",
                typeColor: "var(--color-hex-2a1010)",
            };
        case VDG_NODE_STATUS.DEPRIORITIZED:
            // Slightly lighter than INFEASIBLE to visually distinguish "low priority" vs "impossible"
            return {
                border: "var(--color-hex-252525)",
                bg: "var(--color-hex-0c0c0c)",
                labelColor: "var(--color-hex-363636)",
                typeColor: "var(--color-hex-252525)",
            };
        default:
            return {
                border: "var(--color-hex-1e1e1e)",
                bg: "var(--color-hex-0a0a0a)",
                labelColor: "var(--color-hex-2a2a2a)",
                typeColor: "var(--color-hex-1e1e1e)",
            };
    }
}
