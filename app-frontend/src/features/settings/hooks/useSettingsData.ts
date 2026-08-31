import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { type SettingsTab } from "@/features/settings/components/SettingsPageView";

export const settingsSchema = z.object({
    general: z.object({
        operatorId: z.string(),
        displayName: z.string(),
        organization: z.string(),
        autoRefresh: z.boolean(),
        showUtc: z.boolean(),
        compactRows: z.boolean(),
        soundAlerts: z.boolean(),
        runtime: z.string(),
        ceiling: z.string(),
        defaultMode: z.string(),
        defaultSurface: z.string(),
        roe: z.string(),
        devRef: z.boolean(),
    }),
    models: z.object({
        specialist: z.string(),
        manager: z.string(),
        validator: z.string(),
    }),
    missions: z.object({
        surface: z.string(),
        mode: z.string(),
    }),
    tools: z.object({
        timeout: z.string(),
        parallel: z.string(),
    }),
    memory: z.object({
        thresh: z.string(),
        maxEp: z.string(),
        skillProm: z.string(),
    }),
    vdg: z.object({
        c: z.string(),
        eordThresh: z.string(),
        retryCap: z.string(),
        alpha: z.string(),
        maxDepth: z.string(),
        exploitBias: z.string(),
        validationRetryCap: z.string(),
    }),
    validation: z.object({
        retries: z.string(),
        timeout: z.string(),
    }),
    benchmarks: z.object({
        suite: z.string(),
        runs: z.string(),
        budget: z.string(),
    }),
    cost: z.object({
        ceiling: z.string(),
        perSpec: z.string(),
        alertPct: z.string(),
    }),
    security: z.object({
        sessionTimeout: z.string(),
        retention: z.string(),
    }),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

const defaultValues: SettingsFormValues = {
    general: {
        operatorId: "usr-01",
        displayName: "Security Researcher",
        organization: "RedGrid Research Lab",
        autoRefresh: true,
        showUtc: true,
        compactRows: false,
        soundAlerts: false,
        runtime: "4",
        ceiling: "5.00",
        defaultMode: "ONE-DAY",
        defaultSurface: "WEB APPLICATION",
        roe: "No destructive actions. No data exfiltration beyond evidence collection. No lateral movement beyond defined scope. Stop on any sign of production data exposure. Authorized targets only.",
        devRef: false,
    },
    models: {
        specialist: "claude-sonnet-5",
        manager: "claude-opus-5",
        validator: "claude-haiku-4-5",
    },
    missions: { surface: "WEB APPLICATION", mode: "ONE-DAY" },
    tools: { timeout: "30", parallel: "4" },
    memory: { thresh: "85", maxEp: "500", skillProm: "3" },
    vdg: {
        c: "0.40",
        eordThresh: "3",
        retryCap: "3",
        alpha: "0.25",
        maxDepth: "6",
        exploitBias: "0.30",
        validationRetryCap: "3",
    },
    validation: { retries: "3", timeout: "60" },
    benchmarks: { suite: "CVE-BENCH", runs: "3", budget: "5.00" },
    cost: { ceiling: "10.00", perSpec: "2.00", alertPct: "80" },
    security: { sessionTimeout: "60", retention: "90" },
};

export function useSettingsData() {
    const [tab, setTab] = useState<SettingsTab>("GENERAL");
    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues,
    });

    return {
        tab,
        setTab,
        form,
    };
}

export type SettingsData = ReturnType<typeof useSettingsData>;
