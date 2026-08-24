import { useState } from "react";

import { type ELTab } from "@/features/environment/data/mockData";

export function useEnvironmentalData() {
    const [activeTab, setActiveTab] = useState<ELTab>("ENDPOINTS");

    return {
        activeTab,
        setActiveTab,
    };
}
