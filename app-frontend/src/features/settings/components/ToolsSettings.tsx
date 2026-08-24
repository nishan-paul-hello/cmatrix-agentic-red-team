import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { Toggle } from "@/features/settings/components/Toggle";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

export function ToolsSettings({ data }: { data: SettingsData["tools"] }) {
    const { timeout, setTimeout: setTimeout_, parallel, setParallel } = data;
    const tools = ["nmap", "sqlmap", "curl", "ffuf", "nuclei", "gobuster", "hydra"];
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="EXECUTION LIMITS" />
            <FieldRow label="TOOL TIMEOUT" unit="seconds" value={timeout} onChange={setTimeout_} />
            <FieldRow label="MAX PARALLEL TOOL CALLS" value={parallel} onChange={setParallel} />
            <SectionHead label="TOOL ALLOWLIST" />
            {tools.map((t) => (
                <div
                    key={t}
                    className="mb-4 flex items-center justify-between"
                    style={{
                        borderBottom: "1px solid var(--color-hex-111111)",
                        paddingBottom: 10,
                    }}
                >
                    <span className="font-inherit text-[10px] tracking-[0.08em] text-[var(--color-hex-888888)]">
                        {t}
                    </span>
                    <Toggle on={["nmap", "sqlmap", "curl", "ffuf", "nuclei"].includes(t)} />
                </div>
            ))}
            <SaveBar />
        </div>
    );
}
