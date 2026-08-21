import React, { useEffect } from "react";

import { type VFinding } from "../data/validationMockData";

export default function StateMachineModal({
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
                        {edges.map((e) => (
                            <g key={`${e.x1}-${e.y1}-${e.x2}-${e.y2}`}>
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
