import { useState } from "react";

import { Button } from "@/components/ui/button";
import AttackPath from "@/features/findings/components/AttackPath";
import EvidenceViewer from "@/features/findings/components/EvidenceViewer";
import TrajectoryTab from "@/features/findings/components/TrajectoryTab";
import ValidationTab from "@/features/findings/components/ValidationTab";
import { SEV_C, STATUS_C, type Tab } from "@/features/findings/data/fixtures/findingsMockData";
import { type Finding } from "@/types/domain-types";

export default function FindingDetail({ f, onBack }: { f: Finding; onBack: () => void }) {
    const [tab, setTab] = useState<Tab>("OVERVIEW");
    const [evOpen, setEvOpen] = useState(false);
    const sc = SEV_C[f.severity];
    const stc = STATUS_C[f.status] ?? "var(--muted-foreground)";
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-0">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-muted-foreground hover:text-muted-foreground mb-2.5 h-auto p-0 text-base tracking-widest hover:bg-transparent"
                >
                    ← FINDINGS
                </Button>
                <div className="mb-3 flex items-center gap-3">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">{f.id}</h1>
                    <span
                        className="rounded-sm px-1.5 py-0.5 text-base font-semibold tracking-widest"
                        style={{
                            color: sc.color,
                            background: sc.bg,
                            border: `1px solid ${sc.color}33`,
                        }}
                    >
                        {f.severity}
                    </span>
                    <span
                        className="text-base font-semibold tracking-wide"
                        style={{
                            color: stc,
                        }}
                    >
                        {f.status}
                    </span>
                </div>
                <div className="flex overflow-x-auto">
                    {(
                        ["OVERVIEW", "EVIDENCE", "ATTACK PATH", "VALIDATION", "TRAJECTORY"] as Tab[]
                    ).map((t) => (
                        <Button
                            key={t}
                            variant="ghost"
                            onClick={() => setTab(t)}
                            className="h-auto rounded-none px-3.5 py-1 text-base tracking-widest whitespace-nowrap hover:bg-transparent"
                            style={{
                                borderBottom:
                                    t === tab
                                        ? "2px solid var(--primary)"
                                        : "2px solid transparent",
                                color: t === tab ? "var(--foreground)" : "var(--muted-foreground)",
                                marginBottom: -1,
                            }}
                        >
                            {t}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="flex min-h-0 flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {tab === "OVERVIEW" && (
                        <>
                            <div className="border-border mb-5 overflow-hidden rounded-sm border-[1px] border-solid">
                                {[
                                    {
                                        k: "FINDING ID",
                                        v: f.id,
                                    },
                                    {
                                        k: "TYPE",
                                        v: f.type,
                                    },
                                    {
                                        k: "TARGET",
                                        v: f.target,
                                    },
                                    {
                                        k: "SEVERITY",
                                        v: f.severity,
                                    },
                                    {
                                        k: "STATUS",
                                        v: f.status,
                                    },
                                    {
                                        k: "E_ord",
                                        v: `${f.eord} / 5`,
                                    },
                                    {
                                        k: "FIRST SEEN",
                                        v: f.first,
                                    },
                                    {
                                        k: "VALIDATED",
                                        v: f.validated,
                                    },
                                ].map((r) => (
                                    <div key={r.k} className="border-border flex border-b">
                                        <div className="text-muted-foreground border-border w-[140px] shrink-0 border-r px-3.5 py-2 text-sm font-semibold tracking-widest">
                                            {r.k}
                                        </div>
                                        <div
                                            className="flex-1 px-3.5 py-2 text-xs"
                                            style={{
                                                color: (() => {
                                                    if (r.k === "STATUS") {
                                                        return stc;
                                                    }
                                                    if (r.k === "SEVERITY") {
                                                        return sc.color;
                                                    }
                                                    return "var(--muted-foreground)";
                                                })(),
                                            }}
                                        >
                                            {r.v}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="text-muted-foreground mb-3.5 text-base tracking-widest">
                                ATTACK PATH
                            </div>
                            <AttackPath nodes={f.path} />
                            <div className="mt-6 flex gap-3">
                                <Button
                                    onClick={() => setEvOpen(true)}
                                    className="bg-primary text-foreground hover:bg-destructive h-auto rounded-sm px-4 py-1.5 text-base tracking-widest"
                                >
                                    VIEW EVIDENCE
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setTab("ATTACK PATH")}
                                    className="h-auto rounded-sm px-4 py-1.5 text-base tracking-widest"
                                >
                                    VIEW PATH
                                </Button>
                            </div>
                        </>
                    )}
                    {tab === "EVIDENCE" && <EvidenceViewer inline />}
                    {tab === "ATTACK PATH" && <AttackPath nodes={f.path} large />}
                    {tab === "VALIDATION" && <ValidationTab f={f} />}
                    {tab === "TRAJECTORY" && <TrajectoryTab f={f} />}
                </div>
            </div>
            {evOpen && (
                <div
                    className="bg-muted fixed inset-0 flex items-center justify-center"
                    style={{
                        zIndex: 60,
                    }}
                    onClick={() => setEvOpen(false)}
                    onKeyDown={(e) => {
                        if (e.key === "Escape") {
                            setEvOpen(false);
                        }
                    }}
                    role="presentation"
                >
                    <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.stopPropagation();
                            }
                        }}
                        className="border-border bg-background w-full max-w-[700px] overflow-auto rounded-sm border-[1px] border-solid sm:w-[700px]"
                        style={{
                            maxHeight: "80vh",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="border-border flex justify-between border-b px-5 pt-4 pb-3">
                            <span className="text-foreground text-xs font-bold tracking-normal">
                                EVIDENCE VIEWER
                            </span>
                            <Button
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => setEvOpen(false)}
                                className="text-muted-foreground hover:text-muted-foreground h-auto p-0.5 text-sm hover:bg-transparent"
                            >
                                ✕
                            </Button>
                        </div>
                        <EvidenceViewer />
                    </div>
                </div>
            )}
        </div>
    );
}
