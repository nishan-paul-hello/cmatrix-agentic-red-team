import { useState } from "react";

import { type CostTab } from "../data/costMockData";

export function useCostData() {
    const [tab, setTab] = useState<CostTab>("COST & USAGE");
    return { tab, setTab };
}
