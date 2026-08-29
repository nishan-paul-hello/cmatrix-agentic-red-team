import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

/** Returns the color token for green/warn/red/neutral priority */
export function kvColor(green?: boolean, warn?: boolean, red?: boolean): string {
    if (green) {
        return "text-success";
    }
    if (warn) {
        return "text-warning";
    }
    if (red) {
        return "text-destructive";
    }
    return "text-foreground";
}

/** Returns color for a 0-1 rate: ≥0.8 green, ≥0.5 amber, else red */
export function rateColor(rate: number): string {
    if (rate >= 0.8) {
        return "text-success";
    }
    if (rate >= 0.5) {
        return "text-warning";
    }
    return "text-destructive";
}

/** Returns color for ADM gate: pass=green, fail=red, non-gate=white */
export function gateColor(isGate: boolean, passed: boolean): string {
    if (!isGate) {
        return "text-foreground";
    }
    return passed ? "text-success" : "text-destructive";
}

export type FailureClass = (typeof FAILURE_CLASSES)[number];
export const FAILURE_CLASSES = ["AuthBypass", "JS attacks", "Hard SQLi", "XSS+CSRF"] as const;

/** Small shared KV grid for overview cards */
export function KvGrid(
    items: { k: string; v: string | number; green?: boolean; warn?: boolean; red?: boolean }[],
) {
    return (
        <div
            className="border-border mb-6 grid overflow-hidden rounded-sm border-[1px] border-solid"
            style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
        >
            {items.map((m) => (
                <div key={m.k} className="bg-background border-border border-r px-4 py-3.5">
                    <div className="text-muted-foreground mb-1 text-xs tracking-widest">{m.k}</div>
                    <div className={`text-xs font-bold ${kvColor(m.green, m.warn, m.red)}`}>
                        {m.v}
                    </div>
                </div>
            ))}
        </div>
    );
}

export function MetaRow({ bench }: { bench: BenchRecord }) {
    return (
        <div className="border-border mt-5 grid grid-cols-1 gap-0 overflow-hidden rounded-sm border-[1px] border-solid sm:grid-cols-2 lg:grid-cols-3">
            {[
                { k: "AVG COST", v: bench.avgCost },
                { k: "AVG TIME", v: bench.avgTime },
                { k: "DATE", v: bench.date },
            ].map((m) => (
                <div key={m.k} className="bg-background border-border border-r px-4 py-3">
                    <div className="text-muted-foreground mb-1 text-xs tracking-widest">{m.k}</div>
                    <div className="text-foreground text-sm font-bold">{m.v}</div>
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
        <div className="mb-3.5">
            <div className="mb-2 flex justify-between">
                <span className="text-muted-foreground text-base tracking-widest">{label}</span>
                <span className={`text-xs font-bold ${color}`}>{(value * 100).toFixed(1)}%</span>
            </div>
            <div className="bg-card h-1 overflow-hidden rounded-sm">
                <div
                    className={`h-full rounded-sm ${color.replace("text-", "bg-")}`}
                    style={{ width: `${value * 100}%` }}
                />
            </div>
        </div>
    );
}
