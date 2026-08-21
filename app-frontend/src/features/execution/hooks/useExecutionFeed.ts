import { useEffect, useState } from "react";

import { type ExecEntry } from "@/types/domain-types";
import { globalEventBus } from "@/utils/EventBus";
import { useFeatureFlag } from "@/utils/FeatureFlags";

import { getExecutionEntries } from "../data/fixtures/executionMockData";

export const EXECUTION_EVENT = "EXECUTION_EVENT";

export function useExecutionFeed() {
    const [entries, setEntries] = useState<ExecEntry[]>([]);

    const enableLiveFeeds = useFeatureFlag("ENABLE_LIVE_FEEDS");

    useEffect(() => {
        // Load initial mock data
        void getExecutionEntries().then((data) => setEntries(data));

        if (enableLiveFeeds) {
            // Subscribe to live events
            const unsubscribe = globalEventBus.subscribe<ExecEntry>(EXECUTION_EVENT, (newEntry) => {
                setEntries((prev) => [newEntry, ...prev]);
            });
            return unsubscribe;
        }
    }, [enableLiveFeeds]);

    return entries;
}
