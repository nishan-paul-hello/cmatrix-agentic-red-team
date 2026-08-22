import { KPI } from "@/features/specialists/components/KPI";
import { UCBModal } from "@/features/specialists/components/UCBModal";
import { STATUS_C } from "@/features/specialists/constants";
import {
    type SchedEntry,
    type SpecialistEntry,
    type VDGEntry,
} from "@/features/specialists/data/fixtures/teamDashboardMockData";
import { SPEC_STATUS } from "@/types/domain-types";

const SPEC_C: Record<string, string> = {
    [SPEC_STATUS.COMPLETED]: "var(--color-hex-3fb950)",
    [SPEC_STATUS.RUNNING]: "var(--color-hex-ff2a32)",
    [SPEC_STATUS.WAITING]: "var(--color-hex-d29922)",
    [SPEC_STATUS.IDLE]: "var(--color-hex-333333)",
};
export default function TeamManagerDashboardView({
    ucbEntry,
    setUcbEntry,
    vdg,
    specialists,
    sched,
}: {
    ucbEntry: VDGEntry | null;
    setUcbEntry: (v: VDGEntry | null) => void;
    vdg: VDGEntry[];
    specialists: SpecialistEntry[];
    sched: SchedEntry[];
}) {
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
                            key={s.node}
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
