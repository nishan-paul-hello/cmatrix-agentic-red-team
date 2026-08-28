import React from "react";

export default function Sub({
    label,
    children,
    last,
}: {
    label: string;
    children: React.ReactNode;
    last?: boolean;
}) {
    return (
        <div
            style={{
                marginBottom: last ? 0 : 20,
            }}
        >
            <div className="text-muted-foreground border-border mb-2.5 border-b text-sm tracking-widest">
                {label}
            </div>
            {children}
        </div>
    );
}
