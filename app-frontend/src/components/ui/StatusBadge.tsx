import { cn } from "@/lib/utils";
import { type MissionStatus, type TaskStatus } from "@/types/domain-types";

const STATUS_VARIANTS: Record<string, string> = {
    SUCCESS: "bg-success/10 text-success hover:bg-success/20 border-success/20",
    COMPLETED: "bg-success/10 text-success hover:bg-success/20 border-success/20",
    VALIDATING: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
    RUNNING: "bg-success/10 text-success hover:bg-success/20 border-success/20",
    FAILED: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
    TIMEOUT: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20",
    PAUSED: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20",
    WAITING: "bg-warning/10 text-warning hover:bg-warning/20 border-warning/20",
    QUEUED: "bg-muted text-muted-foreground hover:bg-muted/80 border-border",
    PENDING: "bg-muted text-muted-foreground hover:bg-muted/80 border-border",
    IDLE: "bg-muted text-muted-foreground hover:bg-muted/80 border-border",
    RULED_OUT: "bg-muted text-muted-foreground hover:bg-muted/80 border-border",
    BLOCKED: "bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20",
    VALIDATED: "bg-success/10 text-success hover:bg-success/20 border-success/20",
    ORACLE_CONFIRMED:
        "bg-accent-purple/10 text-accent-purple hover:bg-accent-purple/20 border-accent-purple/20",
    DEFAULT: "bg-muted text-muted-foreground hover:bg-muted/80 border-border",
};

type StatusValue = MissionStatus | TaskStatus | (string & {});

interface StatusBadgeProps {
    status: StatusValue;
    className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
    const formattedStatus = status.toUpperCase().replace(" ", "_");
    const variantClasses = STATUS_VARIANTS[formattedStatus] || STATUS_VARIANTS.DEFAULT;

    return (
        <div
            className={cn(
                "focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none",
                "uppercase",
                variantClasses,
                className,
            )}
        >
            {status}
        </div>
    );
}

export function getStatusColor(status: string): { color: string } {
    const formatted = status.toUpperCase().replace(" ", "_");
    switch (formatted) {
        case "SUCCESS":
        case "COMPLETED":
        case "RUNNING":
        case "VALIDATED":
            return { color: "var(--success)" };
        case "VALIDATING":
        case "FAILED":
        case "BLOCKED":
            return { color: "var(--destructive)" };
        case "TIMEOUT":
        case "PAUSED":
        case "WAITING":
            return { color: "var(--warning)" };
        case "QUEUED":
        case "PENDING":
        case "IDLE":
        case "RULED_OUT":
            return { color: "var(--muted-foreground)" };
        case "ORACLE_CONFIRMED":
            return { color: "var(--accent-purple)" };
        default:
            return { color: "var(--muted-foreground)" };
    }
}
