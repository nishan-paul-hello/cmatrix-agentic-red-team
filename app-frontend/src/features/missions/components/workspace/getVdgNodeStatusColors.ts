import { VDG_NODE_STATUS, type VdgNodeStatus } from "@/types/domain-types";

/** Maps all 6 architecture VDG node statuses to visual badge colors */
export default function getVdgNodeStatusColors(status: VdgNodeStatus): {
    color: string;
    bg: string;
} {
    const map: Record<VdgNodeStatus, { color: string; bg: string }> = {
        [VDG_NODE_STATUS.EXPLOITED]: {
            color: "var(--primary)",
            bg: "var(--border)",
        },
        [VDG_NODE_STATUS.ELIGIBLE]: {
            color: "var(--destructive)",
            bg: "var(--border)",
        },
        [VDG_NODE_STATUS.IN_PROGRESS]: {
            color: "var(--destructive)",
            bg: "var(--border)",
        },
        [VDG_NODE_STATUS.INFEASIBLE]: {
            color: "var(--muted-dimmer)",
            bg: "transparent",
        },
        [VDG_NODE_STATUS.BLOCKED]: {
            color: "var(--destructive)",
            bg: "var(--muted)",
        },
        [VDG_NODE_STATUS.DEPRIORITIZED]: {
            color: "var(--muted-dim)",
            bg: "transparent",
        },
    };
    return map[status];
}
