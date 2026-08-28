// src/utils/EventBus.ts

/**
 * A lightweight typed event bus for global application events.
 * Useful for streaming live agent data independent of React renders.
 */
type EventHandler<T = unknown> = (payload: T) => void;

export class EventBus {
    private listeners: Record<string, EventHandler<unknown>[]> = {};

    subscribe<T>(event: string, callback: EventHandler<T>): () => void {
        if (!(event in this.listeners)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback as unknown as EventHandler<unknown>);

        // Return unsubscribe function
        return () => {
            this.unsubscribe(event, callback);
        };
    }

    unsubscribe<T>(event: string, callback: EventHandler<T>): void {
        if (!(event in this.listeners)) {
            return;
        }
        this.listeners[event] = this.listeners[event].filter(
            (cb) => cb !== (callback as unknown as EventHandler<unknown>),
        );
    }

    publish<T>(event: string, payload: T): void {
        if (!(event in this.listeners)) {
            return;
        }
        this.listeners[event].forEach((cb) => {
            try {
                (cb as unknown as EventHandler<T>)(payload);
            } catch (err) {
                console.error(`Error in EventBus listener for event: ${event}`, err);
            }
        });
    }
}

export const globalEventBus = new EventBus();

// Expose to window for manual testing/debugging
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
    (window as unknown as { __EVENT_BUS__: EventBus }).__EVENT_BUS__ = globalEventBus;
}
