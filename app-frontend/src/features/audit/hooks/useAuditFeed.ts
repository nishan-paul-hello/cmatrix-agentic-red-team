import { useEffect, useState } from "react";

import { useServices } from "@/lib/services-context";
import { type AuditEntry } from "@/types/domain-types";
import { useFeatureFlag } from "@/utils/FeatureFlags";

import { getAuditEntries } from "../data/fixtures/auditMockData";

export const AUDIT_EVENT = "AUDIT_EVENT";

export function useAuditFeed() {
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const { eventBus } = useServices();
    const enableLiveFeeds = useFeatureFlag("ENABLE_LIVE_FEEDS");

    useEffect(() => {
        // Load initial mock data
        void getAuditEntries().then((data) => setEntries(data));

        if (enableLiveFeeds) {
            // Subscribe to live events
            const unsubscribe = eventBus.subscribe<AuditEntry>(AUDIT_EVENT, (newEntry) => {
                setEntries((prev) => [newEntry, ...prev]);
            });
            return unsubscribe;
        }
    }, [enableLiveFeeds, eventBus]);

    return entries;
}
