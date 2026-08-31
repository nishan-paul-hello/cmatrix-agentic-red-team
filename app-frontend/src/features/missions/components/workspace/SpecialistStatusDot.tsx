import { SPEC_STATUS, type Specialist } from "@/types/domain-types";

export default function SpecialistStatusDot(status: Specialist["status"]): string {
    return {
        [SPEC_STATUS.RUNNING]: "text-primary",
        [SPEC_STATUS.IDLE]: "text-border",
        [SPEC_STATUS.QUEUED]: "text-muted-foreground",
        [SPEC_STATUS.WAITING]: "text-warning",
        [SPEC_STATUS.COMPLETED]: "text-success",
        [SPEC_STATUS.VALIDATING]: "text-destructive",
        [SPEC_STATUS.FAILED]: "text-destructive",
        [SPEC_STATUS.BLOCKED]: "text-border",
    }[status];
}
