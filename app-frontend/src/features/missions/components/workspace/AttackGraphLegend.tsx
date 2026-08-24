import React from "react";

export function AttackGraphLegend({
    nodeStatuses,
    nodeStyles,
}: {
    nodeStatuses: string[];
    nodeStyles: Record<
        string,
        {
            border: string;
            bg: string;
            labelColor: string;
            typeColor: string;
            badgeColor: string;
            badgeBg: string;
        }
    >;
}) {
    return (
        <div className="absolute right-4 bottom-4 flex flex-col gap-1.5 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[12px] py-[10px]">
            <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-333333)]">
                LEGEND
            </div>
            {nodeStatuses.map((st) => {
                const s = nodeStyles[st];
                return (
                    <div key={st} className="flex items-center gap-2">
                        <div
                            className="h-[8px] w-[8px] shrink-0 rounded-[1px]"
                            style={{
                                border: `1px solid ${s.border}`,
                                background: s.bg,
                            }}
                        />
                        <span
                            className="text-[7.5px] tracking-[0.1em]"
                            style={{
                                color: s.labelColor,
                            }}
                        >
                            {st === "IN_PROGRESS" ? "IN PROGRESS" : st}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
