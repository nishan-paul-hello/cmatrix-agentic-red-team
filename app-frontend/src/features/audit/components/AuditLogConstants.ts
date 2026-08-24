import { RESULT_C, TYPE_C } from "@/features/audit/components/AuditLogRow";
import { AUDIT_RESULT, type AuditEntry } from "@/types/domain-types";

export const TYPE_FILTERS = [
    "ALL",
    "AUTH",
    "MISSION",
    "EXECUTION",
    "ESCALATION",
    "SYSTEM",
    "CONFIG",
] as const;

export const RESULT_FILTERS = [
    "ALL",
    AUDIT_RESULT.SUCCESS,
    AUDIT_RESULT.FAILURE,
    AUDIT_RESULT.WARNING,
] as const;

export const TABLE_HEADERS = [
    "ID",
    "TIMESTAMP",
    "TYPE",
    "ACTOR",
    "ACTION",
    "RESOURCE",
    "RESULT",
] as const;

export interface DrawerField {
    k: string;
    v: string;
    c?: string;
}

export function drawerFields(sel: AuditEntry): DrawerField[] {
    return [
        { k: "TYPE", v: sel.type, c: TYPE_C[sel.type].c },
        { k: "ACTOR", v: sel.actor },
        { k: "ACTION", v: sel.action },
        { k: "RESOURCE", v: sel.resource },
        { k: "RESULT", v: sel.result, c: RESULT_C[sel.result] },
        { k: "IP / SOURCE", v: sel.ip },
        { k: "DETAIL", v: sel.detail },
    ];
}
