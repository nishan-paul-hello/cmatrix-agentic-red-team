import React from "react";

import ReviewStep from "@/features/missions/components/wizard/ReviewStep";
import { useWizardContext } from "@/features/missions/components/wizard/WizardContext";

export function Step5() {
    const { form } = useWizardContext();
    const target = form.watch("target");
    const targetType = form.watch("targetType");
    const surface = form.watch("surface");
    const mode = form.watch("mode");
    const maxRuntime = form.watch("maxRuntime");
    const costCeiling = form.watch("costCeiling");
    const toolTimeout = form.watch("toolTimeout");
    const roe = form.watch("roe");
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
