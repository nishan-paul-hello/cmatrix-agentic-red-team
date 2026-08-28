import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { ToggleRow } from "@/features/settings/components/ToggleRow";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

export function SecuritySettings({ data }: { data: SettingsData["security"] }) {
    const { sessionTimeout, setSessionTimeout, retention, setRetention } = data;
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
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
