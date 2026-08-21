// Shared mission data — A1: moved from Dashboard.tsx so MissionsPage can import it too
export const MISSIONS = [
  { id: "CVE-001", target: "app.targetcorp.com",      surface: "WEB APPLICATION", mode: "ONE-DAY",  status: "RUNNING",    nodes: 12, findings: 7, cost: "$1.42", started: "06:12:00" },
  { id: "CVE-002", target: "api.targetcorp.com",      surface: "GRAPHQL",          mode: "ZERO-DAY", status: "RUNNING",    nodes: 18, findings: 1, cost: "$0.87", started: "08:44:10" },
  { id: "CVE-003", target: "10.0.4.0/24",             surface: "MULTI-HOST",       mode: "ONE-DAY",  status: "PAUSED",     nodes: 67, findings: 8, cost: "$4.11", started: "Yesterday" },
  { id: "CVE-004", target: "shop.targetcorp.com",     surface: "WEB APPLICATION", mode: "ONE-DAY",  status: "VALIDATING", nodes: 29, findings: 2, cost: "$2.06", started: "Yesterday" },
  { id: "CVE-005", target: "portal.corpx.io",         surface: "WEB APPLICATION", mode: "ZERO-DAY", status: "RUNNING",    nodes: 51, findings: 5, cost: "$3.74", started: "2d ago"    },
  { id: "CVE-006", target: "internal.targetcorp.com", surface: "GRAPHQL",          mode: "ONE-DAY",  status: "QUEUED",     nodes: 0,  findings: 0, cost: "$0.00", started: "—"         },
];
