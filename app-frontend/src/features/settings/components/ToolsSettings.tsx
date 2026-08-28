import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { Toggle } from "@/features/settings/components/Toggle";

export function ToolsSettings() {
    const tools = ["nmap", "sqlmap", "curl", "ffuf", "nuclei", "gobuster", "hydra"];
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="EXECUTION LIMITS" />
            <FieldRow label="TOOL TIMEOUT" unit="seconds" name="tools.timeout" />
            <FieldRow label="MAX PARALLEL TOOL CALLS" name="tools.parallel" />
            <SectionHead label="TOOL ALLOWLIST" />
            {tools.map((t) => (
                <div
                    key={t}
                    className="border-border mb-4 flex items-center justify-between border-b"
                >
                    <span className="font-inherit text-muted-foreground text-xs tracking-tight">
                        {t}
                    </span>
                    <Toggle on={["nmap", "sqlmap", "curl", "ffuf", "nuclei"].includes(t)} />
                </div>
            ))}
            <SaveBar />
        </div>
    );
}
