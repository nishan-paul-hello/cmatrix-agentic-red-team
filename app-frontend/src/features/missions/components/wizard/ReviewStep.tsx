import StepHeading from "@/features/missions/components/wizard/StepHeading";
import {
    SURFACE_SPECIALISTS,
    type ModeType,
    type SurfaceType,
    type TargetType,
} from "@/features/missions/data/wizardMockData";

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
            valueColor: "var(--color-hex-e31b23)",
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
            valueColor: mode === "ZERO-DAY" ? "var(--color-hex-ff2a32)" : "var(--color-hex-d29922)",
        },
        {
            label: "MAX RUNTIME",
            value: `${maxRuntime} min / vulnerability`,
        },
        {
            label: "COST CEILING",
            value: `$${parseFloat(costCeiling).toFixed(2)}`,
            valueColor: costNum > 50 ? "var(--color-hex-d29922)" : "var(--color-hex-f2f2f2)",
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
            <div className="mb-[24px] text-[9.5px] leading-[1.7] tracking-[0.12em] text-[var(--color-hex-666666)]">
                Review the full mission configuration before launch. Once started, cost ceiling and
                rules of engagement cannot be modified.
            </div>

            {/* Main config table */}
            <div className="mb-[20px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)]">
                {rows.map((row, i) => (
                    <div
                        key={row.label}
                        className="flex"
                        style={{
                            borderBottom:
                                i < rows.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            background:
                                i % 2 === 0 ? "var(--color-hex-0d0d0d)" : "var(--color-hex-0b0b0b)",
                        }}
                    >
                        <div
                            className="w-[148px] shrink-0 px-[16px] py-[10px] text-[9px] font-semibold tracking-[0.2em] text-[var(--color-hex-444444)]"
                            style={{
                                borderRight: "1px solid var(--color-hex-1a1a1a)",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {row.label}
                        </div>
                        <div
                            className="flex-1 px-[16px] py-[10px] text-[10.5px] leading-[1.5] tracking-[0.05em]"
                            style={{
                                color: row.valueColor ?? "var(--color-hex-a0a0a0)",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <span className="font-inherit">{row.value}</span>
                            {row.warn && (
                                <span className="shrink-0 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-d2992244)] bg-[var(--color-hex-1a1200)] px-[5px] py-[1px] text-[8.5px] tracking-[0.12em] text-[var(--color-hex-d29922)]">
                                    HIGH
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ROE block */}
            <div className="mb-[24px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)]">
                <div
                    className="bg-[var(--color-hex-111111)] px-[16px] py-[8px] text-[9px] font-semibold tracking-[0.2em] text-[var(--color-hex-444444)]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                    }}
                >
                    RULES OF ENGAGEMENT
                </div>
                <div className="bg-[var(--color-hex-0d0d0d)] px-[16px] py-[12px] text-[10px] leading-[1.75] tracking-[0.04em] text-[var(--color-hex-555555)]">
                    {roe || "—"}
                </div>
            </div>

            {/* System confirmations */}
            <div className="mb-[8px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                <div
                    className="bg-[var(--color-hex-0b0b0b)] px-[16px] py-[8px] text-[9px] font-semibold tracking-[0.2em] text-[var(--color-hex-444444)]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                    }}
                >
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
                ].map((chk, i, arr) => (
                    <div
                        key={chk.label}
                        className="flex items-center gap-3 bg-[var(--color-hex-0d0d0d)] px-[16px] py-[9px]"
                        style={{
                            borderBottom:
                                i < arr.length - 1 ? "1px solid var(--color-hex-141414)" : "none",
                        }}
                    >
                        <span
                            className="shrink-0 text-[11px]"
                            style={{
                                color: chk.ok
                                    ? "var(--color-hex-3fb950)"
                                    : "var(--color-hex-d29922)",
                            }}
                        >
                            {chk.ok ? "✓" : "⚠"}
                        </span>
                        <span
                            className="min-w-[200px] text-[10px] tracking-[0.08em]"
                            style={{
                                color: chk.ok
                                    ? "var(--color-hex-a0a0a0)"
                                    : "var(--color-hex-d29922)",
                            }}
                        >
                            {chk.label}
                        </span>
                        <span className="text-[9px] tracking-[0.06em] text-[var(--color-hex-444444)]">
                            {chk.detail}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
}
