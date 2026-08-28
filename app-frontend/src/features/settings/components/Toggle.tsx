import React, { useState } from "react";

export function Toggle({ on }: { on: boolean }) {
    const [v, setV] = useState(on);
    return (
        <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    setV(!v);
                }
            }}
            onClick={() => setV(!v)}
            className="relative h-[16px] w-[32px] shrink-0 cursor-pointer rounded-[8px]"
            style={{
                background: v ? "var(--color-brand)" : "var(--color-hex-1e1e1e)",
                border: `1px solid ${v ? "var(--color-brand)" : "var(--color-hex-292929)"}`,
                transition: "background 0.15s",
            }}
        >
            <div
                className="absolute top-[1px] h-[12px] w-[12px] bg-[var(--color-fg)]"
                style={{
                    borderRadius: "50%",
                    left: v ? 16 : 2,
                    transition: "left 0.15s",
                }}
            />
        </div>
    );
}
