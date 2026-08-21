import { useState } from "react";

import { type Bench } from "@/features/benchmarks/data/benchmarksMockData";

export function useBenchmarksData() {
    const [detail, setDetail] = useState<Bench | null>(null);
    return { detail, setDetail };
}
