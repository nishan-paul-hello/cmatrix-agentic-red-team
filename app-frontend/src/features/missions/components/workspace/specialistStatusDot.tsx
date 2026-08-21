import { SPEC_STATUS, type Specialist } from "@/types/domain-types";

export default function specialistStatusDot(status: Specialist["status"]): string {
    return {
        [SPEC_STATUS.RUNNING]: "var(--color-hex-e31b23)",
        [SPEC_STATUS.IDLE]: "var(--color-hex-333333)",
        [SPEC_STATUS.QUEUED]: "var(--color-hex-555555)",
        [SPEC_STATUS.WAITING]: "var(--color-hex-d29922)",
        [SPEC_STATUS.COMPLETED]: "var(--color-hex-3fb950)",
        [SPEC_STATUS.VALIDATING]: "var(--color-hex-ff2a32)",
        [SPEC_STATUS.FAILED]: "var(--color-hex-ff2a32)",
        [SPEC_STATUS.BLOCKED]: "var(--color-hex-6f171b)",
    }[status];
}
