import { useEffect, useState } from "react";

import {
    getTeamDashboardData,
    type VDGEntry,
} from "@/features/specialists/data/fixtures/teamDashboardMockData";
import { SPEC_STATUS } from "@/types/domain-types";

const STATUS_C: Record<VDGEntry["status"], string> = {
    ELIGIBLE: "var(--color-hex-e31b23)",
    IN_PROGRESS: "var(--color-hex-ff2a32)",
    EXPLOITED: "var(--color-hex-3fb950)",
    BLOCKED: "var(--color-hex-333333)",
    DEPRIORITIZED: "var(--color-hex-555555)",
};
const SPEC_C: Record<string, string> = {
    [SPEC_STATUS.COMPLETED]: "var(--color-hex-3fb950)",
    [SPEC_STATUS.RUNNING]: "var(--color-hex-ff2a32)",
    [SPEC_STATUS.WAITING]: "var(--color-hex-d29922)",
    [SPEC_STATUS.IDLE]: "var(--color-hex-333333)",
};
export default function TeamManagerDashboard() {
    const [ucbEntry, setUcbEntry] = useState<VDGEntry | null>(null);
    const [vdg, setVdg] = useState<VDGEntry[]>([]);
    const [specialists, setSpecialists] = useState<
        {
            id: string;
            role: string;
            status: string;
            task: string;
            node: string;
            score: number;
            failures: number;
            skills: number;
            context: string;
            evidence: number;
        }[]
    >([]);
    const [sched, setSched] = useState<
        { step: string; node: string; ucb: number; eta: string; reason: string }[]
    >([]);

    useEffect(() => {
        void getTeamDashboardData().then((data) => {
            setVdg(data.vdg);
            setSpecialists(data.specialists);
            setSched(data.sched);
        });
    }, []);
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Header */}
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        TEAM MANAGER
                    </h1>
                    <div className="flex items-center gap-6">
                        <KPI label="ACTIVE SPECIALISTS" value="1" />
                        <KPI
                            label="VDG ELIGIBLE"
                            value={String(vdg.filter((v) => v.status === "ELIGIBLE").length)}
                            red
                        />
                        <KPI label="TOTAL COST" value="$1.42" />
                        <KPI label="RUNTIME" value="00:19:04" />
                    </div>
                </div>
            </div>

            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* LEFT: VDG scoring table */}
                <div
                    className="flex flex-1 flex-col overflow-hidden"
                    style={{
                        borderRight: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div
                        className="shrink-0 bg-[var(--color-hex-0a0a0a)] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]"
                        style={{
                            padding: "10px 20px 8px",
                            borderBottom: "1px solid var(--color-hex-111111)",
                        }}
                    >
                        VDG SCORING — UCB POLICY
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                                    {[
                                        "NODE",
                                        "TYPE",
                                        "STATUS",
                                        "UCB ↓",
                                        "EXPLOIT",
                                        "EXPLORE",
                                        "VISITS",
                                        "E_ORD",
                                        "COST",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-[12px] py-[5px] text-[7.5px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                            style={{
                                                textAlign:
                                                    h === "UCB ↓" ||
                                                    h === "EXPLOIT" ||
                                                    h === "EXPLORE" ||
                                                    h === "VISITS" ||
                                                    h === "E_ORD"
                                                        ? "right"
                                                        : "left",
                                                borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {vdg
                                    .sort((a, b) => b.ucb - a.ucb)
                                    .map((v) => (
                                        <tr
                                            key={v.id}
                                            onClick={() => setUcbEntry(v)}
                                            className="cursor-pointer"
                                            style={{
                                                borderBottom: "1px solid var(--color-hex-111111)",
                                                opacity: v.status === "BLOCKED" ? 0.4 : 1,
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.background =
                                                    "var(--color-hex-0d0d0d)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.background = "transparent")
                                            }
                                        >
                                            <td className="px-[12px] py-[7px] text-[9.5px] font-bold tracking-[0.06em] text-[var(--color-hex-e31b23)]">
                                                {v.id}
                                            </td>
                                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                                {v.type}
                                            </td>
                                            <td className="px-[12px] py-[7px]">
                                                <span
                                                    className="text-[8.5px] font-semibold tracking-[0.1em]"
                                                    style={{
                                                        color: STATUS_C[v.status],
                                                    }}
                                                >
                                                    {v.status}
                                                </span>
                                            </td>
                                            <td className="px-[12px] py-[7px] text-right">
                                                <span
                                                    className="text-[10px] font-bold"
                                                    style={{
                                                        color: (() => {
                                                            if (v.ucb > 0.8) {
                                                                return "var(--color-hex-ff2a32)";
                                                            }
                                                            if (v.ucb > 0.6) {
                                                                return "var(--color-hex-e31b23)";
                                                            }
                                                            if (v.ucb > 0) {
                                                                return "var(--color-hex-a0a0a0)";
                                                            }
                                                            return "var(--color-hex-333333)";
                                                        })(),
                                                    }}
                                                >
                                                    {v.ucb > 0 ? v.ucb.toFixed(3) : "—"}
                                                </span>
                                            </td>
                                            <td className="px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-555555)]">
                                                {v.exploit > 0 ? v.exploit.toFixed(3) : "—"}
                                            </td>
                                            <td className="px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-3fb950)]">
                                                {v.explore > 0 ? v.explore.toFixed(3) : "—"}
                                            </td>
                                            <td className="px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-444444)]">
                                                {v.visits}
                                            </td>
                                            <td
                                                className="px-[12px] py-[7px] text-right text-[9px]"
                                                style={{
                                                    color: (() => {
                                                        if (v.eord >= 4) {
                                                            return "var(--color-hex-3fb950)";
                                                        }
                                                        if (v.eord >= 2) {
                                                            return "var(--color-hex-d29922)";
                                                        }
                                                        return "var(--color-hex-444444)";
                                                    })(),
                                                }}
                                            >
                                                {v.eord}/5
                                            </td>
                                            <td className="px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-444444)]">
                                                {v.cost}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* RIGHT: specialists + schedule */}
                <div className="flex w-[280px] flex-shrink-0 flex-col overflow-y-auto">
                    {/* Specialists */}
                    <div
                        className="bg-[var(--color-hex-0a0a0a)] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]"
                        style={{
                            padding: "10px 16px 8px",
                            borderBottom: "1px solid var(--color-hex-111111)",
                        }}
                    >
                        SPECIALIST STATUS
                    </div>
                    {specialists.map((s) => (
                        <div
                            key={s.id}
                            className="px-[16px] py-[10px]"
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                            }}
                        >
                            <div className="mb-1 flex items-center gap-2">
                                <div
                                    className="h-[6px] w-[6px] shrink-0"
                                    style={{
                                        borderRadius: "50%",
                                        background: SPEC_C[s.status] ?? "var(--color-hex-333333)",
                                    }}
                                />
                                <span className="flex-1 text-[10px] font-bold tracking-[0.06em] text-[var(--color-hex-a0a0a0)]">
                                    {s.role}
                                </span>
                                <span
                                    className="text-[8px] font-semibold tracking-[0.1em]"
                                    style={{
                                        color: SPEC_C[s.status] ?? "var(--color-hex-333333)",
                                    }}
                                >
                                    {s.status}
                                </span>
                            </div>
                            <div className="mb-[1px] text-[8.5px] tracking-[0.06em] text-[var(--color-hex-333333)]">
                                {s.task}
                            </div>
                            {s.score > 0 && (
                                <div className="text-[8px] tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                                    UCB={s.score.toFixed(3)}
                                </div>
                            )}
                        </div>
                    ))}
                    {/* Schedule */}
                    <div
                        className="bg-[var(--color-hex-0a0a0a)] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]"
                        style={{
                            padding: "10px 16px 8px",
                            borderBottom: "1px solid var(--color-hex-111111)",
                            borderTop: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        NEXT SCHEDULED
                    </div>
                    {sched.map((s, i) => (
                        <div
                            key={`${s.step}-${i}`}
                            className="px-[16px] py-[10px]"
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                            }}
                        >
                            <div className="mb-1 flex items-center gap-2">
                                <span
                                    className="min-w-[48px] text-[8px] font-bold tracking-[0.14em]"
                                    style={{
                                        color:
                                            i === 0
                                                ? "var(--color-hex-d29922)"
                                                : "var(--color-hex-333333)",
                                    }}
                                >
                                    {s.step}
                                </span>
                                <span className="text-[10px] font-bold tracking-[0.06em] text-[var(--color-hex-e31b23)]">
                                    {s.node}
                                </span>
                                <span className="ml-auto text-[9px] font-bold text-[var(--color-hex-3fb950)]">
                                    {s.ucb.toFixed(3)}
                                </span>
                            </div>
                            <div className="text-[8px] leading-[1.5] tracking-[0.06em] text-[var(--color-hex-333333)]">
                                {s.reason}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {ucbEntry && (
                <UCBModal
                    entry={ucbEntry}
                    totalVisits={vdg.reduce((s, v) => s + v.visits, 0)}
                    onClose={() => setUcbEntry(null)}
                />
            )}
        </div>
    );
}

/* ── screen 37: UCB BREAKDOWN MODAL ── */
function UCBModal({
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
            color: "var(--color-hex-e31b23)",
            desc: "Q(s,a) — average reward from past attempts",
        },
        {
            label: "EXPLORE TERM",
            value: entry.explore,
            color: "var(--color-hex-3fb950)",
            desc: "c × √(ln N / n) — exploration bonus",
        },
        {
            label: "EPSS PRIOR",
            value: epss,
            color: "var(--color-hex-d29922)",
            desc: "λ × EPSS score — initial exploitability prior from NVD/FIRST API",
        },
        {
            label: "UCB SCORE",
            value: entry.ucb,
            color: "var(--color-hex-ff2a32)",
            desc: "Combined final selection score",
        },
    ];
    const C = 0.4;
    const N = totalVisits;
    const n = entry.visits;
    return (
        <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Enter") {
                    onClose();
                }
            }}
            className="fixed inset-0 flex items-center justify-center bg-[var(--color-hex-00000099)]"
            style={{
                zIndex: 60,
            }}
            onClick={onClose}
        >
            <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.stopPropagation()}
                className="w-[540px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-start justify-between px-5 pt-4 pb-3"
                    style={{
                        borderBottom: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    <div>
                        <div className="mb-[2px] text-[14px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                            UCB BREAKDOWN
                        </div>
                        <div className="text-[9px] tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                            {entry.id} — {entry.type}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer border-none bg-[transparent] text-[16px] text-[var(--color-hex-444444)]"
                    >
                        ✕
                    </button>
                </div>
                <div className="px-5 py-5">
                    {/* Formula */}
                    <div className="mb-[20px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-080808)] px-[16px] py-[12px] text-center">
                        <div className="mb-[6px] text-[11px] tracking-[0.08em] text-[var(--color-hex-555555)]">
                            UCB FORMULA
                        </div>
                        <div className="text-[13px] tracking-[0.06em] text-[var(--color-hex-a0a0a0)]">
                            UCB(s) = <span className="text-[var(--color-hex-e31b23)]">Q(s,a)</span>{" "}
                            +{" "}
                            <span className="text-[var(--color-hex-3fb950)]">c × √(ln N / n)</span>
                        </div>
                        <div className="mt-[8px] text-[9px] tracking-[0.08em] text-[var(--color-hex-333333)]">
                            c={C} · N={N} total visits · n={n === 0 ? "0 (new node)" : n} visits ·
                            ln(N)=
                            {Math.log(N || 1).toFixed(3)}
                        </div>
                        {/* G1: c constant note */}
                        <div className="mt-[6px] text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                            UCB POLICY c = {C.toFixed(2)} — configurable in Settings → VDG
                        </div>
                    </div>
                    {/* Score bars */}
                    {bars.map((b) => (
                        <div key={b.label} className="mb-[16px]">
                            <div className="mb-2 flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] font-semibold tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        {b.label}
                                    </span>
                                    <div className="mt-[2px] text-[8.5px] text-[var(--color-hex-333333)]">
                                        {b.desc}
                                    </div>
                                </div>
                                <span
                                    className="text-[16px] font-bold"
                                    style={{
                                        color: b.color,
                                    }}
                                >
                                    {b.value.toFixed(3)}
                                </span>
                            </div>
                            <div className="h-[5px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full rounded-[2px]"
                                    style={{
                                        width: `${b.value * 100}%`,
                                        background: b.color,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    {/* G3: EPSS ONE-DAY mode footnote */}
                    <div className="mt-[6px] text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                        ONE-DAY mode: Q(s,a) seeded from EPSS prior
                    </div>
                    {/* Stats grid */}
                    <div className="mt-4 grid grid-cols-4 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
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
                        ].map((m, i, a) => (
                            <div
                                key={m.k}
                                className="bg-[var(--color-hex-0b0b0b)] px-[12px] py-[10px]"
                                style={{
                                    borderRight:
                                        i < a.length - 1
                                            ? "1px solid var(--color-hex-1a1a1a)"
                                            : "none",
                                }}
                            >
                                <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                    {m.k}
                                </div>
                                <div
                                    className="text-[13px] font-bold"
                                    style={{
                                        color:
                                            m.k === "STATUS"
                                                ? STATUS_C[entry.status]
                                                : "var(--color-hex-f2f2f2)",
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
    );
}
function KPI({ label, value, red }: { label: string; value: string; red?: boolean }) {
    return (
        <div className="flex flex-col items-end">
            <div className="mb-[2px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                {label}
            </div>
            <div
                className="text-[14px] font-bold"
                style={{
                    color: red ? "var(--color-hex-e31b23)" : "var(--color-hex-f2f2f2)",
                }}
            >
                {value}
            </div>
        </div>
    );
}
