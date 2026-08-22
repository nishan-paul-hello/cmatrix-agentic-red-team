import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

export function VDGSettings({ data }: { data: SettingsData["vdg"] }) {
    const { c, setC, eordThresh, setEordThresh, retryCap, setRetryCap } = data;
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="UCB POLICY" />
            <FieldRow label="UCB EXPLORATION CONSTANT c" value={c} onChange={setC} />
            <SectionHead label="DISPATCH THRESHOLDS" />
            <FieldRow
                label="E_ORD DISPATCH THRESHOLD"
                unit="min E_ord to dispatch"
                value={eordThresh}
                onChange={setEordThresh}
            />
            <FieldRow
                label="RETRY CAP PER NODE"
                unit="attempts"
                value={retryCap}
                onChange={setRetryCap}
            />
            <SaveBar />
        </div>
    );
}
