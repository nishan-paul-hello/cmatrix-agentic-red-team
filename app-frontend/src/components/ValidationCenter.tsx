import { useEffect, useState } from "react";

type VStatus = "PENDING" | "RETRY" | "VALIDATED" | "RULED OUT";
interface VFinding {
    id: string;
    type: string;
    evidence: string;
    retry: number;
    status: VStatus;
    oracle: string;
}
const FINDINGS: VFinding[] = [
    {
        id: "F-001",
        type: "SQL INJECTION",
        evidence: "E_ord 4/5",
        retry: 0,
        status: "VALIDATED",
        oracle: "CVE-BENCH",
    },
    {
        id: "F-002",
        type: "AUTHENTICATION BYPASS",
        evidence: "E_ord 3/5",
        retry: 2,
        status: "RETRY",
        oracle: "CVE-BENCH",
    },
    {
        id: "F-003",
        type: "IDOR",
        evidence: "E_ord 4/5",
        retry: 0,
        status: "VALIDATED",
        oracle: "PREDIQL",
    },
    {
        id: "F-004",
        type: "XSS REFLECTED",
        evidence: "E_ord 2/5",
        retry: 0,
        status: "PENDING",
        oracle: "—",
    },
    {
        id: "F-005",
        type: "SSRF",
        evidence: "E_ord 1/5",
        retry: 3,
        status: "RULED OUT",
        oracle: "CVE-BENCH",
    },
    {
        id: "F-006",
        type: "CSRF",
        evidence: "E_ord 2/5",
        retry: 1,
        status: "PENDING",
        oracle: "—",
    },
    {
        id: "F-007",
        type: "PATH TRAVERSAL",
        evidence: "E_ord 3/5",
        retry: 0,
        status: "PENDING",
        oracle: "—",
    },
    {
        id: "F-008",
        type: "SQL INJECTION",
        evidence: "E_ord 4/5",
        retry: 1,
        status: "RETRY",
        oracle: "CVE-BENCH",
    },
];
const SB: Record<
    VStatus,
    {
        color: string;
        bg: string;
        border: string;
    }
> = {
    PENDING: {
        color: "var(--color-hex-d29922)",
        bg: "var(--color-hex-1a1200)",
        border: "var(--color-hex-d2992244)",
    },
    RETRY: {
        color: "var(--color-hex-ff2a32)",
        bg: "var(--color-hex-1a0608)",
        border: "var(--color-hex-ff2a3244)",
    },
    VALIDATED: {
        color: "var(--color-hex-3fb950)",
        bg: "var(--color-hex-0a1a10)",
        border: "var(--color-hex-3fb95044)",
    },
    "RULED OUT": {
        color: "var(--color-hex-555555)",
        bg: "var(--color-hex-111111)",
        border: "var(--color-hex-33333344)",
    },
};
export default function ValidationCenter() {
    const [modal, setModal] = useState(false);
    const [oracleOpen, setOracleOpen] = useState(false);
    const [selected, setSelected] = useState<VFinding | null>(null);
    const [stateMachineFinding, setStateMachineFinding] = useState<VFinding | null>(null);
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
                            {FINDINGS.map((f) => {
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
                    className="fixed inset-0 flex items-center justify-center bg-[var(--color-hex-00000088)]"
                    style={{
                        zIndex: 50,
                    }}
                    onClick={() => setSelected(null)}
                >
                    <div
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* B4: State machine modal with active state highlight based on finding.status */
function StateMachineModal({
    onClose,
    finding,
}: {
    onClose: () => void;
    finding: VFinding | null;
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

    // Derive active state from finding status
    const activeState = (() => {
        if (!finding) {
            return null;
        }
        switch (finding.status) {
            case "PENDING":
                return "VALIDATION";
            case "RETRY":
                return "RETRY";
            case "VALIDATED":
                return "VALIDATED";
            case "RULED OUT":
                return "RULED OUT";
            default:
                return null;
        }
    })();
    const nodes: {
        id: string;
        x: number;
        y: number;
        w: number;
        h: number;
        color: string;
        text: string;
        border?: string;
    }[] = [
        {
            id: "VALIDATION",
            x: 200,
            y: 20,
            w: 120,
            h: 32,
            color: "var(--color-hex-333333)",
            text: "var(--color-hex-a0a0a0)",
        },
        {
            id: "ORACLE TEST",
            x: 200,
            y: 100,
            w: 120,
            h: 32,
            color: "var(--color-hex-1a0608)",
            text: "var(--color-hex-e31b23)",
            border: "var(--color-hex-e31b23)",
        },
        {
            id: "SUCCESS",
            x: 60,
            y: 190,
            w: 100,
            h: 28,
            color: "var(--color-hex-0a1a10)",
            text: "var(--color-hex-3fb950)",
            border: "var(--color-hex-3fb95066)",
        },
        {
            id: "VALIDATED",
            x: 40,
            y: 260,
            w: 120,
            h: 32,
            color: "var(--color-hex-0a1a10)",
            text: "var(--color-hex-3fb950)",
            border: "var(--color-hex-3fb95066)",
        },
        {
            id: "FAILURE",
            x: 340,
            y: 190,
            w: 100,
            h: 28,
            color: "var(--color-hex-1a0608)",
            text: "var(--color-hex-ff2a32)",
            border: "var(--color-hex-ff2a3266)",
        },
        {
            id: "DIAGNOSIS",
            x: 330,
            y: 260,
            w: 120,
            h: 32,
            color: "var(--color-hex-120608)",
            text: "var(--color-hex-e31b23)",
            border: "var(--color-hex-e31b2344)",
        },
        {
            id: "CORRECTABLE",
            x: 230,
            y: 340,
            w: 120,
            h: 28,
            color: "var(--color-hex-1a1200)",
            text: "var(--color-hex-d29922)",
            border: "var(--color-hex-d2992244)",
        },
        {
            id: "FUNDAMENTAL",
            x: 420,
            y: 340,
            w: 120,
            h: 28,
            color: "var(--color-hex-1a0608)",
            text: "var(--color-hex-ff2a32)",
            border: "var(--color-hex-ff2a3244)",
        },
        {
            id: "ADAPT",
            x: 230,
            y: 410,
            w: 100,
            h: 28,
            color: "var(--color-hex-111111)",
            text: "var(--color-hex-666666)",
            border: "var(--color-hex-33333344)",
        },
        {
            id: "RULED OUT",
            x: 420,
            y: 410,
            w: 100,
            h: 28,
            color: "var(--color-hex-111111)",
            text: "var(--color-hex-555555)",
            border: "var(--color-hex-33333344)",
        },
        {
            id: "RETRY",
            x: 230,
            y: 480,
            w: 100,
            h: 28,
            color: "var(--color-hex-1a0608)",
            text: "var(--color-hex-e31b23)",
            border: "var(--color-hex-e31b2344)",
        },
    ];
    const edges = [
        {
            x1: 260,
            y1: 52,
            x2: 260,
            y2: 100,
            label: "",
        },
        {
            x1: 260,
            y1: 132,
            x2: 110,
            y2: 190,
            label: "SUCCESS",
        },
        {
            x1: 260,
            y1: 132,
            x2: 390,
            y2: 190,
            label: "FAILURE",
        },
        {
            x1: 110,
            y1: 218,
            x2: 100,
            y2: 260,
            label: "",
        },
        {
            x1: 390,
            y1: 218,
            x2: 390,
            y2: 260,
            label: "",
        },
        {
            x1: 390,
            y1: 292,
            x2: 290,
            y2: 340,
            label: "CORRECTABLE",
        },
        {
            x1: 390,
            y1: 292,
            x2: 480,
            y2: 340,
            label: "FUNDAMENTAL",
        },
        {
            x1: 290,
            y1: 368,
            x2: 280,
            y2: 410,
            label: "",
        },
        {
            x1: 480,
            y1: 368,
            x2: 470,
            y2: 410,
            label: "",
        },
        {
            x1: 280,
            y1: 438,
            x2: 280,
            y2: 480,
            label: "",
        },
    ];
    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-[var(--color-hex-00000099)]"
            style={{
                zIndex: 60,
            }}
            onClick={onClose}
        >
            <div
                className="w-[620px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)] p-[24px]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-5 flex justify-between">
                    <div>
                        <div className="text-[13px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                            VALIDATION STATE MACHINE
                        </div>
                        <div className="text-[8.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                            {finding
                                ? `${finding.id} — ${finding.type} — ${finding.status}`
                                : "DIAGNOSIS → ADAPT → CAP RETRY LOOP"}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="cursor-pointer border-none bg-[transparent] text-[14px] text-[var(--color-hex-444444)]"
                    >
                        ✕
                    </button>
                </div>
                <div className="relative h-[530px]">
                    <svg
                        className="absolute"
                        style={{
                            inset: 0,
                        }}
                        width="100%"
                        height="100%"
                    >
                        {edges.map((e, i) => (
                            <g key={i}>
                                <line
                                    x1={e.x1}
                                    y1={e.y1}
                                    x2={e.x2}
                                    y2={e.y2}
                                    stroke="var(--color-hex-333333)"
                                    strokeWidth="1"
                                    markerEnd="url(#sm-arrow)"
                                />
                                {e.label && (
                                    <text
                                        x={(e.x1 + e.x2) / 2 + 6}
                                        y={(e.y1 + e.y2) / 2}
                                        fill="var(--color-hex-555555)"
                                        fontSize="8"
                                        letterSpacing="1"
                                    >
                                        {e.label}
                                    </text>
                                )}
                            </g>
                        ))}
                        {/* Retry back-arrow */}
                        <path
                            d="M 280 508 Q 140 508 140 132 Q 140 116 200 116"
                            stroke="var(--color-hex-6f171b)"
                            strokeWidth="1"
                            fill="none"
                            strokeDasharray="4 3"
                            markerEnd="url(#sm-arrow-red)"
                        />
                        <text
                            x="100"
                            y="340"
                            fill="var(--color-hex-6f171b)"
                            fontSize="8"
                            letterSpacing="1"
                        >
                            RETRY
                        </text>
                        <defs>
                            <marker
                                id="sm-arrow"
                                markerWidth="6"
                                markerHeight="6"
                                refX="5"
                                refY="3"
                                orient="auto"
                            >
                                <path d="M0,0 L0,6 L6,3 z" fill="var(--color-hex-333333)" />
                            </marker>
                            <marker
                                id="sm-arrow-red"
                                markerWidth="6"
                                markerHeight="6"
                                refX="5"
                                refY="3"
                                orient="auto"
                            >
                                <path d="M0,0 L0,6 L6,3 z" fill="var(--color-hex-6f171b)" />
                            </marker>
                        </defs>
                    </svg>
                    {nodes.map((n) => {
                        const isActive = n.id === activeState;
                        return (
                            <div
                                key={n.id}
                                className="absolute rounded-[2px]"
                                style={{
                                    left: n.x,
                                    top: n.y,
                                    width: n.w,
                                    height: n.h,
                                    background: isActive ? "var(--color-hex-e31b23)" : n.color,
                                    border: `1px solid ${isActive ? "var(--color-hex-ff2a32)" : (n.border ?? "var(--color-hex-292929)")}`,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <span
                                    className="text-[9px] font-bold tracking-[0.12em]"
                                    style={{
                                        color: isActive ? "var(--color-hex-f2f2f2)" : n.text,
                                    }}
                                >
                                    {n.id}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
function OraclePanel({ onClose }: { onClose: () => void }) {
    // F10: ESC key closes panel
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                onClose();
            }
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    const oracles = [
        {
            oracle: "CVE-BENCH",
            type: "FILE ACCESS",
            result: "PASS",
            severity: "CRITICAL",
            details: "Flag file /flag.txt read — exploit confirmed",
        },
        {
            oracle: "PREDIQL",
            type: "IDOR",
            result: "PASS",
            severity: "HIGH",
            details: "Unauthorized record access validated",
        },
        {
            oracle: "MHBENCH",
            type: "HOST COMPROMISED",
            result: "FAIL",
            severity: "HIGH",
            details: "Lateral pivot objective not satisfied",
        },
    ];
    return (
        <div
            className="flex w-[300px] flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0b0b0b)]"
            style={{
                borderLeft: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div
                className="flex items-center justify-between px-4 pt-4 pb-3"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <span className="text-[10px] font-semibold tracking-[0.16em] text-[var(--color-hex-a0a0a0)]">
                    ORACLE PANEL
                </span>
                <button
                    onClick={onClose}
                    className="cursor-pointer border-none bg-[transparent] text-[13px] text-[var(--color-hex-444444)]"
                >
                    ✕
                </button>
            </div>
            {oracles.map((o) => (
                <div
                    key={o.oracle}
                    className="px-4 py-4"
                    style={{
                        borderBottom: "1px solid var(--color-hex-141414)",
                    }}
                >
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                            {o.oracle}
                        </span>
                        <span
                            className="rounded-[2px] px-[6px] py-[1px] text-[9px] font-bold tracking-[0.12em]"
                            style={{
                                color:
                                    o.result === "PASS"
                                        ? "var(--color-hex-3fb950)"
                                        : "var(--color-hex-ff2a32)",
                                background:
                                    o.result === "PASS"
                                        ? "var(--color-hex-0a1a10)"
                                        : "var(--color-hex-1a0608)",
                                border: `1px solid ${o.result === "PASS" ? "var(--color-hex-3fb95044)" : "var(--color-hex-ff2a3244)"}`,
                            }}
                        >
                            {o.result}
                        </span>
                    </div>
                    {[
                        {
                            k: "ATTACK TYPE",
                            v: o.type,
                        },
                        {
                            k: "SEVERITY",
                            v: o.severity,
                        },
                        {
                            k: "DETAILS",
                            v: o.details,
                        },
                    ].map((r) => (
                        <div key={r.k} className="mb-[6px]">
                            <div className="mb-[1px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                {r.k}
                            </div>
                            <div className="text-[9.5px] leading-[1.5] tracking-[0.04em] text-[var(--color-hex-666666)]">
                                {r.v}
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
function Btn({ onClick, label, red }: { onClick: () => void; label: string; red?: boolean }) {
    return (
        <button
            onClick={onClick}
            className="font-inherit cursor-pointer rounded-[2px] bg-[transparent] px-[12px] py-[4px] text-[9px] tracking-[0.14em]"
            style={{
                color: red ? "var(--color-hex-e31b23)" : "var(--color-hex-666666)",
                border: `1px solid ${red ? "var(--color-hex-6f171b)" : "var(--color-hex-292929)"}`,
            }}
            onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = red
                    ? "var(--color-hex-e31b23)"
                    : "var(--color-hex-444444)")
            }
            onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = red
                    ? "var(--color-hex-6f171b)"
                    : "var(--color-hex-292929)")
            }
        >
            {label}
        </button>
    );
}
