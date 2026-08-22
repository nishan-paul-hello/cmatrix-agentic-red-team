import { useEffect, useMemo, useState } from "react";

import { type Tab } from "@/features/findings/data/findingsMockData";
import { FindingsRepository } from "@/features/findings/data/FindingsRepository";
import { computeFindingCounts } from "@/features/findings/utils";
import { type Finding } from "@/types/domain-types";

export function useFindingsData(page: number = 1, limit: number = 50) {
    const [detail, setDetail] = useState<Finding | null>(null);
    const [findings, setFindings] = useState<Finding[]>([]);
    const [tab, setTab] = useState<Tab>("OVERVIEW");

    useEffect(() => {
        const repo = new FindingsRepository();
        void repo.fetchAll({ page, limit }).then(setFindings);
    }, [page, limit]);

    const counts = useMemo(() => computeFindingCounts(findings), [findings]);

    return { detail, setDetail, findings, counts, tab, setTab };
}
