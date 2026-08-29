import React from "react";

export default function Sub({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <div className="text-muted-foreground border-border mb-2.5 border-b text-sm tracking-widest">
                {label}
            </div>
            {children}
        </div>
    );
}
