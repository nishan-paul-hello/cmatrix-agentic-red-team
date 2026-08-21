import { useEffect, useState } from "react";

import { type AuditEntry } from "@/types/domain-types";
import { globalEventBus } from "@/utils/EventBus";

import { getAuditEntries } from "../data/fixtures/auditMockData";

export const AUDIT_EVENT = "AUDIT_EVENT";

export function useAuditFeed() {
    const [entries, setEntries] = useState<AuditEntry[]>([]);

    useEffect(() => {
        // Load initial mock data
        void getAuditEntries().then((data) => setEntries(data));

        // Subscribe to live events
        const unsubscribe = globalEventBus.subscribe<AuditEntry>(AUDIT_EVENT, (newEntry) => {
            setEntries((prev) => [newEntry, ...prev]);
        });

        return unsubscribe;
    }, []);

    return entries;
}
