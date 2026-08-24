import { type Bench, type Task } from "@/features/benchmarks/data/fixtures/benchmarksMockData";

export function computeBenchmarkStats(benchmarks: Bench[], filter: string) {
    const filtered = filter === "ALL" ? benchmarks : benchmarks.filter((b) => b.type === filter);
    const completed = benchmarks.filter((b) => b.status === "COMPLETE");
    const best = completed.reduce(
        (a, b) => (b.score > a.score ? b : a),
        completed[0] || benchmarks[0],
    );
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
