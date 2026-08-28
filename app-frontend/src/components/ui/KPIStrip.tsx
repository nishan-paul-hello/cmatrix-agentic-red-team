import React from "react";

import { cn } from "@/lib/utils";

export interface KPIItem {
    k: string;
    v: string | React.ReactNode;
    c?: string;
    sub?: string;
}

export interface KPIStripProps extends React.HTMLAttributes<HTMLDivElement> {
    items: KPIItem[];
    variant?: "default" | "inline" | "card";
}

export function KPIStrip({ items, className, variant = "default", ...props }: KPIStripProps) {
    if (variant === "inline") {
        return (
            <div className={cn("flex items-center gap-5", className)} {...props}>
                {items.map((m) => (
                    <div key={m.k} className="flex flex-col items-end">
                        <div className="text-muted-foreground mb-0.5 text-xs tracking-widest uppercase">
                            {m.k}
                        </div>
                        <div
                            className="text-sm font-bold text-[var(--kpi-color,var(--foreground))]"
                            style={
                                m.c ? ({ "--kpi-color": m.c } as React.CSSProperties) : undefined
                            }
                        >
                            {m.v}
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (variant === "card") {
        return (
            <div className={cn("flex flex-wrap gap-4", className)} {...props}>
                {items.map((m) => (
                    <div
                        key={m.k}
                        className="bg-background border-border rounded-md border px-4 py-3 shadow-none"
                    >
                        <div className="text-muted-foreground mb-0.5 text-xs font-medium tracking-widest uppercase">
                            {m.k}
                        </div>
                        <div
                            className="text-sm font-bold text-[var(--kpi-color,var(--foreground))]"
                            style={
                                m.c ? ({ "--kpi-color": m.c } as React.CSSProperties) : undefined
                            }
                        >
                            {m.v}
                        </div>
                        {m.sub && (
                            <div className="text-muted-foreground mt-0.5 text-sm">{m.sub}</div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div
            className={cn(
                "border-border divide-border gap-0 divide-y overflow-hidden rounded-sm border md:divide-x md:divide-y-0",
                className,
            )}
            {...props}
        >
            {items.map((m) => (
                <div key={m.k} className="bg-card px-4 py-3">
                    <div className="text-muted-foreground mb-1 text-xs tracking-widest uppercase">
                        {m.k}
                    </div>
                    <div
                        className="text-xs font-bold text-[var(--kpi-color,var(--foreground))]"
                        style={m.c ? ({ "--kpi-color": m.c } as React.CSSProperties) : undefined}
                    >
                        {m.v}
                    </div>
                    {m.sub && (
                        <div className="text-muted-foreground mt-0.5 text-sm tracking-normal">
                            {m.sub}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
