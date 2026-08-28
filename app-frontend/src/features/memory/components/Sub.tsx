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
            <div
                className="mb-[10px] text-sm tracking-widest text-[var(--color-hex-444444)]"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                    paddingBottom: 5,
                }}
            >
                {label}
            </div>
            {children}
        </div>
    );
}
