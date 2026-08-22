export type NodeStatus =
    "EXPLOITED" | "ELIGIBLE" | "IN_PROGRESS" | "BLOCKED" | "INFEASIBLE" | "DEPRIORITIZED";

export type FilterStatus = "ALL" | NodeStatus;

export type VulnFilter =
    | "ALL"
    | "SQLi"
    | "XSS"
    | "CSRF"
    | "SSRF"
    | "SSTI"
    | "IDOR"
    | "RCE"
    | "AUTH"
    | "GRAPHQL"
    | "LATERAL";

export interface VDGNode {
    id: string;
    type: string;
    vulnClass: VulnFilter;
    status: NodeStatus;
    ucb: number;
    eord: number;
    cx: number;
    cy: number;
}

export interface Edge {
    from: string;
    to: string;
    active?: boolean;
}

export const NODES: VDGNode[] = [
    {
        id: "RECON-001",
        type: "RECONNAISSANCE",
        vulnClass: "ALL",
        status: "EXPLOITED",
        ucb: 0,
        eord: 5,
        cx: 500,
        cy: 50,
    },
    {
        id: "AUTH-001",
        type: "AUTHENTICATION",
        vulnClass: "AUTH",
        status: "EXPLOITED",
        ucb: 0,
        eord: 4,
        cx: 270,
        cy: 170,
    },
    {
        id: "ENUM-002",
        type: "ENUMERATION",
        vulnClass: "ALL",
        status: "EXPLOITED",
        ucb: 0,
        eord: 4,
        cx: 720,
        cy: 170,
    },
    {
        id: "SQLI-001",
        type: "SQL INJECTION",
        vulnClass: "SQLi",
        status: "ELIGIBLE",
        ucb: 0.824,
        eord: 3,
        cx: 110,
        cy: 320,
    },
    {
        id: "XSS-002",
        type: "CROSS-SITE SCRIPT",
        vulnClass: "XSS",
        status: "IN_PROGRESS",
        ucb: 0.741,
        eord: 3,
        cx: 310,
        cy: 320,
    },
    {
        id: "CSRF-003",
        type: "CROSS-SITE REQ",
        vulnClass: "CSRF",
        status: "BLOCKED",
        ucb: 0.512,
        eord: 1,
        cx: 500,
        cy: 320,
    },
    {
        id: "SSRF-005",
        type: "SERVER-SIDE REQ",
        vulnClass: "SSRF",
        status: "INFEASIBLE",
        ucb: 0,
        eord: 2,
        cx: 690,
        cy: 320,
    },
    {
        id: "IDOR-008",
        type: "INSECURE DIR REF",
        vulnClass: "IDOR",
        status: "ELIGIBLE",
        ucb: 0.631,
        eord: 2,
        cx: 890,
        cy: 320,
    },
    {
        id: "DB-ACCESS-002",
        type: "DATABASE ACCESS",
        vulnClass: "SQLi",
        status: "BLOCKED",
        ucb: 0.39,
        eord: 0,
        cx: 60,
        cy: 480,
    },
    {
        id: "RCE-007",
        type: "REMOTE CODE EXEC",
        vulnClass: "RCE",
        status: "BLOCKED",
        ucb: 0.44,
        eord: 1,
        cx: 240,
        cy: 480,
    },
    {
        id: "SSTI-006",
        type: "SERVER-SIDE TMPL",
        vulnClass: "SSTI",
        status: "DEPRIORITIZED",
        ucb: 0.21,
        eord: 1,
        cx: 690,
        cy: 480,
    },
    {
        id: "IDOR-009",
        type: "INSECURE DIR REF",
        vulnClass: "IDOR",
        status: "ELIGIBLE",
        ucb: 0.588,
        eord: 2,
        cx: 890,
        cy: 480,
    },
];

export const EDGES: Edge[] = [
    {
        from: "RECON-001",
        to: "AUTH-001",
    },
    {
        from: "RECON-001",
        to: "ENUM-002",
    },
    {
        from: "AUTH-001",
        to: "SQLI-001",
    },
    {
        from: "AUTH-001",
        to: "XSS-002",
        active: true,
    },
    {
        from: "AUTH-001",
        to: "CSRF-003",
    },
    {
        from: "ENUM-002",
        to: "SSRF-005",
    },
    {
        from: "ENUM-002",
        to: "IDOR-008",
    },
    {
        from: "SQLI-001",
        to: "DB-ACCESS-002",
    },
    {
        from: "SQLI-001",
        to: "RCE-007",
    },
    {
        from: "SSRF-005",
        to: "SSTI-006",
    },
    {
        from: "IDOR-008",
        to: "IDOR-009",
    },
];
