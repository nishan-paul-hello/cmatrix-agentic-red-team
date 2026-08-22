import React from "react";

export function SectionHead({ label }: { label: string }) {
    return (
        <div
            className="mt-[24px] mb-[16px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]"
            style={{
                borderBottom: "1px solid var(--color-hex-141414)",
                paddingBottom: 6,
            }}
        >
            {label}
        </div>
    );
}
