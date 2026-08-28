import React from "react";

export function ExecDrawerElChangesTab() {
    return (
        <div className="flex flex-col gap-2">
            {[
                "SERVICE ssh:22 ADDED",
                "SERVICE http:80 ADDED",
                "SERVICE https:443 ADDED",
                "HOST app.targetcorp.com CONFIRMED",
            ].map((c) => (
                <div key={c} className="flex items-center gap-2">
                    <span className="text-base text-[var(--color-success)]">+</span>
                    <span className="tracking-tight-1 text-base text-[var(--color-hex-555555)]">
                        {c}
                    </span>
                </div>
            ))}
        </div>
    );
}
