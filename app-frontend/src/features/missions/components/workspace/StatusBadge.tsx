import { type NodeStatus } from "../../data/workspaceMockData";

export default function StatusBadge(status: NodeStatus) {
    const map: Record<
        NodeStatus,
        {
            color: string;
            bg: string;
        }
    > = {
        COMPLETED: {
            color: "var(--color-hex-555555)",
            bg: "transparent",
        },
        EXPLOITED: {
            color: "var(--color-hex-e31b23)",
            bg: "var(--color-hex-1a0608)",
        },
        ELIGIBLE: {
            color: "var(--color-hex-ff2a32)",
            bg: "var(--color-hex-1a0608)",
        },
        IN_PROGRESS: {
            color: "var(--color-hex-ff2a32)",
            bg: "var(--color-hex-1a0608)",
        },
        DEPENDENT: {
            color: "var(--color-hex-333333)",
            bg: "transparent",
        },
        INFEASIBLE: {
            color: "var(--color-hex-2a2a2a)",
            bg: "transparent",
        },
    };
    return map[status];
}
