import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { type VFinding } from "@/features/validation/data/fixtures/validationMockData";

import { STATE_MACHINE_EDGES, STATE_MACHINE_NODES } from "./StateMachineConstants";

export default function StateMachineModal({
    onClose,
    finding,
}: {
    onClose: () => void;
    finding: VFinding | null;
}) {
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
        <Dialog
            open
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                }
            }}
        >
            <DialogContent className="w-panel-2xl sm:max-w-panel-2xl max-w-full p-6">
                <DialogHeader className="mb-5 text-left">
                    <DialogTitle className="text-foreground text-sm font-bold tracking-wide uppercase">
                        VALIDATION STATE MACHINE
                    </DialogTitle>
                    <div className="text-muted-foreground mt-1 text-sm tracking-widest">
                        {finding
                            ? `${finding.id} — ${finding.type} — ${finding.status}`
                            : "DIAGNOSIS → ADAPT → CAP RETRY LOOP"}
                    </div>
                </DialogHeader>
                <div className="relative h-[min(530px,70vh)]">
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
                        <text x="100" y="340" fill="var(--border)" fontSize="8" letterSpacing="1">
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
            </DialogContent>
        </Dialog>
    );
}
