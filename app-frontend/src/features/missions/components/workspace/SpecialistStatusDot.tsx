import { SPEC_STATUS, type Specialist } from "@/types/domain-types";

export default function SpecialistStatusDot(status: Specialist["status"]): string {
    return {
        [SPEC_STATUS.RUNNING]: "var(--color-brand)",
        [SPEC_STATUS.IDLE]: "var(--color-hex-333333)",
        [SPEC_STATUS.QUEUED]: "var(--color-hex-555555)",
        [SPEC_STATUS.WAITING]: "var(--color-warning)",
        [SPEC_STATUS.COMPLETED]: "var(--color-success)",
        [SPEC_STATUS.VALIDATING]: "var(--color-danger)",
        [SPEC_STATUS.FAILED]: "var(--color-danger)",
        [SPEC_STATUS.BLOCKED]: "var(--color-hex-6f171b)",
    }[status];
}
