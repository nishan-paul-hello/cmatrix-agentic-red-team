import { useState } from "react";

import { Button } from "@/components/ui/button";
import { KPIStrip } from "@/components/ui/KPIStrip";
import {
    FAILURE_CLUSTERS,
    FAILURE_TIMELINE,
} from "@/features/research/data/fixtures/researchMockData";

export default function FailureAnalysis() {
    const [sel, setSel] = useState<(typeof FAILURE_CLUSTERS)[0] | null>(null);
    const total = FAILURE_CLUSTERS.reduce((s, c) => s + c.count, 0);
    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                {/* KPIs */}
                <KPIStrip
                    className="mb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    items={[
                        {
                            k: "TOTAL FAILURES",
                            v: String(total),
                        },
                        {
                            k: "UNIQUE CLUSTERS",
                            v: String(FAILURE_CLUSTERS.length),
                        },
                        {
                            k: "FIXABLE",
                            v: String(
                                FAILURE_CLUSTERS.slice(0, 4).reduce((s, c) => s + c.count, 0),
                            ),
                        },
                    ]}
                />
                {/* Failure clusters */}
                <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                    FAILURE CLUSTERS
                </div>
                {FAILURE_CLUSTERS.map((c) => (
                    <div
                        key={c.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSel(sel?.id === c.id ? null : c)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setSel(sel?.id === c.id ? null : c);
                            }
                        }}
                        className="border-border mb-2 cursor-pointer rounded-sm border-[1px] border-solid"
                        style={{
                            background: sel?.id === c.id ? "var(--background)" : "transparent",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--background)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                sel?.id === c.id ? "var(--background)" : "transparent")
                        }
                    >
                        <div className="flex items-center gap-3 px-4 py-3">
                            <div
                                className="h-2.5 w-2.5 shrink-0 rounded-sm"
                                style={{
                                    background: c.color,
                                }}
                            />
                            <span className="text-muted-foreground flex-1 text-xs font-bold tracking-tight">
                                {c.label}
                            </span>
                            <span
                                className="text-sm font-bold"
                                style={{
                                    color: c.color,
                                }}
                            >
                                {c.count}
                            </span>
                            <span className="text-muted-foreground min-w-8 text-right text-base">
                                {c.pct}%
                            </span>
                        </div>
                        <div
                            className="bg-card h-0.5 overflow-hidden rounded-sm"
                            style={{
                                margin: "0 16px 0",
                                marginBottom: sel?.id === c.id ? 0 : 10,
                            }}
                        >
                            <div
                                className="h-full"
                                style={{
                                    width: `${c.pct}%`,
                                    background: c.color,
                                }}
                            />
                        </div>
                        {sel?.id === c.id && (
                            <div className="border-border mt-2 border-t px-4 py-3">
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-muted-foreground text-sm tracking-widest">
                                        {c.id} DETAIL
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSel(null);
                                        }}
                                        className="text-muted-foreground hover:text-muted-foreground h-auto p-0.5 text-sm leading-none hover:bg-transparent"
                                    >
                                        ✕
                                    </Button>
                                </div>
                                <div className="text-muted-foreground mb-2.5 text-base leading-loose">
                                    {c.desc}
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-success shrink-0 text-sm font-bold tracking-widest">
                                        FIX →
                                    </span>
                                    <span className="text-success text-base leading-relaxed">
                                        {c.fix}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {/* Failure timeline */}
                <div className="text-muted-foreground mt-5 mb-3 text-sm tracking-widest">
                    RECENT FAILURES
                </div>
                <div className="border-border overflow-hidden rounded-sm border-[1px] border-solid">
                    <div className="bg-card border-border flex border-b">
                        {["TIME", "TYPE", "RUN", "TASK", "COST", "ATTEMPTS", "RESOLVED"].map(
                            (h) => (
                                <div
                                    key={h}
                                    className="text-muted-foreground px-3 py-1 text-xs font-semibold tracking-widest"
                                    style={{
                                        flex: h === "TYPE" ? 2 : 1,
                                    }}
                                >
                                    {h}
                                </div>
                            ),
                        )}
                    </div>
                    {FAILURE_TIMELINE.map((f) => (
                        <div key={f.ts} className="border-border flex items-center border-b">
                            <div className="text-muted-foreground flex-1 px-3 py-1.5 text-sm">
                                {f.ts}
                            </div>
                            <div
                                className="text-muted-foreground px-3 py-1.5 text-base font-semibold tracking-tight"
                                style={{
                                    flex: 2,
                                }}
                            >
                                {f.type}
                            </div>
                            <div className="text-primary flex-1 px-3 py-1.5 text-base">{f.run}</div>
                            <div className="text-muted-foreground flex-1 px-3 py-1.5 text-base">
                                {f.task}
                            </div>
                            <div className="text-muted-foreground flex-1 px-3 py-1.5 text-base">
                                {f.cost}
                            </div>
                            <div
                                className="flex-1 px-3 py-1.5 text-base"
                                style={{
                                    color:
                                        f.attempts > 2
                                            ? "var(--warning)"
                                            : "var(--muted-foreground)",
                                }}
                            >
                                {f.attempts}
                            </div>
                            <div className="flex-1 px-3 py-1.5">
                                <span
                                    className="text-sm font-bold"
                                    style={{
                                        color: f.resolved ? "var(--success)" : "var(--border)",
                                    }}
                                >
                                    {f.resolved ? "YES" : "—"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
