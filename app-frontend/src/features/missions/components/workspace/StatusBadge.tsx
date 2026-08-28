import { VDG_NODE_STATUS, type VdgNodeStatus } from "@/types/domain-types";

/** Maps all 6 architecture VDG node statuses to visual badge colors */
export default function StatusBadge(status: VdgNodeStatus): { color: string; bg: string } {
    const map: Record<VdgNodeStatus, { color: string; bg: string }> = {
        [VDG_NODE_STATUS.EXPLOITED]: {
            color: "var(--color-brand)",
            bg: "var(--color-hex-1a0608)",
        },
        [VDG_NODE_STATUS.ELIGIBLE]: {
            color: "var(--color-danger)",
            bg: "var(--color-hex-1a0608)",
        },
        [VDG_NODE_STATUS.IN_PROGRESS]: {
            color: "var(--color-danger)",
            bg: "var(--color-hex-1a0608)",
        },
        [VDG_NODE_STATUS.INFEASIBLE]: {
            color: "var(--color-hex-2a2a2a)",
            bg: "transparent",
        },
        [VDG_NODE_STATUS.BLOCKED]: {
            color: "var(--color-hex-4a1a1a)",
            bg: "var(--color-hex-0d0808)",
        },
        [VDG_NODE_STATUS.DEPRIORITIZED]: {
            color: "var(--color-hex-363636)",
            bg: "transparent",
        },
    };
    return map[status];
}
