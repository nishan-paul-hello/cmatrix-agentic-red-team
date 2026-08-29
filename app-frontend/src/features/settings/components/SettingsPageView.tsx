import React from "react";

import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
            <Tabs
                value={tab}
                onValueChange={(v) => setTab(v as SettingsTab)}
                className="flex h-full min-h-0 flex-col lg:flex-row"
            >
                {/* Left nav */}
                <TabsList className="border-border bg-background flex h-auto w-full flex-shrink-0 flex-row justify-start overflow-x-auto rounded-none border-b p-0 py-2 lg:w-40 lg:flex-col lg:justify-start lg:overflow-y-auto lg:border-r lg:border-b-0 lg:py-4">
                    <div className="text-muted-foreground mb-3 hidden w-full pl-4 text-left text-base tracking-widest lg:block">
                        SYSTEM / SETTINGS
                    </div>
                    {TABS.map((t) => (
                        <TabsTrigger
                            key={t}
                            value={t}
                            className="data-[state=active]:bg-border data-[state=active]:border-primary data-[state=active]:text-foreground text-muted-foreground hover:text-foreground w-max shrink-0 justify-start rounded-none border-b-2 border-transparent px-4 py-2 text-xs tracking-tight lg:w-full lg:border-b-0 lg:border-l-2"
                        >
                            {t}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {/* Content */}
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <TabsContent value="GENERAL" className="m-0 flex min-h-0 flex-1 flex-col">
                        <GeneralSettings />
                    </TabsContent>
                    <TabsContent value="MODELS" className="m-0 flex min-h-0 flex-1 flex-col">
                        <ModelSettings />
                    </TabsContent>
                    <TabsContent value="MISSIONS" className="m-0 flex min-h-0 flex-1 flex-col">
                        <MissionsSettings />
                    </TabsContent>
                    <TabsContent value="TOOLS" className="m-0 flex min-h-0 flex-1 flex-col">
                        <ToolsSettings />
                    </TabsContent>
                    <TabsContent value="MEMORY" className="m-0 flex min-h-0 flex-1 flex-col">
                        <MemorySettings />
                    </TabsContent>
                    <TabsContent value="VDG" className="m-0 flex min-h-0 flex-1 flex-col">
                        <VDGSettings />
                    </TabsContent>
                    <TabsContent value="VALIDATION" className="m-0 flex min-h-0 flex-1 flex-col">
                        <ValidationSettings />
                    </TabsContent>
                    <TabsContent value="BENCHMARKS" className="m-0 flex min-h-0 flex-1 flex-col">
                        <BenchmarksSettings />
                    </TabsContent>
                    <TabsContent value="COST" className="m-0 flex min-h-0 flex-1 flex-col">
                        <CostSettings />
                    </TabsContent>
                    <TabsContent value="SECURITY" className="m-0 flex min-h-0 flex-1 flex-col">
                        <SecuritySettings />
                    </TabsContent>
                </div>
            </Tabs>
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
