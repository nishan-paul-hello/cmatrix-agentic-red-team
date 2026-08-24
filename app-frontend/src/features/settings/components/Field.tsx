import React from "react";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-[20px]">
            <div className="mb-[8px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                {label}
            </div>
            {children}
        </div>
    );
}
