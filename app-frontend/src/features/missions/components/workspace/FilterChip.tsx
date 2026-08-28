import React from "react";

import { Button } from "@/components/ui/button";

export function FilterChip({
    label,
    active,
    onClick,
    red,
    dim,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
    red?: boolean;
    dim?: boolean;
}) {
    return (
        <Button
            variant="outline"
            onClick={onClick}
            className="h-auto rounded-sm px-1.5 py-0.5 text-sm tracking-wide"
            style={{
                color: (() => {
                    if (active && red) {
                        return "var(--destructive)";
                    }
                    if (active) {
                        return "var(--foreground)";
                    }
                    if (dim) {
                        return "var(--border)";
                    }
                    return "var(--muted-foreground)";
                })(),
                background: (() => {
                    if (active && red) {
                        return "var(--border)";
                    }
                    if (active) {
                        return "var(--border)";
                    }
                    return "transparent";
                })(),
                border: `1px solid ${(() => {
                    if (active && red) {
                        return "var(--border)";
                    }
                    if (active) {
                        return "var(--border)";
                    }
                    return "var(--border)";
                })()}`,
            }}
            onMouseEnter={(e) => {
                if (!active) {
                    e.currentTarget.style.color = "var(--muted-foreground)";
                }
            }}
            onMouseLeave={(e) => {
                if (!active) {
                    e.currentTarget.style.color = dim ? "var(--border)" : "var(--muted-foreground)";
                }
            }}
        >
            {label}
        </Button>
    );
}
