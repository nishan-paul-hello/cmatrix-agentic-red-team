import React from "react";

import StepHeading from "@/features/missions/components/wizard/StepHeading";
import SurfaceCards from "@/features/missions/components/wizard/SurfaceCards";

export function Step3() {
    return (
        <>
            <StepHeading step={3} label="ATTACK SURFACE" />
            <div className="text-muted-foreground mb-5 text-base leading-relaxed tracking-widest">
                Select the attack surface to engage. This determines which specialist agents are
                spawned and which vulnerability classes are eligible for testing.
            </div>
            <SurfaceCards />
        </>
    );
}
