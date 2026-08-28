import React from "react";

export function SectionHead({ label }: { label: string }) {
    return (
        <div
            className="mt-[24px] mb-[16px] text-sm tracking-widest text-[var(--color-hex-444444)]"
            style={{
                borderBottom: "1px solid var(--color-hex-141414)",
                paddingBottom: 6,
            }}
        >
            {label}
        </div>
    );
}
