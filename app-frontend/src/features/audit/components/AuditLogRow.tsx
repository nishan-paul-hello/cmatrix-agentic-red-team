import React from "react";

import { type AuditEntry, type AuditEventType, type AuditResultValue } from "@/types/domain-types";

export interface ColorPair {
    c: string;
    bg: string;
}

export const TYPE_C: Record<AuditEventType, ColorPair> = {
    AUTH: { c: "var(--muted-foreground)", bg: "var(--border)" },
    MISSION: { c: "var(--primary)", bg: "var(--border)" },
    EXECUTION: { c: "var(--muted-foreground)", bg: "var(--background)" },
    ESCALATION: { c: "var(--warning)", bg: "var(--border)" },
    SYSTEM: { c: "var(--success)", bg: "var(--border)" },
    CONFIG: { c: "var(--muted-foreground)", bg: "var(--border)" },
};

export const RESULT_C: Record<AuditResultValue, string> = {
    SUCCESS: "var(--success)",
    FAILURE: "var(--destructive)",
    WARNING: "var(--warning)",
};

export const AuditLogRow = React.memo(function AuditLogRowInner({
    e,
    isSelected,
    onClick,
}: {
    e: AuditEntry;
    isSelected: boolean;
    onClick: (entry: AuditEntry) => void;
}) {
    const tc = TYPE_C[e.type];
    const rc = RESULT_C[e.result];
    return (
        <tr
            onClick={() => onClick(e)}
            className={[
                "border-border cursor-pointer border-b transition-colors duration-75",
                isSelected ? "bg-background" : "hover:bg-background",
            ].join(" ")}
        >
            <td className="text-muted-foreground px-3 py-1.5 text-sm">{e.id}</td>
            <td className="text-muted-foreground px-3 py-1.5 text-sm whitespace-nowrap">{e.ts}</td>
            <td className="px-3 py-1.5">
                <span
                    className="rounded-sm px-1 py-px text-sm font-semibold tracking-normal"
                    style={{
                        color: tc.c,
                        background: tc.bg,
                        border: `1px solid ${tc.c}33`,
                    }}
                >
                    {e.type}
                </span>
            </td>
            <td className="text-muted-foreground px-3 py-1.5 text-base tracking-tighter">
                {e.actor}
            </td>
            <td className="text-muted-foreground px-3 py-1.5 text-base font-semibold tracking-tighter">
                {e.action}
            </td>
            <td className="text-muted-foreground px-3 py-1.5 text-base">{e.resource}</td>
            <td className="px-3 py-1.5">
                <span className="text-sm font-semibold tracking-normal" style={{ color: rc }}>
                    {e.result}
                </span>
            </td>
        </tr>
    );
});
