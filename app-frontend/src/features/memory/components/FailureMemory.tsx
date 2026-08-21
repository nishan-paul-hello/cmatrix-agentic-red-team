import { useState } from "react";

import { MetricTile } from "@/components/ui/MetricTile";

import { type FailureRecord } from "../data/mockData";
import { globalBlackboard } from "../domain/Blackboard";

export default function FailureMemory() {
    const failures = globalBlackboard.readFailures();
    const [sel, setSel] = useState<FailureRecord | null>(failures[0] || null);
    const tc: Record<string, string> = {
        TIMEOUT: "var(--color-hex-d29922)",
        FAILED: "var(--color-hex-ff2a32)",
        ERROR: "var(--color-hex-ff2a32)",
    };
    const sc: Record<string, string> = {
        LOW: "var(--color-hex-666666)",
        MEDIUM: "var(--color-hex-d29922)",
        HIGH: "var(--color-hex-ff2a32)",
        CRITICAL: "var(--color-hex-ff2a32)",
    };
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-5 flex items-center gap-4">
                    {[
                        {
                            l: "TOTAL FAILURES",
                            v: "3",
                        },
                        {
                            l: "CORRECTABLE",
                            v: "1",
                        },
                        {
                            l: "RULED OUT",
                            v: "2",
                        },
                        {
                            l: "LESSONS ADDED",
                            v: "6",
                        },
                    ].map((m) => (
                        <MetricTile key={m.l} label={m.l} value={m.v} variant="card" />
                    ))}
                </div>
                {failures.map((f) => (
                    <div
                        key={f.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSel(f === sel ? null : f)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setSel(f === sel ? null : f);
                            }
                        }}
                        className="mb-[10px] cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]"
                        style={{
                            background:
                                sel?.id === f.id ? "var(--color-hex-0d0d0d)" : "transparent",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                sel?.id === f.id ? "var(--color-hex-0d0d0d)" : "transparent")
                        }
                    >
                        <div
                            className="flex items-center gap-3 px-4 py-3"
                            style={{
                                borderBottom: "1px solid var(--color-hex-141414)",
                            }}
                        >
                            <span className="text-[9px] font-bold tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                                {f.id}
                            </span>
                            <span className="text-[8.5px] text-[var(--color-hex-555555)]">
                                {f.action}
                            </span>
                            <span
                                className="ml-auto text-[8px] font-semibold tracking-[0.12em]"
                                style={{
                                    color: tc[f.type] ?? "var(--color-hex-666666)",
                                }}
                            >
                                {f.type}
                            </span>
                            <span
                                className="text-[8px] font-semibold tracking-[0.1em]"
                                style={{
                                    color: sc[f.severity],
                                }}
                            >
                                {f.severity}
                            </span>
                            <span className="text-[8px] text-[var(--color-hex-333333)]">
                                {f.ts}
                            </span>
                        </div>
                        <div className="px-4 py-3">
                            <div className="mb-[6px]">
                                <span className="text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                    DIAGNOSIS ·{" "}
                                </span>
                                <span className="text-[9.5px] leading-[1.7] text-[var(--color-hex-555555)]">
                                    {f.diagnosis}
                                </span>
                            </div>
                            <div className="mb-[6px]">
                                <span className="text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                    RESOLUTION ·{" "}
                                </span>
                                <span
                                    className="text-[9.5px] leading-[1.7]"
                                    style={{
                                        color: f.correctable
                                            ? "var(--color-hex-3fb950)"
                                            : "var(--color-hex-666666)",
                                    }}
                                >
                                    {f.resolution}
                                </span>
                            </div>
                            <div
                                className="mt-3 flex flex-col gap-1"
                                style={{
                                    borderTop: "1px solid var(--color-hex-141414)",
                                    paddingTop: 10,
                                }}
                            >
                                <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                    LESSONS LEARNED
                                </div>
                                {f.lessons.map((l) => (
                                    <div key={l} className="flex items-start gap-2">
                                        <span className="mt-[1px] text-[9px] text-[var(--color-hex-d29922)]">
                                            ◆
                                        </span>
                                        <span className="text-[9.5px] leading-[1.6] text-[var(--color-hex-555555)]">
                                            {l}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
