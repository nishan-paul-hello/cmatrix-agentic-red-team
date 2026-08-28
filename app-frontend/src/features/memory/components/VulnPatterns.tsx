import { useEffect, useState } from "react";

import Sub from "@/features/memory/components/Sub";
import { MemoryRepository } from "@/features/memory/data/MemoryRepository";
import { type MemoryNode } from "@/types/domain-types";

export default function VulnPatterns() {
    const [PATTERNS, setData] = useState<MemoryNode[]>([]);
    useEffect(() => {
        void new MemoryRepository()
            .fetchAll<MemoryNode>({ collection: "PATTERNS", limit: 1000 })
            .then(setData);
    }, []);

    const [selId, setSelId] = useState<string | null>(null);

    if (PATTERNS.length === 0) {
        return null;
    }

    const sel = PATTERNS.find((p) => p.id === selId) ?? PATTERNS[0];
    return (
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className="w-panel-md border-border flex-shrink-0 overflow-y-auto border-r">
                <div className="text-muted-foreground border-border border-b text-sm tracking-widest">
                    {PATTERNS.length} PATTERNS
                </div>
                {PATTERNS.map((p) => (
                    <div
                        key={p.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelId(p.id)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setSelId(p.id);
                            }
                        }}
                        className="border-border cursor-pointer border-b px-4 py-3"
                        onMouseEnter={(e) => {
                            if (sel.id !== p.id) {
                                e.currentTarget.style.background = "var(--background)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (sel.id !== p.id) {
                                e.currentTarget.style.background = "transparent";
                            }
                        }}
                    >
                        <div className="mb-1 flex justify-between">
                            <span className="text-primary text-xs font-bold tracking-tight">
                                {p.id}
                            </span>
                            <span className="text-success text-sm">↑{p.score.toFixed(2)}</span>
                        </div>
                        <div className="text-muted-foreground mb-0.5 text-xs">{p.vuln}</div>
                        <div className="text-muted-foreground text-sm">{p.subtype}</div>
                        <div className="mt-2 flex gap-3">
                            <span className="text-muted-foreground text-xs tracking-normal">
                                ×{p.uses} USES
                            </span>
                            <span className="text-muted-foreground text-xs">{p.lastSeen}</span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-5 flex items-baseline gap-3">
                    <h2 className="text-foreground text-sm font-bold tracking-normal">{sel.id}</h2>
                    <span className="text-primary text-base tracking-normal">{sel.vuln}</span>
                    <span className="text-muted-foreground text-base">{sel.subtype}</span>
                </div>
                <div className="border-border mb-5 grid grid-cols-1 gap-0 overflow-hidden rounded-sm border-[1px] border-solid sm:grid-cols-2 lg:grid-cols-3">
                    {[
                        {
                            k: "RELEVANCE",
                            v: sel.score.toFixed(2),
                            red: true,
                        },
                        {
                            k: "USES",
                            v: String(sel.uses),
                        },
                        {
                            k: "LAST APPLIED",
                            v: sel.lastSeen,
                        },
                    ].map((m) => (
                        <div
                            key={m.k}
                            className="bg-background border-border border-r px-3.5 py-2.5"
                        >
                            <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                                {m.k}
                            </div>
                            <div
                                className="text-base font-bold"
                                style={{
                                    color: m.red ? "var(--primary)" : "var(--foreground)",
                                }}
                            >
                                {m.v}
                            </div>
                        </div>
                    ))}
                </div>
                <Sub label="TECHNIQUE SEQUENCE">
                    {sel.techniques.map((t: string, i: number) => (
                        <div key={t} className="mb-2 flex items-center gap-3">
                            <div
                                className="border-border h-4 w-4 shrink-0 border-[1px] border-solid"
                                style={{
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <span className="text-muted-foreground text-xs">{i + 1}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">{t}</span>
                        </div>
                    ))}
                </Sub>
                <Sub label="DETECTION INDICATORS">
                    {sel.indicators.map((ind: string) => (
                        <div key={ind} className="mb-2 flex items-center gap-2">
                            <div
                                className="bg-primary h-1 w-1 shrink-0"
                                style={{
                                    borderRadius: "50%",
                                }}
                            />
                            <span className="text-muted-foreground text-xs">{ind}</span>
                        </div>
                    ))}
                </Sub>
                <Sub label="PATTERN EVOLUTION" last>
                    {sel.evolution.map(
                        (
                            ev: { ts: string; note?: string },
                            i: number,
                            a: { ts: string; note?: string }[],
                        ) => (
                            <div key={ev.ts} className="flex items-start gap-3">
                                <div className="flex shrink-0 flex-col items-center">
                                    <div
                                        className="border-primary mt-0.5 h-1.5 w-1.5 border-[1px] border-solid"
                                        style={{
                                            borderRadius: "50%",
                                            background:
                                                i === a.length - 1
                                                    ? "var(--primary)"
                                                    : "transparent",
                                        }}
                                    />
                                    {i < a.length - 1 && <div className="bg-muted h-5 w-px" />}
                                </div>
                                <div>
                                    <span className="text-muted-foreground mr-2 text-sm">
                                        {ev.ts}
                                    </span>
                                    <span className="text-muted-foreground text-base leading-normal">
                                        {ev.note}
                                    </span>
                                </div>
                            </div>
                        ),
                    )}
                </Sub>
            </div>
        </div>
    );
}
