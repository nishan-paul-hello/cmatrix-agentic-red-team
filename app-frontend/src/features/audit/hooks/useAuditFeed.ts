import { useEffect, useState } from "react";

import { AuditRepository } from "@/features/audit/data/AuditRepository";
import { useServices } from "@/lib/services-context";
import { type AuditEntry } from "@/types/domain-types";
import { useFeatureFlag } from "@/utils/FeatureFlags";

export const AUDIT_EVENT = "AUDIT_EVENT";

export function useAuditFeed(page: number = 1, limit: number = 50) {
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const { eventBus } = useServices();
    const enableLiveFeeds = useFeatureFlag("ENABLE_LIVE_FEEDS");

    useEffect(() => {
        // Load mock data page
        const repo = new AuditRepository();
        void repo.fetchAll({ page, limit }).then((data) => setEntries(data));
    }, [page, limit]);

    useEffect(() => {
        if (enableLiveFeeds && page === 1) {
            // Only subscribe to live events on page 1
            const unsubscribe = eventBus.subscribe<AuditEntry>(AUDIT_EVENT, (newEntry) => {
                setEntries((prev) => [newEntry, ...prev]);
            });
            return unsubscribe;
        }
    }, [enableLiveFeeds, eventBus, page]);

    return entries;
}
