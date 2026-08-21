import { useState } from "react";

import { type LabTab } from "@/features/research/data/researchMockData";

export function useResearchData(initialTab?: LabTab) {
    const [tab, setTab] = useState<LabTab>(initialTab ?? "ABLATION");
    return { tab, setTab };
}
