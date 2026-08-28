import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

/** Returns the color token for green/warn/red/neutral priority */
export function kvColor(green?: boolean, warn?: boolean, red?: boolean): string {
    if (green) {
        return "var(--color-success)";
    }
    if (warn) {
        return "var(--color-warning)";
    }
    if (red) {
        return "var(--color-danger)";
    }
    return "var(--color-fg)";
}

/** Returns color for a 0-1 rate: ≥0.8 green, ≥0.5 amber, else red */
export function rateColor(rate: number): string {
    if (rate >= 0.8) {
        return "var(--color-success)";
    }
    if (rate >= 0.5) {
        return "var(--color-warning)";
    }
    return "var(--color-danger)";
}

/** Returns color for ADM gate: pass=green, fail=red, non-gate=white */
export function gateColor(isGate: boolean, passed: boolean): string {
    if (!isGate) {
        return "var(--color-fg)";
    }
    return passed ? "var(--color-success)" : "var(--color-danger)";
}

export type FailureClass = (typeof FAILURE_CLASSES)[number];
export const FAILURE_CLASSES = ["AuthBypass", "JS attacks", "Hard SQLi", "XSS+CSRF"] as const;

/** Small shared KV grid for overview cards */
export function KvGrid(
    items: { k: string; v: string | number; green?: boolean; warn?: boolean; red?: boolean }[],
) {
    return (
        <div
            className="mb-6 grid overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]"
            style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
        >
            {items.map((m, i, a) => (
                <div
                    key={m.k}
                    className="bg-[var(--color-hex-0d0d0d)] px-[18px] py-[14px]"
                    style={{
                        borderRight:
                            i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                    }}
                >
                    <div className="text-sm-tight tracking-wider-3 mb-[5px] text-[var(--color-hex-444444)]">
                        {m.k}
                    </div>
                    <div
                        className="text-10xl font-bold"
                        style={{ color: kvColor(m.green, m.warn, m.red) }}
                    >
                        {m.v}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function MetaRow({ bench }: { bench: BenchRecord }) {
    return (
        <div className="mt-5 grid grid-cols-3 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
            {[
                { k: "AVG COST", v: bench.avgCost },
                { k: "AVG TIME", v: bench.avgTime },
                { k: "DATE", v: bench.date },
            ].map((m, i, a) => (
                <div
                    key={m.k}
                    className="bg-[var(--color-hex-0d0d0d)] px-[16px] py-[12px]"
                    style={{
                        borderRight:
                            i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                    }}
                >
                    <div className="text-sm-tight tracking-wider-3 mb-[4px] text-[var(--color-hex-444444)]">
                        {m.k}
                    </div>
                    <div className="text-4xl font-bold text-[var(--color-fg)]">{m.v}</div>
                </div>
            ))}
        </div>
    );
}

export function PassRateBar({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    return (
        <div className="mb-[14px]">
            <div className="mb-2 flex justify-between">
                <span className="tracking-wider-1 text-base text-[var(--color-hex-444444)]">
                    {label}
                </span>
                <span className="text-lg font-bold" style={{ color }}>
                    {(value * 100).toFixed(1)}%
                </span>
            </div>
            <div className="h-[4px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                <div
                    className="h-full rounded-[2px]"
                    style={{ width: `${value * 100}%`, background: color }}
                />
            </div>
        </div>
    );
}
