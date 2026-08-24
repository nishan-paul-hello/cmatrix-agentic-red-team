export type EscalationContextBlock = (typeof CONTEXT_BLOCKS)[0];
export const CONTEXT_BLOCKS = [
    {
        k: "MISSION",
        v: "CVE-001 — app.targetcorp.com",
    },
    {
        k: "CURRENT NODE",
        v: "SQLI-001 (IN_PROGRESS, E_ord 4)",
    },
    {
        k: "SPECIALIST",
        v: "INJECT-SPEC",
    },
    {
        k: "RUNTIME",
        v: "00:19:04",
    },
    {
        k: "COST INCURRED",
        v: "$0.223",
    },
    {
        k: "NEXT ACTION",
        v: "sqli_schema_dump() — full DB extraction via time-based blind",
    },
];

export function getEscalationContextBlocks(): Promise<typeof CONTEXT_BLOCKS> {
    return Promise.resolve(CONTEXT_BLOCKS);
}
