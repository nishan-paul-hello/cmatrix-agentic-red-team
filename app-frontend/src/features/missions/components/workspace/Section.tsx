import React from "react";

export function Section({
    label,
    children,
    last,
}: {
    label: string;
    children: React.ReactNode;
    last?: boolean;
}) {
    return (
        <div className={`px-4 py-3${last ? "" : "border-border border-b"}`}>
            <div className="text-muted-foreground mb-2 text-sm tracking-widest">{label}</div>
            {children}
        </div>
    );
}
