import React from "react";

import { type AuditEntry, type AuditEventType, type AuditResultValue } from "@/types/domain-types";

export interface ColorPair {
    c: string;
    bg: string;
    border: string;
}

export const TYPE_C: Record<AuditEventType, ColorPair> = {
    AUTH: { c: "text-muted-foreground", bg: "bg-border", border: "border-muted-foreground/30" },
    MISSION: { c: "text-primary", bg: "bg-border", border: "border-primary/30" },
    EXECUTION: {
        c: "text-muted-foreground",
        bg: "bg-background",
        border: "border-muted-foreground/30",
    },
    ESCALATION: { c: "text-warning", bg: "bg-border", border: "border-warning/30" },
    SYSTEM: { c: "text-success", bg: "bg-border", border: "border-success/30" },
    CONFIG: { c: "text-muted-foreground", bg: "bg-border", border: "border-muted-foreground/30" },
};

export const RESULT_C: Record<AuditResultValue, string> = {
    SUCCESS: "text-success",
    FAILURE: "text-destructive",
    WARNING: "text-warning",
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
                    className={`rounded-sm border border-solid px-1 py-px text-sm font-semibold tracking-normal ${tc.c} ${tc.bg} ${tc.border}`}
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
                <span className={`text-sm font-semibold tracking-normal ${rc}`}>{e.result}</span>
            </td>
        </tr>
    );
});
