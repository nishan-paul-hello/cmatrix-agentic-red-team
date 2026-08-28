import React, { useEffect } from "react";
import { FocusTrap } from "focus-trap-react";

import { Button } from "@/components/ui/button";
import { STATUS_C } from "@/features/specialists/constants";
import { type VDGEntry } from "@/features/specialists/data/fixtures/teamDashboardMockData";

export function UCBModal({
    entry,
    totalVisits,
    onClose,
}: {
    entry: VDGEntry;
    totalVisits: number;
    onClose: () => void;
}) {
    // F10: ESC key closes modal
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    const epss = 0.42;
    const bars = [
        {
            label: "EXPLOIT TERM",
            value: entry.exploit,
            color: "var(--primary)",
            desc: "Q(s,a) — average reward from past attempts",
        },
        {
            label: "EXPLORE TERM",
            value: entry.explore,
            color: "var(--success)",
            desc: "c × √(ln N / n) — exploration bonus",
        },
        {
            label: "EPSS PRIOR",
            value: epss,
            color: "var(--warning)",
            desc: "λ × EPSS score — initial exploitability prior from NVD/FIRST API",
        },
        {
            label: "UCB SCORE",
            value: entry.ucb,
            color: "var(--destructive)",
            desc: "Combined final selection score",
        },
    ];
    const C = 0.4;
    const N = totalVisits;
    const n = entry.visits;
    return (
        <FocusTrap focusTrapOptions={{ escapeDeactivates: false }}>
            <div
                role="presentation"
                onKeyDown={(e) => {
                    if (e.key === "Escape" || e.key === "Enter") {
                        onClose();
                    }
                }}
                className="bg-muted fixed inset-0 flex items-center justify-center"
                style={{
                    zIndex: 60,
                }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="ucb-modal-title"
                    className="w-panel-lg border-border bg-background rounded-sm border-[1px] border-solid"
                >
                    {/* Header */}
                    <div className="border-border flex items-start justify-between border-b px-5 pt-4 pb-3">
                        <div>
                            <div
                                id="ucb-modal-title"
                                className="text-foreground mb-0.5 text-sm font-bold tracking-normal"
                            >
                                UCB BREAKDOWN
                            </div>
                            <div className="text-primary text-base tracking-normal">
                                {entry.id} — {entry.type}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={onClose}
                            className="text-muted-foreground"
                        >
                            ✕
                        </Button>
                    </div>
                    <div className="px-5 py-5">
                        {/* Formula */}
                        <div className="border-border bg-background mb-5 rounded-sm border-[1px] border-solid px-4 py-3 text-center">
                            <div className="text-muted-foreground mb-1.5 text-xs tracking-tight">
                                UCB FORMULA
                            </div>
                            <div className="text-muted-foreground text-sm tracking-tight">
                                UCB(s) = <span className="text-primary">Q(s,a)</span> +{" "}
                                <span className="text-success">c × √(ln N / n)</span>
                            </div>
                            <div className="text-muted-foreground mt-2 text-base tracking-tight">
                                c={C} · N={N} total visits · n={n === 0 ? "0 (new node)" : n} visits
                                · ln(N)=
                                {Math.log(N || 1).toFixed(3)}
                            </div>
                            {/* G1: c constant note */}
                            <div className="text-muted-foreground mt-1.5 text-sm tracking-normal">
                                UCB POLICY c = {C.toFixed(2)} — configurable in Settings → VDG
                            </div>
                        </div>
                        {/* Score bars */}
                        {bars.map((b) => (
                            <div key={b.label} className="mb-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <div>
                                        <span className="text-muted-foreground text-base font-semibold tracking-widest">
                                            {b.label}
                                        </span>
                                        <div className="text-muted-foreground mt-0.5 text-sm">
                                            {b.desc}
                                        </div>
                                    </div>
                                    <span
                                        className="text-base font-bold"
                                        style={{
                                            color: b.color,
                                        }}
                                    >
                                        {b.value.toFixed(3)}
                                    </span>
                                </div>
                                <div className="bg-card h-1 overflow-hidden rounded-sm">
                                    <div
                                        className="h-full rounded-sm"
                                        style={{
                                            width: `${b.value * 100}%`,
                                            background: b.color,
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        {/* G3: EPSS ONE-DAY mode footnote */}
                        <div className="text-muted-foreground mt-1.5 text-sm tracking-normal">
                            ONE-DAY mode: Q(s,a) seeded from EPSS prior
                        </div>
                        {/* Stats grid */}
                        <div className="border-border mt-4 grid grid-cols-1 gap-0 overflow-hidden rounded-sm border-[1px] border-solid sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    k: "E_ORD",
                                    v: `${entry.eord}/5`,
                                },
                                {
                                    k: "VISITS",
                                    v: String(entry.visits),
                                },
                                {
                                    k: "STATUS",
                                    v: entry.status,
                                },
                                {
                                    k: "COST",
                                    v: entry.cost,
                                },
                            ].map((m) => (
                                <div
                                    key={m.k}
                                    className="bg-background border-border border-r px-3 py-2.5"
                                >
                                    <div className="text-muted-foreground mb-1 text-xs tracking-widest">
                                        {m.k}
                                    </div>
                                    <div
                                        className="text-sm font-bold"
                                        style={{
                                            color:
                                                m.k === "STATUS"
                                                    ? STATUS_C[entry.status]
                                                    : "var(--foreground)",
                                        }}
                                    >
                                        {m.v}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </FocusTrap>
    );
}
