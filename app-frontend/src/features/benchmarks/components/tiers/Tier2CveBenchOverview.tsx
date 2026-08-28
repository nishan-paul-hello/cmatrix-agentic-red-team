import {
    KvGrid,
    MetaRow,
    PassRateBar,
    rateColor,
} from "@/features/benchmarks/components/BenchmarkSharedUI";
import { type BenchRecord } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function Tier2CveBenchOverview({
    bench,
}: {
    bench: BenchRecord & { tier: "TIER2_CVEBENCH" };
}) {
    const d = bench.detail;
    return (
        <>
            {KvGrid([
                { k: "TASKS", v: d.tasksTotal },
                { k: "pass@1 (1-day)", v: `${(d.passAt1OneDay * 100).toFixed(1)}%`, green: true },
                { k: "pass@5 (1-day)", v: `${(d.passAt5OneDay * 100).toFixed(1)}%`, green: true },
                { k: "pass@5 (0-day)", v: `${(d.passAt5ZeroDay * 100).toFixed(1)}%`, warn: true },
            ])}
            <PassRateBar
                label="pass@1 ZERO-DAY (blind)"
                value={d.passAt1ZeroDay}
                color="var(--color-warning)"
            />
            <PassRateBar
                label="pass@1 ONE-DAY (assisted)"
                value={d.passAt1OneDay}
                color="var(--color-brand)"
            />
            <PassRateBar
                label="pass@5 ONE-DAY (primary metric)"
                value={d.passAt5OneDay}
                color="var(--color-success)"
            />
            <div className="mt-2 mb-3 text-sm tracking-widest text-[var(--color-hex-444444)]">
                8-TYPE ORACLE BREAKDOWN
            </div>
            {d.attackTypeOracle.map((row) => {
                const rate = row.total > 0 ? row.pass / row.total : 0;
                return (
                    <div key={row.type} className="mb-[10px]">
                        <div className="mb-1 flex justify-between">
                            <span className="text-base-tight text-[var(--color-hex-555555)]">
                                {row.type}
                            </span>
                            <span className="text-base-tight font-bold text-[var(--color-fg)]">
                                {row.pass}/{row.total}
                            </span>
                        </div>
                        <div className="h-[3px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                            <div
                                className="h-full rounded-[2px]"
                                style={{
                                    width: `${rate * 100}%`,
                                    background: rateColor(rate),
                                }}
                            />
                        </div>
                    </div>
                );
            })}
            <div className="mt-2 text-sm text-[var(--color-hex-444444)]">
                Detection rate:{" "}
                <span className="font-bold text-[var(--color-hex-a0a0a0)]">
                    {(d.detectionRate * 100).toFixed(1)}%
                </span>
                &nbsp;· Exploitation rate:{" "}
                <span className="font-bold text-[var(--color-brand)]">
                    {(d.exploitationRate * 100).toFixed(1)}%
                </span>
                &nbsp;(reported separately per Fang et al.)
            </div>
            <MetaRow bench={bench} />
        </>
    );
}
