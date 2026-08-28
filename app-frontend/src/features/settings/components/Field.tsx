import React from "react";

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mb-[20px]">
            <div className="mb-[8px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                {label}
            </div>
            {children}
        </div>
    );
}
