import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    wizardSchema,
    type WizardFormValues,
} from "@/features/missions/components/wizard/WizardContext";

export function useNewMissionWizard() {
    const [step, setStep] = useState(1);
    const [animateIn, setAnimateIn] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setAnimateIn(true), 0);
        return () => clearTimeout(t);
    }, []);

    const form = useForm<WizardFormValues>({
        resolver: zodResolver(wizardSchema),
        defaultValues: {
            target: "https://app.targetcorp.com",
            targetType: "URL",
            benchSuite: "CVE-BENCH",
            benchTaskId: "",
            roe: "No disruptive actions.\nMaintain operational safety.\nScan only in maintenance window.",
            maxRuntime: "10",
            costCeiling: "10.00",
            toolTimeout: "120",
            surface: "WEB APPLICATION",
            mode: "ONE-DAY",
        },
    });

    return {
        step,
        setStep,
        animateIn,
        form,
    };
}
