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
                className="text-lg-tight mb-[8px] tracking-widest text-[var(--color-hex-666666)]"
                style={{
                    display: "block",
                }}
            >
                {label}
            </label>
            {children}
            {hint && (
                <div className="mt-[6px] text-base tracking-wide text-[var(--color-hex-444444)]">
                    {hint}
                </div>
            )}
        </div>
    );
}
