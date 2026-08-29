import React from "react";

import { KPIStrip } from "@/components/ui/KPIStrip";
import { type VDGNode } from "@/features/missions/data/fixtures/attackGraphMockData";

interface NodeStyleProps {
    border: string;
    bg: string;
    labelColor: string;
    typeColor: string;
    badgeColor: string;
    badgeBg: string;
}

export const AttackGraphNode = React.memo(function AttackGraphNodeBase({
    node,
    style,
    isVis,
    isHov,
    x,
    y,
    width,
    onMouseEnter,
    onMouseLeave,
    onClick,
}: {
    node: VDGNode;
    style: NodeStyleProps;
    isVis: boolean;
    isHov: boolean;
    x: number;
    y: number;
    width: number;
    onMouseEnter: (id: string) => void;
    onMouseLeave: (id: null) => void;
    onClick: (node: VDGNode) => void;
}) {
    return (
        <button
            type="button"
            onMouseEnter={() => onMouseEnter(node.id)}
            onMouseLeave={() => onMouseLeave(null)}
            onClick={() => onClick(node)}
            className={`absolute flex cursor-pointer flex-col items-center justify-center rounded-sm transition-all duration-150 ${isHov ? "z-node-hover" : "z-node-base"} ${isVis ? "opacity-100" : "opacity-12"}`}
            style={{
                top: y,
                left: x,
                width,
                background: style.bg,
                border: `1px solid ${isHov && isVis ? "var(--destructive)" : style.border}`,
            }}
        >
            {node.status === "ELIGIBLE" && isVis && (
                <div
                    className="border-border absolute rounded-xs border-[1px] border-solid"
                    style={{
                        inset: -4,
                        pointerEvents: "none",
                        animation: "nodeRing 2.2s ease infinite",
                    }}
                />
            )}
            <div className="mb-1 flex items-center justify-between">
                <span
                    className="text-base font-bold tracking-normal"
                    style={{
                        color: style.labelColor,
                    }}
                >
                    {node.id}
                </span>
                <span
                    className="text-destructive text-sm"
                    style={{
                        animation:
                            node.status === "IN_PROGRESS" ? "blink 1s ease infinite" : "none",
                    }}
                >
                    {(() => {
                        if (node.status === "EXPLOITED") {
                            return "✓";
                        }
                        if (node.status === "BLOCKED") {
                            return "⊗";
                        }
                        if (node.status === "IN_PROGRESS") {
                            return "▶";
                        }
                        return "";
                    })()}
                </span>
            </div>
            <div
                className="leading-tight-2 mb-1.5 text-xs tracking-widest"
                style={{
                    color: style.typeColor,
                }}
            >
                {node.type}
            </div>
            <div
                className="flex items-center gap-3"
                style={{
                    borderTop: `1px solid ${style.border}`,
                    paddingTop: 5,
                }}
            >
                <KPIStrip
                    variant="inline"
                    className="gap-3"
                    items={[
                        {
                            k: "UCB",
                            v: node.status === "EXPLOITED" ? "—" : node.ucb.toFixed(3),
                            c: style.labelColor,
                        },
                        { k: "E_ord", v: `${node.eord}/5`, c: style.labelColor },
                    ]}
                />
                <div className="ml-auto">
                    <span
                        className="rounded-sm px-1 py-px text-xs font-semibold tracking-normal"
                        style={{
                            color: style.badgeColor,
                            background: style.badgeBg,
                            border: `1px solid ${style.badgeColor}33`,
                        }}
                    >
                        {(() => {
                            if (node.status === "IN_PROGRESS") {
                                return "IN PROG";
                            }
                            if (node.status === "DEPRIORITIZED") {
                                return "DEPRIO";
                            }
                            return node.status;
                        })()}
                    </span>
                </div>
            </div>
        </button>
    );
});
