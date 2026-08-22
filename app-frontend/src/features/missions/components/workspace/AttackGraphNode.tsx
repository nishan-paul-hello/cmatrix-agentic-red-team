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
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
}) {
    return (
        <div
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onClick={onClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    onClick();
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
                border: `1px solid ${isHov && isVis ? "var(--color-hex-ff2a32)" : style.border}`,
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
                    className="text-[9.5px] font-bold tracking-[0.1em]"
                    style={{
                        color: style.labelColor,
                    }}
                >
                    {node.id}
                </span>
                <span
                    className="text-[8px] text-[var(--color-hex-ff2a32)]"
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
                className="mb-[6px] text-[7.5px] leading-[1.2] tracking-[0.14em]"
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
                        className="rounded-[2px] px-[4px] py-[1px] text-[7.5px] font-semibold tracking-[0.1em]"
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
