import { useCallback } from "react";

export type TelemetryEventName =
    | "MISSION_CREATED"
    | "ESCALATION_APPROVED"
    | "TASK_COMPLETED"
    | "ORACLE_EVALUATED"
    | "FINDING_VERIFIED"
    | "FINDING_REJECTED"
    | "MISSION_PAUSED"
    | "MISSION_RESUMED"
    | "MISSION_TERMINATED";

export function useTelemetry() {
    const logEvent = useCallback(
        (eventName: TelemetryEventName, payload?: Record<string, unknown>) => {
            // In a real application, this would send data to a telemetry service (e.g., Datadog, Sentry, Mixpanel).
            // For now, we simply log to the console (using warn as it's allowed) to centralize the instrumentation.
            console.warn(`[TELEMETRY] ${eventName}`, payload ?? {});
        },
        [],
    );

    return { logEvent };
}
