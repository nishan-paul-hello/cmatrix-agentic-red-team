import React from "react";

import { Chips } from "@/features/settings/components/Chips";
import { Field } from "@/features/settings/components/Field";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { ToggleRow } from "@/features/settings/components/ToggleRow";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

export function MissionsSettings({ data }: { data: SettingsData["missions"] }) {
    const { surface, setSurface, mode, setMode } = data;
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="MISSION DEFAULTS" />
            <Field label="DEFAULT SURFACE">
                <Chips
                    options={["WEB APPLICATION", "GRAPHQL", "MULTI-HOST"]}
                    value={surface}
                    onChange={setSurface}
                />
            </Field>
            <Field label="DEFAULT MODE">
                <Chips options={["ONE-DAY", "ZERO-DAY"]} value={mode} onChange={setMode} />
            </Field>
            <SectionHead label="AUTOMATION" />
            <ToggleRow label="AUTO-START VALIDATION AFTER EXPLOIT" on />
            <ToggleRow label="EARLY-STOP ON CRITICAL FINDING" on={false} />
            <SaveBar />
        </div>
    );
}
