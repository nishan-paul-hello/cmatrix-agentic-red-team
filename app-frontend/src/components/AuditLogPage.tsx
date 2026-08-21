import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EvtType = "AUTH" | "MISSION" | "EXECUTION" | "ESCALATION" | "SYSTEM" | "CONFIG";
type ResultValue = "SUCCESS" | "FAILURE" | "WARNING";

interface AuditEntry {
  id: string;
  ts: string;
  type: EvtType;
  actor: string;
  action: string;
  resource: string;
  result: ResultValue;
  ip: string;
  detail: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const ENTRIES: AuditEntry[] = [
  { id: "AL-0891", ts: "2026-08-19 06:31:04", type: "MISSION",   actor: "TEAM-MANAGER",    action: "ORACLE_DISPATCH",      resource: "CVE-001/SQLI-001", result: "SUCCESS", ip: "internal", detail: "Oracle test dispatched to CVE-BENCH FILE ACCESS endpoint" },
  { id: "AL-0890", ts: "2026-08-19 06:30:58", type: "EXECUTION", actor: "INJECT-SPEC",     action: "SPECIALIST_EVALUATE",  resource: "CVE-001/SQLI-001", result: "SUCCESS", ip: "internal", detail: "E_ord raised 3→4. DB-ACCESS-002 unlocked." },
  { id: "AL-0889", ts: "2026-08-19 06:30:51", type: "EXECUTION", actor: "EXEC-AGENT",      action: "TOOL_EXECUTION",       resource: "curl/sqli_payload", result: "SUCCESS", ip: "internal", detail: "time-based SQLi confirmed: RTT 4.18s" },
  { id: "AL-0888", ts: "2026-08-19 06:30:39", type: "MISSION",   actor: "VALID-AGENT",     action: "ORACLE_TEST",          resource: "CVE-001/AUTH-001", result: "SUCCESS", ip: "internal", detail: "CVE-BENCH oracle PASS — FILE ACCESS confirmed" },
  { id: "AL-0887", ts: "2026-08-19 06:29:58", type: "EXECUTION", actor: "INJECT-SPEC",     action: "CONTEXT_COMPACTION",   resource: "S-03",             result: "SUCCESS", ip: "internal", detail: "Context compacted 94K→48K tokens" },
  { id: "AL-0886", ts: "2026-08-19 06:29:44", type: "EXECUTION", actor: "INJECT-SPEC",     action: "TOOL_EXECUTION",       resource: "curl/union_probe", result: "FAILURE", ip: "internal", detail: "Union-based SQLi failed — column count mismatch" },
  { id: "AL-0885", ts: "2026-08-19 06:29:03", type: "EXECUTION", actor: "NETWORK-SPEC",    action: "TOOL_EXECUTION",       resource: "nmap/lateral",     result: "WARNING", ip: "internal", detail: "Port 5432 filtered — timeout after 30s" },
  { id: "AL-0884", ts: "2026-08-19 06:25:33", type: "MISSION",   actor: "RECON-SPEC",      action: "FINDING_RECORDED",     resource: "CVE-001/F-003",    result: "SUCCESS", ip: "internal", detail: "IDOR confirmed on /api/users/:id — E_ord 3" },
  { id: "AL-0883", ts: "2026-08-19 06:24:00", type: "ESCALATION",actor: "TEAM-MANAGER",    action: "HUMAN_ESCALATION",     resource: "CVE-001",          result: "SUCCESS", ip: "internal", detail: "Cost threshold escalation — operator authorized continuation" },
  { id: "AL-0882", ts: "2026-08-19 06:22:14", type: "MISSION",   actor: "AUTH-SPEC",       action: "EXPLOIT_CONFIRMED",    resource: "CVE-001/AUTH-001", result: "SUCCESS", ip: "internal", detail: "JWT HS256 secret cracked: password123" },
  { id: "AL-0881", ts: "2026-08-19 06:20:00", type: "MISSION",   actor: "TEAM-MANAGER",    action: "UCB_RESCORE",          resource: "CVE-001",          result: "SUCCESS", ip: "internal", detail: "12 VDG nodes rescored. AUTH-001 selected (UCB=0.91)" },
  { id: "AL-0880", ts: "2026-08-19 06:12:00", type: "MISSION",   actor: "OPERATOR:usr-01", action: "MISSION_START",        resource: "CVE-001",          result: "SUCCESS", ip: "10.0.0.4", detail: "Mission initiated: target=app.targetcorp.com type=URL" },
  { id: "AL-0879", ts: "2026-08-19 06:11:42", type: "AUTH",      actor: "usr-01",          action: "LOGIN",                resource: "AUTH",             result: "SUCCESS", ip: "10.0.0.4", detail: "Interactive session authenticated — MFA verified" },
  { id: "AL-0878", ts: "2026-08-19 06:11:30", type: "AUTH",      actor: "usr-02",          action: "LOGIN",                resource: "AUTH",             result: "FAILURE", ip: "10.0.0.9", detail: "Authentication failed — incorrect password (attempt 1/3)" },
  { id: "AL-0877", ts: "2026-08-18 22:14:01", type: "CONFIG",    actor: "usr-01",          action: "CONFIG_CHANGE",        resource: "SETTINGS/ROE",     result: "SUCCESS", ip: "10.0.0.4", detail: "MAX_RUNTIME updated: 4h→8h" },
  { id: "AL-0876", ts: "2026-08-18 22:13:50", type: "SYSTEM",    actor: "SYSTEM",          action: "BENCHMARK_COMPLETE",   resource: "B-031",            result: "SUCCESS", ip: "internal", detail: "CVE-BENCH v2 Full completed: score 81.2%" },
];

// ─── Style maps ───────────────────────────────────────────────────────────────

interface ColorPair { c: string; bg: string; }

const TYPE_C: Record<EvtType, ColorPair> = {
  AUTH:      { c: "var(--color-hex-a0a0a0)", bg: "var(--color-hex-111111)" },
  MISSION:   { c: "var(--color-hex-e31b23)", bg: "var(--color-hex-120608)" },
  EXECUTION: { c: "var(--color-hex-666666)", bg: "var(--color-hex-0d0d0d)" },
  ESCALATION:{ c: "var(--color-hex-d29922)", bg: "var(--color-hex-110e00)" },
  SYSTEM:    { c: "var(--color-hex-3fb950)", bg: "var(--color-hex-061a0c)" },
  CONFIG:    { c: "var(--color-hex-a0a0a0)", bg: "var(--color-hex-111111)" },
};

const RESULT_C: Record<ResultValue, string> = {
  SUCCESS: "var(--color-hex-3fb950)",
  FAILURE: "var(--color-hex-ff2a32)",
  WARNING: "var(--color-hex-d29922)",
};

// ─── Filter options ───────────────────────────────────────────────────────────

const TYPE_FILTERS = ["ALL", "AUTH", "MISSION", "EXECUTION", "ESCALATION", "SYSTEM", "CONFIG"] as const;
type TypeFilter = typeof TYPE_FILTERS[number];

const RESULT_FILTERS = ["ALL", "SUCCESS", "FAILURE", "WARNING"] as const;
type ResultFilter = typeof RESULT_FILTERS[number];

const TABLE_HEADERS = ["ID", "TIMESTAMP", "TYPE", "ACTOR", "ACTION", "RESOURCE", "RESULT"] as const;

// ─── Detail drawer field definition ──────────────────────────────────────────

interface DrawerField { k: string; v: string; c?: string; }

function drawerFields(sel: AuditEntry): DrawerField[] {
  return [
    { k: "TYPE",      v: sel.type,     c: TYPE_C[sel.type].c },
    { k: "ACTOR",     v: sel.actor },
    { k: "ACTION",    v: sel.action },
    { k: "RESOURCE",  v: sel.resource },
    { k: "RESULT",    v: sel.result,   c: RESULT_C[sel.result] },
    { k: "IP / SOURCE", v: sel.ip },
    { k: "DETAIL",    v: sel.detail },
  ];
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AuditLogPage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
  const [resultFilter, setResultFilter] = useState<ResultFilter>("ALL");
  const [sel, setSel] = useState<AuditEntry | null>(null);
  const [search, setSearch] = useState("");

  const visible = ENTRIES.filter(
    (e) =>
      (typeFilter === "ALL" || e.type === typeFilter) &&
      (resultFilter === "ALL" || e.result === resultFilter) &&
      (!search ||
        e.action.includes(search.toUpperCase()) ||
        e.actor.toLowerCase().includes(search.toLowerCase()) ||
        e.resource.toLowerCase().includes(search.toLowerCase())),
  );

  function toggleSel(entry: AuditEntry) {
    setSel((prev) => (prev?.id === entry.id ? null : entry));
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-[var(--color-hex-1e1e1e)]">
        <div className="page-eyebrow">SYSTEM</div>
        <div className="flex items-baseline justify-between">
          <h1 className="text-[20px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.12em]">
            AUDIT LOG
          </h1>
          <div className="flex items-center gap-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH…"
              aria-label="Search audit log"
              className="bg-[var(--color-hex-0d0d0d)] border border-[var(--color-hex-1e1e1e)] rounded-[2px] py-[4px] px-[10px] text-[9px] text-[var(--color-hex-a0a0a0)] outline-none tracking-[0.08em] w-[160px] focus:border-[var(--color-hex-e31b23)] transition-colors duration-100"
            />
            <span className="text-[8.5px] text-[var(--color-hex-333333)] tracking-[0.12em]">
              {visible.length} EVENTS
            </span>
          </div>
        </div>
      </div>

      {/* Filter strip */}
      <div
        className="flex-shrink-0 flex flex-wrap items-center gap-3 px-6 py-2 bg-[var(--color-hex-0a0a0a)] border-b border-[var(--color-hex-141414)]"
      >
        {/* Type filters */}
        <div className="flex gap-1" role="group" aria-label="Filter by event type">
          {TYPE_FILTERS.map((t) => {
            const active = typeFilter === t;
            const cc = TYPE_C[t as EvtType];
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                aria-pressed={active}
                className="text-[7.5px] tracking-[0.12em] py-[2px] px-[8px] rounded-[2px] cursor-pointer transition-colors duration-100"
                style={{
                  background: active ? cc?.bg ?? "var(--color-hex-120608)" : "transparent",
                  border: `1px solid ${active ? cc?.c ?? "var(--color-hex-e31b23)" : "var(--color-hex-1e1e1e)"}`,
                  color: active ? cc?.c ?? "var(--color-hex-e31b23)" : "var(--color-hex-444444)",
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="w-[1px] h-[16px] bg-[var(--color-hex-1e1e1e)]" aria-hidden="true" />

        {/* Result filters */}
        <div className="flex gap-1" role="group" aria-label="Filter by result">
          {RESULT_FILTERS.map((r) => {
            const active = resultFilter === r;
            const color = RESULT_C[r as ResultValue];
            return (
              <button
                key={r}
                onClick={() => setResultFilter(r)}
                aria-pressed={active}
                className="text-[7.5px] tracking-[0.12em] py-[2px] px-[8px] bg-transparent rounded-[2px] cursor-pointer transition-colors duration-100"
                style={{
                  border: `1px solid ${active ? color ?? "var(--color-hex-e31b23)" : "var(--color-hex-1e1e1e)"}`,
                  color: active ? color ?? "var(--color-hex-e31b23)" : "var(--color-hex-444444)",
                }}
              >
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* Table + detail drawer */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--color-hex-0f0f0f)] sticky top-0 z-10">
                {TABLE_HEADERS.map((h) => (
                  <th
                    key={h}
                    className="py-[5px] px-[12px] text-left text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.16em] font-semibold whitespace-nowrap border-b border-[var(--color-hex-1a1a1a)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => {
                const tc = TYPE_C[e.type];
                const rc = RESULT_C[e.result];
                const isSelected = sel?.id === e.id;
                return (
                  <tr
                    key={e.id}
                    onClick={() => toggleSel(e)}
                    className={[
                      "cursor-pointer border-b border-[var(--color-hex-0e0e0e)] transition-colors duration-75",
                      isSelected
                        ? "bg-[var(--color-hex-0d0d0d)]"
                        : "hover:bg-[var(--color-hex-0a0a0a)]",
                    ].join(" ")}
                  >
                    <td className="py-[7px] px-[12px] text-[var(--color-hex-333333)] text-[8.5px]">
                      {e.id}
                    </td>
                    <td className="py-[7px] px-[12px] text-[var(--color-hex-333333)] text-[8.5px] whitespace-nowrap">
                      {e.ts}
                    </td>
                    <td className="py-[7px] px-[12px]">
                      <span
                        className="text-[8px] rounded-[2px] py-[1px] px-[5px] tracking-[0.1em] font-semibold"
                        style={{
                          color: tc.c,
                          background: tc.bg,
                          border: `1px solid ${tc.c}33`,
                        }}
                      >
                        {e.type}
                      </span>
                    </td>
                    <td className="py-[7px] px-[12px] text-[var(--color-hex-666666)] text-[9px] tracking-[0.04em]">
                      {e.actor}
                    </td>
                    <td className="py-[7px] px-[12px] text-[var(--color-hex-a0a0a0)] text-[9px] tracking-[0.04em] font-semibold">
                      {e.action}
                    </td>
                    <td className="py-[7px] px-[12px] text-[var(--color-hex-444444)] text-[9px]">
                      {e.resource}
                    </td>
                    <td className="py-[7px] px-[12px]">
                      <span
                        className="text-[8.5px] tracking-[0.1em] font-semibold"
                        style={{ color: rc }}
                      >
                        {e.result}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Detail drawer */}
        {sel && (
          <div className="flex-shrink-0 flex flex-col overflow-y-auto w-[300px] bg-[var(--color-hex-0d0d0d)] border-l border-[var(--color-hex-292929)]">
            <div className="flex justify-between items-start px-4 pt-4 pb-3 border-b border-[var(--color-hex-1e1e1e)]">
              <div>
                <div className="text-[11px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.1em]">
                  {sel.id}
                </div>
                <div className="text-[8.5px] text-[var(--color-hex-444444)] mt-[2px]">
                  {sel.ts}
                </div>
              </div>
              <button
                onClick={() => setSel(null)}
                aria-label="Close detail drawer"
                className="text-[var(--color-hex-444444)] bg-transparent border-none cursor-pointer text-[14px] hover:text-[var(--color-hex-a0a0a0)] transition-colors duration-100"
              >
                ✕
              </button>
            </div>

            <div className="px-4 py-4 flex flex-col gap-4">
              {drawerFields(sel).map((row) => (
                <div key={row.k}>
                  <div className="text-[7.5px] text-[var(--color-hex-444444)] tracking-[0.18em] mb-[3px]">
                    {row.k}
                  </div>
                  <div
                    className="text-[10px] leading-[1.6]"
                    style={{ color: row.c ?? "var(--color-hex-888888)" }}
                  >
                    {row.v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}