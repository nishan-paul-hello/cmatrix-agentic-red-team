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
        <div
            className="shrink-0 px-[24px] py-[16px]"
            style={{
                borderBottom: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div className="mb-[12px] text-sm tracking-widest text-[var(--color-hex-444444)]">
                BENCHMARK SUITES
            </div>
            <div
                style={{
                    display: "flex",
                    gap: 8,
                }}
            >
                {TIERS.map((t) => {
                    const scoreColor = (() => {
                        if (t.score === null) {
                            return "var(--color-hex-333333)";
                        }
                        if (t.score >= 0.75) {
                            return "var(--color-success)";
                        }
                        if (t.score >= 0.5) {
                            return "var(--color-warning)";
                        }
                        return "var(--color-hex-333333)";
                    })();
                    return (
                        <div
                            key={t.n}
                            className="min-w-[0px] flex-1 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[12px] py-[10px]"
                        >
                            <div className="text-sm-tight tracking-wider-2 text-[var(--color-hex-444444)]">
                                TIER {t.n}
                            </div>
                            <div
                                className="mt-[4px] overflow-hidden text-lg font-bold tracking-normal whitespace-nowrap text-[var(--color-fg)]"
                                style={{
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {t.name}
                            </div>
                            <div className="text-base-tight mt-[2px] text-[var(--color-hex-444444)]">
                                {t.desc}
                            </div>
                            <div
                                className="mt-[6px] text-xl font-bold"
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
