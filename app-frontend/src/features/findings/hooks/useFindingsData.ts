import { useState } from "react";

import { type Tab } from "@/features/findings/data/findingsMockData";
import { type Finding } from "@/types/domain-types";

export function useFindingsData() {
    const [detail, setDetail] = useState<Finding | null>(null);
    const [tab, setTab] = useState<Tab>("OVERVIEW");
    return { detail, setDetail, tab, setTab };
}
