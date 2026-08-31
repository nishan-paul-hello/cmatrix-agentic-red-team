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
        <div className="border-border bg-background absolute top-4 left-4 z-10 flex flex-col gap-1.5 rounded-sm border-[1px] border-solid px-3 py-2.5">
            <div className="text-muted-foreground mb-1 text-xs tracking-widest">LEGEND</div>
            {nodeStatuses.map((st) => {
                const s = nodeStyles[st];
                return (
                    <div key={st} className="flex items-center gap-2">
                        <div
                            className="h-2 w-2 shrink-0 rounded-none"
                            style={{
                                border: `1px solid ${s.border}`,
                                background: s.bg,
                            }}
                        />
                        <span
                            className="text-xs tracking-normal"
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
