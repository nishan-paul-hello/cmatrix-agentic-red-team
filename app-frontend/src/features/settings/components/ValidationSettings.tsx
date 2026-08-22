import React from "react";

import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

import { FieldRow } from "./FieldRow";
import { SaveBar } from "./SaveBar";
import { SectionHead } from "./SectionHead";
import { ToggleRow } from "./ToggleRow";

export function ValidationSettings({ data }: { data: SettingsData["validation"] }) {
    const { retries, setRetries, timeout, setTimeout: setTimeout_ } = data;
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
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
