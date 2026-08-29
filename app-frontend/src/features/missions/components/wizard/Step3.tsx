import React from "react";

import StepHeading from "@/features/missions/components/wizard/StepHeading";
import SurfaceCards from "@/features/missions/components/wizard/SurfaceCards";
import { useWizardContext } from "@/features/missions/components/wizard/WizardContext";

export function Step3() {
    const { form } = useWizardContext();
    const surface = form.watch("surface");

    return (
        <>
            <StepHeading step={3} label="ATTACK SURFACE" />
            <div className="text-muted-foreground mb-5 text-xs">
                Select the attack surface to engage. This determines which specialist agents are
                spawned and which vulnerability classes are eligible for testing.
            </div>
            <SurfaceCards
                value={surface}
                onChange={(v) => form.setValue("surface", v, { shouldValidate: true, shouldDirty: true })}
            />
        </>
    );
}
