import React from "react";

import { Chips } from "@/features/settings/components/Chips";
import { Field } from "@/features/settings/components/Field";
import { FieldRow } from "@/features/settings/components/FieldRow";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";

export function BenchmarksSettings() {
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="DEFAULT SUITE" />
            <Field label="BENCHMARK SUITE" name="benchmarks.suite">
                <Chips options={["CVE-BENCH", "PREDIQL", "MHBENCH"]} />
            </Field>
            <SectionHead label="RUN PARAMETERS" />
            <FieldRow label="RUNS PER CONDITION" name="benchmarks.runs" />
            <FieldRow label="COMPUTE BUDGET PER RUN" unit="USD" name="benchmarks.budget" />
            <SaveBar />
        </div>
    );
}
