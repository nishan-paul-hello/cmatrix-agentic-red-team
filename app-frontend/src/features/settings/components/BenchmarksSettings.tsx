import React from "react";

import { Chips } from "@/features/settings/components/Chips";
import { Field } from "@/features/settings/components/Field";
import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

export function BenchmarksSettings({ data }: { data: SettingsData["benchmarks"] }) {
    const { suite, setSuite, runs, setRuns, budget, setBudget } = data;
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="DEFAULT SUITE" />
            <Field label="BENCHMARK SUITE">
                <Chips
                    options={["CVE-BENCH", "PREDIQL", "MHBENCH"]}
                    value={suite}
                    onChange={setSuite}
                />
            </Field>
            <SectionHead label="RUN PARAMETERS" />
            <FieldRow label="RUNS PER CONDITION" value={runs} onChange={setRuns} />
            <FieldRow
                label="COMPUTE BUDGET PER RUN"
                unit="USD"
                value={budget}
                onChange={setBudget}
            />
            <SaveBar />
        </div>
    );
}
