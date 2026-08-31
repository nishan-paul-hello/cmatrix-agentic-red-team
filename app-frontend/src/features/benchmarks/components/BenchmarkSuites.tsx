export function BenchmarkSuites() {
    const TIERS = [
        {
            n: 0,
            name: "FANG SANDBOX",
            desc: "Internal sandbox",
            score: null,
        },
        {
            n: 1,
            name: "PENTESTEVAL",
            desc: "Basic web pentesting",
            score: 0.821,
        },
        {
            n: 2,
            name: "CVE-BENCH",
            desc: "40 critical CVEs",
            score: 0.812,
        },
        {
            n: 3,
            name: "PREDIQL",
            desc: "IDOR + GraphQL",
            score: 0.741,
        },
        {
            n: 4,
            name: "MHBENCH",
            desc: "Multi-host lateral",
            score: 0.634,
        },
        {
            n: 5,
            name: "BOUNTYBENCH",
            desc: "Real bug bounty targets",
            score: 0.488,
        },
        {
            n: 6,
            name: "PENTESTGPT/HTB",
            desc: "HackTheBox integration",
            score: null,
        },
    ];
    return (
        <div className="border-border shrink-0 border-b px-6 py-4">
            <div className="text-muted-foreground mb-3 text-sm tracking-widest">
                BENCHMARK SUITES
            </div>
            <div className="flex gap-2">
                {TIERS.map((t) => {
                    const scoreColor = (() => {
                        if (t.score === null) {
                            return "text-border";
                        }
                        if (t.score >= 0.75) {
                            return "text-success";
                        }
                        if (t.score >= 0.5) {
                            return "text-warning";
                        }
                        return "text-border";
                    })();
                    return (
                        <div
                            key={t.n}
                            className="border-border bg-background min-w-0 flex-1 rounded-sm border-[1px] border-solid px-3 py-2.5"
                        >
                            <div className="text-muted-foreground text-xs tracking-widest">
                                TIER {t.n}
                            </div>
                            <div className="text-foreground cell-truncate mt-1 text-xs font-bold tracking-normal">
                                {t.name}
                            </div>
                            <div className="text-muted-foreground mt-0.5 text-sm">{t.desc}</div>
                            <div
                                className="mt-1.5 text-xs font-bold"
                                style={{
                                    color: scoreColor,
                                }}
                            >
                                {t.score !== null ? `${(t.score * 100).toFixed(1)}%` : "—"}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
