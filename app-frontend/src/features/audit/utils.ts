import { type AuditEntry } from "@/types/domain-types";

export function filterAuditEntries(
    entries: AuditEntry[],
    typeFilter: string,
    resultFilter: string,
    search: string,
): AuditEntry[] {
    return entries.filter(
        (e) =>
            (typeFilter === "ALL" || e.type === typeFilter) &&
            (resultFilter === "ALL" || e.result === resultFilter) &&
            (!search ||
                e.action.includes(search.toUpperCase()) ||
                e.actor.toLowerCase().includes(search.toLowerCase()) ||
                e.resource.toLowerCase().includes(search.toLowerCase())),
    );
}
