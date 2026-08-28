import React from "react";

import StepHeading from "@/features/missions/components/wizard/StepHeading";
import SurfaceCards from "@/features/missions/components/wizard/SurfaceCards";
import { useWizardContext } from "@/features/missions/components/wizard/WizardContext";

export function Step3() {
    const { surface, setSurface } = useWizardContext();
    return (
        <>
            <StepHeading step={3} label="ATTACK SURFACE" />
            <div className="text-lg-tight tracking-wider-1 mb-[20px] leading-relaxed text-[var(--color-hex-666666)]">
                Select the attack surface to engage. This determines which specialist agents are
                spawned and which vulnerability classes are eligible for testing.
            </div>
            <SurfaceCards value={surface} onChange={setSurface} />
        </>
    );
}
