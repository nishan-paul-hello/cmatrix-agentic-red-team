/**
 * Circuit Breaker + Retry Pattern.
 * Detects cascading failures in tooling/APIs (e.g., rate limits, WAF blocks)
 * and pauses execution temporarily, falling back to a human or alternate strategy.
 */

export interface CircuitBreakerState {
    status: "CLOSED" | "OPEN" | "HALF_OPEN";
    failures: number;
    lastFailureTime?: number;
    threshold: number;
    timeoutMs: number;
}

export class ToolCircuitBreaker {
    private states = new Map<string, CircuitBreakerState>();
    private readonly defaultThreshold = 3;
    private readonly defaultTimeoutMs = 60000;

    private getState(toolId: string): CircuitBreakerState {
        if (!this.states.has(toolId)) {
            this.states.set(toolId, {
                status: "CLOSED",
                failures: 0,
                threshold: this.defaultThreshold,
                timeoutMs: this.defaultTimeoutMs,
            });
        }
        return this.states.get(toolId) as CircuitBreakerState;
    }

    public recordSuccess(toolId: string) {
        const state = this.getState(toolId);
        state.failures = 0;
        state.status = "CLOSED";
    }

    public recordFailure(toolId: string) {
        const state = this.getState(toolId);
        state.failures += 1;
        state.lastFailureTime = Date.now();
        if (state.failures >= state.threshold) {
            state.status = "OPEN";
        }
    }

    public canExecute(toolId: string): boolean {
        const state = this.getState(toolId);
        if (state.status === "CLOSED") {
            return true;
        }
        if (state.status === "OPEN") {
            const now = Date.now();
            if (state.lastFailureTime && now - state.lastFailureTime > state.timeoutMs) {
                state.status = "HALF_OPEN";
                return true; // Allow one test request
            }
            return false;
        }
        // HALF_OPEN
        return true;
    }
}

export const globalCircuitBreaker = new ToolCircuitBreaker();
