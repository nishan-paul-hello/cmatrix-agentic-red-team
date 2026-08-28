/**
 * StatusBadge — coloured pill badge for mission/task status values.
 * Previously duplicated verbatim in Dashboard.tsx and MissionsPage.tsx.
 */

import { type MissionStatus, type TaskStatus } from "@/types/domain-types";
import { getStatusColor } from "@/utils/statusColors";

type StatusValue = MissionStatus | TaskStatus | (string & {});

interface StatusBadgeProps {
    status: StatusValue;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const { bg, color } = getStatusColor(status);

    return (
        <span
            className="text-lg-tight tracking-wider-1 rounded-[2px] px-[6px] py-[1px] font-semibold"
            style={{
                background: bg,
                color,
                border: `1px solid ${color}22`,
            }}
        >
            {status}
        </span>
    );
}
