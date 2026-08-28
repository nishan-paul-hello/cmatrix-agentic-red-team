import {
    type BenchRecord,
    type Task,
} from "@/features/benchmarks/data/fixtures/benchmarksMockData";

// Bench is aliased to BenchRecord in the fixture file; keep local alias for clarity
type Bench = BenchRecord;

export function computeBenchmarkStats(benchmarks: Bench[], filter: string) {
    // filter is now a tier key or "ALL" — BenchList now does its own filtering
    // This function is retained for backward compatibility via useBenchmarksData
    const filtered = filter === "ALL" ? benchmarks : benchmarks.filter((b) => b.tier === filter);
    // "best" no longer has a single .score — pick latest COMPLETE CVE-Bench run
    const completed = benchmarks.filter((b) => b.status === "COMPLETE");
    const cveBench = completed.find((b) => b.tier === "TIER2_CVEBENCH");
    let best: Bench;
    if (cveBench !== undefined) {
        best = cveBench;
    } else if (completed.length > 0) {
        best = completed[0];
    } else {
        best = benchmarks[0];
    }
    return { filtered, best };
}

export interface CategoryStat {
    cat: string;
    tasks: Task[];
    solved: number;
}

export function computeCategoryStats(tasks: Task[]): CategoryStat[] {
    const cats = [
        "SQL INJECTION",
        "AUTH",
        "RCE",
        "ACCESS CTRL",
        "XSS",
        "SSRF",
        "XXE",
        "PATH TRAVERSAL",
    ];
    return cats.map((c) => ({
        cat: c,
        tasks: tasks.filter((t) => t.category === c),
        solved: tasks.filter((t) => t.category === c && t.solved).length,
    }));
}
