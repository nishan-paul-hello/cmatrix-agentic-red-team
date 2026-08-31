import React from "react";

import { Input } from "@/components/ui/input";
import { Field } from "@/features/settings/components/Field";
import { ModelSelect } from "@/features/settings/components/ModelSelect";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { Toggle } from "@/features/settings/components/Toggle";

export function ModelSettings() {
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="MODEL ASSIGNMENTS" />
            <Field label="SPECIALIST AGENTS" name="models.specialist">
                <ModelSelect onChange={() => {}} />
            </Field>
            <Field label="TEAM MANAGER" name="models.manager">
                <ModelSelect onChange={() => {}} />
            </Field>
            <Field label="VALIDATION AGENT" name="models.validator">
                <ModelSelect onChange={() => {}} />
            </Field>
            <SectionHead label="INFERENCE SETTINGS" />
            <Field label="MAX TOKENS PER CALL">
                <div className="flex items-center gap-2">
                    <Input
                        defaultValue="8192"
                        className="text-muted-foreground w-[80px] text-right text-xs"
                    />
                    <span className="text-muted-foreground text-sm">tokens</span>
                </div>
            </Field>
            <Field label="TEMPERATURE">
                <Input
                    defaultValue="0.7"
                    className="text-muted-foreground w-[80px] text-right text-xs"
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
                    <span className="text-muted-foreground text-xs">{s.l}</span>
                    <Toggle on={s.on} />
                </div>
            ))}
            <SaveBar />
        </div>
    );
}
