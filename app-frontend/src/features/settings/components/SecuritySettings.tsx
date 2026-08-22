import React from "react";

import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

import { FieldRow } from "./FieldRow";
import { SaveBar } from "./SaveBar";
import { SectionHead } from "./SectionHead";
import { ToggleRow } from "./ToggleRow";

export function SecuritySettings({ data }: { data: SettingsData["security"] }) {
    const { sessionTimeout, setSessionTimeout, retention, setRetention } = data;
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="AUTHENTICATION" />
            <ToggleRow label="REQUIRE MFA" on />
            <FieldRow
                label="SESSION TIMEOUT"
                unit="minutes"
                value={sessionTimeout}
                onChange={setSessionTimeout}
            />
            <SectionHead label="AUDIT" />
            <FieldRow
                label="AUDIT LOG RETENTION"
                unit="days"
                value={retention}
                onChange={setRetention}
            />
            <SaveBar />
        </div>
    );
}
