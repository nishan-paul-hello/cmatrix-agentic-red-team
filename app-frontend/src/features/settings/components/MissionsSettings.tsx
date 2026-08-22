import React from "react";

import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

import { Chips } from "./Chips";
import { Field } from "./Field";
import { SaveBar } from "./SaveBar";
import { SectionHead } from "./SectionHead";
import { ToggleRow } from "./ToggleRow";

export function MissionsSettings({ data }: { data: SettingsData["missions"] }) {
    const { surface, setSurface, mode, setMode } = data;
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
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
