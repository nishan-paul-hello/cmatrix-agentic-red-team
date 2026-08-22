import { useEffect, useMemo, useState } from "react";

import { BenchmarksRepository } from "@/features/benchmarks/data/BenchmarksRepository";
import { type Bench } from "@/features/benchmarks/data/fixtures/benchmarksMockData";
import { computeBenchmarkStats } from "@/features/benchmarks/utils";

export function useBenchmarksData() {
    const [detail, setDetail] = useState<Bench | null>(null);
    const [benchmarks, setBenchmarks] = useState<Bench[]>([]);
    const [filter, setFilter] = useState<string>("ALL");

    useEffect(() => {
        void BenchmarksRepository.getAll().then(setBenchmarks);
    }, []);

    const { filtered, best } = useMemo(
        () => computeBenchmarkStats(benchmarks, filter),
        [benchmarks, filter],
    );

    return { detail, setDetail, benchmarks, filter, setFilter, filtered, best };
}
