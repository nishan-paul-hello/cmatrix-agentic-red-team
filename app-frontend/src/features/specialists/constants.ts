import { type VDGEntry } from "@/features/specialists/data/fixtures/teamDashboardMockData";

export const STATUS_C: Record<VDGEntry["status"], string> = {
    ELIGIBLE: "var(--color-hex-e31b23)",
    IN_PROGRESS: "var(--color-hex-ff2a32)",
    EXPLOITED: "var(--color-hex-3fb950)",
    BLOCKED: "var(--color-hex-333333)",
    DEPRIORITIZED: "var(--color-hex-555555)",
};
