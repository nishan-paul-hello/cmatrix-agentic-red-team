import { EORD_LABELS } from "../lib/constants";

interface DrawerNode {
  id: string; type: string; status: string;
  ucb: number; eord: number; vulnClass: string;
}

const NODE_DETAIL: Record<string, {
  intent: string;
  prerequisites: { id: string; done: boolean }[];
  enables: string[];
  facts: { k: string; v: string }[];
}> = {
  "SQLI-001": {
    intent: "Exploit time-based blind SQL injection in /api/users via id parameter",
    prerequisites: [{ id: "AUTH-001", done: true }, { id: "RECON-004", done: true }],
    enables: ["DB-ACCESS-002", "RCE-007"],
    facts: [
      { k: "ENDPOINT",   v: "GET /api/users" },
      { k: "PARAMETER",  v: "id (integer, unsanitised)" },
      { k: "AUTH STATE", v: "SESSION admin@targetcorp.com" },
      { k: "TECH",       v: "Flask 2.3 / SQLite 3.39" },
      { k: "EVIDENCE",   v: "HTTP 500 on id=1' observed (E_ord 3)" },
    ],
  },
  "AUTH-001": {
    intent: "Exploit authentication bypass on /api/auth/login",
    prerequisites: [{ id: "RECON-001", done: true }],
    enables: ["SQLI-001", "XSS-002", "CSRF-003"],
    facts: [
      { k: "ENDPOINT",   v: "POST /api/auth/login" },
      { k: "PARAMETER",  v: "username, password" },
      { k: "AUTH STATE", v: "UNAUTHENTICATED" },
      { k: "EVIDENCE",   v: "Default admin credentials accepted (E_ord 4)" },
    ],
  },
  "RECON-001": {
    intent: "Enumerate attack surface via spider, port scan, technology fingerprint",
    prerequisites: [],
    enables: ["AUTH-001", "ENUM-002"],
    facts: [
      { k: "TARGET",   v: "app.targetcorp.com" },
      { k: "METHOD",   v: "nmap + spider" },
      { k: "TECH",     v: "nginx/1.24, Flask 2.3, PostgreSQL 14" },
      { k: "EVIDENCE", v: "12 endpoints discovered (E_ord 5)" },
    ],
  },
};

const DEFAULT_DETAIL = {
  intent: "Investigate target node for exploitable vulnerabilities.",
  prerequisites: [] as { id: string; done: boolean }[],
  enables: [] as string[],
  facts: [] as { k: string; v: string }[],
};

export default function VDGNodeDrawer({ node, onClose }: { node: DrawerNode; onClose: () => void }) {
  const detail = NODE_DETAIL[node.id] ?? DEFAULT_DETAIL;
  const statusColor = node.status === "ELIGIBLE" ? "#FF2A32" : node.status === "EXPLOITED" ? "#E31B23" : node.status === "IN_PROGRESS" ? "#FF2A32" : "#A0A0A0";
  const statusBg = ["ELIGIBLE", "EXPLOITED", "IN_PROGRESS"].includes(node.status) ? "#1A0608" : "#111111";
  const statusBorder = ["ELIGIBLE", "EXPLOITED", "IN_PROGRESS"].includes(node.status) ? "#6F171B" : "#292929";

  return (
    <div className="flex flex-col h-full" style={{ width: 320, borderLeft: "1px solid #292929", background: "#0D0D0D", flexShrink: 0 }}>
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3" style={{ borderBottom: "1px solid #1E1E1E" }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F2F2F2", letterSpacing: "0.12em" }}>{node.id}</span>
            <span style={{ fontSize: 8.5, color: statusColor, background: statusBg, border: `1px solid ${statusBorder}`, borderRadius: 2, padding: "1px 6px", letterSpacing: "0.14em", fontWeight: 600 }}>{node.status}</span>
          </div>
          <div style={{ fontSize: 9, color: "#6F171B", letterSpacing: "0.18em" }}>{node.type}</div>
        </div>
        <button onClick={onClose} style={{ fontSize: 14, color: "#444444", background: "transparent", border: "none", cursor: "pointer", lineHeight: 1, padding: 2 }} onMouseEnter={e => e.currentTarget.style.color = "#A0A0A0"} onMouseLeave={e => e.currentTarget.style.color = "#444444"}>✕</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Attack intent */}
        <Section label="ATTACK INTENT">
          <p style={{ fontSize: 10, color: "#666666", letterSpacing: "0.04em", lineHeight: 1.7 }}>{detail.intent}</p>
        </Section>

        {/* Stat grid */}
        <Section label="SCORES & METRICS">
          <div className="grid grid-cols-2 gap-0" style={{ border: "1px solid #1E1E1E", borderRadius: 2, overflow: "hidden" }}>
            {[
              { k: "UCB SCORE",    v: node.ucb > 0 ? node.ucb.toFixed(3) : "—", red: true  },
              { k: "PATH SCORE",   v: "0.612", red: false },
              { k: "PROMISE φ",    v: "0.81",  red: false },
              { k: "DIFFICULTY δ", v: "0.32",  red: false },
              { k: "E_ord",        v: `${node.eord} / 5`, red: true  },
              { k: "EPSS PRIOR",   v: "0.42",  red: false },
              { k: "RETRY",        v: "1 / 3", red: false },
              { k: "COST EST.",    v: "$0.18", red: false },
            ].map((r, i) => (
              <div key={r.k} style={{ padding: "7px 10px", borderRight: i % 2 === 0 ? "1px solid #1A1A1A" : "none", borderBottom: i < 6 ? "1px solid #1A1A1A" : "none", background: i % 2 === 0 ? "#0D0D0D" : "#0B0B0B" }}>
                <div style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.16em", marginBottom: 2 }}>{r.k}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: r.red ? "#E31B23" : "#A0A0A0" }}>{r.v}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* E_ord indicator */}
        <Section label="EVIDENCE LEVEL">
          <EOrdIndicator value={node.eord} />
        </Section>

        {/* Prerequisites */}
        <Section label="PREREQUISITES">
          <div className="flex flex-col gap-1.5">
            {detail.prerequisites.length === 0
              ? <span style={{ fontSize: 10, color: "#333333", letterSpacing: "0.08em" }}>None</span>
              : detail.prerequisites.map(p => (
              <div key={p.id} className="flex items-center gap-2">
                <span style={{ color: p.done ? "#3FB950" : "#444444", fontSize: 10 }}>{p.done ? "✓" : "○"}</span>
                <span style={{ fontSize: 10, color: p.done ? "#A0A0A0" : "#444444", letterSpacing: "0.08em" }}>{p.id}</span>
                <span style={{ fontSize: 8, color: p.done ? "#3FB950" : "#333333", letterSpacing: "0.12em", marginLeft: "auto" }}>{p.done ? "SATISFIED" : "PENDING"}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Enables */}
        <Section label="ENABLES">
          <div className="flex flex-col gap-1.5">
            {detail.enables.length === 0
              ? <span style={{ fontSize: 10, color: "#333333", letterSpacing: "0.08em" }}>None</span>
              : detail.enables.map(id => (
              <div key={id} className="flex items-center gap-2">
                <span style={{ fontSize: 9, color: "#E31B23" }}>→</span>
                <span style={{ fontSize: 10, color: "#666666", letterSpacing: "0.08em" }}>{id}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Source EL facts */}
        <Section label="SOURCE ENVIRONMENT FACTS">
          <div className="flex flex-col gap-0" style={{ border: "1px solid #1E1E1E", borderRadius: 2, overflow: "hidden" }}>
            {detail.facts.length === 0
              ? <div style={{ padding: "6px 10px", fontSize: 9, color: "#333333" }}>No facts available</div>
              : detail.facts.map((r, i, a) => (
              <div key={r.k} className="flex gap-3" style={{ padding: "6px 10px", borderBottom: i < a.length - 1 ? "1px solid #141414" : "none", background: "#0B0B0B" }}>
                <span style={{ fontSize: 8.5, color: "#444444", letterSpacing: "0.14em", minWidth: 72, flexShrink: 0 }}>{r.k}</span>
                <span style={{ fontSize: 9, color: "#666666", letterSpacing: "0.04em", lineHeight: 1.4 }}>{r.v}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Timeline */}
        <Section label="NODE LIFECYCLE" last>
          <div className="flex flex-col gap-0">
            {[
              { ts: "06:12:04", event: "CANDIDATE",   color: "#444444" },
              { ts: "06:18:31", event: "ELIGIBLE",     color: "#E31B23" },
              { ts: "06:28:47", event: "IN_PROGRESS",  color: "#FF2A32" },
              { ts: "06:29:03", event: "RETRY 1",      color: "#D29922" },
              { ts: "06:30:58", event: "IN_PROGRESS",  color: "#FF2A32" },
            ].map((t, i, a) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex flex-col items-center" style={{ flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", border: `1px solid ${t.color}`, background: i === a.length - 1 ? t.color : "transparent", marginTop: 2 }} />
                  {i < a.length - 1 && <div style={{ width: 1, height: 18, background: "#1E1E1E" }} />}
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 8.5, color: "#333333", letterSpacing: "0.06em" }}>{t.ts}</span>
                  <span style={{ fontSize: 9, color: t.color, letterSpacing: "0.12em", fontWeight: 600 }}>{t.event}</span>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ label, children, last }: { label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className="px-4 py-3" style={{ borderBottom: last ? "none" : "1px solid #141414" }}>
      <div style={{ fontSize: 8, color: "#444444", letterSpacing: "0.22em", marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

function EOrdIndicator({ value }: { value: number }) {
  return (
    <div>
      <div className="flex items-end justify-between" style={{ position: "relative", paddingBottom: 20 }}>
        {/* track */}
        <div style={{ position: "absolute", top: 6, left: 4, right: 4, height: 1, background: "#292929" }} />
        {/* filled */}
        <div style={{ position: "absolute", top: 6, left: 4, width: `${(value / 5) * 92}%`, height: 1, background: "#E31B23" }} />
        {EORD_LABELS.map((lbl, i) => (
          <div key={lbl} className="flex flex-col items-center" style={{ zIndex: 1 }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, border: `1px solid ${i <= value ? "#E31B23" : "#292929"}`, background: i < value ? "#E31B23" : i === value ? "#FF2A32" : "transparent", marginBottom: 2 }} />
            {i === value && <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "5px solid #FF2A32", position: "absolute", top: 10 }} />}
            <span style={{ fontSize: 6.5, color: i === value ? "#E31B23" : "#333333", letterSpacing: "0.1em", marginTop: 14, whiteSpace: "nowrap" }}>{lbl}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 8.5, color: "#666666", letterSpacing: "0.1em", marginTop: 4 }}>Current: <span style={{ color: "#E31B23" }}>E_ord {value} — {EORD_LABELS[value]}</span></div>
    </div>
  );
}
