import React from "react";

import ReviewStep from "./ReviewStep";
import { useWizardContext } from "./WizardContext";

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
