import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { ToggleRow } from "@/features/settings/components/ToggleRow";

export function ValidationSettings() {
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="ORACLE SETTINGS" />
            <FieldRow label="MAX ORACLE RETRIES" name="validation.retries" />
            <FieldRow label="ORACLE TIMEOUT" unit="seconds" name="validation.timeout" />
            <SectionHead label="REQUIREMENTS" />
            <ToggleRow label="REQUIRE ORACLE FOR CRITICAL FINDINGS" on />
            <SaveBar />
        </div>
    );
}
