// Shared constants — F12: deduplicate EORD_LABELS across VDGNodeDrawer and EvaluationScreen
export const EORD_LABELS = ["UNSEEN", "NOTHING", "WEAK", "CLEAR", "CONFIRMED", "ORACLE"] as const;
export type EordLabel = typeof EORD_LABELS[number];
