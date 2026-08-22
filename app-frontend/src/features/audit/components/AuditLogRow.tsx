import React from "react";

import { type AuditEntry, type AuditEventType, type AuditResultValue } from "@/types/domain-types";

export interface ColorPair {
    c: string;
    bg: string;
}

export const TYPE_C: Record<AuditEventType, ColorPair> = {
    AUTH: { c: "var(--color-hex-a0a0a0)", bg: "var(--color-hex-111111)" },
    MISSION: { c: "var(--color-hex-e31b23)", bg: "var(--color-hex-120608)" },
    EXECUTION: { c: "var(--color-hex-666666)", bg: "var(--color-hex-0d0d0d)" },
    ESCALATION: { c: "var(--color-hex-d29922)", bg: "var(--color-hex-110e00)" },
    SYSTEM: { c: "var(--color-hex-3fb950)", bg: "var(--color-hex-061a0c)" },
    CONFIG: { c: "var(--color-hex-a0a0a0)", bg: "var(--color-hex-111111)" },
};

export const RESULT_C: Record<AuditResultValue, string> = {
    SUCCESS: "var(--color-hex-3fb950)",
    FAILURE: "var(--color-hex-ff2a32)",
    WARNING: "var(--color-hex-d29922)",
};

export const AuditLogRow = React.memo(function AuditLogRowInner({
    e,
    isSelected,
    onClick,
}: {
    e: AuditEntry;
    isSelected: boolean;
    onClick: () => void;
}) {
    const tc = TYPE_C[e.type];
    const rc = RESULT_C[e.result];
    return (
        <tr
            onClick={onClick}
            className={[
                "cursor-pointer border-b border-[var(--color-hex-0e0e0e)] transition-colors duration-75",
                isSelected ? "bg-[var(--color-hex-0d0d0d)]" : "hover:bg-[var(--color-hex-0a0a0a)]",
            ].join(" ")}
        >
            <td className="px-[12px] py-[7px] text-[8.5px] text-[var(--color-hex-333333)]">
                {e.id}
            </td>
            <td className="px-[12px] py-[7px] text-[8.5px] whitespace-nowrap text-[var(--color-hex-333333)]">
                {e.ts}
            </td>
            <td className="px-[12px] py-[7px]">
                <span
                    className="rounded-[2px] px-[5px] py-[1px] text-[8px] font-semibold tracking-[0.1em]"
                    style={{
                        color: tc.c,
                        background: tc.bg,
                        border: `1px solid ${tc.c}33`,
                    }}
                >
                    {e.type}
                </span>
            </td>
            <td className="px-[12px] py-[7px] text-[9px] tracking-[0.04em] text-[var(--color-hex-666666)]">
                {e.actor}
            </td>
            <td className="px-[12px] py-[7px] text-[9px] font-semibold tracking-[0.04em] text-[var(--color-hex-a0a0a0)]">
                {e.action}
            </td>
            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                {e.resource}
            </td>
            <td className="px-[12px] py-[7px]">
                <span className="text-[8.5px] font-semibold tracking-[0.1em]" style={{ color: rc }}>
                    {e.result}
                </span>
            </td>
        </tr>
    );
});
