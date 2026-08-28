import React from "react";

import { Field } from "@/features/settings/components/Field";
import { ModelSelect } from "@/features/settings/components/ModelSelect";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { Toggle } from "@/features/settings/components/Toggle";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

export function ModelSettings({ data }: { data: SettingsData["models"] }) {
    const { specialist, setSpecialist, manager, setManager, validator, setValidator } = data;
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="MODEL ASSIGNMENTS" />
            <Field label="SPECIALIST AGENTS">
                <ModelSelect value={specialist} onChange={setSpecialist} />
            </Field>
            <Field label="TEAM MANAGER">
                <ModelSelect value={manager} onChange={setManager} />
            </Field>
            <Field label="VALIDATION AGENT">
                <ModelSelect value={validator} onChange={setValidator} />
            </Field>
            <SectionHead label="INFERENCE SETTINGS" />
            <Field label="MAX TOKENS PER CALL">
                <div className="flex items-center gap-2 focus:border-[var(--color-brand)]">
                    <input
                        defaultValue="8192"
                        className="font-inherit w-[80px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[8px] py-[5px] text-right text-lg text-[var(--color-hex-a0a0a0)] outline-none"
                    />
                    <span className="text-base-tight text-[var(--color-hex-444444)]">tokens</span>
                </div>
            </Field>
            <Field label="TEMPERATURE">
                <input
                    defaultValue="0.7"
                    className="font-inherit w-[80px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[8px] py-[5px] text-right text-lg text-[var(--color-hex-a0a0a0)] outline-none focus:border-[var(--color-brand)]"
                />
            </Field>
            {[
                {
                    l: "ENABLE PROMPT CACHING",
                    on: true,
                },
                {
                    l: "STREAMING RESPONSES",
                    on: true,
                },
            ].map((s) => (
                <div key={s.l} className="mb-4 flex items-center justify-between">
                    <span className="text-lg text-[var(--color-hex-888888)]">{s.l}</span>
                    <Toggle on={s.on} />
                </div>
            ))}
            <SaveBar />
        </div>
    );
}
