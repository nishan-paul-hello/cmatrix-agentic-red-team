import React from "react";

import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

import { FieldRow } from "./FieldRow";
import { SaveBar } from "./SaveBar";
import { SectionHead } from "./SectionHead";

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
