import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { ToggleRow } from "@/features/settings/components/ToggleRow";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

export function ValidationSettings({ data }: { data: SettingsData["validation"] }) {
    const { retries, setRetries, timeout, setTimeout: setTimeout_ } = data;
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="ORACLE SETTINGS" />
            <FieldRow label="MAX ORACLE RETRIES" value={retries} onChange={setRetries} />
            <FieldRow
                label="ORACLE TIMEOUT"
                unit="seconds"
                value={timeout}
                onChange={setTimeout_}
            />
            <SectionHead label="REQUIREMENTS" />
            <ToggleRow label="REQUIRE ORACLE FOR CRITICAL FINDINGS" on />
            <SaveBar />
        </div>
    );
}
