import React from "react";

import ReviewStep from "@/features/missions/components/wizard/ReviewStep";
import { useWizardContext } from "@/features/missions/components/wizard/WizardContext";

export function Step5() {
    const { target, targetType, surface, mode, maxRuntime, costCeiling, toolTimeout, roe } =
        useWizardContext();
    return (
        <ReviewStep
            target={target}
            targetType={targetType}
            surface={surface}
            mode={mode}
            maxRuntime={maxRuntime}
            costCeiling={costCeiling}
            toolTimeout={toolTimeout}
            roe={roe}
        />
    );
}
