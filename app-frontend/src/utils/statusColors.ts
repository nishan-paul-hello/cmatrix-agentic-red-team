export const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
    SUCCESS: { color: "var(--color-success)", bg: "var(--color-hex-0a1a10)" },
    COMPLETED: { color: "var(--color-success)", bg: "var(--color-hex-0a1a10)" },
    VALIDATING: { color: "var(--color-danger)", bg: "var(--color-hex-1a0a0b)" },
    RUNNING: { color: "var(--color-success)", bg: "var(--color-hex-0d2010)" },
    FAILED: { color: "var(--color-danger)", bg: "var(--color-hex-1a0808)" },
    TIMEOUT: { color: "var(--color-warning)", bg: "var(--color-hex-1a1a00)" },
    PAUSED: { color: "var(--color-warning)", bg: "var(--color-hex-1a1a00)" },
    QUEUED: { color: "var(--color-hex-666666)", bg: "var(--color-hex-111111)" },
    PENDING: { color: "var(--color-hex-666666)", bg: "var(--color-hex-111111)" },
    IDLE: { color: "var(--color-hex-666666)", bg: "var(--color-hex-111111)" },
    WAITING: { color: "var(--color-warning)", bg: "var(--color-hex-1a1200)" },
    BLOCKED: { color: "var(--color-danger)", bg: "var(--color-hex-1a0608)" },
    VALIDATED: { color: "var(--color-success)", bg: "var(--color-hex-0a1a10)" },
    RULED_OUT: { color: "var(--color-hex-666666)", bg: "var(--color-hex-111111)" },
    ORACLE_CONFIRMED: { color: "var(--color-hex-a371f7)", bg: "var(--color-hex-1a0f2e)" },
    DEFAULT: { color: "var(--color-hex-666666)", bg: "var(--color-hex-111111)" },
};

export function getStatusColor(status: string) {
    return STATUS_COLORS[status.toUpperCase().replace(" ", "_")] ?? STATUS_COLORS.DEFAULT;
}
