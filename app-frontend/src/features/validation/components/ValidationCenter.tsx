import Btn from "@/features/validation/components/Btn";
import OraclePanel from "@/features/validation/components/OraclePanel";
import StateMachineModal from "@/features/validation/components/StateMachineModal";
import { SB } from "@/features/validation/data/validationMockData";
import { useValidationData } from "@/features/validation/hooks/useValidationData";
import { useTelemetry } from "@/hooks/useTelemetry";

export default function ValidationCenter() {
    const { logEvent } = useTelemetry();
    const {
        modal,
        setModal,
        oracleOpen,
        setOracleOpen,
        selected,
        setSelected,
        stateMachineFinding,
        setStateMachineFinding,
        findings,
        updateFindingStatus,
        addGuardrailResult,
        guardrails,
    } = useValidationData();
    const metrics = [
        {
            label: "PENDING VALIDATION",
            value: "08",
            color: "var(--color-hex-d29922)",
        },
        {
            label: "VALIDATED",
            value: "21",
            color: "var(--color-hex-3fb950)",
        },
        {
            label: "RULED OUT",
            value: "13",
            color: "var(--color-hex-555555)",
        },
        {
            label: "RETRIES",
            value: "17",
            color: "var(--color-hex-ff2a32)",
        },
    ];
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <div className="flex items-center justify-between">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        VALIDATION CENTER
                    </h1>
                    <div className="flex gap-2">
                        <Btn
                            onClick={() => {
                                setStateMachineFinding(selected);
                                setModal(true);
                            }}
                            label="STATE MACHINE"
                        />
                        <Btn onClick={() => setOracleOpen((v) => !v)} label="ORACLE PANEL" red />
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div
                className="grid flex-shrink-0 grid-cols-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                {metrics.map((m, i) => (
                    <div
                        key={m.label}
                        className="bg-[var(--color-hex-0d0d0d)] px-[20px] py-[14px]"
                        style={{
                            borderRight: i < 3 ? "1px solid var(--color-hex-1e1e1e)" : "none",
                        }}
                    >
                        <div className="mb-[6px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                            {m.label}
                        </div>
                        <div
                            className="text-[28px] leading-[1] font-bold"
                            style={{
                                color: m.color,
                            }}
                        >
                            {m.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className="flex min-h-[0px] flex-1 overflow-hidden">
                {/* Table */}
                <div className="flex-1 overflow-auto">
                    <table className="w-full border-collapse text-[10.5px]">
                        <thead>
                            <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                                {[
                                    "FINDING",
                                    "TYPE",
                                    "EVIDENCE",
                                    "RETRY",
                                    "STATUS",
                                    "ORACLE",
                                    "",
                                ].map((h) => (
                                    <th
                                        key={h}
                                        className="px-[16px] py-[6px] text-left text-[8px] font-semibold tracking-[0.18em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                        style={{
                                            borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {findings.map((f) => {
                                const sb = SB[f.status];
                                const isSelected = selected?.id === f.id;
                                return (
                                    <tr
                                        key={f.id}
                                        className="cursor-pointer"
                                        style={{
                                            borderBottom: "1px solid var(--color-hex-111111)",
                                            background: isSelected
                                                ? "var(--color-hex-0f0f0f)"
                                                : "transparent",
                                        }}
                                        onClick={() => setSelected(f)}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                "var(--color-hex-0f0f0f)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = isSelected
                                                ? "var(--color-hex-0f0f0f)"
                                                : "transparent")
                                        }
                                    >
                                        <td className="px-[16px] py-[8px] font-bold tracking-[0.08em] text-[var(--color-hex-e31b23)]">
                                            {f.id}
                                        </td>
                                        <td className="px-[16px] py-[8px] text-[var(--color-hex-a0a0a0)]">
                                            {f.type}
                                        </td>
                                        <td className="px-[16px] py-[8px] text-[9px] text-[var(--color-hex-666666)]">
                                            {f.evidence}
                                        </td>
                                        <td
                                            className="px-[16px] py-[8px] text-right"
                                            style={{
                                                color:
                                                    f.retry > 0
                                                        ? "var(--color-hex-d29922)"
                                                        : "var(--color-hex-444444)",
                                            }}
                                        >
                                            {f.retry}
                                        </td>
                                        <td className="px-[16px] py-[8px]">
                                            <span
                                                className="rounded-[2px] px-[6px] py-[1px] text-[9px] font-semibold tracking-[0.12em]"
                                                style={{
                                                    color: sb.color,
                                                    background: sb.bg,
                                                    border: `1px solid ${sb.border}`,
                                                }}
                                            >
                                                {f.status}
                                            </span>
                                        </td>
                                        <td className="px-[16px] py-[8px] text-[9px] text-[var(--color-hex-555555)]">
                                            {f.oracle}
                                        </td>
                                        <td className="px-[16px] py-[8px]">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelected(f);
                                                }}
                                                className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[8px] py-[2px] text-[8.5px] tracking-[0.1em] text-[var(--color-hex-666666)] hover:border-[var(--color-hex-e31b23)]"
                                            >
                                                DETAIL
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Oracle panel */}
                {oracleOpen && <OraclePanel onClose={() => setOracleOpen(false)} />}
            </div>

            {/* State machine modal */}
            {modal && (
                <StateMachineModal onClose={() => setModal(false)} finding={stateMachineFinding} />
            )}

            {/* Finding detail drawer */}
            {selected && (
                <div
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Escape" || e.key === "Enter") {
                            setSelected(null);
                        }
                    }}
                    className="fixed inset-0 flex items-center justify-center bg-[var(--color-hex-00000088)]"
                    style={{
                        zIndex: 50,
                    }}
                    onClick={() => setSelected(null)}
                >
                    <div
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="w-[400px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[28px] py-[24px]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mb-4 flex justify-between">
                            <div>
                                <div className="text-[13px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                                    {selected.id}
                                </div>
                                <div className="text-[9px] tracking-[0.14em] text-[var(--color-hex-666666)]">
                                    {selected.type}
                                </div>
                            </div>
                            <button
                                onClick={() => setSelected(null)}
                                className="cursor-pointer border-none bg-[transparent] text-[14px] text-[var(--color-hex-444444)]"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="flex flex-col gap-3">
                            {[
                                {
                                    k: "STATUS",
                                    v: selected.status,
                                },
                                {
                                    k: "EVIDENCE",
                                    v: selected.evidence,
                                },
                                {
                                    k: "ORACLE",
                                    v: selected.oracle,
                                },
                                {
                                    k: "RETRY COUNT",
                                    v: String(selected.retry),
                                },
                            ].map((r) => (
                                <div key={r.k}>
                                    <div className="mb-[1px] text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        {r.k}
                                    </div>
                                    <div className="text-[10px] text-[var(--color-hex-888888)]">
                                        {r.v}
                                    </div>
                                </div>
                            ))}

                            {selected.id in guardrails && (
                                <div className="mt-4 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-333333)] bg-[var(--color-hex-0a0a0a)] px-[12px] py-[10px]">
                                    <div className="mb-2 text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                        SUPERVISOR GUARDRAIL
                                    </div>
                                    <div
                                        className="text-[10px] font-bold"
                                        style={{
                                            color:
                                                guardrails[selected.id].verdict === "PASS"
                                                    ? "var(--color-hex-3fb950)"
                                                    : "var(--color-hex-ff2a32)",
                                        }}
                                    >
                                        {guardrails[selected.id].verdict}
                                    </div>
                                </div>
                            )}
                            <div className="mt-5 flex gap-3">
                                <button
                                    onClick={() => {
                                        if (updateFindingStatus(selected, "VALIDATED")) {
                                            addGuardrailResult({
                                                findingId: selected.id,
                                                verifiedBy: "SUPERVISOR",
                                                verdict: "PASS",
                                            });
                                            logEvent("FINDING_VERIFIED", {
                                                findingId: selected.id,
                                            });
                                        }
                                    }}
                                    className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-3fb95044)] bg-[transparent] px-[16px] py-[6px] text-[9.5px] tracking-[0.14em] text-[var(--color-hex-3fb950)] hover:border-[var(--color-hex-3fb950)] hover:bg-[var(--color-hex-0a1a0c)]"
                                >
                                    VERIFY
                                </button>
                                <button
                                    onClick={() => {
                                        if (updateFindingStatus(selected, "RULED_OUT")) {
                                            addGuardrailResult({
                                                findingId: selected.id,
                                                verifiedBy: "SUPERVISOR",
                                                verdict: "FAIL",
                                            });
                                            logEvent("FINDING_REJECTED", {
                                                findingId: selected.id,
                                            });
                                        }
                                    }}
                                    className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-ff2a3244)] bg-[transparent] px-[16px] py-[6px] text-[9.5px] tracking-[0.14em] text-[var(--color-hex-ff2a32)] hover:border-[var(--color-hex-ff2a32)] hover:bg-[var(--color-hex-130408)]"
                                >
                                    REJECT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
