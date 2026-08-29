import React from "react";

import ModeCards from "@/features/missions/components/wizard/ModeCards";
import StepHeading from "@/features/missions/components/wizard/StepHeading";
import { useWizardContext } from "@/features/missions/components/wizard/WizardContext";

export function Step4() {
    const { form } = useWizardContext();
    const mode = form.watch("mode");

    return (
        <>
            <StepHeading step={4} label="MISSION MODE" />
            <div className="text-muted-foreground mb-6 text-xs leading-relaxed tracking-normal">
                Select the knowledge mode under which the system operates. This controls whether a
                CVE identifier hint is injected into the team manager context at mission start.
            </div>
            <ModeCards
                value={mode}
                onChange={(v) => form.setValue("mode", v, { shouldValidate: true, shouldDirty: true })}
            />
        </>
    );
}
