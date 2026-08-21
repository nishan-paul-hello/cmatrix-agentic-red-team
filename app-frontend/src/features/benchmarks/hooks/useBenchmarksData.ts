import { useState } from "react";

import { type Bench } from "../data/benchmarksMockData";

export function useBenchmarksData() {
    const [detail, setDetail] = useState<Bench | null>(null);
    return { detail, setDetail };
}
