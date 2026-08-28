// Shared mission options — used by TrajectoryBrowser, MemoryBrowser, CostBrowser.
// Extract here to avoid the four mission IDs drifting apart across independent copies.

export const MISSION_IDS = ["CVE-001", "CVE-002", "CVE-003", "BENCH-014"] as const;
export type MissionId = (typeof MISSION_IDS)[number];

export const ALL_MISSIONS_OPTION = "ALL MISSIONS" as const;

/** Full selector list for browser components — ALL MISSIONS first, then per-mission IDs. */
export const MISSION_OPTIONS = [ALL_MISSIONS_OPTION, ...MISSION_IDS] as const;
export type MissionOption = (typeof MISSION_OPTIONS)[number];
