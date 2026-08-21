/**
 * StatusBadge — coloured pill badge for mission/task status values.
 * Previously duplicated verbatim in Dashboard.tsx and MissionsPage.tsx.
 */

type StatusValue =
    "RUNNING" | "PAUSED" | "VALIDATING" | "QUEUED" | "COMPLETED" | "FAILED" | (string & {});

interface StatusConfig {
    bg: string;
    color: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
    RUNNING: {
        bg: "var(--color-hex-0d2010)",
        color: "var(--color-hex-3fb950)",
    },
    PAUSED: {
        bg: "var(--color-hex-1a1a00)",
        color: "var(--color-hex-d29922)",
    },
    VALIDATING: {
        bg: "var(--color-hex-1a0a0b)",
        color: "var(--color-hex-ff2a32)",
    },
    QUEUED: {
        bg: "var(--color-hex-111111)",
        color: "var(--color-hex-666666)",
    },
    COMPLETED: {
        bg: "var(--color-hex-0a1a10)",
        color: "var(--color-hex-3fb950)",
    },
    FAILED: {
        bg: "var(--color-hex-1a0808)",
        color: "var(--color-hex-ff2a32)",
    },
};

const FALLBACK_CONFIG: StatusConfig = {
    bg: "var(--color-hex-111111)",
    color: "var(--color-hex-666666)",
};

interface StatusBadgeProps {
    status: StatusValue;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
    const { bg, color } = STATUS_MAP[status] ?? FALLBACK_CONFIG;

    return (
        <span
            className="rounded-[2px] px-[6px] py-[1px] text-[9.5px] font-semibold tracking-[0.14em]"
            style={{
                background: bg,
                color,
                border: `1px solid ${color}22`,
            }}
        >
            {status}
        </span>
    );
}
