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
            className={`h-auto rounded-sm border border-solid px-1.5 py-0.5 text-sm tracking-wide transition-colors ${(() => {
                if (active && red) {
                    return "text-destructive bg-border border-border";
                }
                if (active) {
                    return "text-foreground bg-border border-border";
                }
                if (dim) {
                    return "text-border border-border hover:text-muted-foreground bg-transparent";
                }
                return "text-muted-foreground border-border hover:text-muted-foreground bg-transparent";
            })()} cursor-pointer`}
        >
            {label}
        </Button>
    );
}
