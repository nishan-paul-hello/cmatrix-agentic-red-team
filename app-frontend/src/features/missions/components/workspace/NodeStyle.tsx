import { type NodeStatus } from "../../data/workspaceMockData";

export default function NodeStyle(status: NodeStatus): {
    border: string;
    bg: string;
    labelColor: string;
    typeColor: string;
} {
    switch (status) {
        case "COMPLETED":
            return {
                border: "var(--color-hex-333333)",
                bg: "var(--color-hex-0f0f0f)",
                labelColor: "var(--color-hex-555555)",
                typeColor: "var(--color-hex-333333)",
            };
        case "EXPLOITED":
            return {
                border: "var(--color-hex-9e1118)",
                bg: "var(--color-hex-150608)",
                labelColor: "var(--color-hex-e31b23)",
                typeColor: "var(--color-hex-6f171b)",
            };
        case "ELIGIBLE":
            return {
                border: "var(--color-hex-e31b23)",
                bg: "var(--color-hex-120608)",
                labelColor: "var(--color-hex-ff2a32)",
                typeColor: "var(--color-hex-9e1118)",
            };
        case "IN_PROGRESS":
            return {
                border: "var(--color-hex-ff2a32)",
                bg: "var(--color-hex-180a0b)",
                labelColor: "var(--color-hex-ff2a32)",
                typeColor: "var(--color-hex-9e1118)",
            };
        case "DEPENDENT":
            return {
                border: "var(--color-hex-222222)",
                bg: "var(--color-hex-0b0b0b)",
                labelColor: "var(--color-hex-333333)",
                typeColor: "var(--color-hex-222222)",
            };
        case "INFEASIBLE":
            return {
                border: "var(--color-hex-1e1e1e)",
                bg: "var(--color-hex-0a0a0a)",
                labelColor: "var(--color-hex-2a2a2a)",
                typeColor: "var(--color-hex-1e1e1e)",
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
