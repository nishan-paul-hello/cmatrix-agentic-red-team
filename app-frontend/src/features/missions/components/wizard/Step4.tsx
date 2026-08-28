import React from "react";

import ModeCards from "@/features/missions/components/wizard/ModeCards";
import StepHeading from "@/features/missions/components/wizard/StepHeading";

export function Step4() {
    return (
        <>
            <StepHeading step={4} label="MISSION MODE" />
            <div className="text-muted-foreground mb-6 text-base leading-relaxed tracking-widest">
                Select the knowledge mode under which the system operates. This controls whether a
                CVE identifier hint is injected into the team manager context at mission start.
            </div>
            <ModeCards />
        </>
    );
}
