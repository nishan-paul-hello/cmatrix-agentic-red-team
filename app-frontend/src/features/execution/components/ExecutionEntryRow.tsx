import React from "react";

import { formatCommand } from "@/features/execution/domain/TaskCommand";
import { type ExecEntry } from "@/types/domain-types";
import { getStatusColor } from "@/utils/statusColors";

export const ExecutionEntryRow = React.memo(function ExecutionEntryRowInner({
    e,
    onClick,
}: {
    e: ExecEntry;
    onClick: () => void;
}) {
    return (
        <div
            className="flex cursor-pointer items-start gap-0"
            style={{
                borderBottom: "1px solid var(--color-hex-0e0e0e)",
            }}
            onClick={(ev) => {
                ev.stopPropagation();
                onClick();
            }}
            onKeyDown={(ev) => {
                if (ev.key === "Enter" || ev.key === " ") {
                    onClick();
                }
            }}
            role="button"
            tabIndex={0}
            onMouseEnter={(ev) => (ev.currentTarget.style.background = "var(--color-hex-0d0d0d)")}
            onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
        >
            <div className="w-[48px] shrink-0 px-[12px] py-[7px] text-base text-[var(--color-hex-333333)]">
                {e.id}
            </div>
            <div className="w-[80px] shrink-0 px-[12px] py-[7px] text-base tracking-tighter text-[var(--color-hex-333333)]">
                {e.ts}
            </div>
            <div className="w-[108px] shrink-0 px-[12px] py-[7px] text-base font-semibold tracking-tight text-[var(--color-brand)]">
                {e.specialist}
            </div>
            <div
                className="w-[160px] shrink-0 overflow-hidden px-[12px] py-[7px] text-base tracking-tighter whitespace-nowrap text-[var(--color-hex-666666)]"
                style={{
                    textOverflow: "ellipsis",
                }}
            >
                {formatCommand(e.command)}
            </div>
            <div className="w-[72px] shrink-0 px-[12px] py-[7px] text-base text-[var(--color-hex-444444)]">
                {e.command.tool.id}
            </div>
            <div className="w-[64px] shrink-0 px-[12px] py-[7px] text-right text-base text-[var(--color-hex-444444)]">
                {e.duration}
            </div>
            <div className="w-[72px] shrink-0 px-[12px] py-[7px]">
                <span
                    className="text-base-tight font-semibold tracking-normal"
                    style={{
                        color: getStatusColor(e.status).color,
                    }}
                >
                    {e.status}
                </span>
            </div>
            <div
                className="tracking-tighter-1 flex-1 overflow-hidden px-[12px] py-[7px] text-base leading-tight whitespace-nowrap text-[var(--color-hex-555555)]"
                style={{
                    textOverflow: "ellipsis",
                }}
            >
                {e.output || <span className="text-[var(--color-hex-2a2a2a)]">IN PROGRESS…</span>}
            </div>
        </div>
    );
});
