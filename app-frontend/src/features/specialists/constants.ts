import { type VDGEntry } from "@/features/specialists/data/fixtures/teamDashboardMockData";

export const STATUS_C: Record<VDGEntry["status"], string> = {
    ELIGIBLE: "var(--color-brand)",
    IN_PROGRESS: "var(--color-danger)",
    EXPLOITED: "var(--color-success)",
    BLOCKED: "var(--color-hex-333333)",
    DEPRIORITIZED: "var(--color-hex-555555)",
};
