import { createContext, useContext } from "react";
import { type UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { type TelemetryEventName } from "@/hooks/useTelemetry";
import { type EventBus } from "@/utils/EventBus";

export const wizardSchema = z.object({
    target: z.string(),
    targetType: z.enum(["URL", "HOST", "BENCHMARK ENVIRONMENT"]),
    benchSuite: z.string(),
    benchTaskId: z.string(),
    roe: z.string(),
    maxRuntime: z.string(),
    costCeiling: z.string(),
    toolTimeout: z.string(),
    surface: z.enum(["WEB APPLICATION", "GRAPHQL", "MULTI-HOST"]),
    mode: z.enum(["ONE-DAY", "ZERO-DAY"]),
});

export type WizardFormValues = z.infer<typeof wizardSchema>;

export interface WizardContextType {
    step: number;
    setStep: (s: number) => void;
    form: UseFormReturn<WizardFormValues>;
    onCancel?: () => void;
    eventBus: EventBus;
    logEvent: (event: TelemetryEventName, data?: Record<string, unknown>) => void;
    onStart?: () => void;
}

export const WizardContext = createContext<WizardContextType | null>(null);

export function useWizardContext() {
    const ctx = useContext(WizardContext);
    if (!ctx) {
        throw new Error("Missing WizardContext");
    }
    return ctx;
}
