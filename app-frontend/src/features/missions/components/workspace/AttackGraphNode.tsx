import React from "react";

import { KPIStrip } from "@/components/ui/KPIStrip";

export interface BaseVDGNode {
    id: string;
    type: string;
    status: string;
    ucb?: number;
    eord?: number;
    eordMax?: number;
}

interface NodeStyleProps {
    border: string;
    bg: string;
    labelColor: string;
    typeColor: string;
    badgeColor: string;
    badgeBg: string;
}

export function AttackGraphNode<T extends BaseVDGNode>({
    node,
    style,
    isVis = true,
    isHov = false,
    x,
    y,
    width,
    variant = "default",
    onMouseEnter,
    onMouseLeave,
    onClick,
}: {
    node: T;
    style: NodeStyleProps;
    isVis?: boolean;
    isHov?: boolean;
    x?: number;
    y?: number;
    width?: number;
    variant?: "default" | "overview";
    onMouseEnter?: (id: string) => void;
    onMouseLeave?: (id: null) => void;
    onClick?: (node: T) => void;
}) {
    if (variant === "overview") {
        return (
            <button
                type="button"
                onClick={() => onClick?.(node)}
                onMouseEnter={() => onMouseEnter?.(node.id)}
                onMouseLeave={() => onMouseLeave?.(null)}
                className={`focus-visible:ring-primary relative cursor-pointer rounded-sm px-3 py-2.5 text-left transition-all duration-150 focus-visible:ring-1 focus-visible:outline-none ${isHov ? "z-node-hover" : "z-node-base"} ${isVis ? "opacity-100" : "opacity-12"}`}
                style={{
                    width: width ?? 224,
                    background: style.bg,
                    border: `1px solid ${isHov && isVis ? "var(--destructive)" : style.border}`,
                }}
                title="Click to open Attack Graph"
            >
                {node.status === "ELIGIBLE" && isVis && (
                    <div className="border-border node-ring-pulse pointer-events-none absolute -inset-[3px] rounded-xs border-[1px] border-solid" />
                )}

                <div className="mb-1.5 flex items-center justify-between">
                    <span
                        className="text-xs font-bold tracking-wide"
                        style={{ color: style.labelColor }}
                    >
                        {node.id}
                    </span>
                    <span
                        className="rounded-sm px-1 py-px text-sm font-semibold tracking-widest"
                        style={{
                            color: style.badgeColor,
                            background: style.badgeBg,
                            border: `1px solid ${style.badgeColor}44`,
                        }}
                    >
                        {node.status}
                    </span>
                </div>

                <div
                    className={`text-[10px] uppercase tracking-widest ${node.ucb !== undefined ? "mb-2" : "mb-0"}`}
                    style={{
                        color: style.typeColor,
                    }}
                >
                    {node.type}
                </div>

                {node.ucb !== undefined && (
                    <div
                        className="flex items-center gap-4 pt-[7px]"
                        style={{
                            borderTop: `1px solid ${style.border}`,
                        }}
                    >
                        <KPIStrip
                            variant="inline"
                            items={[
                                {
                                    k: "UCB",
                                    v: node.ucb.toFixed(3),
                                    c: style.labelColor,
                                },
                                {
                                    k: "E_ord",
                                    v: `${node.eord ?? 0}/${node.eordMax ?? 5}`,
                                    c: style.labelColor,
                                },
                                { k: "PATH", v: "0.612", c: style.typeColor },
                            ]}
                        />
                    </div>
                )}
            </button>
        );
    }

    return (
        <button
            type="button"
            onMouseEnter={() => onMouseEnter?.(node.id)}
            onMouseLeave={() => onMouseLeave?.(null)}
            onClick={() => onClick?.(node)}
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
                <div className="border-border node-ring-pulse pointer-events-none absolute -inset-[4px] rounded-xs border-[1px] border-solid" />
            )}
            <div className="mb-1 flex w-full items-center justify-between px-2 pt-2">
                <span
                    className="truncate text-xs font-bold tracking-wide"
                    style={{
                        color: style.labelColor,
                    }}
                >
                    {node.id}
                </span>
                <span
                    className={`text-destructive text-sm ${node.status === "IN_PROGRESS" ? "blink" : ""}`}
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
                className="leading-tight-2 mb-1.5 w-full truncate px-2 text-left text-[10px] uppercase tracking-widest"
                style={{
                    color: style.typeColor,
                }}
            >
                {node.type}
            </div>
            <div
                className="flex w-full items-center gap-2 px-2 pb-2"
                style={{
                    borderTop: `1px solid ${style.border}`,
                    paddingTop: 5,
                }}
            >
                <KPIStrip
                    variant="inline"
                    className="gap-2"
                    items={[
                        {
                            k: "UCB",
                            v:
                                node.status === "EXPLOITED"
                                    ? "—"
                                    : (node.ucb?.toFixed(3) ?? "0.000"),
                            c: style.labelColor,
                        },
                        { k: "E_ord", v: `${node.eord}/5`, c: style.labelColor },
                    ]}
                />
                <div className="ml-auto">
                    <span
                        className="rounded-sm px-1.5 py-0.5 text-[10px] font-semibold tracking-widest"
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
}
