import { useEffect, useState } from "react";

import { emitAuditEvent } from "@/features/audit/emitAuditEvent";
import { ExecutionRepository } from "@/features/execution/data/ExecutionRepository";
import { useServices } from "@/lib/services-context";
import { AUDIT_RESULT, TASK_STATUS, type ExecEntry } from "@/types/domain-types";
import { useFeatureFlag } from "@/utils/FeatureFlags";

export const EXECUTION_EVENT = "EXECUTION_EVENT";

export function useExecutionFeed() {
    const [entries, setEntries] = useState<ExecEntry[]>([]);
    const { eventBus, circuitBreaker } = useServices();

    const enableLiveFeeds = useFeatureFlag("ENABLE_LIVE_FEEDS");

    useEffect(() => {
        // Load initial mock data
        void ExecutionRepository.getAll().then((data) => {
            data.forEach((entry) => {
                if (entry.status === TASK_STATUS.FAILED || entry.status === TASK_STATUS.TIMEOUT) {
                    circuitBreaker.recordFailure(entry.command.tool.id);
                } else if (entry.status === TASK_STATUS.SUCCESS) {
                    circuitBreaker.recordSuccess(entry.command.tool.id);
                }

                if (
                    entry.status === TASK_STATUS.SUCCESS ||
                    entry.status === TASK_STATUS.FAILED ||
                    entry.status === TASK_STATUS.TIMEOUT
                ) {
                    emitAuditEvent(eventBus, {
                        type: "EXECUTION",
                        actor: entry.specialist,
                        action: "EXECUTE",
                        resource: `tool/${entry.command.tool.id}`,
                        result:
                            entry.status === TASK_STATUS.SUCCESS
                                ? AUDIT_RESULT.SUCCESS
                                : AUDIT_RESULT.FAILURE,
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
