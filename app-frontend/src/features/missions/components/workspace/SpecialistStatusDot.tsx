import { SPEC_STATUS, type Specialist } from "@/types/domain-types";

export default function SpecialistStatusDot(status: Specialist["status"]): string {
    return {
        [SPEC_STATUS.RUNNING]: "var(--primary)",
        [SPEC_STATUS.IDLE]: "var(--border)",
        [SPEC_STATUS.QUEUED]: "var(--muted-foreground)",
        [SPEC_STATUS.WAITING]: "var(--warning)",
        [SPEC_STATUS.COMPLETED]: "var(--success)",
        [SPEC_STATUS.VALIDATING]: "var(--destructive)",
        [SPEC_STATUS.FAILED]: "var(--destructive)",
        [SPEC_STATUS.BLOCKED]: "var(--border)",
    }[status];
}
