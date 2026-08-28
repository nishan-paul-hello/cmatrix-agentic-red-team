/**
 * Human-in-the-Loop / Escalation Pattern.
 * Manages escalation boundaries when the agent encounters uncertainty
 * or high-risk situations (e.g. out of scope, zero-day, cost limit).
 */

import { type RiskAssessment } from "@/types/domain-types";

export type EscalationReason =
    | "AMBIGUOUS_SCOPE"
    | "NOVEL_VULNERABILITY"
    | "HIGH_RISK_ACTION"
    | "ORACLE_FAILURE"
    | "COST_THRESHOLD";

export interface EscalationCategory {
    id: EscalationReason;
    label: string;
    desc: string;
    color: string;
}

export const ESCALATION_CATEGORIES: EscalationCategory[] = [
    {
        id: "AMBIGUOUS_SCOPE",
        label: "AMBIGUOUS SCOPE",
        desc: "Agent cannot determine if target is in-scope for this engagement",
        color: "var(--warning)",
    },
    {
        id: "NOVEL_VULNERABILITY",
        label: "NOVEL VULNERABILITY",
        desc: "Potential zero-day pattern detected — requires human expert verification before exploitation",
        color: "var(--primary)",
    },
    {
        id: "HIGH_RISK_ACTION",
        label: "HIGH-RISK ACTION",
        desc: "Next action may cause irreversible damage or unintended lateral impact",
        color: "var(--destructive)",
    },
    {
        id: "ORACLE_FAILURE",
        label: "ORACLE FAILURE",
        desc: "Validation oracle returned unexpected result — human review required",
        color: "var(--warning)",
    },
    {
        id: "COST_THRESHOLD",
        label: "COST THRESHOLD",
        desc: "Projected cost exceeds ROE ceiling — explicit authorization required to continue",
        color: "var(--color-zinc-600)",
    },
];

export interface EscalationHistoryEntry {
    ts: string;
    type: string;
    status: string;
    response: string;
}

export class EscalationManager {
    public getHistory(): EscalationHistoryEntry[] {
        return [
            {
                ts: "06:24:00",
                type: "COST THRESHOLD",
                status: "RESOLVED",
                response: "Authorized — proceed",
            },
            {
                ts: "05:58:00",
                type: "AMBIGUOUS SCOPE",
                status: "RESOLVED",
                response: "In-scope confirmed",
            },
            {
                ts: "04:12:00",
                type: "ORACLE FAILURE",
                status: "RESOLVED",
                response: "Retry with PREDIQL",
            },
        ];
    }
}

export const globalEscalationManager = new EscalationManager();

export function shouldEscalate(assessment: RiskAssessment): boolean {
    return assessment.score >= assessment.threshold;
}
