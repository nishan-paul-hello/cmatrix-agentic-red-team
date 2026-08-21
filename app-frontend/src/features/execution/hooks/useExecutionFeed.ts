import { useEffect, useState } from "react";

import { AUDIT_EVENT } from "@/features/audit/hooks/useAuditFeed";
import { getExecutionEntries } from "@/features/execution/data/fixtures/executionMockData";
import { useServices } from "@/lib/services-context";
import { type AuditEntry, type ExecEntry } from "@/types/domain-types";
import { useFeatureFlag } from "@/utils/FeatureFlags";

export const EXECUTION_EVENT = "EXECUTION_EVENT";

export function useExecutionFeed() {
    const [entries, setEntries] = useState<ExecEntry[]>([]);
    const { eventBus, circuitBreaker } = useServices();

    const enableLiveFeeds = useFeatureFlag("ENABLE_LIVE_FEEDS");

    useEffect(() => {
        // Load initial mock data
        void getExecutionEntries().then((data) => {
            data.forEach((entry) => {
                if (entry.status === "FAILED" || entry.status === "TIMEOUT") {
                    circuitBreaker.recordFailure(entry.command.tool.id);
                } else if (entry.status === "SUCCESS") {
                    circuitBreaker.recordSuccess(entry.command.tool.id);
                }

                if (
                    entry.status === "SUCCESS" ||
                    entry.status === "FAILED" ||
                    entry.status === "TIMEOUT"
                ) {
                    eventBus.publish<AuditEntry>(AUDIT_EVENT, {
                        id: `EV-${Date.now().toString().slice(-6)}-${entry.id}`,
                        ts: new Date().toLocaleTimeString("en-US", {
                            hour12: false,
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        }),
                        type: "EXECUTION",
                        actor: entry.specialist,
                        action: "EXECUTE",
                        resource: `tool/${entry.command.tool.id}`,
                        result: entry.status === "SUCCESS" ? "SUCCESS" : "FAILURE",
                        ip: "127.0.0.1",
                        detail: `Executed ${entry.command.tool.id} with status ${entry.status}`,
                    });
                }
            });
            setEntries(data);
        });

        if (enableLiveFeeds) {
            // Subscribe to live events
            const unsubscribe = eventBus.subscribe<ExecEntry>(EXECUTION_EVENT, (newEntry) => {
                setEntries((prev) => [newEntry, ...prev]);
            });
            return unsubscribe;
        }
    }, [enableLiveFeeds, eventBus, circuitBreaker]);

    return entries;
}
