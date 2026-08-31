import React from "react";

export function SectionHead({ label }: { label: string }) {
    return (
        <div className="border-border text-muted-foreground mt-6 mb-4 border-b pb-1.5 text-sm tracking-widest">
            {label}
        </div>
    );
}
