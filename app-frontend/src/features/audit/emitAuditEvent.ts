import { type AuditEventType, type AuditResultValue } from "@/types/domain-types";
import { type EventBus } from "@/utils/EventBus";

export function emitAuditEvent(
    eventBus: EventBus,
    params: {
        type: AuditEventType;
        actor: string;
        action: string;
        resource: string;
        result: AuditResultValue;
        detail: string;
    },
) {
    eventBus.publish("AUDIT_EVENT", {
        id: `EVT-${Math.floor(Math.random() * 100000)
            .toString()
            .padStart(5, "0")}`,
        ts: `${new Date().toISOString().replace("T", " ").substring(0, 19)} UTC`,
        type: params.type,
        actor: params.actor,
        action: params.action,
        resource: params.resource,
        result: params.result,
        ip: "127.0.0.1",
        detail: params.detail,
    });
}
