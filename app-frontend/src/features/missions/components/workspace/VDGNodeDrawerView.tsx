import React, { createContext, useContext } from "react";

import { EOrdIndicator } from "./EOrdIndicator";
import { Section } from "./Section";

export interface NodeDrawerContextType {
    node: DrawerNode;
    detail: (typeof NODE_DETAIL)[string];
    onClose: () => void;
    statusColor: string;
    statusBg: string;
    statusBorder: string;
}
export const NodeDrawerContext = createContext<NodeDrawerContextType | null>(null);
export function useNodeDrawerContext() {
    const ctx = useContext(NodeDrawerContext);
    if (!ctx) {
        throw new Error("Missing NodeDrawerContext");
    }
    return ctx;
}

export interface DrawerNode {
    id: string;
    type: string;
    status: string;
    ucb: number;
    eord: number;
    vulnClass: string;
}
const NODE_DETAIL: Record<
    string,
    {
        intent: string;
        prerequisites: {
            id: string;
            done: boolean;
        }[];
        enables: string[];
        facts: {
            k: string;
            v: string;
        }[];
    }
> = {
    "SQLI-001": {
        intent: "Exploit time-based blind SQL injection in /api/users via id parameter",
        prerequisites: [
            {
                id: "AUTH-001",
                done: true,
            },
            {
                id: "RECON-004",
                done: true,
            },
        ],
        enables: ["DB-ACCESS-002", "RCE-007"],
        facts: [
            {
                k: "ENDPOINT",
                v: "GET /api/users",
            },
            {
                k: "PARAMETER",
                v: "id (integer, unsanitised)",
            },
            {
                k: "AUTH STATE",
                v: "SESSION admin@targetcorp.com",
            },
            {
                k: "TECH",
                v: "Flask 2.3 / SQLite 3.39",
            },
            {
                k: "EVIDENCE",
                v: "HTTP 500 on id=1' observed (E_ord 3)",
            },
        ],
    },
    "AUTH-001": {
        intent: "Exploit authentication bypass on /api/auth/login",
        prerequisites: [
            {
                id: "RECON-001",
                done: true,
            },
        ],
        enables: ["SQLI-001", "XSS-002", "CSRF-003"],
        facts: [
            {
                k: "ENDPOINT",
                v: "POST /api/auth/login",
            },
            {
                k: "PARAMETER",
                v: "username, password",
            },
            {
                k: "AUTH STATE",
                v: "UNAUTHENTICATED",
            },
            {
                k: "EVIDENCE",
                v: "Default admin credentials accepted (E_ord 4)",
            },
        ],
    },
    "RECON-001": {
        intent: "Enumerate attack surface via spider, port scan, technology fingerprint",
        prerequisites: [],
        enables: ["AUTH-001", "ENUM-002"],
        facts: [
            {
                k: "TARGET",
                v: "app.targetcorp.com",
            },
            {
                k: "METHOD",
                v: "nmap + spider",
            },
            {
                k: "TECH",
                v: "nginx/1.24, Flask 2.3, PostgreSQL 14",
            },
            {
                k: "EVIDENCE",
                v: "12 endpoints discovered (E_ord 5)",
            },
        ],
    },
};
const DEFAULT_DETAIL = {
    intent: "Investigate target node for exploitable vulnerabilities.",
    prerequisites: [] as {
        id: string;
        done: boolean;
    }[],
    enables: [] as string[],
    facts: [] as {
        k: string;
        v: string;
    }[],
};
export default function VDGNodeDrawerView({
    node,
    onClose,
}: {
    node: DrawerNode;
    onClose: () => void;
}) {
    const detail = NODE_DETAIL[node.id] ?? DEFAULT_DETAIL;
    const statusColor = (() => {
        if (node.status === "ELIGIBLE") {
            return "var(--color-hex-ff2a32)";
        }
        if (node.status === "EXPLOITED") {
            return "var(--color-hex-e31b23)";
        }
        if (node.status === "IN_PROGRESS") {
            return "var(--color-hex-ff2a32)";
        }
        return "var(--color-hex-a0a0a0)";
    })();
    const statusBg = ["ELIGIBLE", "EXPLOITED", "IN_PROGRESS"].includes(node.status)
        ? "var(--color-hex-1a0608)"
        : "var(--color-hex-111111)";
    const statusBorder = ["ELIGIBLE", "EXPLOITED", "IN_PROGRESS"].includes(node.status)
        ? "var(--color-hex-6f171b)"
        : "var(--color-hex-292929)";
    return (
        <NodeDrawerContext.Provider
            value={{ node, detail, onClose, statusColor, statusBg, statusBorder }}
        >
            <div
                className="flex h-full w-[320px] shrink-0 flex-col bg-[var(--color-hex-0d0d0d)]"
                style={{
                    borderLeft: "1px solid var(--color-hex-292929)",
                }}
            >
                <VDGNodeDrawerView.Header />
                <div className="flex-1 overflow-y-auto">
                    <VDGNodeDrawerView.Intent />
                    <VDGNodeDrawerView.Metrics />
                    <VDGNodeDrawerView.Evidence />
                    <VDGNodeDrawerView.Prerequisites />
                    <VDGNodeDrawerView.Enables />
                    <VDGNodeDrawerView.Facts />
                    <VDGNodeDrawerView.Lifecycle />
                </div>
            </div>
        </NodeDrawerContext.Provider>
    );
}

VDGNodeDrawerView.Header = function Header() {
    const { node, onClose, statusColor, statusBg, statusBorder } = useNodeDrawerContext();
    return (
        <div
            className="flex items-start justify-between px-4 pt-4 pb-3"
            style={{
                borderBottom: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div>
                <div className="mb-1 flex items-center gap-2">
                    <span className="text-[13px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        {node.id}
                    </span>
                    <span
                        className="rounded-[2px] px-[6px] py-[1px] text-[8.5px] font-semibold tracking-[0.14em]"
                        style={{
                            color: statusColor,
                            background: statusBg,
                            border: `1px solid ${statusBorder}`,
                        }}
                    >
                        {node.status}
                    </span>
                </div>
                <div className="text-[9px] tracking-[0.18em] text-[var(--color-hex-6f171b)]">
                    {node.type}
                </div>
            </div>
            <button
                onClick={onClose}
                className="cursor-pointer border-none bg-[transparent] p-[2px] text-[14px] leading-[1] text-[var(--color-hex-444444)] hover:text-[var(--color-hex-a0a0a0)]"
            >
                ✕
            </button>
        </div>
    );
};

VDGNodeDrawerView.Intent = function Intent() {
    const { detail } = useNodeDrawerContext();
    return (
        <Section label="ATTACK INTENT">
            <p className="text-[10px] leading-[1.7] tracking-[0.04em] text-[var(--color-hex-666666)]">
                {detail.intent}
            </p>
        </Section>
    );
};

VDGNodeDrawerView.Metrics = function Metrics() {
    const { node } = useNodeDrawerContext();
    return (
        <Section label="SCORES & METRICS">
            <div className="grid grid-cols-2 gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                {[
                    {
                        k: "UCB SCORE",
                        v: node.ucb > 0 ? node.ucb.toFixed(3) : "—",
                        red: true,
                    },
                    {
                        k: "PATH SCORE",
                        v: "0.612",
                        red: false,
                    },
                    {
                        k: "PROMISE φ",
                        v: "0.81",
                        red: false,
                    },
                    {
                        k: "DIFFICULTY δ",
                        v: "0.32",
                        red: false,
                    },
                    {
                        k: "E_ord",
                        v: `${node.eord} / 5`,
                        red: true,
                    },
                    {
                        k: "EPSS PRIOR",
                        v: "0.42",
                        red: false,
                    },
                    {
                        k: "RETRY",
                        v: "1 / 3",
                        red: false,
                    },
                    {
                        k: "COST EST.",
                        v: "$0.18",
                        red: false,
                    },
                ].map((r, i) => (
                    <div
                        key={r.k}
                        className="px-[10px] py-[7px]"
                        style={{
                            borderRight: i % 2 === 0 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            borderBottom: i < 6 ? "1px solid var(--color-hex-1a1a1a)" : "none",
                            background:
                                i % 2 === 0 ? "var(--color-hex-0d0d0d)" : "var(--color-hex-0b0b0b)",
                        }}
                    >
                        <div className="mb-[2px] text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                            {r.k}
                        </div>
                        <div
                            className="text-[12px] font-bold"
                            style={{
                                color: r.red
                                    ? "var(--color-hex-e31b23)"
                                    : "var(--color-hex-a0a0a0)",
                            }}
                        >
                            {r.v}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

VDGNodeDrawerView.Evidence = function Evidence() {
    const { node } = useNodeDrawerContext();
    return (
        <Section label="EVIDENCE LEVEL">
            <EOrdIndicator value={node.eord} />
        </Section>
    );
};

VDGNodeDrawerView.Prerequisites = function Prerequisites() {
    const { detail } = useNodeDrawerContext();
    return (
        <Section label="PREREQUISITES">
            <div className="flex flex-col gap-1.5">
                {detail.prerequisites.length === 0 ? (
                    <span className="text-[10px] tracking-[0.08em] text-[var(--color-hex-333333)]">
                        None
                    </span>
                ) : (
                    detail.prerequisites.map((p) => (
                        <div key={p.id} className="flex items-center gap-2">
                            <span
                                className="text-[10px]"
                                style={{
                                    color: p.done
                                        ? "var(--color-hex-3fb950)"
                                        : "var(--color-hex-444444)",
                                }}
                            >
                                {p.done ? "✓" : "○"}
                            </span>
                            <span
                                className="text-[10px] tracking-[0.08em]"
                                style={{
                                    color: p.done
                                        ? "var(--color-hex-a0a0a0)"
                                        : "var(--color-hex-444444)",
                                }}
                            >
                                {p.id}
                            </span>
                            <span
                                className="ml-auto text-[8px] tracking-[0.12em]"
                                style={{
                                    color: p.done
                                        ? "var(--color-hex-3fb950)"
                                        : "var(--color-hex-333333)",
                                }}
                            >
                                {p.done ? "SATISFIED" : "PENDING"}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </Section>
    );
};

VDGNodeDrawerView.Enables = function Enables() {
    const { detail } = useNodeDrawerContext();
    return (
        <Section label="ENABLES">
            <div className="flex flex-col gap-1.5">
                {detail.enables.length === 0 ? (
                    <span className="text-[10px] tracking-[0.08em] text-[var(--color-hex-333333)]">
                        None
                    </span>
                ) : (
                    detail.enables.map((id) => (
                        <div key={id} className="flex items-center gap-2">
                            <span className="text-[9px] text-[var(--color-hex-e31b23)]">→</span>
                            <span className="text-[10px] tracking-[0.08em] text-[var(--color-hex-666666)]">
                                {id}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </Section>
    );
};

VDGNodeDrawerView.Facts = function Facts() {
    const { detail } = useNodeDrawerContext();
    return (
        <Section label="SOURCE ENVIRONMENT FACTS">
            <div className="flex flex-col gap-0 overflow-hidden rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)]">
                {detail.facts.length === 0 ? (
                    <div className="px-[10px] py-[6px] text-[9px] text-[var(--color-hex-333333)]">
                        No facts available
                    </div>
                ) : (
                    detail.facts.map((r, i, a) => (
                        <div
                            key={r.k}
                            className="flex gap-3 bg-[var(--color-hex-0b0b0b)] px-[10px] py-[6px]"
                            style={{
                                borderBottom:
                                    i < a.length - 1 ? "1px solid var(--color-hex-141414)" : "none",
                            }}
                        >
                            <span className="min-w-[72px] shrink-0 text-[8.5px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                                {r.k}
                            </span>
                            <span className="text-[9px] leading-[1.4] tracking-[0.04em] text-[var(--color-hex-666666)]">
                                {r.v}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </Section>
    );
};

VDGNodeDrawerView.Lifecycle = function Lifecycle() {
    return (
        <Section label="NODE LIFECYCLE" last>
            <div className="flex flex-col gap-0">
                {[
                    {
                        ts: "06:12:04",
                        event: "CANDIDATE",
                        color: "var(--color-hex-444444)",
                    },
                    {
                        ts: "06:18:31",
                        event: "ELIGIBLE",
                        color: "var(--color-hex-e31b23)",
                    },
                    {
                        ts: "06:28:47",
                        event: "IN_PROGRESS",
                        color: "var(--color-hex-ff2a32)",
                    },
                    {
                        ts: "06:29:03",
                        event: "RETRY 1",
                        color: "var(--color-hex-d29922)",
                    },
                    {
                        ts: "06:30:58",
                        event: "IN_PROGRESS",
                        color: "var(--color-hex-ff2a32)",
                    },
                ].map((t, i, a) => (
                    <div key={t.ts} className="flex items-start gap-3">
                        <div className="flex shrink-0 flex-col items-center">
                            <div
                                className="mt-[2px] h-[6px] w-[6px]"
                                style={{
                                    borderRadius: "50%",
                                    border: `1px solid ${t.color}`,
                                    background: i === a.length - 1 ? t.color : "transparent",
                                }}
                            />
                            {i < a.length - 1 && (
                                <div className="h-[18px] w-[1px] bg-[var(--color-hex-1e1e1e)]" />
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[8.5px] tracking-[0.06em] text-[var(--color-hex-333333)]">
                                {t.ts}
                            </span>
                            <span
                                className="text-[9px] font-semibold tracking-[0.12em]"
                                style={{
                                    color: t.color,
                                }}
                            >
                                {t.event}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};
