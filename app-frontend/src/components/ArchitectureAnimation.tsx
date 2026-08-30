"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Activity,
    BrainCircuit,
    Bug,
    Code2,
    Coins,
    Crosshair,
    Database,
    Eye,
    GitBranch,
    History,
    Library,
    Lock,
    Network,
    PauseCircle,
    Search,
    Server,
    ShieldCheck,
    Terminal,
    Unlock,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Static structure — mirrors the RedGrid architecture spec           */
/* ------------------------------------------------------------------ */

type NodeStatus = "hidden" | "locked" | "eligible" | "selected" | "in_progress" | "exploited";

type VdgId = "v1" | "v2" | "v3" | "v4" | "v5";

const VDG: Record<
    VdgId,
    { x: number; y: number; label: string; sub: string; phi: number; delta: number; epss: number }
> = {
    v1: {
        x: 150,
        y: 245,
        label: "AUTH BYPASS",
        sub: "JWT forgery",
        phi: 0.74,
        delta: 0.35,
        epss: 0.41,
    },
    v2: {
        x: 460,
        y: 215,
        label: "SQLI · login",
        sub: "blind UNION",
        phi: 0.83,
        delta: 0.22,
        epss: 0.71,
    },
    v3: {
        x: 790,
        y: 245,
        label: "XSS · search",
        sub: "reflected",
        phi: 0.58,
        delta: 0.28,
        epss: 0.33,
    },
    v4: { x: 300, y: 365, label: "PRIV ESC", sub: "role param", phi: 0.61, delta: 0.5, epss: 0.22 },
    v5: {
        x: 590,
        y: 435,
        label: "RCE · upload",
        sub: "file-type bypass",
        phi: 0.69,
        delta: 0.62,
        epss: 0.58,
    },
};

const PREREQ: { from: VdgId; to: VdgId; d: string }[] = [
    { from: "v1", to: "v4", d: "M 160,270 Q 220,315 292,342" },
    { from: "v2", to: "v5", d: "M 480,242 Q 545,330 583,408" },
    { from: "v4", to: "v5", d: "M 320,390 Q 430,415 560,428" },
];

type EdgeId =
    | "el-manager"
    | "manager-specialist"
    | "manager-vdg"
    | "specialist-target"
    | "target-pipeline"
    | "exec-eval"
    | "eval-validation"
    | "to-el"
    | "vdg-manager-loop";

const EDGES: Record<EdgeId, { d: string; color: string }> = {
    "el-manager": { d: "M 300,85 L 350,85", color: "#38bdf8" },
    "manager-specialist": { d: "M 650,85 L 700,85", color: "#f43f5e" },
    "manager-vdg": { d: "M 500,150 Q 480,182 460,215", color: "#a78bfa" },
    "specialist-target": { d: "M 840,150 C 840,300 760,340 710,495", color: "#fbbf24" },
    "target-pipeline": { d: "M 560,548 L 480,540", color: "#fbbf24" },
    "exec-eval": { d: "M 160,540 L 190,540", color: "#38bdf8" },
    "eval-validation": { d: "M 310,540 L 340,540", color: "#38bdf8" },
    "to-el": { d: "M 420,500 C 200,410 70,300 55,150", color: "#34d399" },
    "vdg-manager-loop": { d: "M 900,205 Q 970,110 650,85", color: "#f43f5e" },
};

type SpecId = "recon" | "sqli" | "xss" | "lateral";
const SPECIALISTS: { id: SpecId; label: string; sub: string; icon: React.ReactNode }[] = [
    {
        id: "recon",
        label: "Recon Specialist",
        sub: "surface mapping",
        icon: <Search className="h-3.5 w-3.5" />,
    },
    {
        id: "sqli",
        label: "SQLi Specialist",
        sub: "payload FSM",
        icon: <Code2 className="h-3.5 w-3.5" />,
    },
    {
        id: "xss",
        label: "XSS Specialist",
        sub: "5-phase mutation",
        icon: <Bug className="h-3.5 w-3.5" />,
    },
    {
        id: "lateral",
        label: "Lateral Specialist",
        sub: "multi-host",
        icon: <Network className="h-3.5 w-3.5" />,
    },
];

type MemId = "strategy" | "skill" | "episodic" | "cost" | "stop";
const MEMORY: { id: MemId; x: number; label: string; icon: React.ReactNode }[] = [
    { id: "strategy", x: 110, label: "Strategy Mem", icon: <GitBranch className="h-3.5 w-3.5" /> },
    { id: "skill", x: 320, label: "Skill Library", icon: <Library className="h-3.5 w-3.5" /> },
    { id: "episodic", x: 530, label: "Episodic Mem", icon: <History className="h-3.5 w-3.5" /> },
    { id: "cost", x: 740, label: "Trajectory Log", icon: <Coins className="h-3.5 w-3.5" /> },
    { id: "stop", x: 890, label: "Early-Stop", icon: <PauseCircle className="h-3.5 w-3.5" /> },
];

/* ------------------------------------------------------------------ */
/*  Phase timeline                                                     */
/* ------------------------------------------------------------------ */

type Phase = {
    title: string;
    desc: string;
    el: string[];
    ucb: string[];
    log: string;
    activeSpecialist: SpecId | null;
    target: string[];
    nodeStatus: Record<VdgId, NodeStatus>;
    edges: EdgeId[];
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
        title: "1 · Intake & Autonomous Recon",
        desc: "The Orchestrator scopes the mission. An auto-prompter runs unstructured recon; every confirmed fact is written directly into the Environmental Layer — never inferred.",
        el: [
            "host: 10.20.4.17",
            "ports: 80, 443, 8080",
            "stack: nginx + PHP 8.1",
            "waf: ModSecurity (detected)",
        ],
        ucb: ["awaiting environmental facts…"],
        log: "[EL] +4 facts written by Recon Specialist",
        activeSpecialist: "recon",
        target: [
            "nmap -p- -sV …",
            "service fingerprint: nginx/php8.1",
            "WhatWeb + ObserverWard running",
        ],
        nodeStatus: HIDDEN_ALL,
        edges: ["specialist-target", "to-el"],
        memory: [],
        stats: { t: "0:12", calls: 6, cost: "$0.04", nodes: 0 },
        icon: <Search className="h-5 w-5 text-cyan-400" />,
    },
    {
        title: "2 · VDG Hypothesis Synthesis",
        desc: "The Team Manager reads the Environmental Layer and grows the Vulnerability Dependency Graph: promise φ, difficulty δ, and EPSS priors are scored, and prerequisite edges are inferred via batched LLM calls.",
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
        activeSpecialist: null,
        target: ["idle"],
        nodeStatus: { v1: "eligible", v2: "eligible", v3: "eligible", v4: "locked", v5: "locked" },
        edges: ["el-manager", "manager-vdg"],
        memory: [],
        stats: { t: "0:34", calls: 12, cost: "$0.11", nodes: 3 },
        icon: <BrainCircuit className="h-5 w-5 text-violet-400" />,
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
            "UCB(sqli)  = .42 +.58 +.25 −.02 +.11 = 0.91",
            "UCB(auth)  = .31 +.51 +.22 −.03 +.06 = 0.78",
            "UCB(xss)   = .20 +.44 +.15 −.05 +.05 = 0.54",
            "→ argmax: sqli_login",
        ],
        log: "[ADM] eligible={auth,sqli,xss} → SELECTED sqli_login",
        activeSpecialist: null,
        target: ["idle"],
        nodeStatus: { v1: "eligible", v2: "selected", v3: "eligible", v4: "locked", v5: "locked" },
        edges: ["manager-vdg"],
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
        activeSpecialist: "sqli",
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
        edges: ["manager-specialist", "specialist-target"],
        memory: [],
        stats: { t: "1:22", calls: 27, cost: "$0.34", nodes: 3 },
        icon: <Terminal className="h-5 w-5 text-amber-400" />,
    },
    {
        title: "5 · Evaluation & Oracle Validation",
        desc: "The Evaluation Agent produces a 4-part critique; the Validation Agent's Diagnose-Adapt-Cap loop forces a mandatory PoC re-run before the oracle confirms exploitation.",
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
        activeSpecialist: "sqli",
        target: ["PoC re-run ×1", "oracle: CONFIRMED", "creds harvested → EL"],
        nodeStatus: { v1: "eligible", v2: "exploited", v3: "eligible", v4: "locked", v5: "locked" },
        edges: ["target-pipeline", "exec-eval", "eval-validation"],
        memory: [],
        stats: { t: "1:58", calls: 31, cost: "$0.41", nodes: 3 },
        icon: <Eye className="h-5 w-5 text-emerald-400" />,
    },
    {
        title: "6 · Backprop & Skill Crystallization",
        desc: "E_ord backpropagates into the VDG. The confirmed exploit workflow is promoted into the Skill Library — oracle-gated, with a negative-transfer guard against unseen targets.",
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
        activeSpecialist: null,
        target: ["idle"],
        nodeStatus: { v1: "eligible", v2: "exploited", v3: "eligible", v4: "locked", v5: "locked" },
        edges: ["to-el"],
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
        activeSpecialist: null,
        target: ["idle"],
        nodeStatus: { v1: "selected", v2: "exploited", v3: "eligible", v4: "locked", v5: "locked" },
        edges: ["vdg-manager-loop", "manager-vdg"],
        memory: ["stop"],
        stats: { t: "2:15", calls: 33, cost: "$0.44", nodes: 3 },
        icon: <GitBranch className="h-5 w-5 text-rose-400" />,
    },
];

const STEP_MS = 5200;

/* ------------------------------------------------------------------ */
/*  Status → visual tokens                                             */
/* ------------------------------------------------------------------ */

const STATUS_RING: Record<NodeStatus, string> = {
    hidden: "border-zinc-800/0",
    locked: "border-zinc-700",
    eligible: "border-violet-500/60",
    selected: "border-rose-500 shadow-[0_0_28px_rgba(244,63,94,0.35)]",
    in_progress: "border-amber-500/70 shadow-[0_0_22px_rgba(251,191,36,0.25)]",
    exploited: "border-emerald-500/70 shadow-[0_0_22px_rgba(52,211,153,0.25)]",
};

const STATUS_TEXT: Record<NodeStatus, string> = {
    hidden: "text-zinc-700",
    locked: "text-zinc-500",
    eligible: "text-violet-300",
    selected: "text-rose-300",
    in_progress: "text-amber-300",
    exploited: "text-emerald-300",
};

function StatusIcon({ status }: { status: NodeStatus }) {
    if (status === "locked") {
        return <Lock className="h-3 w-3 text-zinc-600" />;
    }
    if (status === "exploited") {
        return <Unlock className="h-3 w-3 text-emerald-400" />;
    }
    if (status === "in_progress") {
        return <Activity className="h-3 w-3 animate-pulse text-amber-400" />;
    }
    if (status === "selected") {
        return <Crosshair className="h-3 w-3 text-rose-400" />;
    }
    return <Activity className="h-3 w-3 text-violet-400/70" />;
}

/* ------------------------------------------------------------------ */
/*  Flow particles along a bezier/line path                            */
/* ------------------------------------------------------------------ */

function FlowEdge({ d, color, active }: { d: string; color: string; active: boolean }) {
    return (
        <g>
            <path
                d={d}
                fill="none"
                stroke={active ? color : "#27272a"}
                strokeWidth={active ? 1.75 : 1.25}
                strokeOpacity={active ? 0.9 : 0.5}
                style={{ transition: "stroke 0.4s ease, stroke-width 0.4s ease" }}
            />
            {active &&
                [0, 0.33, 0.66].map((offset) => (
                    <circle key={offset} r="3.2" fill={color}>
                        <animateMotion
                            dur="1.1s"
                            begin={`${offset}s`}
                            repeatCount="indefinite"
                            path={d}
                        />
                    </circle>
                ))}
        </g>
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

    // drives the per-step progress bar independent of the phase interval
    useEffect(() => {
        const raf = setInterval(() => setTick((t) => Math.min(100, t + 100 / (STEP_MS / 60))), 60);
        return () => clearInterval(raf);
    }, [step, paused]);

    const current = PHASES[step];
    const activeEdgeSet = useMemo(() => new Set(current.edges), [current]);

    const isSpecActive = (id: SpecId) => current.activeSpecialist === id;
    const isMemActive = (id: MemId) => current.memory.includes(id);

    return (
        <div className="z-10 mt-16 w-full max-w-6xl font-mono">
            {/* Header / Info panel */}
            <div className="mb-4 flex flex-col items-start justify-between gap-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-6 backdrop-blur-md md:flex-row">
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
                        className="text-[10px] tracking-wide text-zinc-500 uppercase transition-colors hover:text-zinc-300"
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
                        className="rounded-lg border border-zinc-800 bg-zinc-950/50 py-2"
                    >
                        <div className="text-sm font-bold text-zinc-200">{s.value}</div>
                        <div className="text-[9px] tracking-wider text-zinc-600 uppercase">
                            {s.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Canvas */}
            <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-[#08080a] shadow-2xl">
                <div className="px-4 pt-2 text-[10px] text-zinc-600 sm:hidden">
                    ← scroll to see the full graph →
                </div>
                <div className="relative aspect-[1000/700] w-full min-w-[920px]">
                    {/* grid + vignette */}
                    <div
                        className="absolute inset-0 opacity-[0.15]"
                        style={{
                            backgroundImage:
                                "linear-gradient(#27272a 1px, transparent 1px), linear-gradient(90deg, #27272a 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#08080a]" />

                    <svg
                        className="pointer-events-none absolute inset-0 h-full w-full"
                        viewBox="0 0 1000 700"
                        preserveAspectRatio="xMidYMid meet"
                    >
                        <defs>
                            <marker
                                id="arrow-zinc"
                                markerWidth="8"
                                markerHeight="8"
                                refX="6"
                                refY="3"
                                orient="auto"
                            >
                                <path d="M0,0 L6,3 L0,6 Z" fill="#3f3f46" />
                            </marker>
                            <marker
                                id="arrow-emerald"
                                markerWidth="8"
                                markerHeight="8"
                                refX="6"
                                refY="3"
                                orient="auto"
                            >
                                <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
                            </marker>
                        </defs>

                        {/* structural edges */}
                        {(Object.keys(EDGES) as EdgeId[]).map((id) => (
                            <FlowEdge
                                key={id}
                                d={EDGES[id].d}
                                color={EDGES[id].color}
                                active={activeEdgeSet.has(id)}
                            />
                        ))}

                        {/* prerequisite edges inside the VDG */}
                        {PREREQ.map((edge) => {
                            const sourceDone = current.nodeStatus[edge.from] === "exploited";
                            return (
                                <path
                                    key={`${edge.from}-${edge.to}`}
                                    d={edge.d}
                                    fill="none"
                                    stroke={sourceDone ? "#34d399" : "#3f3f46"}
                                    strokeWidth={sourceDone ? 1.75 : 1.25}
                                    strokeDasharray={sourceDone ? undefined : "4 4"}
                                    markerEnd={
                                        sourceDone ? "url(#arrow-emerald)" : "url(#arrow-zinc)"
                                    }
                                    style={{ transition: "stroke 0.5s ease" }}
                                />
                            );
                        })}
                    </svg>

                    {/* ---- HTML NODES (percentage-positioned to track the 1000x700 viewBox) ---- */}

                    {/* Environmental Layer */}
                    <div className="absolute" style={{ left: "2%", top: "2.8%", width: "28%" }}>
                        <div className="flex h-[125px] flex-col rounded-lg border border-cyan-500/40 bg-zinc-950/80 p-3 shadow-xl backdrop-blur-xl">
                            <div className="mb-1.5 flex items-center gap-2 border-b border-zinc-800 pb-1.5">
                                <Database className="h-3.5 w-3.5 text-cyan-400" />
                                <span className="text-[10px] font-bold text-cyan-300">
                                    ENVIRONMENTAL LAYER
                                </span>
                            </div>
                            <div className="overflow-hidden text-[9.5px] leading-snug whitespace-pre-line text-cyan-200/70">
                                {current.el.join("\n")}
                            </div>
                        </div>
                    </div>

                    {/* Team Manager */}
                    <div className="absolute" style={{ left: "35%", top: "2.8%", width: "30%" }}>
                        <div className="flex h-[125px] flex-col rounded-lg border border-blue-500/40 bg-zinc-950/80 p-3 shadow-xl backdrop-blur-xl">
                            <div className="mb-1.5 flex items-center justify-between border-b border-zinc-800 pb-1.5">
                                <div className="flex items-center gap-2">
                                    <BrainCircuit className="h-3.5 w-3.5 text-blue-400" />
                                    <span className="text-[10px] font-bold text-blue-300">
                                        TEAM MANAGER · ADM
                                    </span>
                                </div>
                                <Activity className="h-3 w-3 animate-pulse text-blue-400" />
                            </div>
                            <div className="overflow-hidden text-[9.5px] leading-snug whitespace-pre-line text-blue-200/80">
                                {current.ucb.join("\n")}
                            </div>
                        </div>
                    </div>

                    {/* Specialist pool */}
                    <div className="absolute" style={{ left: "70%", top: "2.8%", width: "28%" }}>
                        <div className="flex h-[125px] flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950/80 p-2.5 shadow-xl backdrop-blur-xl">
                            {SPECIALISTS.map((s) => (
                                <div
                                    key={s.id}
                                    className={`flex items-center gap-2 rounded px-1.5 py-1 transition-all duration-500 ${
                                        isSpecActive(s.id)
                                            ? "bg-amber-500/10 text-amber-200"
                                            : "text-zinc-500"
                                    }`}
                                >
                                    <span
                                        className={
                                            isSpecActive(s.id) ? "text-amber-400" : "text-zinc-600"
                                        }
                                    >
                                        {s.icon}
                                    </span>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[9.5px] font-bold">{s.label}</span>
                                        <span className="text-[8px] text-zinc-600">{s.sub}</span>
                                    </div>
                                    {isSpecActive(s.id) && (
                                        <Activity className="ml-auto h-2.5 w-2.5 animate-pulse text-amber-400" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* VDG graph nodes */}
                    {(Object.keys(VDG) as VdgId[]).map((id) => {
                        const n = VDG[id];
                        const status = current.nodeStatus[id];
                        const hidden = status === "hidden";
                        return (
                            <div
                                key={id}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${
                                    hidden
                                        ? "pointer-events-none scale-75 opacity-0"
                                        : "scale-100 opacity-100"
                                } ${status === "selected" ? "scale-110" : ""}`}
                                style={{
                                    left: `${n.x / 10}%`,
                                    top: `${(n.y / 700) * 100}%`,
                                    width: "148px",
                                }}
                            >
                                <div
                                    className={`rounded-lg border-2 bg-zinc-950/90 px-2.5 py-2 backdrop-blur-xl transition-all duration-500 ${STATUS_RING[status]}`}
                                >
                                    <div className="mb-1 flex items-center justify-between">
                                        <span
                                            className={`text-[9.5px] font-bold ${STATUS_TEXT[status]}`}
                                        >
                                            {n.label}
                                        </span>
                                        <StatusIcon status={status} />
                                    </div>
                                    <div className="mb-1 text-[8px] text-zinc-600">{n.sub}</div>
                                    <div className="flex gap-1.5 text-[7.5px] text-zinc-600">
                                        <span>φ{n.phi}</span>
                                        <span>δ{n.delta}</span>
                                        <span>epss{n.epss}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Execution / Evaluation / Validation pipeline */}
                    {[
                        {
                            key: "exec",
                            x: 4,
                            w: 12,
                            label: "EXECUTION",
                            sub: "tool calls only",
                            icon: <Terminal className="h-3 w-3" />,
                            active: activeEdgeSet.has("target-pipeline"),
                        },
                        {
                            key: "eval",
                            x: 19,
                            w: 12,
                            label: "EVALUATION",
                            sub: "4-part critique",
                            icon: <Eye className="h-3 w-3" />,
                            active: activeEdgeSet.has("exec-eval"),
                        },
                        {
                            key: "val",
                            x: 34,
                            w: 14,
                            label: "VALIDATION",
                            sub: "diagnose·adapt·cap",
                            icon: <ShieldCheck className="h-3 w-3" />,
                            active: activeEdgeSet.has("eval-validation"),
                        },
                    ].map((b) => (
                        <div
                            key={b.key}
                            className="absolute"
                            style={{ left: `${b.x}%`, top: "70.5%", width: `${b.w}%` }}
                        >
                            <div
                                className={`flex h-[68px] flex-col items-center justify-center rounded-lg border bg-zinc-950/85 px-2 py-2 text-center backdrop-blur-xl transition-all duration-500 ${
                                    b.active
                                        ? "border-emerald-500/50 shadow-[0_0_18px_rgba(52,211,153,0.15)]"
                                        : "border-zinc-800"
                                }`}
                            >
                                <span className={b.active ? "text-emerald-400" : "text-zinc-600"}>
                                    {b.icon}
                                </span>
                                <span
                                    className={`mt-1 text-[8.5px] font-bold ${b.active ? "text-emerald-300" : "text-zinc-500"}`}
                                >
                                    {b.label}
                                </span>
                                <span className="text-[7px] text-zinc-600">{b.sub}</span>
                            </div>
                        </div>
                    ))}

                    {/* Target environment */}
                    <div className="absolute" style={{ left: "56%", top: "70%", width: "30%" }}>
                        <div
                            className={`rounded-lg border bg-zinc-950/85 p-3 shadow-xl backdrop-blur-xl transition-all duration-500 ${
                                step === 4
                                    ? "border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.15)]"
                                    : "border-zinc-800"
                            }`}
                        >
                            <div className="mb-1.5 flex items-center justify-between border-b border-zinc-800 pb-1.5">
                                <div className="flex items-center gap-2">
                                    <Server
                                        className={`h-3.5 w-3.5 ${step === 4 ? "text-rose-400" : "text-zinc-400"}`}
                                    />
                                    <span className="text-[10px] font-bold text-zinc-200">
                                        TARGET ENVIRONMENT
                                    </span>
                                </div>
                                {step === 4 ? (
                                    <Unlock className="h-3 w-3 text-rose-400" />
                                ) : (
                                    <Lock className="h-3 w-3 text-zinc-600" />
                                )}
                            </div>
                            <div className="text-[9px] leading-snug whitespace-pre-line text-zinc-400">
                                {current.target.join("\n")}
                            </div>
                        </div>
                    </div>

                    {/* Memory strip */}
                    <div className="absolute inset-x-0" style={{ top: "93%" }}>
                        <div className="flex justify-between px-[3%]">
                            {MEMORY.map((m) => (
                                <div
                                    key={m.id}
                                    className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 transition-all duration-500 ${
                                        isMemActive(m.id)
                                            ? "border-emerald-500/50 bg-emerald-500/5 text-emerald-300"
                                            : "border-zinc-800 text-zinc-600"
                                    }`}
                                >
                                    {m.icon}
                                    <span className="hidden text-[8px] font-bold whitespace-nowrap md:inline">
                                        {m.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[9px] text-zinc-500">
                {[
                    { label: "locked", cls: "border-zinc-700" },
                    { label: "eligible", cls: "border-violet-500/60" },
                    { label: "selected", cls: "border-rose-500" },
                    { label: "in progress", cls: "border-amber-500/70" },
                    { label: "exploited", cls: "border-emerald-500/70" },
                ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                        <span className={`h-2.5 w-2.5 rounded-sm border-2 ${l.cls}`} />
                        {l.label}
                    </div>
                ))}
            </div>

            {/* Trajectory log */}
            <div className="mt-3 overflow-hidden rounded-lg border border-zinc-800 bg-black/60 px-4 py-2 text-[10px] text-zinc-500">
                <span className="mr-2 text-zinc-700">$</span>
                {current.log}
                <span className="ml-1 inline-block h-3 w-1.5 animate-pulse bg-zinc-600 align-middle" />
            </div>
        </div>
    );
}
