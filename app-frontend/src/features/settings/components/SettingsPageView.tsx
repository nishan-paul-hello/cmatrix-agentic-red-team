import React from "react";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BenchmarksSettings } from "@/features/settings/components/BenchmarksSettings";
import { CostSettings } from "@/features/settings/components/CostSettings";
import { GeneralSettings } from "@/features/settings/components/GeneralSettings";
import { MemorySettings } from "@/features/settings/components/MemorySettings";
import { MissionsSettings } from "@/features/settings/components/MissionsSettings";
import { ModelSettings } from "@/features/settings/components/ModelSettings";
import { SecuritySettings } from "@/features/settings/components/SecuritySettings";
import { ToolsSettings } from "@/features/settings/components/ToolsSettings";
import { ValidationSettings } from "@/features/settings/components/ValidationSettings";
import { VDGSettings } from "@/features/settings/components/VDGSettings";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

export type SettingsTab =
    | "GENERAL"
    | "MODELS"
    | "MISSIONS"
    | "TOOLS"
    | "MEMORY"
    | "VDG"
    | "VALIDATION"
    | "BENCHMARKS"
    | "COST"
    | "SECURITY";
const TABS: SettingsTab[] = [
    "GENERAL",
    "MODELS",
    "MISSIONS",
    "TOOLS",
    "MEMORY",
    "VDG",
    "VALIDATION",
    "BENCHMARKS",
    "COST",
    "SECURITY",
];
export default function SettingsPageView({ data }: { data: SettingsData }) {
    const { tab, setTab, form } = data;
    return (
        <Form {...form}>
            <div className="flex h-full min-h-0 flex-col lg:flex-row">
                {/* Left nav */}
                <div className="border-border bg-background flex w-full flex-shrink-0 flex-row overflow-x-auto border-b py-2 lg:w-40 lg:flex-col lg:overflow-y-auto lg:border-r lg:border-b-0 lg:py-4">
                    <div className="text-muted-foreground mb-3 hidden pl-4 text-base tracking-widest lg:block">
                        SYSTEM / SETTINGS
                    </div>
                    {TABS.map((t) => (
                        <Button
                            key={t}
                            variant="ghost"
                            size="sm"
                            onClick={() => setTab(t)}
                            className={[
                                "w-max shrink-0 justify-start rounded-none border-b-2 px-4 py-2 text-xs tracking-tight lg:w-full lg:border-b-0 lg:border-l-2",
                                t === tab
                                    ? "bg-border text-foreground border-primary"
                                    : "text-muted-foreground hover:text-foreground border-transparent",
                            ].join(" ")}
                        >
                            {t}
                        </Button>
                    ))}
                </div>

                {/* Content */}
                <div className="min-h-0 flex-1 overflow-hidden">
                    {tab === "GENERAL" && <GeneralSettings />}
                    {tab === "MODELS" && <ModelSettings />}
                    {tab === "MISSIONS" && <MissionsSettings />}
                    {tab === "TOOLS" && <ToolsSettings />}
                    {tab === "MEMORY" && <MemorySettings />}
                    {tab === "VDG" && <VDGSettings />}
                    {tab === "VALIDATION" && <ValidationSettings />}
                    {tab === "BENCHMARKS" && <BenchmarksSettings />}
                    {tab === "COST" && <CostSettings />}
                    {tab === "SECURITY" && <SecuritySettings />}
                </div>
            </div>
        </Form>
    );
}

/* ── Shared helpers ── */

/* ── GENERAL ── */

/* ── MODELS ── */

/* ── MISSIONS ── */

/* ── TOOLS ── */

/* ── MEMORY ── */

/* ── VDG ── */

/* ── VALIDATION ── */

/* ── BENCHMARKS ── */

/* ── COST ── */

/* ── SECURITY ── */
