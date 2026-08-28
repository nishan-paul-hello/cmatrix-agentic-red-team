import { useState } from "react";

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
    const stc = STATUS_C[f.status] ?? "var(--color-hex-666666)";
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-0"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <button
                    onClick={onBack}
                    className="font-inherit tracking-wider-1 mb-[10px] cursor-pointer border-none bg-[transparent] p-[0px] text-base text-[var(--color-hex-666666)] hover:text-[var(--color-hex-a0a0a0)]"
                >
                    ← FINDINGS
                </button>
                <div className="mb-3 flex items-center gap-3">
                    <h1 className="text-8xl font-bold tracking-wide text-[var(--color-fg)]">
                        {f.id}
                    </h1>
                    <span
                        className="tracking-wider-1 rounded-[2px] px-[7px] py-[2px] text-base font-semibold"
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
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className="font-inherit tracking-wider-1 cursor-pointer border-none bg-[transparent] px-[14px] py-[5px] text-base whitespace-nowrap"
                            style={{
                                borderBottom:
                                    t === tab
                                        ? "2px solid var(--color-brand)"
                                        : "2px solid transparent",
                                color: t === tab ? "var(--color-fg)" : "var(--color-hex-444444)",
                                marginBottom: -1,
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {tab === "OVERVIEW" && (
                        <>
                            <div className="mb-[20px] overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
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
                                ].map((r, i, a) => (
                                    <div
                                        key={r.k}
                                        className="flex"
                                        style={{
                                            borderBottom:
                                                i < a.length - 1
                                                    ? "1px solid var(--color-hex-141414)"
                                                    : "none",
                                            background:
                                                i % 2
                                                    ? "var(--color-hex-0b0b0b)"
                                                    : "var(--color-hex-0d0d0d)",
                                        }}
                                    >
                                        <div
                                            className="text-base-tight tracking-wider-3 w-[140px] shrink-0 px-[14px] py-[9px] font-semibold text-[var(--color-hex-444444)]"
                                            style={{
                                                borderRight: "1px solid var(--color-hex-141414)",
                                            }}
                                        >
                                            {r.k}
                                        </div>
                                        <div
                                            className="flex-1 px-[14px] py-[9px] text-lg"
                                            style={{
                                                color: (() => {
                                                    if (r.k === "STATUS") {
                                                        return stc;
                                                    }
                                                    if (r.k === "SEVERITY") {
                                                        return sc.color;
                                                    }
                                                    return "var(--color-hex-888888)";
                                                })(),
                                            }}
                                        >
                                            {r.v}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mb-[14px] text-base tracking-widest text-[var(--color-hex-444444)]">
                                ATTACK PATH
                            </div>
                            <AttackPath nodes={f.path} />
                            <div className="mt-6 flex gap-3">
                                <button
                                    onClick={() => setEvOpen(true)}
                                    className="font-inherit text-lg-tight tracking-wider-1 cursor-pointer rounded-[2px] border-none bg-[var(--color-brand)] px-[18px] py-[7px] text-[var(--color-fg)] hover:bg-[var(--color-danger)]"
                                >
                                    VIEW EVIDENCE
                                </button>
                                <button
                                    onClick={() => setTab("ATTACK PATH")}
                                    className="font-inherit text-lg-tight tracking-wider-1 cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[transparent] px-[18px] py-[7px] text-[var(--color-hex-a0a0a0)] hover:border-[var(--color-hex-a0a0a0)]"
                                >
                                    VIEW PATH
                                </button>
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
                    className="fixed inset-0 flex items-center justify-center bg-[var(--color-hex-00000099)]"
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
                        className="w-[700px] overflow-auto rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)]"
                        style={{
                            maxHeight: "80vh",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="flex justify-between px-5 pt-4 pb-3"
                            style={{
                                borderBottom: "1px solid var(--color-hex-1e1e1e)",
                            }}
                        >
                            <span className="text-2xl font-bold tracking-normal text-[var(--color-fg)]">
                                EVIDENCE VIEWER
                            </span>
                            <button
                                onClick={() => setEvOpen(false)}
                                className="cursor-pointer border-none bg-[transparent] text-4xl text-[var(--color-hex-444444)]"
                            >
                                ✕
                            </button>
                        </div>
                        <EvidenceViewer />
                    </div>
                </div>
            )}
        </div>
    );
}
