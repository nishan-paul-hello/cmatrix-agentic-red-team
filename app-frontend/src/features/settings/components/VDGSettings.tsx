import React from "react";

import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";

/** VDGSettings — UCB hyperparameters per architecture §5.1 */
export function VDGSettings() {
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            {/* UCB Policy — §5.1 */}
            <SectionHead label="UCB POLICY — §5.1" />
            <FieldRow label="UCB EXPLORATION CONSTANT c" unit="√(ln N / n_i) weight" name="vdg.c" />
            <FieldRow
                label="UCB α — E_ORD PRIOR STRENGTH"
                unit="weight on E_ord bonus [0.0–1.0]"
                name="vdg.alpha"
            />
            <FieldRow
                label="EXPLOIT BIAS"
                unit="fraction of cycles run greedy [0.0–1.0]"
                name="vdg.exploitBias"
            />
            <FieldRow
                label="MAX VDG TRAVERSAL DEPTH"
                unit="nodes before forced backtrack"
                name="vdg.maxDepth"
            />

            {/* Dispatch Thresholds — §5.3 */}
            <SectionHead label="DISPATCH THRESHOLDS — §5.3" />
            <FieldRow
                label="E_ORD DISPATCH THRESHOLD"
                unit="min E_ord to dispatch (1=WEAK … 5=CONFIRMED)"
                name="vdg.eordThresh"
            />
            <FieldRow
                label="RETRY CAP PER NODE"
                unit="specialist attempts before BLOCKED"
                name="vdg.retryCap"
            />

            {/* Validation Agent — §11.3 */}
            <SectionHead label="VALIDATION AGENT — §11.3" />
            <FieldRow
                label="DIAGNOSIS-ADAPT-CAP RETRY CAP"
                unit="oracle retry attempts before INFEASIBLE"
                name="vdg.validationRetryCap"
            />

            <SaveBar />
        </div>
    );
}
