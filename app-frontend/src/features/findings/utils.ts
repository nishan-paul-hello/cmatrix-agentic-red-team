import { type Finding, type Severity } from "@/types/domain-types";

export function computeFindingCounts(findings: Finding[]) {
    const counts: Record<Severity, number> = {
        CRITICAL: 0,
        HIGH: 0,
        MEDIUM: 0,
        LOW: 0,
    };
    findings.forEach((f) => counts[f.severity]++);
    return counts;
}
