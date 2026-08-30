import React from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Chips } from "@/features/settings/components/Chips";
import { Field } from "@/features/settings/components/Field";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { SettingsTextInput } from "@/features/settings/components/SettingsTextInput";
import { ToggleRow } from "@/features/settings/components/ToggleRow";

export function GeneralSettings() {
    const form = useFormContext();
    return (
        <div className="max-w-panel-xl flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="OPERATOR" />
            <Field label="OPERATOR ID" name="general.operatorId">
                <SettingsTextInput />
            </Field>
            <Field label="DISPLAY NAME" name="general.displayName">
                <SettingsTextInput />
            </Field>
            <Field label="ORGANIZATION" name="general.organization">
                <SettingsTextInput />
            </Field>
            <SectionHead label="INTERFACE" />
            <ToggleRow label="AUTO-REFRESH LIVE FEED" name="general.autoRefresh" />
            <ToggleRow label="SHOW TIMESTAMPS IN UTC" name="general.showUtc" />
            <ToggleRow label="COMPACT TABLE ROWS" name="general.compactRows" />
            <ToggleRow label="SOUND ALERTS ON ESCALATION" name="general.soundAlerts" />
            <SectionHead label="DEFAULT RULES OF ENGAGEMENT" />
            <FormField
                control={form.control}
                name="general.runtime"
                render={({ field }) => (
                    <FormItem className="mb-5">
                        <FormLabel className="text-muted-foreground mb-2 block text-sm leading-none font-normal tracking-widest">
                            MAX RUNTIME
                        </FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-2">
                                <SettingsTextInput
                                    {...field}
                                    className="text-muted-foreground w-[72px] text-right text-xs"
                                />
                                <span className="text-muted-foreground text-sm">hours</span>
                            </div>
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="general.ceiling"
                render={({ field }) => (
                    <FormItem className="mb-5">
                        <FormLabel className="text-muted-foreground mb-2 block text-sm leading-none font-normal tracking-widest">
                            COST CEILING
                        </FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-2">
                                <SettingsTextInput
                                    {...field}
                                    className="text-muted-foreground w-[72px] text-right text-xs"
                                />
                                <span className="text-muted-foreground text-sm">USD</span>
                            </div>
                        </FormControl>
                    </FormItem>
                )}
            />
            <Field label="DEFAULT MODE" name="general.defaultMode">
                <Chips options={["ONE-DAY", "ZERO-DAY"]} />
            </Field>
            <Field label="DEFAULT SURFACE" name="general.defaultSurface">
                <Chips options={["WEB APPLICATION", "GRAPHQL", "MULTI-HOST"]} />
            </Field>
            <Field label="ROE TEXT" name="general.roe">
                <Textarea className="text-muted-foreground min-h-[80px] resize-y text-xs leading-loose tracking-tighter" />
            </Field>
            <SectionHead label="DANGER ZONE" />
            <div className="border-border bg-muted rounded-sm border px-4 py-3.5">
                <div className="text-destructive mb-2 text-base tracking-widest">
                    DESTRUCTIVE ACTIONS
                </div>
                <div className="flex flex-wrap gap-3">
                    {["CLEAR ALL MISSIONS", "RESET KNOWLEDGE BASE", "FACTORY RESET"].map((a) => (
                        <Button
                            key={a}
                            variant="outline"
                            size="sm"
                            className="text-destructive border-border hover:border-destructive hover:bg-muted text-xs tracking-normal"
                        >
                            {a}
                        </Button>
                    ))}
                </div>
            </div>
            {/* DEV REFERENCE collapsible */}
            <div className="mt-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        form.setValue("general.devRef", !form.watch("general.devRef"));
                    }}
                    className="text-muted-foreground cursor-pointer text-xs tracking-widest"
                >
                    {form.watch("general.devRef") ? "▾" : "▸"} DEV REFERENCE
                </Button>
                {form.watch("general.devRef") && (
                    <div className="border-border bg-background text-muted-foreground mt-2.5 rounded-sm border px-3.5 py-2.5 text-base leading-loose tracking-tight">
                        Modal states: ELIGIBLE · IN_PROGRESS · EXPLOITED · BLOCKED · INFEASIBLE ·
                        DEPRIORITIZED
                        <br />
                        Finding states: PENDING · RETRY · VALIDATED · RULED OUT
                        <br />
                        Mission states: RUNNING · PAUSED · VALIDATING · QUEUED · COMPLETED ·
                        TERMINATED
                    </div>
                )}
            </div>
            <SaveBar />
        </div>
    );
}
