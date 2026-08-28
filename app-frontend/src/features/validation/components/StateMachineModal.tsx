import { useEffect } from "react";
import { FocusTrap } from "focus-trap-react";

import { Button } from "@/components/ui/button";
import { type VFinding } from "@/features/validation/data/fixtures/validationMockData";

import { STATE_MACHINE_EDGES, STATE_MACHINE_NODES } from "./StateMachineConstants";

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
            case "RULED_OUT":
                return "RULED_OUT";
            case "ORACLE_CONFIRMED":
                return "ORACLE_CONFIRMED";
            default:
                return null;
        }
    })();
    const nodes = STATE_MACHINE_NODES;
    const edges = STATE_MACHINE_EDGES;
    return (
        <FocusTrap focusTrapOptions={{ escapeDeactivates: false }}>
            <div
                role="presentation"
                onKeyDown={(e) => {
                    if (e.key === "Escape" || e.key === "Enter") {
                        onClose();
                    }
                }}
                className="bg-muted fixed inset-0 z-[60] flex items-center justify-center"
                onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        onClose();
                    }
                }}
            >
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="state-machine-modal-title"
                    className="w-panel-2xl border-border bg-background rounded-sm border-[1px] border-solid p-6"
                >
                    <div className="mb-5 flex justify-between">
                        <div>
                            <div
                                id="state-machine-modal-title"
                                className="text-foreground text-sm font-bold tracking-wide"
                            >
                                VALIDATION STATE MACHINE
                            </div>
                            <div className="text-muted-foreground text-sm tracking-widest">
                                {finding
                                    ? `${finding.id} — ${finding.type} — ${finding.status}`
                                    : "DIAGNOSIS → ADAPT → CAP RETRY LOOP"}
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
                                        stroke="var(--border)"
                                        strokeWidth="1"
                                        markerEnd="url(#sm-arrow)"
                                    />
                                    {e.label && (
                                        <text
                                            x={(e.x1 + e.x2) / 2 + 6}
                                            y={(e.y1 + e.y2) / 2}
                                            fill="var(--muted-foreground)"
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
                                stroke="var(--border)"
                                strokeWidth="1"
                                fill="none"
                                strokeDasharray="4 3"
                                markerEnd="url(#sm-arrow-red)"
                            />
                            <text
                                x="100"
                                y="340"
                                fill="var(--border)"
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
                                    <path d="M0,0 L0,6 L6,3 z" fill="var(--border)" />
                                </marker>
                                <marker
                                    id="sm-arrow-red"
                                    markerWidth="6"
                                    markerHeight="6"
                                    refX="5"
                                    refY="3"
                                    orient="auto"
                                >
                                    <path d="M0,0 L0,6 L6,3 z" fill="var(--border)" />
                                </marker>
                            </defs>
                        </svg>
                        {nodes.map((n) => {
                            const isActive = n.id === activeState;
                            return (
                                <div
                                    key={n.id}
                                    className="absolute rounded-sm"
                                    style={{
                                        left: n.x,
                                        top: n.y,
                                        width: n.w,
                                        height: n.h,
                                        background: isActive ? "var(--primary)" : n.color,
                                        border: `1px solid ${isActive ? "var(--destructive)" : (n.border ?? "var(--border)")}`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <span
                                        className="text-base font-bold tracking-wide"
                                        style={{
                                            color: isActive ? "var(--foreground)" : n.text,
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
        </FocusTrap>
    );
}
