import React from "react";
import { cva } from "class-variance-authority";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const metricTileVariants = cva("", {
    variants: {
        variant: {
            dashboard: "flex flex-col justify-center bg-background px-5 py-4",
            card: "bg-background rounded-md border border-border px-4 py-3",
            inline: "flex items-center gap-2 px-4 py-1.5",
        },
        borderRight: {
            true: "border-r border-r-border rounded-r-none",
            false: "",
        },
    },
    defaultVariants: {
        variant: "card",
        borderRight: false,
    },
});

export interface MetricTileProps {
    label: string;
    value: string | React.ReactNode;
    valueColor?: string;
    variant?: "dashboard" | "card" | "inline";
    borderRight?: boolean;
    sub?: string;
    className?: string;
}

export function MetricTile({
    label,
    value,
    valueColor,
    variant = "card",
    borderRight = false,
    sub,
    className,
}: MetricTileProps) {
    if (variant === "inline") {
        return (
            <div className={cn(metricTileVariants({ variant, borderRight }), className)}>
                <span className="text-muted-foreground text-sm tracking-widest uppercase">
                    {label}
                </span>
                <span
                    className="text-xs font-bold tracking-tight"
                    style={valueColor ? { color: valueColor } : undefined}
                >
                    {value}
                </span>
                {sub && <span className="text-muted-foreground text-xs tracking-tight">{sub}</span>}
            </div>
        );
    }

    if (variant === "dashboard") {
        return (
            <div className={cn(metricTileVariants({ variant, borderRight }), className)}>
                <div className="text-muted-foreground mb-1.5 text-xs font-medium tracking-widest uppercase">
                    {label}
                </div>
                <div
                    className="text-base leading-none font-bold tracking-tighter"
                    style={valueColor ? { color: valueColor } : undefined}
                >
                    {value}
                </div>
                {sub && <div className="text-muted-foreground mt-0.5 text-sm">{sub}</div>}
            </div>
        );
    }

    return (
        <Card
            className={cn(metricTileVariants({ variant, borderRight }), "shadow-none", className)}
        >
            <CardHeader className="p-0 pb-1">
                <CardTitle className="text-muted-foreground text-xs font-medium tracking-widest uppercase">
                    {label}
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div
                    className="text-sm font-bold"
                    style={valueColor ? { color: valueColor } : undefined}
                >
                    {value}
                </div>
                {sub && <CardDescription className="mt-0.5 text-sm">{sub}</CardDescription>}
            </CardContent>
        </Card>
    );
}
