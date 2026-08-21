import React from "react";

import { type Specialist } from "@/types/domain-types";

import specialistStatusDot from "./specialistStatusDot";

export default function SpecBadge({ status }: { status: Specialist["status"] }) {
    const color = specialistStatusDot(status);
    return (
        <span
            className="text-[8.5px] tracking-[0.12em]"
            style={{
                color,
            }}
        >
            {status}
        </span>
    );
}
