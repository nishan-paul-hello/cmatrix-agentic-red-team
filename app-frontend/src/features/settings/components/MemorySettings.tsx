import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";

export function MemorySettings() {
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="CONTEXT MANAGEMENT" />
            <FieldRow label="COMPACTION THRESHOLD" unit="% context used" name="memory.thresh" />
            <FieldRow label="MAX EPISODIC ENTRIES" name="memory.maxEp" />
            <SectionHead label="SKILL LIBRARY" />
            <FieldRow
                label="SKILL PROMOTION THRESHOLD"
                unit="successful uses"
                name="memory.skillProm"
            />
            <SaveBar />
        </div>
    );
}
