import { useEffect, useMemo, useState } from "react";

import { BenchmarksRepository } from "@/features/benchmarks/data/BenchmarksRepository";
import { type Task } from "@/features/benchmarks/data/fixtures/benchmarksMockData";
import { computeCategoryStats } from "@/features/benchmarks/utils";

export function useBenchmarkDetailData() {
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        void BenchmarksRepository.getTasks().then(setTasks);
    }, []);

    const catStats = useMemo(() => computeCategoryStats(tasks), [tasks]);

    return { tasks, catStats };
}
