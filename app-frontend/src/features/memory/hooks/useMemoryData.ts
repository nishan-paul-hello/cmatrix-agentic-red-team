import { useState } from "react";

import { type MemTab } from "../data/mockData";

export function useMemoryData(initialTab: MemTab = "VULNERABILITY PATTERNS") {
    const [activeTab, setActiveTab] = useState<MemTab>(initialTab);

    return {
        activeTab,
        setActiveTab,
    };
}
