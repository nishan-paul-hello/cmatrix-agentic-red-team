export const STEPS = [
    {
        index: 1,
        id: "target",
        label: "TARGET",
    },
    {
        index: 2,
        id: "roe",
        label: "RULES OF ENGAGEMENT",
    },
    {
        index: 3,
        id: "surface",
        label: "ATTACK SURFACE",
    },
    {
        index: 4,
        id: "mode",
        label: "MISSION MODE",
    },
    {
        index: 5,
        id: "review",
        label: "REVIEW",
    },
];
export type TargetType = "URL" | "HOST" | "BENCHMARK ENVIRONMENT";
export type SurfaceType = "WEB APPLICATION" | "GRAPHQL" | "MULTI-HOST";
export type ModeType = "ONE-DAY" | "ZERO-DAY";
export interface WizardProps {
    onCancel: () => void;
    onStart?: () => void;
    initialStep?: number;
}

/* ── Shared sub-components ── */

export const SURFACE_OPTIONS: {
    value: SurfaceType;
    proto: string;
    icon: string;
    tags: string[];
    specialists: string[];
    description: string;
}[] = [
    {
        value: "WEB APPLICATION",
        proto: "HTTP / HTML",
        icon: "⬡",
        tags: ["SQLi", "XSS", "CSRF", "SSRF", "SSTI", "IDOR", "Auth Bypass", "Path Traversal"],
        specialists: ["RECON", "AUTH", "INJECTION", "LOGIC", "VALIDATION"],
        description:
            "Full web-layer attack surface. Enumerates endpoints, parameters, and authentication state before attempting exploitation.",
    },
    {
        value: "GRAPHQL",
        proto: "GraphQL / HTTP",
        icon: "◈",
        tags: [
            "Schema Introspection",
            "Dependency Injection",
            "IDOR",
            "Batching Attacks",
            "Auth Bypass",
        ],
        specialists: ["RECON", "GRAPHQL", "INJECTION", "VALIDATION"],
        description:
            "GraphQL schema discovery and exploitation. Tests field-level authorization, nested query abuse, and injection via arguments.",
    },
    {
        value: "MULTI-HOST",
        proto: "TCP / Network",
        icon: "◉",
        tags: [
            "Lateral Movement",
            "Privilege Escalation",
            "Credential Reuse",
            "Service Exploit",
            "Pivoting",
        ],
        specialists: ["RECON", "NETWORK", "LATERAL", "PRIVESC", "VALIDATION"],
        description:
            "Multi-host network engagement. Maps topology, pivots across trust boundaries, and escalates privileges across hosts.",
    },
];
export const MODE_OPTIONS: {
    value: ModeType;
    hint: string;
    badge: string;
    badgeColor: string;
    difficulty: string;
    icon: string;
    description: string;
    implications: {
        label: string;
        detail: string;
    }[];
}[] = [
    {
        value: "ONE-DAY",
        hint: "CVE HINT AVAILABLE",
        badge: "ASSISTED",
        badgeColor: "var(--color-warning)",
        difficulty: "STANDARD",
        icon: "◈",
        description:
            "The team manager receives a CVE identifier at mission start. The system uses this to bias UCB exploration toward known vulnerability classes and seed the VDG with informed candidate nodes.",
        implications: [
            {
                label: "CVE SEED",
                detail: "CVE id injected into team manager system prompt.",
            },
            {
                label: "VDG INIT",
                detail: "Attack graph pre-seeded with CVE-class candidates.",
            },
            {
                label: "UCB PRIOR",
                detail: "EPSS score from CVE record used as UCB prior.",
            },
            {
                label: "MEMORY LOOKUP",
                detail: "Skill library queried for CVE-class patterns first.",
            },
            {
                label: "ORACLE",
                detail: "Oracle validation available on BENCHMARK targets.",
            },
        ],
    },
    {
        value: "ZERO-DAY",
        hint: "NO CVE HINT",
        badge: "BLIND",
        badgeColor: "var(--color-brand)",
        difficulty: "HARD",
        icon: "◆",
        description:
            "No CVE identifier is provided. The system must discover the vulnerability class through autonomous reconnaissance, environmental layer construction, and fully unsupervised VDG expansion.",
        implications: [
            {
                label: "NO SEED",
                detail: "VDG initialized from surface heuristics only.",
            },
            {
                label: "UCB PRIOR",
                detail: "Uniform prior — no EPSS bias applied.",
            },
            {
                label: "FULL RECON",
                detail: "Complete recon pass required before exploitation.",
            },
            {
                label: "HIGHER COST",
                detail: "Typically 2–4× more LLM calls than ONE-DAY mode.",
            },
            {
                label: "ORACLE",
                detail: "Oracle validation available on BENCHMARK targets.",
            },
        ],
    },
];
export const SURFACE_SPECIALISTS: Record<SurfaceType, string[]> = {
    "WEB APPLICATION": ["RECON", "AUTH", "INJECTION", "LOGIC", "VALIDATION"],
    GRAPHQL: ["RECON", "GRAPHQL", "INJECTION", "VALIDATION"],
    "MULTI-HOST": ["RECON", "NETWORK", "LATERAL", "PRIVESC", "VALIDATION"],
};
