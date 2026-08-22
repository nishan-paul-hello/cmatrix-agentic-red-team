import React from "react";

import ModeCards from "./ModeCards";
import StepHeading from "./StepHeading";
import { useWizardContext } from "./WizardContext";

export function Step4() {
    const { mode, setMode } = useWizardContext();
    return (
        <>
            <StepHeading step={4} label="MISSION MODE" />
            <div className="mb-[24px] text-[9.5px] leading-[1.7] tracking-[0.14em] text-[var(--color-hex-666666)]">
                Select the knowledge mode under which the system operates. This controls whether a
                CVE identifier hint is injected into the team manager context at mission start.
            </div>
            <ModeCards value={mode} onChange={setMode} />
        </>
    );
}
