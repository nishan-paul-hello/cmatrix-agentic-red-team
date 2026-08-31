"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Activity,
    Boxes,
    Braces,
    BrainCircuit,
    Bug,
    ClipboardList,
    Code2,
    Coins,
    Compass,
    Crosshair,
    Database,
    Eye,
    GitBranch,
    History,
    KeyRound,
    Layers,
    Library,
    Lock,
    Network,
    PauseCircle,
    Search,
    Server,
    ShieldCheck,
    Terminal,
    Unlock,
    Wand2,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Geometry — every box lives in a fixed 1000x860 coordinate space.   */
/*  All connectors are derived FROM these boxes, so a line's endpoint  */
/*  is always exactly on a box's border — never floating near it.      */
/* ------------------------------------------------------------------ */

const VB_W = 1000;
const VB_H = 860;

type BoxId = "orch" | "el" | "tm" | "spec" | "vdg" | "val" | "ev" | "exec" | "target";

type Box = { x: number; y: number; w: number; h: number };

const BOX: Record<BoxId, Box> = {
    orch: { x: 24, y: 24, w: 952, h: 64 },
    el: { x: 24, y: 104, w: 270, h: 130 },
    tm: { x: 310, y: 104, w: 270, h: 130 },
    spec: { x: 596, y: 104, w: 380, h: 432 },
    vdg: { x: 24, y: 250, w: 548, h: 286 },
    val: { x: 24, y: 552, w: 170, h: 120 },
    ev: { x: 210, y: 552, w: 170, h: 120 },
    exec: { x: 396, y: 552, w: 170, h: 120 },
    target: { x: 596, y: 552, w: 380, h: 120 },
};

const pct = (box: Box) => ({
    left: `${(box.x / VB_W) * 100}%`,
    top: `${(box.y / VB_H) * 100}%`,
    width: `${(box.w / VB_W) * 100}%`,
    height: `${(box.h / VB_H) * 100}%`,
});

/* ------------------------------------------------------------------ */
/*  VDG — Vulnerability Dependency Graph nodes (fixed positions)       */
/* ------------------------------------------------------------------ */

type NodeStatus = "hidden" | "locked" | "eligible" | "selected" | "in_progress" | "exploited";
type VdgId = "v1" | "v2" | "v3" | "v4" | "v5";

const VDG_NODE: Record<
    VdgId,
    { box: Box; label: string; sub: string; phi: number; delta: number; epss: number }
> = {
    v1: {
        box: { x: 44, y: 296, w: 155, h: 95 },
        label: "AUTH BYPASS",
        sub: "JWT forgery",
        phi: 0.74,
        delta: 0.35,
        epss: 0.41,
    },
    v2: {
        box: { x: 211, y: 296, w: 155, h: 95 },
        label: "SQLI · LOGIN",
        sub: "blind UNION",
        phi: 0.83,
        delta: 0.22,
        epss: 0.71,
    },
    v3: {
        box: { x: 378, y: 296, w: 155, h: 95 },
        label: "XSS · SEARCH",
        sub: "reflected",
        phi: 0.58,
        delta: 0.28,
        epss: 0.33,
    },
    v4: {
        box: { x: 100, y: 410, w: 210, h: 95 },
        label: "PRIV ESC",
        sub: "role parameter",
        phi: 0.61,
        delta: 0.5,
        epss: 0.22,
    },
    v5: {
        box: { x: 330, y: 410, w: 210, h: 95 },
        label: "RCE · UPLOAD",
        sub: "file-type bypass",
        phi: 0.69,
        delta: 0.62,
        epss: 0.58,
    },
};

// Prerequisite edges inside the VDG. Elbowed so every line meets a node
// border square-on — no diagonal lines guessing where a box edge is.
const PREREQ: { from: VdgId; to: VdgId; d: string }[] = [
    { from: "v1", to: "v4", d: "M 121.5,391 L 121.5,400 L 205,400 L 205,410" },
    { from: "v2", to: "v5", d: "M 288.5,391 L 288.5,400 L 435,400 L 435,410" },
    { from: "v4", to: "v5", d: "M 310,457.5 L 330,457.5" },
];

/* ------------------------------------------------------------------ */
/*  Structural edges — one connector per pair of components, ever.     */
/* ------------------------------------------------------------------ */

type StructId =
    | "orch-el"
    | "orch-tm"
    | "el-tm"
    | "tm-spec"
    | "el-vdg"
    | "tm-vdg"
    | "spec-target"
    | "target-exec"
    | "exec-ev"
    | "ev-val"
    | "val-vdg";

type Accent = "cyan" | "indigo" | "amber" | "emerald";

const STRUCT: Record<StructId, { d: string; accent: Accent }> = {
    "orch-el": { d: "M 159,88 L 159,104", accent: "cyan" },
    "orch-tm": { d: "M 445,88 L 445,104", accent: "indigo" },
    "el-tm": { d: "M 294,169 L 310,169", accent: "cyan" },
    "tm-spec": { d: "M 580,169 L 596,169", accent: "indigo" },
    "el-vdg": { d: "M 159,234 L 159,250", accent: "cyan" },
    "tm-vdg": { d: "M 445,234 L 445,250", accent: "indigo" },
    "spec-target": { d: "M 786,536 L 786,552", accent: "amber" },
    "target-exec": { d: "M 596,612 L 566,612", accent: "amber" },
    "exec-ev": { d: "M 396,612 L 380,612", accent: "amber" },
    "ev-val": { d: "M 210,612 L 194,612", accent: "amber" },
    "val-vdg": { d: "M 109,552 L 109,536", accent: "emerald" },
};

const ACCENT_HEX: Record<Accent, string> = {
    cyan: "#22d3ee",
    indigo: "#818cf8",
    amber: "#fbbf24",
    emerald: "#34d399",
};

/* ------------------------------------------------------------------ */
/*  Layer 1 — Orchestrator sub-stages                                  */
/* ------------------------------------------------------------------ */

type OrchStage = "intake" | "recon" | "compact" | null;

const ORCH_STAGES: {
    id: Exclude<OrchStage, null>;
    label: string;
    sub: string;
    icon: React.ReactNode;
}[] = [
    {
        id: "intake",
        label: "Scope Intake",
        sub: "target · RoE · zero-day vs one-day",
        icon: <ClipboardList className="h-3.5 w-3.5" />,
    },
    {
        id: "recon",
        label: "Auto-prompter",
        sub: "unstructured recon, seeds EL",
        icon: <Wand2 className="h-3.5 w-3.5" />,
    },
    {
        id: "compact",
        label: "FullCompact Trigger",
        sub: "@85% context → rebuild TM context",
        icon: <Layers className="h-3.5 w-3.5" />,
    },
];

/* ------------------------------------------------------------------ */
/*  Specialists / Memory tiers                                         */
/* ------------------------------------------------------------------ */

type SpecId = "recon" | "sqli" | "xss" | "graphql" | "auth" | "lateral";
const SPECIALISTS: { id: SpecId; label: string; sub: string; icon: React.ReactNode }[] = [
    {
        id: "recon",
        label: "Recon Specialist",
        sub: "nmap -p- · WhatWeb · ZAP-map",
        icon: <Search className="h-3.5 w-3.5" />,
    },
    {
        id: "sqli",
        label: "SQLi Specialist",
        sub: "baseline → bit-extraction FSM",
        icon: <Code2 className="h-3.5 w-3.5" />,
    },
    {
        id: "xss",
        label: "XSS Specialist",
        sub: "5-phase canary → mutation",
        icon: <Bug className="h-3.5 w-3.5" />,
    },
    {
        id: "graphql",
        label: "GraphQL Specialist",
        sub: "introspection · bandit fuzz",
        icon: <Braces className="h-3.5 w-3.5" />,
    },
    {
        id: "auth",
        label: "Auth/Session Specialist",
        sub: "SPS · JWT · CSRF lifecycle",
        icon: <KeyRound className="h-3.5 w-3.5" />,
    },
    {
        id: "lateral",
        label: "Lateral-Movement Specialist",
        sub: "Scan · Move · Escalate · Exfil",
        icon: <Network className="h-3.5 w-3.5" />,
    },
];

type MemId = "strategy" | "skill" | "episodic" | "cost" | "stop";
const MEMORY: { id: MemId; label: string; sub: string; icon: React.ReactNode }[] = [
    {
        id: "strategy",
        label: "Strategy Memory",
        sub: "Tier 2 · conditional branching (WAF-adaptive)",
        icon: <GitBranch className="h-4 w-4" />,
    },
    {
        id: "skill",
        label: "Skill Library",
        sub: "oracle-gated crystallization",
        icon: <Library className="h-4 w-4" />,
    },
    {
        id: "episodic",
        label: "Episodic Failure Mem",
        sub: "4th FAISS tier · per-mission",
        icon: <History className="h-4 w-4" />,
    },
    {
        id: "cost",
        label: "Usage + Trajectory Log",
        sub: "tokens · $ · full reproducibility",
        icon: <Coins className="h-4 w-4" />,
    },
    {
        id: "stop",
        label: "Early-Stopping",
        sub: "N=5 idle + empty frontier → halt",
        icon: <PauseCircle className="h-4 w-4" />,
    },
];

/* ------------------------------------------------------------------ */
/*  Phase timeline                                                     */
/* ------------------------------------------------------------------ */

type ActiveEdge = { id: StructId; reverse?: boolean };

type Phase = {
    title: string;
    desc: string;
    el: string[];
    ucb: string[];
    log: string;
    activeSpecialists: SpecId[];
    orchStage: OrchStage;
    target: string[];
    nodeStatus: Record<VdgId, NodeStatus>;
    activeBoxes: BoxId[];
    activeEdges: ActiveEdge[];
    memory: MemId[];
    stats: { t: string; calls: number; cost: string; nodes: number };
    icon: React.ReactNode;
};

const HIDDEN_ALL: Record<VdgId, NodeStatus> = {
    v1: "hidden",
    v2: "hidden",
    v3: "hidden",
    v4: "hidden",
    v5: "hidden",
};

const PHASES: Phase[] = [
    {
        title: "1 · Operator Intake & Autonomous Recon",
        desc: "The Orchestrator scopes the mission (target, rules of engagement, zero-day vs one-day mode) and runs an unstructured auto-prompter recon pass. Every confirmed fact is written directly into the Environmental Layer — never inferred.",
        el: [
            "host: 10.20.4.17",
            "ports: 80, 443, 8080",
            "stack: nginx + PHP 8.1",
            "waf: ModSecurity (detected)",
        ],
        ucb: ["awaiting environmental facts…"],
        log: "[EL] +4 facts written by Recon Specialist",
        activeSpecialists: ["recon"],
        orchStage: "intake",
        target: [
            "nmap -p- -sV …",
            "service fingerprint: nginx/php8.1",
            "WhatWeb + ObserverWard running",
        ],
        nodeStatus: HIDDEN_ALL,
        activeBoxes: ["orch", "spec", "target", "el"],
        activeEdges: [{ id: "orch-el" }, { id: "spec-target" }],
        memory: [],
        stats: { t: "0:12", calls: 6, cost: "$0.04", nodes: 0 },
        icon: <Search className="h-5 w-5 text-cyan-400" />,
    },
    {
        title: "2 · VDG Hypothesis Synthesis",
        desc: "The Team Manager reads the Environmental Layer and grows the Vulnerability Dependency Graph: promise φ, difficulty δ, and EPSS priors are scored, and prerequisite edges are inferred via batched LLM calls (2 calls/node, not O(2M) pairwise).",
        el: [
            "host: 10.20.4.17",
            "ports: 80, 443, 8080",
            "stack: nginx + PHP 8.1",
            "waf: ModSecurity (detected)",
        ],
        ucb: [
            "VDG_AddNode × 3",
            "batched prereq inference (2 calls/node)",
            "φ, δ, epss_prior assessed",
        ],
        log: "[VDG] 3 nodes added · 2 edges inferred (conf ≥ 0.7)",
        activeSpecialists: [],
        orchStage: null,
        target: ["idle"],
        nodeStatus: { v1: "eligible", v2: "eligible", v3: "eligible", v4: "locked", v5: "locked" },
        activeBoxes: ["el", "tm", "vdg"],
        activeEdges: [{ id: "el-tm" }, { id: "el-vdg" }, { id: "tm-vdg" }],
        memory: [],
        stats: { t: "0:34", calls: 12, cost: "$0.11", nodes: 3 },
        icon: <BrainCircuit className="h-5 w-5 text-indigo-400" />,
    },
    {
        title: "3 · Dependency-Constrained UCB",
        desc: "UCB is computed only over the eligible frontier — nodes whose prerequisites are already satisfied. sqli_login wins the argmax over auth_bypass and xss_search.",
        el: [
            "host: 10.20.4.17",
            "ports: 80, 443, 8080",
            "stack: nginx + PHP 8.1",
            "waf: ModSecurity (detected)",
        ],
        ucb: [
            "UCB(sqli) = .42+.58+.25−.02+.11 = 0.91",
            "UCB(auth) = .31+.51+.22−.03+.06 = 0.78",
            "UCB(xss)  = .20+.44+.15−.05+.05 = 0.54",
            "→ argmax: sqli_login",
        ],
        log: "[ADM] eligible={auth,sqli,xss} → SELECTED sqli_login",
        activeSpecialists: [],
        orchStage: null,
        target: ["idle"],
        nodeStatus: { v1: "eligible", v2: "selected", v3: "eligible", v4: "locked", v5: "locked" },
        activeBoxes: ["tm", "vdg"],
        activeEdges: [{ id: "tm-vdg" }],
        memory: [],
        stats: { t: "0:41", calls: 12, cost: "$0.12", nodes: 3 },
        icon: <Crosshair className="h-5 w-5 text-rose-400" />,
    },
    {
        title: "4 · Declarative Dispatch & Execution",
        desc: "A fresh-context SQLi Specialist receives a high-level verb, not raw shell. The Execution Agent issues deterministic tool calls only — it never re-interprets output.",
        el: [
            "host: 10.20.4.17",
            "ports: 80, 443, 8080",
            "stack: nginx + PHP 8.1",
            "waf: ModSecurity (detected)",
        ],
        ucb: ["Dispatch(sqli_login, verb=ExploitCandidate)", "fresh-context Specialist invoked"],
        log: "[EXEC] declarative task dispatched · verb=ExploitCandidate",
        activeSpecialists: ["sqli"],
        orchStage: null,
        target: [
            "baseline probe sent",
            "SLEEP(5) timing confirmed",
            "bit-extraction FSM: 38% complete",
        ],
        nodeStatus: {
            v1: "eligible",
            v2: "in_progress",
            v3: "eligible",
            v4: "locked",
            v5: "locked",
        },
        activeBoxes: ["tm", "spec", "target", "exec"],
        activeEdges: [{ id: "tm-spec" }, { id: "spec-target" }, { id: "target-exec" }],
        memory: [],
        stats: { t: "1:22", calls: 27, cost: "$0.34", nodes: 3 },
        icon: <Terminal className="h-5 w-5 text-amber-400" />,
    },
    {
        title: "5 · Evaluation & Oracle Validation",
        desc: "The Evaluation Agent produces a 4-part critique; the Validation Agent's Diagnose-Adapt-Cap loop forces a mandatory PoC re-run before the per-surface oracle confirms exploitation.",
        el: [
            "host: 10.20.4.17",
            "ports: 80, 443, 8080",
            "creds: admin:*** (harvested)",
            "waf: ModSecurity (detected)",
        ],
        ucb: [
            "Eval: {what, expected_vs_actual, next, E_ord=5}",
            "Validation: Diagnose → Adapt → Cap",
            "oracle-confirmed ✓",
        ],
        log: "[ORACLE] sqli_login CONFIRMED · E_ord=5",
        activeSpecialists: ["sqli"],
        orchStage: null,
        target: ["PoC re-run ×1", "oracle: CONFIRMED", "creds harvested → EL"],
        nodeStatus: { v1: "eligible", v2: "exploited", v3: "eligible", v4: "locked", v5: "locked" },
        activeBoxes: ["target", "exec", "ev", "val"],
        activeEdges: [{ id: "target-exec" }, { id: "exec-ev" }, { id: "ev-val" }],
        memory: [],
        stats: { t: "1:58", calls: 31, cost: "$0.41", nodes: 3 },
        icon: <Eye className="h-5 w-5 text-emerald-400" />,
    },
    {
        title: "6 · Backprop & Skill Crystallization",
        desc: "E_ord backpropagates into the VDG. The confirmed exploit workflow is promoted into the Skill Library — oracle-gated, with a negative-transfer guard against unseen framework versions.",
        el: [
            "host: 10.20.4.17",
            "ports: 80, 443, 8080",
            "creds: admin:*** (harvested)",
            "waf: ModSecurity (detected)",
        ],
        ucb: [
            "E_ord backprop → VDG(sqli_login)",
            "skill promoted (oracle-gated)",
            "negative-transfer guard: pass",
        ],
        log: "[MEM] skill promoted: sqli_login → creds_harvest",
        activeSpecialists: [],
        orchStage: null,
        target: ["idle"],
        nodeStatus: { v1: "eligible", v2: "exploited", v3: "eligible", v4: "locked", v5: "locked" },
        activeBoxes: ["val", "vdg"],
        activeEdges: [{ id: "val-vdg" }],
        memory: ["strategy", "skill", "episodic", "cost"],
        stats: { t: "2:10", calls: 33, cost: "$0.44", nodes: 3 },
        icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
    },
    {
        title: "7 · Frontier Re-Plan",
        desc: "With sqli_login exploited, the Team Manager recomputes UCB over the refreshed frontier. auth_bypass now leads — the cycle repeats until the frontier empties or the budget runs out.",
        el: [
            "host: 10.20.4.17",
            "ports: 80, 443, 8080",
            "creds: admin:*** (harvested)",
            "waf: ModSecurity (detected)",
        ],
        ucb: [
            "frontier = {auth, xss} (sqli cleared)",
            "UCB(auth)=0.88 > UCB(xss)=0.61",
            "→ SELECTED auth_bypass",
        ],
        log: "[LOOP] frontier refreshed · early-stop N=0 idle",
        activeSpecialists: [],
        orchStage: null,
        target: ["idle"],
        nodeStatus: { v1: "selected", v2: "exploited", v3: "eligible", v4: "locked", v5: "locked" },
        activeBoxes: ["tm", "vdg"],
        activeEdges: [{ id: "tm-vdg", reverse: true }],
        memory: ["stop"],
        stats: { t: "2:15", calls: 33, cost: "$0.44", nodes: 3 },
        icon: <GitBranch className="h-5 w-5 text-indigo-400" />,
    },
    {
        title: "8 · Context Compaction & Cross-Surface Scaling",
        desc: "At 85% context utilization, FullCompact reconstructs the Team Manager's reasoning context from the EL+AL snapshot. The same VDG and orchestration layer drive GraphQL and multi-host missions — surface-specific Specialists activate, not a separate codepath.",
        el: [
            "host: 10.20.4.17",
            "ports: 80, 443, 8080",
            "creds: admin:*** (harvested)",
            "waf: ModSecurity (detected)",
        ],
        ucb: [
            "context @ 87% → FullCompact triggered",
            "TM context rebuilt from EL+AL state",
            "GraphQL / Lateral pools idle-ready",
        ],
        log: "[ORCH] FullCompact reconstructed context · frontier re-synced",
        activeSpecialists: [],
        orchStage: "compact",
        target: ["idle"],
        nodeStatus: { v1: "selected", v2: "exploited", v3: "eligible", v4: "locked", v5: "locked" },
        activeBoxes: ["orch", "tm", "spec"],
        activeEdges: [{ id: "orch-tm" }, { id: "tm-spec" }],
        memory: ["cost", "stop"],
        stats: { t: "2:19", calls: 34, cost: "$0.45", nodes: 3 },
        icon: <Layers className="h-5 w-5 text-cyan-400" />,
    },
];

const STEP_MS = 5600;

/* ------------------------------------------------------------------ */
/*  Status → visual tokens (flat colors only — no gradients/glows)     */
/* ------------------------------------------------------------------ */

const STATUS_BORDER: Record<NodeStatus, string> = {
    hidden: "border-transparent",
    locked: "border-zinc-700",
    eligible: "border-violet-400",
    selected: "border-rose-400",
    in_progress: "border-amber-400",
    exploited: "border-emerald-400",
};

const STATUS_TEXT: Record<NodeStatus, string> = {
    hidden: "text-zinc-700",
    locked: "text-zinc-400",
    eligible: "text-violet-300",
    selected: "text-rose-300",
    in_progress: "text-amber-300",
    exploited: "text-emerald-300",
};

const STATUS_BG: Record<NodeStatus, string> = {
    hidden: "bg-zinc-950",
    locked: "bg-zinc-950",
    eligible: "bg-violet-950/40",
    selected: "bg-rose-950/40",
    in_progress: "bg-amber-950/30",
    exploited: "bg-emerald-950/30",
};

const STATUS_LABEL: Record<NodeStatus, string> = {
    hidden: "",
    locked: "LOCKED",
    eligible: "ELIGIBLE",
    selected: "SELECTED",
    in_progress: "IN PROGRESS",
    exploited: "EXPLOITED",
};

function StatusIcon({ status, className }: { status: NodeStatus; className?: string }) {
    const cls = className ?? "h-3 w-3";
    if (status === "locked") {
        return <Lock className={`${cls} text-zinc-500`} />;
    }
    if (status === "exploited") {
        return <Unlock className={`${cls} text-emerald-400`} />;
    }
    if (status === "in_progress") {
        return <Activity className={`${cls} animate-pulse text-amber-400`} />;
    }
    if (status === "selected") {
        return <Crosshair className={`${cls} text-rose-400`} />;
    }
    return <Activity className={`${cls} text-violet-400`} />;
}

/* Small colored stat pill used inside VDG node cards (φ / δ / epss) */
function StatPill({
    label,
    value,
    tone,
}: {
    label: string;
    value: number;
    tone: "violet" | "amber" | "cyan";
}) {
    const toneClass = {
        violet: "text-violet-300 border-violet-800/60 bg-violet-950/30",
        amber: "text-amber-300 border-amber-800/60 bg-amber-950/30",
        cyan: "text-cyan-300 border-cyan-800/60 bg-cyan-950/30",
    }[tone];
    return (
        <span className={`rounded-sm border px-1 py-[1px] text-[8px] leading-none ${toneClass}`}>
            {label} <b className="font-bold">{value.toFixed(2)}</b>
        </span>
    );
}

/* ------------------------------------------------------------------ */
/*  A connector: a straight or elbowed line whose endpoints are always */
/*  exact box-border coordinates. Flat stroke, no gradient fill.       */
/* ------------------------------------------------------------------ */

function Connector({
    d,
    color,
    active,
    reverse,
}: {
    d: string;
    color: string;
    active: boolean;
    reverse?: boolean;
}) {
    return (
        <g>
            <path
                d={d}
                fill="none"
                stroke={active ? color : "#3f3f46"}
                strokeWidth={active ? 2 : 1.25}
                strokeOpacity={active ? 1 : 0.45}
                style={{
                    transition:
                        "stroke 0.4s ease, stroke-width 0.4s ease, stroke-opacity 0.4s ease",
                }}
            />
            {active &&
                [0, 0.4, 0.8].map((offset) => (
                    <circle key={offset} r="3" fill={color}>
                        <animateMotion
                            dur="1.3s"
                            begin={`${offset}s`}
                            repeatCount="indefinite"
                            path={d}
                            keyPoints={reverse ? "1;0" : "0;1"}
                            keyTimes="0;1"
                        />
                    </circle>
                ))}
        </g>
    );
}

/* ------------------------------------------------------------------ */
/*  Reusable panel — a box positioned from BOX geometry                */
/* ------------------------------------------------------------------ */

const ACCENT_CLASS: Record<Accent, { border: string; text: string; icon: string }> = {
    cyan: { border: "border-cyan-400/80", text: "text-cyan-200", icon: "text-cyan-400" },
    indigo: { border: "border-indigo-400/80", text: "text-indigo-200", icon: "text-indigo-400" },
    amber: { border: "border-amber-400/80", text: "text-amber-200", icon: "text-amber-400" },
    emerald: {
        border: "border-emerald-400/80",
        text: "text-emerald-200",
        icon: "text-emerald-400",
    },
};

function Panel({
    box,
    active,
    accent,
    icon,
    title,
    subtitle,
    pulse,
    children,
}: {
    box: Box;
    active: boolean;
    accent: Accent;
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    pulse?: boolean;
    children: React.ReactNode;
}) {
    const a = ACCENT_CLASS[accent];
    return (
        <div className="absolute" style={pct(box)}>
            <div
                className={`flex h-full flex-col rounded-md border bg-[#0c0d10] p-3 transition-colors duration-500 ${
                    active ? a.border : "border-zinc-800"
                }`}
            >
                <div className="mb-1.5 flex items-center justify-between border-b border-zinc-800 pb-1.5">
                    <div className="flex min-w-0 items-center gap-2">
                        <span className={active ? a.icon : "text-zinc-600"}>{icon}</span>
                        <span
                            className={`truncate text-[10.5px] font-bold tracking-wide ${active ? a.text : "text-zinc-500"}`}
                        >
                            {title}
                        </span>
                        {subtitle && (
                            <span className="hidden shrink-0 text-[8.5px] text-zinc-600 sm:inline">
                                {subtitle}
                            </span>
                        )}
                    </div>
                    {pulse && active && <Activity className={`h-3 w-3 animate-pulse ${a.icon}`} />}
                </div>
                <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Trajectory log — parses the "[TAG] rest of line" convention into   */
/*  a colored badge so the log reads at a glance instead of as one     */
/*  flat monospace string.                                             */
/* ------------------------------------------------------------------ */

const LOG_TAG_STYLE: Record<string, string> = {
    EL: "bg-cyan-950/60 text-cyan-300 border-cyan-800/60",
    VDG: "bg-violet-950/60 text-violet-300 border-violet-800/60",
    ADM: "bg-indigo-950/60 text-indigo-300 border-indigo-800/60",
    EXEC: "bg-amber-950/60 text-amber-300 border-amber-800/60",
    ORACLE: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
    MEM: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
    LOOP: "bg-indigo-950/60 text-indigo-300 border-indigo-800/60",
    ORCH: "bg-cyan-950/60 text-cyan-300 border-cyan-800/60",
};

function TrajectoryLog({ line }: { line: string }) {
    const match = line.match(/^\[([A-Z]+)\]\s*(.*)$/);
    if (!match) {
        return <span>{line}</span>;
    }
    const [, tag, rest] = match;
    const style = LOG_TAG_STYLE[tag] ?? "bg-zinc-900 text-zinc-300 border-zinc-700";
    return (
        <span className="inline-flex items-center gap-2">
            <span
                className={`rounded border px-1.5 py-[1px] text-[9px] font-bold tracking-wide ${style}`}
            >
                {tag}
            </span>
            <span>{rest}</span>
        </span>
    );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ArchitectureAnimation() {
    const [step, setStep] = useState(0);
    const [paused, setPaused] = useState(false);
    const [tick, setTick] = useState(0);

    useEffect(() => {
        if (paused) {
            return;
        }
        const timer = setInterval(() => {
            setStep((prev) => (prev + 1) % PHASES.length);
            setTick(0);
        }, STEP_MS);
        return () => clearInterval(timer);
    }, [paused]);

    useEffect(() => {
        const raf = setInterval(() => setTick((t) => Math.min(100, t + 100 / (STEP_MS / 60))), 60);
        return () => clearInterval(raf);
    }, [step, paused]);

    const current = PHASES[step];
    const activeEdgeMap = useMemo(() => {
        const m = new Map<StructId, boolean>();
        current.activeEdges.forEach((e) => m.set(e.id, !!e.reverse));
        return m;
    }, [current]);
    const activeBoxSet = useMemo(() => new Set(current.activeBoxes), [current]);

    const isSpecActive = (id: SpecId) => current.activeSpecialists.includes(id);
    const isMemActive = (id: MemId) => current.memory.includes(id);
    const isBoxActive = (id: BoxId) => activeBoxSet.has(id);

    return (
        <div className="z-10 mt-6 w-full max-w-6xl font-mono">
            {/* Header / Info panel */}
            <div className="mb-4 flex flex-col items-start justify-between gap-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6 md:flex-row">
                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center gap-3">
                        {current.icon}
                        <h3 className="text-lg font-bold tracking-tight text-zinc-100">
                            {current.title}
                        </h3>
                    </div>
                    <p className="max-w-2xl text-sm leading-relaxed text-zinc-400">
                        {current.desc}
                    </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-3">
                    <div className="flex gap-1.5">
                        {PHASES.map((phase, i) => (
                            <button
                                key={phase.title}
                                aria-label={`Go to phase ${i + 1}`}
                                onClick={() => {
                                    setStep(i);
                                    setTick(0);
                                }}
                                className="relative h-1.5 w-8 overflow-hidden rounded-full bg-zinc-800 transition-colors hover:bg-zinc-700"
                            >
                                {i === step && (
                                    <span
                                        className="absolute inset-y-0 left-0 bg-zinc-200"
                                        style={{ width: `${tick}%` }}
                                    />
                                )}
                                {i < step && <span className="absolute inset-0 bg-zinc-500" />}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPaused((p) => !p)}
                        className="text-[10px] tracking-wide text-zinc-400 uppercase transition-colors hover:text-zinc-200"
                    >
                        {paused ? "▶ resume" : "⏸ pause"}
                    </button>
                </div>
            </div>

            {/* Stats strip */}
            <div className="mb-4 grid grid-cols-4 gap-3 text-center">
                {[
                    { label: "elapsed", value: current.stats.t },
                    { label: "tool calls", value: current.stats.calls },
                    { label: "est. cost", value: current.stats.cost },
                    { label: "VDG nodes", value: current.stats.nodes },
                ].map((s) => (
                    <div
                        key={s.label}
                        className="rounded-md border border-zinc-800 bg-zinc-950 py-2"
                    >
                        <div className="text-sm font-bold text-zinc-100">{s.value}</div>
                        <div className="text-[9px] tracking-wider text-zinc-500 uppercase">
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Canvas */}
            <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#08090b]">
                <div className="px-4 pt-2 text-[10px] text-zinc-500 sm:hidden">
                    ← scroll to see the full graph →
                </div>
                <div
                    className="relative w-full min-w-[960px]"
                    style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
                >
                    {/* flat dot grid — no color gradient, just a repeating pattern */}
                    <div
                        className="absolute inset-0 opacity-[0.35]"
                        style={{
                            backgroundImage: "radial-gradient(#27272a 1px, transparent 1px)",
                            backgroundSize: "26px 26px",
                        }}
                    />

                    <svg
                        className="pointer-events-none absolute inset-0 h-full w-full"
                        viewBox={`0 0 ${VB_W} ${VB_H}`}
                        preserveAspectRatio="xMidYMid meet"
                    >
                        {/* structural connectors — exactly one line per component pair */}
                        {(Object.keys(STRUCT) as StructId[]).map((id) => {
                            const edge = STRUCT[id];
                            const active = activeEdgeMap.has(id);
                            return (
                                <Connector
                                    key={id}
                                    d={edge.d}
                                    color={ACCENT_HEX[edge.accent]}
                                    active={active}
                                    reverse={activeEdgeMap.get(id)}
                                />
                            );
                        })}

                        {/* VDG corner brackets — the diagram's signature mark */}
                        {(() => {
                            const b = BOX.vdg;
                            const arm = 18;
                            const corners = [
                                { x: b.x, y: b.y, dx: 1, dy: 1 },
                                { x: b.x + b.w, y: b.y, dx: -1, dy: 1 },
                                { x: b.x, y: b.y + b.h, dx: 1, dy: -1 },
                                { x: b.x + b.w, y: b.y + b.h, dx: -1, dy: -1 },
                            ];
                            return corners.map((c) => (
                                <path
                                    key={`${c.x}-${c.y}`}
                                    d={`M ${c.x + c.dx * arm},${c.y} L ${c.x},${c.y} L ${c.x},${c.y + c.dy * arm}`}
                                    fill="none"
                                    stroke="#52525b"
                                    strokeWidth={1.5}
                                />
                            ));
                        })()}

                        {/* prerequisite edges — only drawn once both endpoints exist */}
                        {PREREQ.map((edge) => {
                            const fromStatus = current.nodeStatus[edge.from];
                            const toStatus = current.nodeStatus[edge.to];
                            if (fromStatus === "hidden" || toStatus === "hidden") {
                                return null;
                            }
                            const satisfied = fromStatus === "exploited";
                            return (
                                <path
                                    key={`${edge.from}-${edge.to}`}
                                    d={edge.d}
                                    fill="none"
                                    stroke={satisfied ? "#34d399" : "#52525b"}
                                    strokeWidth={satisfied ? 2 : 1.25}
                                    strokeDasharray={satisfied ? undefined : "3 4"}
                                    style={{ transition: "stroke 0.5s ease" }}
                                />
                            );
                        })}
                    </svg>

                    {/* ---- HTML PANELS (percentage-positioned from BOX geometry) ---- */}

                    {/* Layer 1 — Orchestrator */}
                    <Panel
                        box={BOX.orch}
                        active={isBoxActive("orch")}
                        accent="cyan"
                        icon={<Compass className="h-3.5 w-3.5" />}
                        title="LAYER 1 — ORCHESTRATOR (MISSION PLANNER)"
                        subtitle="Operator: target + scope + mode"
                    >
                        <div className="flex h-full items-stretch gap-3">
                            {ORCH_STAGES.map((stage, i) => {
                                const on = current.orchStage === stage.id;
                                return (
                                    <React.Fragment key={stage.id}>
                                        {i > 0 && <div className="w-px shrink-0 bg-zinc-800" />}
                                        <div
                                            className={`flex flex-1 items-center gap-2 rounded px-2 transition-colors duration-300 ${on ? "bg-cyan-500/10" : ""}`}
                                        >
                                            <span
                                                className={on ? "text-cyan-400" : "text-zinc-600"}
                                            >
                                                {stage.icon}
                                            </span>
                                            <div className="flex min-w-0 flex-col leading-none">
                                                <span
                                                    className={`text-[9.5px] font-bold whitespace-nowrap ${on ? "text-cyan-200" : "text-zinc-400"}`}
                                                >
                                                    {stage.label}
                                                </span>
                                                <span className="mt-0.5 hidden truncate text-[8px] text-zinc-600 md:inline">
                                                    {stage.sub}
                                                </span>
                                            </div>
                                            {on && (
                                                <Activity className="ml-auto h-2.5 w-2.5 shrink-0 animate-pulse text-cyan-400" />
                                            )}
                                        </div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </Panel>

                    <Panel
                        box={BOX.el}
                        active={isBoxActive("el")}
                        accent="cyan"
                        icon={<Database className="h-3.5 w-3.5" />}
                        title="ENVIRONMENTAL LAYER"
                    >
                        <div className="space-y-0.5 text-[10px] leading-snug text-zinc-300">
                            {current.el.map((line, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={i}>{line}</div>
                            ))}
                        </div>
                    </Panel>

                    <Panel
                        box={BOX.tm}
                        active={isBoxActive("tm")}
                        accent="indigo"
                        icon={<BrainCircuit className="h-3.5 w-3.5" />}
                        title="TEAM MANAGER · ADM"
                        pulse
                    >
                        <div className="space-y-0.5 text-[10px] leading-snug text-zinc-300">
                            {current.ucb.map((line, i) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div key={i}>{line}</div>
                            ))}
                        </div>
                    </Panel>

                    {/* Specialist Pool — 2-column grid, all six roles get their own card */}
                    <Panel
                        box={BOX.spec}
                        active={isBoxActive("spec")}
                        accent="amber"
                        icon={<Boxes className="h-3.5 w-3.5" />}
                        title="LAYER 3 — SPECIALIST POOL"
                        subtitle="fresh context per invocation"
                    >
                        <div className="grid h-full grid-cols-2 gap-2">
                            {SPECIALISTS.map((s) => {
                                const on = isSpecActive(s.id);
                                return (
                                    <div
                                        key={s.id}
                                        className={`flex flex-col justify-between rounded border px-2 py-1.5 transition-colors duration-300 ${
                                            on
                                                ? "border-amber-400/70 bg-amber-500/10"
                                                : "border-zinc-800/80 bg-zinc-900/30"
                                        }`}
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className={on ? "text-amber-400" : "text-zinc-600"}
                                            >
                                                {s.icon}
                                            </span>
                                            <span
                                                className={`text-[9px] leading-tight font-bold ${on ? "text-amber-200" : "text-zinc-400"}`}
                                            >
                                                {s.label}
                                            </span>
                                            {on && (
                                                <Activity className="ml-auto h-2.5 w-2.5 shrink-0 animate-pulse text-amber-400" />
                                            )}
                                        </div>
                                        <span className="mt-1 text-[7.5px] leading-tight text-zinc-500">
                                            {s.sub}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </Panel>

                    {/* VDG / Attack Layer container */}
                    <div className="absolute" style={pct(BOX.vdg)}>
                        <div
                            className={`h-full rounded-md border p-3 transition-colors duration-500 ${isBoxActive("vdg") ? "border-violet-400/70" : "border-zinc-800"}`}
                        >
                            <div className="mb-2 flex items-center gap-2 border-b border-zinc-800 pb-1.5">
                                <GitBranch
                                    className={`h-3.5 w-3.5 ${isBoxActive("vdg") ? "text-violet-400" : "text-zinc-600"}`}
                                />
                                <span
                                    className={`text-[10.5px] font-bold tracking-wide ${isBoxActive("vdg") ? "text-violet-200" : "text-zinc-500"}`}
                                >
                                    ATTACK LAYER — VULNERABILITY DEPENDENCY GRAPH
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* VDG nodes */}
                    {(Object.keys(VDG_NODE) as VdgId[]).map((id) => {
                        const n = VDG_NODE[id];
                        const status = current.nodeStatus[id];
                        const hidden = status === "hidden";
                        return (
                            <div
                                key={id}
                                className={`absolute transition-all duration-700 ${hidden ? "pointer-events-none scale-90 opacity-0" : "scale-100 opacity-100"} ${
                                    status === "selected" ? "scale-[1.04]" : ""
                                }`}
                                style={pct(n.box)}
                            >
                                <div
                                    className={`flex h-full flex-col justify-between rounded-md border-2 px-2 py-1.5 transition-colors duration-500 ${STATUS_BORDER[status]} ${STATUS_BG[status]}`}
                                >
                                    <div className="flex items-center justify-between gap-1">
                                        <span
                                            className={`text-[10px] leading-tight font-bold ${STATUS_TEXT[status]}`}
                                        >
                                            {n.label}
                                        </span>
                                        <StatusIcon status={status} />
                                    </div>
                                    <div className="text-[8.5px] text-zinc-400">{n.sub}</div>
                                    <div className="flex flex-wrap items-center gap-1">
                                        <StatPill label="φ" value={n.phi} tone="violet" />
                                        <StatPill label="δ" value={n.delta} tone="amber" />
                                        <StatPill label="epss" value={n.epss} tone="cyan" />
                                    </div>
                                    <span
                                        className={`text-[7px] font-bold tracking-wider ${STATUS_TEXT[status]}`}
                                    >
                                        {STATUS_LABEL[status]}
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    <Panel
                        box={BOX.val}
                        active={isBoxActive("val")}
                        accent="emerald"
                        icon={<ShieldCheck className="h-3.5 w-3.5" />}
                        title="VALIDATION"
                    >
                        <div className="flex h-full flex-col justify-center gap-1">
                            <div className="text-[9px] text-zinc-400">diagnose · adapt · cap</div>
                            <div className="text-[7.5px] text-zinc-600">
                                oracle: CVE-Bench · PrediQL · MHBench
                            </div>
                        </div>
                    </Panel>

                    <Panel
                        box={BOX.ev}
                        active={isBoxActive("ev")}
                        accent="emerald"
                        icon={<Eye className="h-3.5 w-3.5" />}
                        title="EVALUATION"
                    >
                        <div className="flex h-full flex-col justify-center gap-1">
                            <div className="text-[9px] text-zinc-400">4-part critique</div>
                            <div className="text-[7.5px] text-zinc-600">
                                what · expected_vs_actual · next · E_ord
                            </div>
                        </div>
                    </Panel>

                    <Panel
                        box={BOX.exec}
                        active={isBoxActive("exec")}
                        accent="amber"
                        icon={<Terminal className="h-3.5 w-3.5" />}
                        title="EXECUTION"
                    >
                        <div className="flex h-full flex-col justify-center">
                            <div className="text-[9px] text-zinc-400">
                                deterministic tool calls only
                            </div>
                        </div>
                    </Panel>

                    {/* Target environment */}
                    <div className="absolute" style={pct(BOX.target)}>
                        <div
                            className={`flex h-full flex-col rounded-md border p-3 transition-colors duration-500 ${isBoxActive("target") ? "border-rose-400/80" : "border-zinc-800"} bg-[#0c0d10]`}
                        >
                            <div className="mb-1.5 flex items-center justify-between border-b border-zinc-800 pb-1.5">
                                <div className="flex items-center gap-2">
                                    <Server
                                        className={`h-3.5 w-3.5 ${isBoxActive("target") ? "text-rose-400" : "text-zinc-600"}`}
                                    />
                                    <span
                                        className={`text-[10.5px] font-bold tracking-wide ${isBoxActive("target") ? "text-rose-200" : "text-zinc-500"}`}
                                    >
                                        TARGET ENVIRONMENT
                                    </span>
                                </div>
                                {isBoxActive("target") ? (
                                    <Unlock className="h-3 w-3 text-rose-400" />
                                ) : (
                                    <Lock className="h-3 w-3 text-zinc-600" />
                                )}
                            </div>
                            <div className="space-y-0.5 overflow-hidden text-[9.5px] leading-snug text-zinc-300">
                                {current.target.map((line, i) => (
                                    // eslint-disable-next-line react/no-array-index-key
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Memory & State Services — dedicated card grid, not a pill strip */}
                    <div
                        className="absolute inset-x-6 flex gap-2"
                        style={{ top: `${(688 / VB_H) * 100}%`, height: `${(140 / VB_H) * 100}%` }}
                    >
                        {MEMORY.map((m) => {
                            const on = isMemActive(m.id);
                            return (
                                <div
                                    key={m.id}
                                    className={`flex flex-1 flex-col justify-between rounded-md border p-2 transition-colors duration-500 ${
                                        on
                                            ? "border-emerald-400/70 bg-emerald-500/10"
                                            : "border-zinc-800 bg-zinc-950"
                                    }`}
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span className={on ? "text-emerald-400" : "text-zinc-600"}>
                                            {m.icon}
                                        </span>
                                        {on && (
                                            <Activity className="ml-auto h-2.5 w-2.5 animate-pulse text-emerald-400" />
                                        )}
                                    </div>
                                    <div
                                        className={`mt-1 text-[9.5px] leading-tight font-bold ${on ? "text-emerald-200" : "text-zinc-400"}`}
                                    >
                                        {m.label}
                                    </div>
                                    <div className="mt-0.5 text-[8px] leading-snug text-zinc-600">
                                        {m.sub}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-2 rounded-md border border-zinc-800 bg-zinc-950 px-4 py-2.5">
                <span className="mr-1 text-[9px] font-bold tracking-wider text-zinc-500 uppercase">
                    VDG node status
                </span>
                {(
                    ["locked", "eligible", "selected", "in_progress", "exploited"] as NodeStatus[]
                ).map((status) => (
                    <div
                        key={status}
                        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9.5px] ${STATUS_BORDER[status]} ${STATUS_BG[status]} ${STATUS_TEXT[status]}`}
                    >
                        <StatusIcon status={status} className="h-3 w-3" />
                        {STATUS_LABEL[status].toLowerCase()}
                    </div>
                ))}
            </div>

            {/* Trajectory log */}
            <div className="mt-3 overflow-hidden rounded-md border border-zinc-800 bg-black px-4 py-2 text-[10px] text-zinc-300">
                <span className="mr-2 text-zinc-600">$</span>
                <TrajectoryLog line={current.log} />
                <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-zinc-500 align-middle" />
            </div>
        </div>
    );
}
