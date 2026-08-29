import StepHeading from "@/features/missions/components/wizard/StepHeading";
import {
    SURFACE_SPECIALISTS,
    type ModeType,
    type SurfaceType,
    type TargetType,
} from "@/features/missions/data/fixtures/wizardMockData";

export default function ReviewStep({
    target,
    targetType,
    surface,
    mode,
    maxRuntime,
    costCeiling,
    toolTimeout,
    roe,
}: {
    target: string;
    targetType: TargetType;
    surface: SurfaceType;
    mode: ModeType;
    maxRuntime: string;
    costCeiling: string;
    toolTimeout: string;
    roe: string;
}) {
    const specialists = SURFACE_SPECIALISTS[surface];
    const isOracle = targetType === "BENCHMARK ENVIRONMENT";
    const costNum = parseFloat(costCeiling) || 0;
    const rows: {
        label: string;
        value: string;
        valueColor?: string;
        mono?: boolean;
        warn?: boolean;
    }[] = [
        {
            label: "TARGET",
            value: target || "—",
            valueColor: "text-primary",
            mono: true,
        },
        {
            label: "TARGET TYPE",
            value: targetType,
        },
        {
            label: "SURFACE",
            value: surface,
        },
        {
            label: "MODE",
            value: mode,
            valueColor: mode === "ZERO-DAY" ? "text-destructive" : "text-warning",
        },
        {
            label: "MAX RUNTIME",
            value: `${maxRuntime} min / vulnerability`,
        },
        {
            label: "COST CEILING",
            value: `$${parseFloat(costCeiling).toFixed(2)}`,
            valueColor: costNum > 50 ? "text-warning" : "text-foreground",
            warn: costNum > 50,
        },
        {
            label: "TOOL TIMEOUT",
            value: `${toolTimeout} seconds`,
        },
        {
            label: "SPECIALISTS",
            value: specialists.join("  ·  "),
        },
        {
            label: "VALIDATION",
            value: isOracle ? "ORACLE CONFIRMED (CVE-BENCH)" : "E_ord THRESHOLD (≥ 4)",
        },
        {
            label: "MEMORY",
            value: "ENABLED — Vulnerability patterns, strategies, episodic failures",
        },
        {
            label: "EARLY STOP",
            value: "ENABLED — Halt on cost ceiling or runtime breach",
        },
    ];
    return (
        <>
            <StepHeading step={5} label="REVIEW & CONFIRM" />
            <div className="text-muted-foreground mb-6 text-xs leading-relaxed tracking-normal">
                Review the full mission configuration before launch. Once started, cost ceiling and
                rules of engagement cannot be modified.
            </div>

            {/* Main config table */}
            <div className="border-border mb-5 overflow-hidden rounded-sm border-[1px] border-solid">
                {rows.map((row) => (
                    <div key={row.label} className="border-border flex border-b">
                        <div className="text-muted-foreground border-border w-panel-2xs shrink-0 border-r px-4 py-2.5 text-xs font-semibold tracking-widest uppercase">
                            {row.label}
                        </div>
                        <div
                            className={`flex flex-1 items-center gap-2 px-4 py-2.5 text-xs leading-snug tracking-tight ${row.valueColor ?? "text-muted-foreground"}`}
                        >
                            <span className="font-inherit">{row.value}</span>
                            {row.warn && (
                                <span className="border-border bg-muted text-warning shrink-0 rounded-sm border-[1px] border-solid px-1 py-px text-sm tracking-wide">
                                    HIGH
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ROE block */}
            <div className="border-border mb-6 overflow-hidden rounded-sm border-[1px] border-solid">
                <div className="bg-card text-muted-foreground border-border border-b px-4 py-2 text-xs font-semibold tracking-widest uppercase">
                    RULES OF ENGAGEMENT
                </div>
                <div className="leading-relaxed-2 bg-background text-muted-foreground px-4 py-3 text-xs tracking-tighter">
                    {roe || "—"}
                </div>
            </div>

            {/* System confirmations */}
            <div className="border-border mb-2 overflow-hidden rounded-sm border-[1px] border-solid">
                <div className="bg-background text-muted-foreground border-border border-b px-4 py-2 text-xs font-semibold tracking-widest uppercase">
                    PRE-FLIGHT CHECKS
                </div>
                {[
                    {
                        ok: true,
                        label: "Target reachability",
                        detail: "DNS resolved — 104.21.3.212",
                    },
                    {
                        ok: true,
                        label: "Cost ceiling configured",
                        detail: `$${parseFloat(costCeiling).toFixed(2)} ceiling set`,
                    },
                    {
                        ok: true,
                        label: "Specialist agents available",
                        detail: `${specialists.length} agents ready`,
                    },
                    {
                        ok: isOracle,
                        label: "Oracle validation",
                        detail: isOracle
                            ? "CVE-BENCH oracle linked"
                            : "Manual E_ord threshold (≥ 4)",
                    },
                    {
                        ok: true,
                        label: "Memory subsystem",
                        detail: "Vulnerability pattern DB: 847 records",
                    },
                ].map((chk) => (
                    <div
                        key={chk.label}
                        className="bg-background border-border flex items-center gap-3 border-b px-4 py-2"
                    >
                        <span
                            className={`shrink-0 text-xs ${chk.ok ? "text-success" : "text-warning"}`}
                        >
                            {chk.ok ? "✓" : "⚠"}
                        </span>
                        <span
                            className={`min-w-[200px] text-xs tracking-tight ${chk.ok ? "text-muted-foreground" : "text-warning"}`}
                        >
                            {chk.label}
                        </span>
                        <span className="text-muted-foreground text-xs tracking-tight">
                            {chk.detail}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}
