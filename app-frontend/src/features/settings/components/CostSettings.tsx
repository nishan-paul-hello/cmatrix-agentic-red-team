import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";

export function CostSettings() {
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="COST LIMITS" />
            <FieldRow label="GLOBAL COST CEILING" unit="USD" name="cost.ceiling" />
            <FieldRow label="PER-SPECIALIST COST CAP" unit="USD" name="cost.perSpec" />
            <SectionHead label="ALERTS" />
            <FieldRow label="COST ALERT THRESHOLD" unit="% of ceiling" name="cost.alertPct" />
            <SaveBar />
        </div>
    );
}
