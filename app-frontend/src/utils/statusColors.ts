export const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
    SUCCESS: { color: "var(--color-hex-3fb950)", bg: "var(--color-hex-0a1a10)" },
    COMPLETED: { color: "var(--color-hex-3fb950)", bg: "var(--color-hex-0a1a10)" },
    VALIDATING: { color: "var(--color-hex-d29922)", bg: "var(--color-hex-1a1200)" },
    RUNNING: { color: "var(--color-hex-3fb950)", bg: "var(--color-hex-0a1a10)" },
    FAILED: { color: "var(--color-hex-ff2a32)", bg: "var(--color-hex-1a0608)" },
    TIMEOUT: { color: "var(--color-hex-d29922)", bg: "var(--color-hex-1a1200)" },
    PAUSED: { color: "var(--color-hex-a0a0a0)", bg: "var(--color-hex-222222)" },
    QUEUED: { color: "var(--color-hex-666666)", bg: "var(--color-hex-111111)" },
    PENDING: { color: "var(--color-hex-666666)", bg: "var(--color-hex-111111)" },
    IDLE: { color: "var(--color-hex-666666)", bg: "var(--color-hex-111111)" },
    WAITING: { color: "var(--color-hex-d29922)", bg: "var(--color-hex-1a1200)" },
    BLOCKED: { color: "var(--color-hex-ff2a32)", bg: "var(--color-hex-1a0608)" },
    VALIDATED: { color: "var(--color-hex-3fb950)", bg: "var(--color-hex-0a1a10)" },
    RULED_OUT: { color: "var(--color-hex-666666)", bg: "var(--color-hex-111111)" },
    ORACLE_CONFIRMED: { color: "var(--color-hex-a371f7)", bg: "var(--color-hex-1a0f2e)" },
    DEFAULT: { color: "var(--color-hex-a0a0a0)", bg: "var(--color-hex-222222)" },
};

export function getStatusColor(status: string) {
    return STATUS_COLORS[status.toUpperCase().replace(" ", "_")] ?? STATUS_COLORS.DEFAULT;
}
