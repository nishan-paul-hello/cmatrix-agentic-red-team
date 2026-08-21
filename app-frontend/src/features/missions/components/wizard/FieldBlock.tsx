import React from "react";

export default function FieldBlock({
    label,
    hint,
    mb,
    children,
}: {
    label: string;
    hint?: string;
    mb?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className={mb ? "mb-7" : ""}>
            <label
                className="mb-[8px] text-[9.5px] tracking-[0.2em] text-[var(--color-hex-666666)]"
                style={{
                    display: "block",
                }}
            >
                {label}
            </label>
            {children}
            {hint && (
                <div className="mt-[6px] text-[9px] tracking-[0.12em] text-[var(--color-hex-444444)]">
                    {hint}
                </div>
            )}
        </div>
    );
}
