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
            <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
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
                            return "var(--color-hex-3fb950)";
                        }
                        if (t.score >= 0.5) {
                            return "var(--color-hex-d29922)";
                        }
                        return "var(--color-hex-333333)";
                    })();
                    return (
                        <div
                            key={t.n}
                            className="min-w-[0px] flex-1 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[12px] py-[10px]"
                        >
                            <div className="text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                TIER {t.n}
                            </div>
                            <div
                                className="mt-[4px] overflow-hidden text-[10px] font-bold tracking-[0.1em] whitespace-nowrap text-[var(--color-hex-f2f2f2)]"
                                style={{
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {t.name}
                            </div>
                            <div className="mt-[2px] text-[8.5px] text-[var(--color-hex-444444)]">
                                {t.desc}
                            </div>
                            <div
                                className="mt-[6px] text-[11px] font-bold"
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
