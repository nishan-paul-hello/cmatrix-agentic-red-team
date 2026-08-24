import { createContext, useContext } from "react";

import {
    type ModeType,
    type SurfaceType,
    type TargetType,
} from "@/features/missions/data/fixtures/wizardMockData";
import { type TelemetryEventName } from "@/hooks/useTelemetry";
import { type EventBus } from "@/utils/EventBus";

export interface WizardContextType {
    step: number;
    setStep: (s: number) => void;
    target: string;
    setTarget: (t: string) => void;
    targetType: TargetType;
    setTargetType: (t: TargetType) => void;
    benchSuite: string;
    setBenchSuite: (s: string) => void;
    benchTaskId: string;
    setBenchTaskId: (s: string) => void;
    roe: string;
    setRoe: (r: string) => void;
    maxRuntime: string;
    setMaxRuntime: (m: string) => void;
    costCeiling: string;
    setCostCeiling: (c: string) => void;
    toolTimeout: string;
    setToolTimeout: (t: string) => void;
    surface: SurfaceType;
    setSurface: (s: SurfaceType) => void;
    mode: ModeType;
    setMode: (m: ModeType) => void;
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
