import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

/** VDGSettings — UCB hyperparameters per architecture §5.1 */
export function VDGSettings({ data }: { data: SettingsData["vdg"] }) {
    const {
        c,
        setC,
        eordThresh,
        setEordThresh,
        retryCap,
        setRetryCap,
        alpha,
        setAlpha,
        maxDepth,
        setMaxDepth,
        exploitBias,
        setExploitBias,
        validationRetryCap,
        setValidationRetryCap,
    } = data;

    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            {/* UCB Policy — §5.1 */}
            <SectionHead label="UCB POLICY — §5.1" />
            <FieldRow
                label="UCB EXPLORATION CONSTANT c"
                unit="√(ln N / n_i) weight"
                value={c}
                onChange={setC}
            />
            <FieldRow
                label="UCB α — E_ORD PRIOR STRENGTH"
                unit="weight on E_ord bonus [0.0–1.0]"
                value={alpha}
                onChange={setAlpha}
            />
            <FieldRow
                label="EXPLOIT BIAS"
                unit="fraction of cycles run greedy [0.0–1.0]"
                value={exploitBias}
                onChange={setExploitBias}
            />
            <FieldRow
                label="MAX VDG TRAVERSAL DEPTH"
                unit="nodes before forced backtrack"
                value={maxDepth}
                onChange={setMaxDepth}
            />

            {/* Dispatch Thresholds — §5.3 */}
            <SectionHead label="DISPATCH THRESHOLDS — §5.3" />
            <FieldRow
                label="E_ORD DISPATCH THRESHOLD"
                unit="min E_ord to dispatch (1=WEAK … 5=CONFIRMED)"
                value={eordThresh}
                onChange={setEordThresh}
            />
            <FieldRow
                label="RETRY CAP PER NODE"
                unit="specialist attempts before BLOCKED"
                value={retryCap}
                onChange={setRetryCap}
            />

            {/* Validation Agent — §11.3 */}
            <SectionHead label="VALIDATION AGENT — §11.3" />
            <FieldRow
                label="DIAGNOSIS-ADAPT-CAP RETRY CAP"
                unit="oracle retry attempts before INFEASIBLE"
                value={validationRetryCap}
                onChange={setValidationRetryCap}
            />

            <SaveBar />
        </div>
    );
}
