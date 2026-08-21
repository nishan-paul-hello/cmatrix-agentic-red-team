import { useState } from "react";

import { type Finding } from "@/types/domain-types";

import { type Tab } from "../data/findingsMockData";

export function useFindingsData() {
    const [detail, setDetail] = useState<Finding | null>(null);
    const [tab, setTab] = useState<Tab>("OVERVIEW");
    return { detail, setDetail, tab, setTab };
}
