import { useState } from "react";

import { MetricTile } from "@/components/ui/MetricTile";
import { useServices } from "@/lib/services-context";
import { type FailureLogEntry } from "@/types/domain-types";

export default function FailureMemory() {
    const { blackboard } = useServices();
    const failures: FailureLogEntry[] = blackboard.readFailures();
    const [selId, setSelId] = useState<string | null>(null);
    const tc: Record<string, string> = {
        TIMEOUT: "var(--color-warning)",
        FAILED: "var(--color-danger)",
        ERROR: "var(--color-danger)",
    };
    const sc: Record<string, string> = {
        LOW: "var(--color-hex-666666)",
        MEDIUM: "var(--color-warning)",
        HIGH: "var(--color-danger)",
        CRITICAL: "var(--color-danger)",
    };
    const sel = (selId ? failures.find((f) => f.id === selId) : failures[0]) ?? null;
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
                        onClick={() => setSelId(f.id === selId ? null : f.id)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setSelId(f.id === selId ? null : f.id);
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
                            <span className="text-base font-bold tracking-normal text-[var(--color-brand)]">
                                {f.id}
                            </span>
                            <span className="text-base-tight text-[var(--color-hex-555555)]">
                                {f.action}
                            </span>
                            <span
                                className="ml-auto text-sm font-semibold tracking-wide"
                                style={{
                                    color: tc[f.type] ?? "var(--color-hex-666666)",
                                }}
                            >
                                {f.type}
                            </span>
                            <span
                                className="text-sm font-semibold tracking-normal"
                                style={{
                                    color: sc[f.severity],
                                }}
                            >
                                {f.severity}
                            </span>
                            <span className="text-sm text-[var(--color-hex-333333)]">{f.ts}</span>
                        </div>
                        <div className="px-4 py-3">
                            <div className="mb-[6px]">
                                <span className="text-sm-tight tracking-wider-2 text-[var(--color-hex-444444)]">
                                    DIAGNOSIS ·{" "}
                                </span>
                                <span className="text-lg-tight leading-relaxed text-[var(--color-hex-555555)]">
                                    {f.diagnosis}
                                </span>
                            </div>
                            <div className="mb-[6px]">
                                <span className="text-sm-tight tracking-wider-2 text-[var(--color-hex-444444)]">
                                    RESOLUTION ·{" "}
                                </span>
                                <span
                                    className="text-lg-tight leading-relaxed"
                                    style={{
                                        color: f.correctable
                                            ? "var(--color-success)"
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
                                <div className="text-sm-tight tracking-wider-3 mb-[4px] text-[var(--color-hex-444444)]">
                                    LESSONS LEARNED
                                </div>
                                {f.lessons.map((l) => (
                                    <div key={l} className="flex items-start gap-2">
                                        <span className="mt-[1px] text-base text-[var(--color-warning)]">
                                            ◆
                                        </span>
                                        <span className="text-lg-tight leading-normal text-[var(--color-hex-555555)]">
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
