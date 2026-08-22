import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

export function MemorySettings({ data }: { data: SettingsData["memory"] }) {
    const { thresh, setThresh, maxEp, setMaxEp, skillProm, setSkillProm } = data;
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="CONTEXT MANAGEMENT" />
            <FieldRow
                label="COMPACTION THRESHOLD"
                unit="% context used"
                value={thresh}
                onChange={setThresh}
            />
            <FieldRow label="MAX EPISODIC ENTRIES" value={maxEp} onChange={setMaxEp} />
            <SectionHead label="SKILL LIBRARY" />
            <FieldRow
                label="SKILL PROMOTION THRESHOLD"
                unit="successful uses"
                value={skillProm}
                onChange={setSkillProm}
            />
            <SaveBar />
        </div>
    );
}
