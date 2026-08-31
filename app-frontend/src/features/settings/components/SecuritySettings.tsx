import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { ToggleRow } from "@/features/settings/components/ToggleRow";

export function SecuritySettings() {
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="AUTHENTICATION" />
            <ToggleRow label="REQUIRE MFA" on />
            <FieldRow label="SESSION TIMEOUT" unit="minutes" name="security.sessionTimeout" />
            <SectionHead label="AUDIT" />
            <FieldRow label="AUDIT LOG RETENTION" unit="days" name="security.retention" />
            <SaveBar />
        </div>
    );
}
