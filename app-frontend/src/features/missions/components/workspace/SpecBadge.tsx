import specialistStatusDot from "@/features/missions/components/workspace/SpecialistStatusDot";
import { type Specialist } from "@/types/domain-types";

export default function SpecBadge({ status }: { status: Specialist["status"] }) {
    const color = specialistStatusDot(status);
    return (
        <span
            className="text-sm tracking-wide"
            style={{
                color,
            }}
        >
            {status}
        </span>
    );
}
