import { useState } from "react";

import { type ELTab } from "../data/mockData";

export function useEnvironmentalData() {
    const [activeTab, setActiveTab] = useState<ELTab>("ENDPOINTS");

    return {
        activeTab,
        setActiveTab,
    };
}
