import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

export function CostSettings({ data }: { data: SettingsData["cost"] }) {
    const { ceiling, setCeiling, perSpec, setPerSpec, alertPct, setAlertPct } = data;
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="COST LIMITS" />
            <FieldRow
                label="GLOBAL COST CEILING"
                unit="USD"
                value={ceiling}
                onChange={setCeiling}
            />
            <FieldRow
                label="PER-SPECIALIST COST CAP"
                unit="USD"
                value={perSpec}
                onChange={setPerSpec}
            />
            <SectionHead label="ALERTS" />
            <FieldRow
                label="COST ALERT THRESHOLD"
                unit="% of ceiling"
                value={alertPct}
                onChange={setAlertPct}
            />
            <SaveBar />
        </div>
    );
}
