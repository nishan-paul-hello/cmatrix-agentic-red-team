import { useState } from "react";

type MemTab =
    | "VULNERABILITY PATTERNS"
    | "STRATEGY BRANCHING"
    | "TECHNICAL ACTIONS"
    | "FAILURE MEMORY"
    | "SKILL LIBRARY"
    | "CONTEXT UTILIZATION";

/* ── Shared data ── */
const PATTERNS = [
    {
        id: "VP-0291",
        vuln: "SQL INJECTION",
        target: "Flask/SQLite REST API",
        subtype: "TIME-BASED BLIND",
        score: 0.91,
        uses: 14,
        lastSeen: "06:30:58",
        techniques: [
            "sqlmap --technique=T",
            "time-sec delta measurement",
            "manual id param fuzzing",
        ],
        indicators: ["HTTP 500 on quote", "response time delta >2σ", "error in response body"],
        evolution: [
            {
                ts: "03:12:00",
                note: "Pattern initialized from RECON-SPEC endpoint discovery",
            },
            {
                ts: "04:44:22",
                note: "Subtype narrowed: error-based ruled out, time-based confirmed",
            },
            {
                ts: "05:58:11",
                note: "id parameter flagged as primary injection point (E_ord 2→3)",
            },
            {
                ts: "06:30:51",
                note: "Technique sequence locked: probe→payload→extract",
            },
        ],
    },
    {
        id: "VP-0188",
        vuln: "AUTHENTICATION BYPASS",
        target: "JWT HS256 APIs",
        subtype: "WEAK SECRET BRUTE-FORCE",
        score: 0.78,
        uses: 9,
        lastSeen: "06:22:14",
        techniques: ["hashcat JWT mode", "wordlist: rockyou+custom", "HMAC-SHA256 verification"],
        indicators: ["HS256 alg header", "short token length", "predictable claims structure"],
        evolution: [
            {
                ts: "03:01:00",
                note: "JWT token captured from login response",
            },
            {
                ts: "05:30:00",
                note: "Algorithm confirmed HS256 via header decode",
            },
            {
                ts: "06:22:14",
                note: "Secret cracked in 48s — admin token forged",
            },
        ],
    },
    {
        id: "VP-0044",
        vuln: "IDOR",
        target: "REST /api/users/:id",
        subtype: "DIRECT OBJECT REFERENCE",
        score: 0.67,
        uses: 6,
        lastSeen: "06:25:33",
        techniques: ["sequential id enumeration", "auth header swap", "cross-account access probe"],
        indicators: ["integer id in path", "predictable sequence", "missing ownership check"],
        evolution: [
            {
                ts: "06:18:00",
                note: "Pattern detected from endpoint enumeration",
            },
            {
                ts: "06:25:33",
                note: "Access to id=2 confirmed while authenticated as id=1",
            },
        ],
    },
];
export default function MemoryPage({
    initialTab = "VULNERABILITY PATTERNS",
}: {
    initialTab?: MemTab;
}) {
    const [tab, setTab] = useState<MemTab>(initialTab);
    const tabs: MemTab[] = [
        "VULNERABILITY PATTERNS",
        "STRATEGY BRANCHING",
        "TECHNICAL ACTIONS",
        "FAILURE MEMORY",
        "SKILL LIBRARY",
        "CONTEXT UTILIZATION",
    ];
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-0"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <h1 className="mb-[12px] text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                    MEMORY
                </h1>
                <div className="flex overflow-x-auto">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className="font-inherit cursor-pointer border-none bg-[transparent] px-[14px] py-[5px] text-[8.5px] tracking-[0.12em] whitespace-nowrap"
                            style={{
                                borderBottom:
                                    t === tab
                                        ? "2px solid var(--color-hex-e31b23)"
                                        : "2px solid transparent",
                                color:
                                    t === tab
                                        ? "var(--color-hex-f2f2f2)"
                                        : "var(--color-hex-444444)",
                                marginBottom: -1,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            {t}
                            {}
                            <span className="ml-[4px] rounded-[2px] bg-[var(--color-hex-1a1a1a)] px-[4px] py-[0px] text-[7.5px] text-[var(--color-hex-444444)]">
                                {(() => {
                                    if (t === "CONTEXT UTILIZATION") {
                                        return "T1";
                                    }
                                    if (t === "SKILL LIBRARY") {
                                        return "T3";
                                    }
                                    return "T2";
                                })()}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            {/* G2: Tier legend row */}
            <div
                className="shrink-0 px-[24px] py-[6px]"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                    display: "flex",
                    gap: 20,
                }}
            >
                {[
                    {
                        n: 1,
                        label: "WORKING CONTEXT",
                        color: "var(--color-hex-d29922)",
                    },
                    {
                        n: 2,
                        label: "EPISODIC MEMORY",
                        color: "var(--color-hex-666666)",
                    },
                    {
                        n: 3,
                        label: "SKILL LIBRARY",
                        color: "var(--color-hex-e31b23)",
                    },
                ].map((t) => (
                    <div
                        key={t.n}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                        }}
                    >
                        <div
                            className="h-[6px] w-[6px] rounded-[1px]"
                            style={{
                                background: t.color,
                            }}
                        />
                        <span className="text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                            TIER {t.n} — {t.label}
                        </span>
                    </div>
                ))}
            </div>
            {tab === "VULNERABILITY PATTERNS" && <VulnPatterns />}
            {tab === "STRATEGY BRANCHING" && <StrategyBranching />}
            {tab === "TECHNICAL ACTIONS" && <TechnicalActions />}
            {tab === "FAILURE MEMORY" && <FailureMemory />}
            {tab === "SKILL LIBRARY" && <SkillLibrary />}
            {tab === "CONTEXT UTILIZATION" && <ContextUtilization />}
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   TAB 1 — VULNERABILITY PATTERNS
══════════════════════════════════════════════════════ */
function VulnPatterns() {
    const [sel, setSel] = useState(PATTERNS[0]);
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div
                className="w-[300px] flex-shrink-0 overflow-y-auto"
                style={{
                    borderRight: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div
                    className="text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]"
                    style={{
                        padding: "8px 16px 6px",
                        borderBottom: "1px solid var(--color-hex-111111)",
                    }}
                >
                    {PATTERNS.length} PATTERNS
                </div>
                {PATTERNS.map((p) => (
                    <div
                        key={p.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSel(p)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setSel(p);
                            }
                        }}
                        className="cursor-pointer px-[16px] py-[12px]"
                        style={{
                            borderBottom: "1px solid var(--color-hex-111111)",
                            background: sel.id === p.id ? "var(--color-hex-120608)" : "transparent",
                            borderLeft:
                                sel.id === p.id
                                    ? "2px solid var(--color-hex-e31b23)"
                                    : "2px solid transparent",
                        }}
                        onMouseEnter={(e) => {
                            if (sel.id !== p.id) {
                                e.currentTarget.style.background = "var(--color-hex-0d0d0d)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (sel.id !== p.id) {
                                e.currentTarget.style.background = "transparent";
                            }
                        }}
                    >
                        <div className="mb-1 flex justify-between">
                            <span className="text-[10px] font-bold tracking-[0.08em] text-[var(--color-hex-e31b23)]">
                                {p.id}
                            </span>
                            <span className="text-[8px] text-[var(--color-hex-3fb950)]">
                                ↑{p.score.toFixed(2)}
                            </span>
                        </div>
                        <div className="mb-[2px] text-[10px] text-[var(--color-hex-a0a0a0)]">
                            {p.vuln}
                        </div>
                        <div className="text-[8.5px] text-[var(--color-hex-444444)]">
                            {p.subtype}
                        </div>
                        <div className="mt-2 flex gap-3">
                            <span className="text-[7.5px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                ×{p.uses} USES
                            </span>
                            <span className="text-[7.5px] text-[var(--color-hex-333333)]">
                                {p.lastSeen}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-5 flex items-baseline gap-3">
                    <h2 className="text-[15px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                        {sel.id}
                    </h2>
                    <span className="text-[9px] tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                        {sel.vuln}
                    </span>
                    <span className="text-[9px] text-[var(--color-hex-444444)]">{sel.subtype}</span>
                </div>
                <div className="mb-5 grid grid-cols-3 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                    {[
                        {
                            k: "RELEVANCE",
                            v: sel.score.toFixed(2),
                            red: true,
                        },
                        {
                            k: "USES",
                            v: String(sel.uses),
                        },
                        {
                            k: "LAST APPLIED",
                            v: sel.lastSeen,
                        },
                    ].map((m, i, a) => (
                        <div
                            key={m.k}
                            className="bg-[var(--color-hex-0d0d0d)] px-[14px] py-[10px]"
                            style={{
                                borderRight:
                                    i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            }}
                        >
                            <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                {m.k}
                            </div>
                            <div
                                className="text-[17px] font-bold"
                                style={{
                                    color: m.red
                                        ? "var(--color-hex-e31b23)"
                                        : "var(--color-hex-f2f2f2)",
                                }}
                            >
                                {m.v}
                            </div>
                        </div>
                    ))}
                </div>
                <Sub label="TECHNIQUE SEQUENCE">
                    {sel.techniques.map((t, i) => (
                        <div key={t} className="mb-2 flex items-center gap-3">
                            <div
                                className="h-[17px] w-[17px] shrink-0 border-[1px] border-solid border-[var(--color-hex-1e1e1e)]"
                                style={{
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <span className="text-[7.5px] text-[var(--color-hex-444444)]">
                                    {i + 1}
                                </span>
                            </div>
                            <span className="text-[10px] text-[var(--color-hex-888888)]">{t}</span>
                        </div>
                    ))}
                </Sub>
                <Sub label="DETECTION INDICATORS">
                    {sel.indicators.map((ind) => (
                        <div key={ind} className="mb-2 flex items-center gap-2">
                            <div
                                className="h-[5px] w-[5px] shrink-0 bg-[var(--color-hex-e31b23)]"
                                style={{
                                    borderRadius: "50%",
                                }}
                            />
                            <span className="text-[10px] text-[var(--color-hex-666666)]">
                                {ind}
                            </span>
                        </div>
                    ))}
                </Sub>
                <Sub label="PATTERN EVOLUTION" last>
                    {sel.evolution.map((ev, i, a) => (
                        <div key={ev.ts} className="flex items-start gap-3">
                            <div className="flex shrink-0 flex-col items-center">
                                <div
                                    className="mt-[2px] h-[7px] w-[7px] border-[1px] border-solid border-[var(--color-hex-e31b23)]"
                                    style={{
                                        borderRadius: "50%",
                                        background:
                                            i === a.length - 1
                                                ? "var(--color-hex-e31b23)"
                                                : "transparent",
                                    }}
                                />
                                {i < a.length - 1 && (
                                    <div className="h-[20px] w-[1px] bg-[var(--color-hex-1e1e1e)]" />
                                )}
                            </div>
                            <div>
                                <span className="mr-[8px] text-[8px] text-[var(--color-hex-333333)]">
                                    {ev.ts}
                                </span>
                                <span className="text-[9.5px] leading-[1.6] text-[var(--color-hex-666666)]">
                                    {ev.note}
                                </span>
                            </div>
                        </div>
                    ))}
                </Sub>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   TAB 2 — STRATEGY BRANCHING (screen 28)
══════════════════════════════════════════════════════ */
const BRANCHES = [
    {
        id: "BR-001",
        ts: "04:12:00",
        decision: "Target recon approach",
        chosen: "PASSIVE + ACTIVE HYBRID",
        alternatives: ["PURE ACTIVE (nmap -A)", "PASSIVE ONLY (osint)"],
        reason: "Active scan would trigger WAF; passive alone misses live port state. Hybrid balances coverage vs detection risk.",
        outcome: "SUCCESS",
        impact: "Discovered 12 endpoints, 3 authenticated — fed AUTH-SPEC with surface area.",
        children: [
            {
                id: "BR-003",
                ts: "05:30:00",
                decision: "JWT attack vector",
                chosen: "BRUTE-FORCE HS256 SECRET",
                alternatives: ["ALG CONFUSION (RS256→HS256)", "NONE ALG BYPASS"],
                reason: "Token header confirmed HS256. Algorithm confusion requires RSA key. None bypass patched in this Flask-JWT version.",
                outcome: "SUCCESS",
                impact: "Admin token obtained in 48s — auth bypass confirmed (AUTH-001 EXPLOITED).",
                children: [],
            },
        ],
    },
    {
        id: "BR-002",
        ts: "05:58:00",
        decision: "SQL injection technique",
        chosen: "TIME-BASED BLIND",
        alternatives: ["ERROR-BASED", "UNION-BASED"],
        reason: "Error messages suppressed in production config. UNION blocked by column count mismatch. Time-based reliable on SQLite via SLEEP().",
        outcome: "IN PROGRESS",
        impact: "E_ord raised 2→3→4. DB schema enumeration in progress.",
        children: [
            {
                id: "BR-004",
                ts: "06:29:00",
                decision: "Payload escalation",
                chosen: "SCHEMA DUMP VIA TIMING",
                alternatives: ["OUT-OF-BAND DNS", "FILE WRITE RCE"],
                reason: "DNS egress blocked (filtered). File write requires SUPER privilege. Schema dump is lower-risk and sufficient for oracle.",
                outcome: "RUNNING",
                impact: "Awaiting oracle confirmation.",
                children: [],
            },
        ],
    },
];
function BranchTree({ nodes, depth = 0 }: { nodes: typeof BRANCHES; depth?: number }) {
    return (
        <>
            {nodes.map((b) => (
                <div
                    key={b.id}
                    style={{
                        marginLeft: depth * 24,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "stretch",
                            gap: 0,
                        }}
                    >
                        {depth > 0 && (
                            <div
                                className="mb-[8px] w-[20px] shrink-0"
                                style={{
                                    borderLeft: "1px solid var(--color-hex-1e1e1e)",
                                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                                }}
                            />
                        )}
                        <div className="mb-[10px] flex-1 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                            <div
                                className="flex items-center gap-3 bg-[var(--color-hex-0d0d0d)] px-4 py-2"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-141414)",
                                }}
                            >
                                <span className="text-[9px] font-bold tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                                    {b.id}
                                </span>
                                <span className="flex-1 text-[8.5px] text-[var(--color-hex-a0a0a0)]">
                                    {b.decision}
                                </span>
                                <span className="text-[8px] text-[var(--color-hex-333333)]">
                                    {b.ts}
                                </span>
                                <span
                                    className="text-[8px] font-semibold tracking-[0.12em]"
                                    style={{
                                        color: (() => {
                                            if (b.outcome === "SUCCESS") {
                                                return "var(--color-hex-3fb950)";
                                            }
                                            if (
                                                b.outcome === "IN PROGRESS" ||
                                                b.outcome === "RUNNING"
                                            ) {
                                                return "var(--color-hex-d29922)";
                                            }
                                            return "var(--color-hex-e31b23)";
                                        })(),
                                    }}
                                >
                                    {b.outcome}
                                </span>
                            </div>
                            <div className="px-4 py-3">
                                <div className="mb-[8px]">
                                    <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        CHOSEN PATH
                                    </div>
                                    <div className="text-[10px] font-semibold tracking-[0.06em] text-[var(--color-hex-3fb950)]">
                                        {b.chosen}
                                    </div>
                                </div>
                                <div className="mb-[8px]">
                                    <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        ALTERNATIVES REJECTED
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {b.alternatives.map((a) => (
                                            <span
                                                key={a}
                                                className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-111111)] px-[7px] py-[2px] text-[8.5px] text-[var(--color-hex-333333)]"
                                                style={{
                                                    textDecoration: "line-through",
                                                }}
                                            >
                                                {a}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-[6px]">
                                    <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        RATIONALE
                                    </div>
                                    <div className="text-[9.5px] leading-[1.7] text-[var(--color-hex-555555)]">
                                        {b.reason}
                                    </div>
                                </div>
                                <div
                                    className="mt-[8px]"
                                    style={{
                                        borderTop: "1px solid var(--color-hex-141414)",
                                        paddingTop: 8,
                                    }}
                                >
                                    <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        IMPACT
                                    </div>
                                    <div className="text-[9.5px] leading-[1.6] text-[var(--color-hex-666666)]">
                                        {b.impact}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {b.children.length > 0 && <BranchTree nodes={b.children} depth={depth + 1} />}
                </div>
            ))}
        </>
    );
}
function StrategyBranching() {
    return (
        <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="mb-5 flex items-center justify-between">
                <div className="text-[9px] tracking-[0.16em] text-[var(--color-hex-666666)]">
                    {BRANCHES.length} ROOT DECISIONS · 4 TOTAL BRANCHES
                </div>
                <div className="flex gap-4">
                    {[
                        {
                            l: "SUCCESS",
                            c: "var(--color-hex-3fb950)",
                        },
                        {
                            l: "IN PROGRESS",
                            c: "var(--color-hex-d29922)",
                        },
                        {
                            l: "RUNNING",
                            c: "var(--color-hex-d29922)",
                        },
                    ].map((x) => (
                        <div key={x.l} className="flex items-center gap-2">
                            <div
                                className="h-[6px] w-[6px]"
                                style={{
                                    borderRadius: "50%",
                                    background: x.c,
                                }}
                            />
                            <span className="text-[8px] tracking-[0.12em] text-[var(--color-hex-444444)]">
                                {x.l}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <BranchTree nodes={BRANCHES} />
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   TAB 3 — TECHNICAL ACTIONS (screen 29)
══════════════════════════════════════════════════════ */
const ACTIONS = [
    {
        id: "TA-0041",
        ts: "06:30:51",
        spec: "INJECT-SPEC",
        action: "sqli_payload_dispatch()",
        tool: "curl",
        args: "GET /api/users?id=1' AND SLEEP(4)-- -",
        result: "HTTP 200 · 4.18s · TIMING CONFIRMED",
        eord: "3→4",
        status: "SUCCESS",
    },
    {
        id: "TA-0040",
        ts: "06:30:39",
        spec: "VALID-AGENT",
        action: "oracle_test(AUTH-001)",
        tool: "cve_bench",
        args: "attack_type=FILE_ACCESS target=/flag.txt",
        result: "ORACLE PASS · flag.txt contents returned",
        eord: "4→5",
        status: "SUCCESS",
    },
    {
        id: "TA-0039",
        ts: "06:30:22",
        spec: "AUTH-SPEC",
        action: "forge_jwt_token()",
        tool: "python",
        args: "secret=password123 claims={role:admin}",
        result: "eyJhbGciOiJIUzI1NiJ9... admin session active",
        eord: "—",
        status: "SUCCESS",
    },
    {
        id: "TA-0038",
        ts: "06:29:58",
        spec: "INJECT-SPEC",
        action: "sqli_error_probe()",
        tool: "curl",
        args: "GET /api/users?id=1'",
        result: "HTTP 500 · SQL syntax error in response",
        eord: "2→3",
        status: "SUCCESS",
    },
    {
        id: "TA-0037",
        ts: "06:29:44",
        spec: "RECON-SPEC",
        action: "endpoint_enumerate()",
        tool: "spider",
        args: "base=https://app.targetcorp.com depth=3",
        result: "12 endpoints · 3 authenticated · 2 file upload",
        eord: "—",
        status: "SUCCESS",
    },
    {
        id: "TA-0036",
        ts: "06:29:03",
        spec: "NETWORK-SPEC",
        action: "lateral_pivot()",
        tool: "nmap",
        args: "-p 5432,6379 --scan-delay 2s",
        result: "Port 5432 filtered · timeout exceeded",
        eord: "—",
        status: "TIMEOUT",
    },
    {
        id: "TA-0035",
        ts: "06:28:47",
        spec: "RECON-SPEC",
        action: "service_scan()",
        tool: "nmap",
        args: "-sV -p 22,80,443,5432,6379",
        result: "8 services · SSH/HTTP/HTTPS open",
        eord: "—",
        status: "SUCCESS",
    },
    {
        id: "TA-0034",
        ts: "06:22:14",
        spec: "AUTH-SPEC",
        action: "jwt_brute_force()",
        tool: "hashcat",
        args: "mode=16500 wordlist=rockyou+custom.txt",
        result: "Secret: password123 · cracked in 48s",
        eord: "3→4",
        status: "SUCCESS",
    },
];
function TechnicalActions() {
    const [sel, setSel] = useState<(typeof ACTIONS)[0] | null>(null);
    const sc: Record<string, string> = {
        SUCCESS: "var(--color-hex-3fb950)",
        TIMEOUT: "var(--color-hex-d29922)",
        FAILED: "var(--color-hex-ff2a32)",
        RUNNING: "var(--color-hex-e31b23)",
    };
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                <table className="w-full border-collapse text-[10px]">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                            {[
                                "ID",
                                "TIME",
                                "SPECIALIST",
                                "ACTION",
                                "TOOL",
                                "RESULT",
                                "E_ORD",
                                "STATUS",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-[12px] py-[6px] text-left text-[7.5px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ACTIONS.map((a) => (
                            <tr
                                key={a.id}
                                onClick={() => setSel(a)}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0d0d0d)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                    {a.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-333333)]">
                                    {a.ts}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] font-bold tracking-[0.06em] text-[var(--color-hex-e31b23)]">
                                    {a.spec}
                                </td>
                                <td className="font-inherit px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                    {a.action}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                    {a.tool}
                                </td>
                                <td
                                    className="max-w-[240px] overflow-hidden px-[12px] py-[7px] text-[9px] whitespace-nowrap text-[var(--color-hex-555555)]"
                                    style={{
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {a.result}
                                </td>
                                <td
                                    className="px-[12px] py-[7px] text-[9px] font-semibold"
                                    style={{
                                        color:
                                            a.eord !== "—"
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-333333)",
                                    }}
                                >
                                    {a.eord}
                                </td>
                                <td className="px-[12px] py-[7px]">
                                    <span
                                        className="text-[8.5px] font-semibold tracking-[0.1em]"
                                        style={{
                                            color: sc[a.status] ?? "var(--color-hex-666666)",
                                        }}
                                    >
                                        {a.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sel && (
                <div
                    className="flex w-[320px] flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0d0d0d)]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-292929)",
                    }}
                >
                    <div
                        className="flex items-start justify-between px-4 pt-4 pb-3"
                        style={{
                            borderBottom: "1px solid var(--color-hex-1e1e1e)",
                        }}
                    >
                        <div>
                            <div className="text-[12px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                                {sel.id}
                            </div>
                            <div className="mt-[2px] text-[8.5px] text-[var(--color-hex-444444)]">
                                {sel.spec} · {sel.tool}
                            </div>
                        </div>
                        <button
                            onClick={() => setSel(null)}
                            className="cursor-pointer border-none bg-[transparent] text-[14px] text-[var(--color-hex-444444)]"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex flex-col gap-4 px-4 py-4">
                        {(
                            [
                                {
                                    k: "ACTION",
                                    v: sel.action,
                                },
                                {
                                    k: "TOOL",
                                    v: sel.tool,
                                },
                                {
                                    k: "ARGUMENTS",
                                    v: sel.args,
                                },
                                {
                                    k: "RESULT",
                                    v: sel.result,
                                },
                                {
                                    k: "E_ORD DELTA",
                                    v: sel.eord,
                                    red: sel.eord !== "—",
                                },
                                {
                                    k: "STATUS",
                                    v: sel.status,
                                    col: sc[sel.status],
                                },
                            ] as {
                                k: string;
                                v: string;
                                red?: boolean;
                                col?: string;
                            }[]
                        ).map((r) => (
                            <div key={r.k}>
                                <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                    {r.k}
                                </div>
                                <div
                                    className="text-[10px] leading-[1.6]"
                                    style={{
                                        color:
                                            r.col ??
                                            (r.red
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-888888)"),
                                    }}
                                >
                                    {r.v}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   TAB 4 — FAILURE MEMORY (screen 30)
══════════════════════════════════════════════════════ */
const FAILURES = [
    {
        id: "FM-0019",
        ts: "06:29:03",
        spec: "NETWORK-SPEC",
        action: "lateral_pivot()",
        type: "TIMEOUT",
        severity: "LOW",
        diagnosis:
            "Port 5432 egress filtered at network level — not an app-layer vulnerability. Payload never reached target.",
        correctable: false,
        resolution: "RULED OUT — network path infeasible without pivot host",
        lessons: [
            "Scan filtered ports last to avoid time waste",
            "Add network-reachability preflight to NETWORK-SPEC context",
        ],
        retries: 1,
    },
    {
        id: "FM-0011",
        ts: "05:44:18",
        spec: "INJECT-SPEC",
        action: "sqli_union_probe()",
        type: "FAILED",
        severity: "MEDIUM",
        diagnosis:
            "UNION SELECT rejected — column count 7, app expects 3. Backend ORM strips extra columns silently, no error.",
        correctable: true,
        resolution: "Switched to TIME-BASED technique — E_ord confirmed at 3 after switch",
        lessons: [
            "Union-based requires column fingerprinting before dispatch",
            "Add column-count probe to INJECT-SPEC pre-flight",
        ],
        retries: 2,
    },
    {
        id: "FM-0007",
        ts: "04:58:40",
        spec: "AUTH-SPEC",
        action: "jwt_alg_confusion()",
        type: "FAILED",
        severity: "HIGH",
        diagnosis:
            "RSA public key not exposed on /.well-known/jwks.json — alg confusion requires public key material. Flask-JWT 1.3 uses symmetric-only config.",
        correctable: false,
        resolution: "Pivoted to brute-force attack on HS256 secret — succeeded",
        lessons: [
            "Check JWKS endpoint before assuming RS256 available",
            "Cache alg-confusion eligibility in specialist context",
        ],
        retries: 1,
    },
];
function FailureMemory() {
    const [sel, setSel] = useState<(typeof FAILURES)[0] | null>(null);
    const tc: Record<string, string> = {
        TIMEOUT: "var(--color-hex-d29922)",
        FAILED: "var(--color-hex-ff2a32)",
        ERROR: "var(--color-hex-ff2a32)",
    };
    const sc: Record<string, string> = {
        LOW: "var(--color-hex-666666)",
        MEDIUM: "var(--color-hex-d29922)",
        HIGH: "var(--color-hex-ff2a32)",
        CRITICAL: "var(--color-hex-ff2a32)",
    };
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-5 flex items-center gap-4">
                    {[
                        {
                            l: "TOTAL FAILURES",
                            v: "3",
                        },
                        {
                            l: "CORRECTABLE",
                            v: "1",
                        },
                        {
                            l: "RULED OUT",
                            v: "2",
                        },
                        {
                            l: "LESSONS ADDED",
                            v: "6",
                        },
                    ].map((m) => (
                        <div
                            key={m.l}
                            className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[16px] py-[10px]"
                        >
                            <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                {m.l}
                            </div>
                            <div className="text-[18px] font-bold text-[var(--color-hex-f2f2f2)]">
                                {m.v}
                            </div>
                        </div>
                    ))}
                </div>
                {FAILURES.map((f) => (
                    <div
                        key={f.id}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSel(f === sel ? null : f)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                setSel(f === sel ? null : f);
                            }
                        }}
                        className="mb-[10px] cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]"
                        style={{
                            background:
                                sel?.id === f.id ? "var(--color-hex-0d0d0d)" : "transparent",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                sel?.id === f.id ? "var(--color-hex-0d0d0d)" : "transparent")
                        }
                    >
                        <div
                            className="flex items-center gap-3 px-4 py-3"
                            style={{
                                borderBottom: "1px solid var(--color-hex-141414)",
                            }}
                        >
                            <span className="text-[9px] font-bold tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                                {f.id}
                            </span>
                            <span className="text-[8.5px] text-[var(--color-hex-555555)]">
                                {f.action}
                            </span>
                            <span
                                className="ml-auto text-[8px] font-semibold tracking-[0.12em]"
                                style={{
                                    color: tc[f.type] ?? "var(--color-hex-666666)",
                                }}
                            >
                                {f.type}
                            </span>
                            <span
                                className="text-[8px] font-semibold tracking-[0.1em]"
                                style={{
                                    color: sc[f.severity],
                                }}
                            >
                                {f.severity}
                            </span>
                            <span className="text-[8px] text-[var(--color-hex-333333)]">
                                {f.ts}
                            </span>
                        </div>
                        <div className="px-4 py-3">
                            <div className="mb-[6px]">
                                <span className="text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                    DIAGNOSIS ·{" "}
                                </span>
                                <span className="text-[9.5px] leading-[1.7] text-[var(--color-hex-555555)]">
                                    {f.diagnosis}
                                </span>
                            </div>
                            <div className="mb-[6px]">
                                <span className="text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                    RESOLUTION ·{" "}
                                </span>
                                <span
                                    className="text-[9.5px] leading-[1.7]"
                                    style={{
                                        color: f.correctable
                                            ? "var(--color-hex-3fb950)"
                                            : "var(--color-hex-666666)",
                                    }}
                                >
                                    {f.resolution}
                                </span>
                            </div>
                            <div
                                className="mt-3 flex flex-col gap-1"
                                style={{
                                    borderTop: "1px solid var(--color-hex-141414)",
                                    paddingTop: 10,
                                }}
                            >
                                <div className="mb-[4px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                    LESSONS LEARNED
                                </div>
                                {f.lessons.map((l) => (
                                    <div key={l} className="flex items-start gap-2">
                                        <span className="mt-[1px] text-[9px] text-[var(--color-hex-d29922)]">
                                            ◆
                                        </span>
                                        <span className="text-[9.5px] leading-[1.6] text-[var(--color-hex-555555)]">
                                            {l}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   TAB 5 — SKILL LIBRARY (screen 31)
══════════════════════════════════════════════════════ */
const SKILLS = [
    {
        id: "SK-0012",
        name: "time_based_sqli",
        cat: "SQL INJECTION",
        spec: "INJECT-SPEC",
        calls: 14,
        success: 13,
        lastCall: "06:30:51",
        desc: "Dispatches time-based blind SQLi payload via execution agent. Measures RTT delta against baseline. Raises E_ord on ≥2σ delta.",
        params: [
            {
                k: "target",
                t: "str",
                desc: "Endpoint URL with param",
            },
            {
                k: "param",
                t: "str",
                desc: "Injection point",
            },
            {
                k: "time_sec",
                t: "int",
                desc: "Delay threshold in seconds",
            },
            {
                k: "reps",
                t: "int",
                desc: "Confirmation repetitions",
            },
        ],
        eordDelta: "2→4",
    },
    {
        id: "SK-0009",
        name: "jwt_brute_hs256",
        cat: "AUTH BYPASS",
        spec: "AUTH-SPEC",
        calls: 4,
        success: 3,
        lastCall: "06:22:14",
        desc: "Brute-forces JWT HS256 secret using hashcat mode 16500. Requires captured token. Falls back to custom wordlist if rockyou fails in 30s.",
        params: [
            {
                k: "token",
                t: "str",
                desc: "Captured JWT",
            },
            {
                k: "wordlist",
                t: "str",
                desc: "Wordlist path",
            },
            {
                k: "timeout",
                t: "int",
                desc: "Max runtime seconds",
            },
        ],
        eordDelta: "1→4",
    },
    {
        id: "SK-0023",
        name: "endpoint_spider",
        cat: "RECONNAISSANCE",
        spec: "RECON-SPEC",
        calls: 8,
        success: 8,
        lastCall: "06:29:44",
        desc: "Recursive endpoint spider. Detects auth-required paths via redirect analysis. Outputs structured EL endpoint facts.",
        params: [
            {
                k: "base_url",
                t: "str",
                desc: "Starting URL",
            },
            {
                k: "depth",
                t: "int",
                desc: "Max crawl depth",
            },
            {
                k: "follow_redirects",
                t: "bool",
                desc: "Follow 30x redirects",
            },
        ],
        eordDelta: "N/A",
    },
    {
        id: "SK-0031",
        name: "idor_enumerate",
        cat: "ACCESS CONTROL",
        spec: "RECON-SPEC",
        calls: 3,
        success: 3,
        lastCall: "06:25:33",
        desc: "Enumerates integer-keyed resource paths. Detects cross-account access by comparing response ownership claims.",
        params: [
            {
                k: "endpoint",
                t: "str",
                desc: "Path with :id",
            },
            {
                k: "range",
                t: "int",
                desc: "ID range to test",
            },
            {
                k: "auth_header",
                t: "str",
                desc: "Auth token to use",
            },
        ],
        eordDelta: "1→3",
    },
];
function SkillLibrary() {
    const [sel, setSel] = useState(SKILLS[0]);
    const [filter, setFilter] = useState("");
    const q = filter.toLowerCase();
    const filtered = SKILLS.filter(
        (s) =>
            s.name.includes(q) ||
            s.cat.toLowerCase().includes(q) ||
            s.desc.toLowerCase().includes(q) ||
            s.spec.toLowerCase().includes(q),
    );
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div
                className="flex w-[280px] flex-shrink-0 flex-col overflow-hidden"
                style={{
                    borderRight: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div
                    className="px-[12px] py-[10px]"
                    style={{
                        borderBottom: "1px solid var(--color-hex-111111)",
                    }}
                >
                    <input
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="FILTER SKILLS…"
                        className="font-inherit w-full rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[8px] py-[5px] text-[9px] tracking-[0.08em] text-[var(--color-hex-a0a0a0)] outline-none"
                        style={{
                            boxSizing: "border-box",
                        }}
                    />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {filtered.map((sk) => (
                        <div
                            key={sk.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSel(sk)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setSel(sk);
                                }
                            }}
                            className="cursor-pointer px-[14px] py-[11px]"
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                                background:
                                    sel.id === sk.id ? "var(--color-hex-120608)" : "transparent",
                                borderLeft:
                                    sel.id === sk.id
                                        ? "2px solid var(--color-hex-e31b23)"
                                        : "2px solid transparent",
                            }}
                            onMouseEnter={(e) => {
                                if (sel.id !== sk.id) {
                                    e.currentTarget.style.background = "var(--color-hex-0d0d0d)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (sel.id !== sk.id) {
                                    e.currentTarget.style.background = "transparent";
                                }
                            }}
                        >
                            <div className="font-inherit mb-[2px] text-[10px] font-bold tracking-[0.06em] text-[var(--color-hex-a0a0a0)]">
                                {sk.name}()
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-111111)] px-[5px] py-[1px] text-[7.5px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                    {sk.cat}
                                </span>
                                <span className="ml-auto text-[7.5px] text-[var(--color-hex-3fb950)]">
                                    {sk.success}/{sk.calls} OK
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-2 flex items-baseline gap-3">
                    <h2 className="font-inherit text-[14px] font-bold text-[var(--color-hex-f2f2f2)]">
                        {sel.name}()
                    </h2>
                    <span className="text-[9px] tracking-[0.1em] text-[var(--color-hex-444444)]">
                        {sel.id}
                    </span>
                </div>
                <div className="mb-5 flex items-center gap-3">
                    <span className="text-[8.5px] font-semibold tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                        {sel.spec}
                    </span>
                    <span className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-111111)] px-[6px] py-[1px] text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                        {sel.cat}
                    </span>
                </div>
                <Sub label="DESCRIPTION">
                    <p
                        className="text-[10px] leading-[1.8] text-[var(--color-hex-666666)]"
                        style={{
                            margin: 0,
                        }}
                    >
                        {sel.desc}
                    </p>
                </Sub>
                <Sub label="PARAMETERS">
                    <div className="overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                        {sel.params.map((p, i, a) => (
                            <div
                                key={p.k}
                                className="flex items-start gap-4 px-[12px] py-[8px]"
                                style={{
                                    borderBottom:
                                        i < a.length - 1
                                            ? "1px solid var(--color-hex-141414)"
                                            : "none",
                                    background:
                                        i % 2
                                            ? "var(--color-hex-0b0b0b)"
                                            : "var(--color-hex-0d0d0d)",
                                }}
                            >
                                <span className="font-inherit min-w-[80px] shrink-0 text-[10px] font-bold text-[var(--color-hex-a0a0a0)]">
                                    {p.k}
                                </span>
                                <span className="min-w-[28px] shrink-0 text-[8.5px] text-[var(--color-hex-333333)]">
                                    {p.t}
                                </span>
                                <span className="text-[9px] text-[var(--color-hex-555555)]">
                                    {p.desc}
                                </span>
                            </div>
                        ))}
                    </div>
                </Sub>
                <Sub label="USAGE STATS">
                    <div className="grid grid-cols-4 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                        {[
                            {
                                k: "CALLS",
                                v: String(sel.calls),
                            },
                            {
                                k: "SUCCESS",
                                v: String(sel.success),
                            },
                            {
                                k: "LAST CALL",
                                v: sel.lastCall,
                            },
                            {
                                k: "E_ORD DELTA",
                                v: sel.eordDelta,
                            },
                        ].map((m, i, a) => (
                            <div
                                key={m.k}
                                className="bg-[var(--color-hex-0d0d0d)] px-[12px] py-[10px]"
                                style={{
                                    borderRight:
                                        i < a.length - 1
                                            ? "1px solid var(--color-hex-1a1a1a)"
                                            : "none",
                                }}
                            >
                                <div className="mb-[4px] text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                    {m.k}
                                </div>
                                <div
                                    className="text-[14px] font-bold"
                                    style={{
                                        color: (() => {
                                            if (m.k === "SUCCESS") {
                                                return "var(--color-hex-3fb950)";
                                            }
                                            if (m.k === "E_ORD DELTA") {
                                                return "var(--color-hex-e31b23)";
                                            }
                                            return "var(--color-hex-f2f2f2)";
                                        })(),
                                    }}
                                >
                                    {m.v}
                                </div>
                            </div>
                        ))}
                    </div>
                </Sub>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   TAB 6 — CONTEXT UTILIZATION
══════════════════════════════════════════════════════ */
const CTX_SPECS = [
    {
        id: "S-01",
        role: "RECON-SPEC",
        state: "COMPACTED",
        used: 94208,
        max: 128000,
        compacted: 2,
        tokens: 3900,
    },
    {
        id: "S-02",
        role: "AUTH-SPEC",
        state: "COMPACTED",
        used: 81920,
        max: 128000,
        compacted: 1,
        tokens: 2100,
    },
    {
        id: "S-03",
        role: "INJECT-SPEC",
        state: "ACTIVE",
        used: 112640,
        max: 128000,
        compacted: 0,
        tokens: 14400,
    },
    {
        id: "S-04",
        role: "VALID-AGENT",
        state: "ACTIVE",
        used: 36864,
        max: 128000,
        compacted: 0,
        tokens: 4800,
    },
    {
        id: "S-05",
        role: "NETWORK-SPEC",
        state: "IDLE",
        used: 20480,
        max: 128000,
        compacted: 0,
        tokens: 1200,
    },
];
function ContextUtilization() {
    const [sel, setSel] = useState(CTX_SPECS[2]);
    const stc: Record<string, string> = {
        COMPACTED: "var(--color-hex-d29922)",
        ACTIVE: "var(--color-hex-3fb950)",
        IDLE: "var(--color-hex-444444)",
    };
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="mb-6 grid grid-cols-3 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                    {[
                        {
                            k: "TOTAL CONTEXT USED",
                            v: "346K",
                            sub: "across all specialists",
                        },
                        {
                            k: "COMPACTION EVENTS",
                            v: "3",
                            sub: "context refreshes",
                        },
                        {
                            k: "TOKENS SAVED",
                            v: "184K",
                            sub: "via compaction",
                        },
                    ].map((m, i, a) => (
                        <div
                            key={m.k}
                            className="bg-[var(--color-hex-0d0d0d)] px-[18px] py-[14px]"
                            style={{
                                borderRight:
                                    i < a.length - 1 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            }}
                        >
                            <div className="mb-[6px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                {m.k}
                            </div>
                            <div className="mb-[2px] text-[22px] font-bold text-[var(--color-hex-f2f2f2)]">
                                {m.v}
                            </div>
                            <div className="text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                {m.sub}
                            </div>
                        </div>
                    ))}
                </div>
                {CTX_SPECS.map((s) => {
                    const pct = Math.round((s.used / s.max) * 100);
                    const barColor = (() => {
                        if (pct > 85) {
                            return "var(--color-hex-ff2a32)";
                        }
                        if (pct > 60) {
                            return "var(--color-hex-d29922)";
                        }
                        return "var(--color-hex-3fb950)";
                    })();
                    return (
                        <div
                            key={s.id}
                            role="button"
                            tabIndex={0}
                            onClick={() => setSel(s)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    setSel(s);
                                }
                            }}
                            className="mb-[8px] cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] px-[16px] py-[12px]"
                            style={{
                                background:
                                    sel.id === s.id ? "var(--color-hex-0d0d0d)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0a0a0a)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    sel.id === s.id ? "var(--color-hex-0d0d0d)" : "transparent")
                            }
                        >
                            <div className="mb-3 flex items-center gap-3">
                                <span className="text-[10px] font-bold tracking-[0.08em] text-[var(--color-hex-a0a0a0)]">
                                    {s.role}
                                </span>
                                <span
                                    className="ml-auto text-[8px] font-semibold tracking-[0.14em]"
                                    style={{
                                        color: stc[s.state],
                                    }}
                                >
                                    {s.state}
                                </span>
                                <span className="text-[8.5px] text-[var(--color-hex-555555)]">
                                    {pct}%
                                </span>
                            </div>
                            <div className="h-[4px] overflow-hidden rounded-[2px] bg-[var(--color-hex-1a1a1a)]">
                                <div
                                    className="h-full rounded-[2px]"
                                    style={{
                                        width: `${pct}%`,
                                        background: barColor,
                                        transition: "width 0.3s",
                                    }}
                                />
                            </div>
                            <div className="mt-2 flex items-center gap-4">
                                <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                    {(s.used / 1024).toFixed(0)}K / {s.max / 1024}K tokens
                                </span>
                                {s.compacted > 0 && (
                                    <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-d29922)]">
                                        COMPACTED ×{s.compacted}
                                    </span>
                                )}
                                <span className="ml-auto text-[8px] text-[var(--color-hex-333333)]">
                                    THIS SESSION: {(s.tokens / 1000).toFixed(1)}K
                                </span>
                            </div>
                        </div>
                    );
                })}
                {}
            </div>
            <div
                className="flex w-[280px] flex-shrink-0 flex-col overflow-y-auto p-[16px]"
                style={{
                    borderLeft: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[4px] text-[11px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                    {sel.role}
                </div>
                <div className="mb-[16px] text-[8.5px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                    {sel.id} · {sel.state}
                </div>
                {[
                    {
                        k: "TOKENS USED",
                        v: `${(sel.used / 1024).toFixed(0)}K`,
                    },
                    {
                        k: "CONTEXT LIMIT",
                        v: `${sel.max / 1024}K`,
                    },
                    {
                        k: "UTILIZATION",
                        v: `${Math.round((sel.used / sel.max) * 100)}%`,
                    },
                    {
                        k: "COMPACTION EVENTS",
                        v: String(sel.compacted),
                    },
                    {
                        k: "SESSION TOKENS",
                        v: `${(sel.tokens / 1000).toFixed(1)}K`,
                    },
                ].map((r) => (
                    <div key={r.k} className="mb-[12px]">
                        <div className="mb-[3px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                            {r.k}
                        </div>
                        <div className="text-[13px] font-bold text-[var(--color-hex-f2f2f2)]">
                            {r.v}
                        </div>
                    </div>
                ))}
                {sel.compacted > 0 && (
                    <div className="mt-[8px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-d2992244)] bg-[var(--color-hex-110e00)] px-[12px] py-[10px]">
                        <div className="mb-[4px] text-[8px] tracking-[0.16em] text-[var(--color-hex-d29922)]">
                            COMPACTION NOTE
                        </div>
                        <div className="text-[9px] leading-[1.7] text-[var(--color-hex-666666)]">
                            Context was compacted {sel.compacted}× to preserve working memory.
                            Historical tool outputs summarized. Active state preserved.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── shared helper ── */
function Sub({
    label,
    children,
    last,
}: {
    label: string;
    children: React.ReactNode;
    last?: boolean;
}) {
    return (
        <div
            style={{
                marginBottom: last ? 0 : 20,
            }}
        >
            <div
                className="mb-[10px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                    paddingBottom: 5,
                }}
            >
                {label}
            </div>
            {children}
        </div>
    );
}
