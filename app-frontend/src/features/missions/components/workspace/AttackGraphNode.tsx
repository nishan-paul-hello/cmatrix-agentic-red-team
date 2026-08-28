import React from "react";

import { NodeStat } from "@/features/missions/components/workspace/NodeStat";
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
        <div
            onMouseEnter={() => onMouseEnter(node.id)}
            onMouseLeave={() => onMouseLeave(null)}
            onClick={() => onClick(node)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    onClick(node);
                }
            }}
            role="button"
            tabIndex={0}
            className="absolute cursor-pointer rounded-[2px] px-[10px] py-[8px]"
            style={{
                left: x,
                top: y,
                width,
                background: style.bg,
                border: `1px solid ${isHov && isVis ? "var(--color-danger)" : style.border}`,
                opacity: isVis ? 1 : 0.12,
                zIndex: isHov ? 10 : 1,
                transition: "opacity 0.15s, border-color 0.1s",
            }}
        >
            {node.status === "ELIGIBLE" && isVis && (
                <div
                    className="absolute rounded-[3px] border-[1px] border-solid border-[var(--color-hex-e31b2330)]"
                    style={{
                        inset: -4,
                        pointerEvents: "none",
                        animation: "nodeRing 2.2s ease infinite",
                    }}
                />
            )}
            <div className="mb-1 flex items-center justify-between">
                <span
                    className="text-lg-tight font-bold tracking-normal"
                    style={{
                        color: style.labelColor,
                    }}
                >
                    {node.id}
                </span>
                <span
                    className="text-sm text-[var(--color-danger)]"
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
                className="text-sm-tight leading-tight-2 tracking-wider-1 mb-[6px]"
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
                <NodeStat
                    label="UCB"
                    value={node.status === "EXPLOITED" ? "—" : node.ucb.toFixed(3)}
                    color={style.labelColor}
                />
                <NodeStat label="E_ord" value={`${node.eord}/5`} color={style.labelColor} />
                <div className="ml-auto">
                    <span
                        className="text-sm-tight rounded-[2px] px-[4px] py-[1px] font-semibold tracking-normal"
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
        </div>
    );
});
