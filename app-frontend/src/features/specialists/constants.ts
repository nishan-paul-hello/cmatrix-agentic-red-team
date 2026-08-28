import { type VDGEntry } from "@/features/specialists/data/fixtures/teamDashboardMockData";

export const STATUS_C: Record<VDGEntry["status"], string> = {
    ELIGIBLE: "var(--primary)",
    IN_PROGRESS: "var(--destructive)",
    EXPLOITED: "var(--success)",
    BLOCKED: "var(--color-zinc-800)",
    DEPRIORITIZED: "var(--color-zinc-600)",
};
