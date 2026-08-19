import { useState } from "react";

type ELTab = "ENDPOINTS" | "SERVICES" | "HOSTS" | "CREDENTIALS" | "AUTH STATES" | "PARAMETERS" | "CVE CANDIDATES" | "FINDINGS" | "EVIDENCE" | "FAILURES";
const TABS: ELTab[] = ["ENDPOINTS","SERVICES","HOSTS","CREDENTIALS","AUTH STATES","PARAMETERS","CVE CANDIDATES","FINDINGS","EVIDENCE","FAILURES"];

const ENDPOINTS = [
  { endpoint: "GET /api/users",          method: "GET",    auth: "SESSION",  params: "id, limit, offset",   source: "SPIDER",    seen: "06:31:04" },
  { endpoint: "POST /api/auth/login",    method: "POST",   auth: "NONE",     params: "username, password",  source: "MANUAL",    seen: "06:12:18" },
  { endpoint: "GET /api/users/:id",      method: "GET",    auth: "SESSION",  params: "id (path)",           source: "SPIDER",    seen: "06:31:04" },
  { endpoint: "DELETE /api/users/:id",   method: "DELETE", auth: "ADMIN",    params: "id (path)",           source: "SPIDER",    seen: "06:29:44" },
  { endpoint: "GET /admin/dashboard",    method: "GET",    auth: "ADMIN",    params: "—",                   source: "SPIDER",    seen: "06:14:02" },
  { endpoint: "POST /api/upload",        method: "POST",   auth: "SESSION",  params: "file, type",          source: "SPIDER",    seen: "06:22:31" },
  { endpoint: "GET /api/products",       method: "GET",    auth: "NONE",     params: "category, sort",      source: "SPIDER",    seen: "06:31:04" },
  { endpoint: "PUT /api/users/:id",      method: "PUT",    auth: "SESSION",  params: "id, body (JSON)",     source: "SPIDER",    seen: "06:30:11" },
  { endpoint: "GET /api/orders",         method: "GET",    auth: "SESSION",  params: "user_id, status",     source: "SPIDER",    seen: "06:28:59" },
  { endpoint: "POST /api/password/reset",method: "POST",   auth: "NONE",     params: "email, token",        source: "INFERENCE", seen: "06:19:43" },
  { endpoint: "GET /static/config.json", method: "GET",    auth: "NONE",     params: "—",                   source: "SPIDER",    seen: "06:16:07" },
  { endpoint: "POST /api/graphql",       method: "POST",   auth: "SESSION",  params: "query, variables",    source: "SPIDER",    seen: "06:25:33" },
];

const SERVICES = [
  { host: "app.targetcorp.com", port: "443",  service: "HTTPS",      version: "nginx/1.24.0",     banner: "nginx",              status: "OPEN"   },
  { host: "app.targetcorp.com", port: "80",   service: "HTTP",       version: "nginx/1.24.0",     banner: "→ 443 redirect",     status: "OPEN"   },
  { host: "app.targetcorp.com", port: "22",   service: "SSH",        version: "OpenSSH 8.9p1",    banner: "SSH-2.0-OpenSSH_8.9",status: "OPEN"   },
  { host: "app.targetcorp.com", port: "5432", service: "POSTGRESQL", version: "PostgreSQL 14.8",  banner: "—",                  status: "FILTERED"},
  { host: "app.targetcorp.com", port: "6379", service: "REDIS",      version: "Redis 7.0.11",     banner: "—",                  status: "FILTERED"},
  { host: "app.targetcorp.com", port: "8080", service: "HTTP-ALT",   version: "Gunicorn 20.1.0",  banner: "Gunicorn/20.1",      status: "OPEN"   },
  { host: "app.targetcorp.com", port: "3306", service: "MYSQL",      version: "—",                banner: "—",                  status: "CLOSED" },
  { host: "app.targetcorp.com", port: "25",   service: "SMTP",       version: "—",                banner: "—",                  status: "CLOSED" },
];

const HOSTS = [
  {
    id: "HOST-01", ip: "10.0.0.10", hostname: "app.targetcorp.com",
    role: "WEB APPLICATION SERVER", os: "Ubuntu 22.04 LTS",
    services: ["HTTPS :443","HTTP :80","SSH :22","HTTP-ALT :8080"],
    status: "CONFIRMED", eord: 4,
    edges: [{ to: "HOST-02", label: "credential", detail: "admin / SSH key", eord: 4 }],
  },
  {
    id: "HOST-02", ip: "10.0.0.20", hostname: "db.targetcorp.internal",
    role: "DATABASE SERVER", os: "Ubuntu 20.04 LTS",
    services: ["POSTGRESQL :5432","SSH :22"],
    status: "DISCOVERED", eord: 3,
    edges: [{ to: "HOST-03", label: "network trust", detail: "subnet ACL — no auth", eord: 3 }],
  },
  {
    id: "HOST-03", ip: "10.0.0.30", hostname: "mgmt.targetcorp.internal",
    role: "MANAGEMENT / BASTION", os: "CentOS 7",
    services: ["SSH :22","RDP :3389"],
    status: "INFERRED", eord: 2,
    edges: [],
  },
];

const EORD_COLOR: Record<number, string> = { 5: "#FF2A32", 4: "#E31B23", 3: "#D29922", 2: "#666666", 1: "#444444", 0: "#333333" };
const STATUS_BADGE: Record<string, { color: string; bg: string; border: string }> = {
  CONFIRMED:  { color: "#3FB950", bg: "#0A1A10", border: "#1A4A2044" },
  DISCOVERED: { color: "#D29922", bg: "#1A1200", border: "#D2992244" },
  INFERRED:   { color: "#666666", bg: "#111111", border: "#33333344" },
};

function HostTopology() {
  const [selected, setSelected] = useState<string | null>("HOST-01");
  const sel = HOSTS.find(h => h.id === selected);

  return (
    <div className="flex h-full" style={{ minHeight: 0 }}>
      {/* Topology diagram */}
      <div className="flex flex-col flex-1 overflow-y-auto px-10 py-8" style={{ borderRight: "1px solid #1E1E1E" }}>
        <div className="flex items-center gap-3 mb-6">
          <span style={{ fontSize: 8.5, color: "#3FB950", background: "#0A1A10", border: "1px solid #1A4A2044", borderRadius: 2, padding: "2px 8px", letterSpacing: "0.16em" }}>CONFIRMED TOPOLOGY</span>
          <span style={{ fontSize: 8, color: "#444444", letterSpacing: "0.14em" }}>SOURCE: NMAP + CREDENTIAL REUSE · E_ord ≥ 3</span>
        </div>

        <div className="flex flex-col items-start" style={{ gap: 0 }}>
          {HOSTS.map((host, i) => {
            const isSel = selected === host.id;
            const sb = STATUS_BADGE[host.status];
            return (
              <div key={host.id} className="flex flex-col items-start">
                {/* Host card */}
                <button
                  onClick={() => setSelected(isSel ? null : host.id)}
                  className="flex items-start gap-4 text-left"
                  style={{
                    background: isSel ? "#120608" : "#0D0D0D",
                    border: `1px solid ${isSel ? "#E31B23" : "#292929"}`,
                    borderRadius: 2,
                    padding: "14px 18px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    width: 480,
                    transition: "border-color 0.1s, background 0.1s",
                  }}
                  onMouseEnter={e => { if (!isSel) { e.currentTarget.style.borderColor = "#444444"; e.currentTarget.style.background = "#111111"; } }}
                  onMouseLeave={e => { if (!isSel) { e.currentTarget.style.borderColor = "#292929"; e.currentTarget.style.background = "#0D0D0D"; } }}
                >
                  {/* Left: id + status dot */}
                  <div className="flex flex-col items-center gap-1.5 flex-shrink-0" style={{ paddingTop: 2 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, border: `1px solid ${isSel ? "#E31B23" : "#333333"}`, background: isSel ? "#E31B23" : "#151515" }} />
                    <span style={{ fontSize: 8, color: isSel ? "#E31B23" : "#444444", letterSpacing: "0.1em", fontWeight: 700 }}>{host.id}</span>
                  </div>

                  {/* Center: details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span style={{ fontSize: 11, fontWeight: 700, color: isSel ? "#F2F2F2" : "#888888", letterSpacing: "0.08em" }}>{host.ip}</span>
                      <span style={{ fontSize: 9, color: "#555555" }}>·</span>
                      <span style={{ fontSize: 10, color: isSel ? "#A0A0A0" : "#555555", letterSpacing: "0.04em" }}>{host.hostname}</span>
                    </div>
                    <div style={{ fontSize: 9, color: "#444444", letterSpacing: "0.14em", marginBottom: 8 }}>{host.role}</div>
                    <div className="flex flex-wrap gap-1">
                      {host.services.map(s => (
                        <span key={s} style={{ fontSize: 8, color: "#555555", background: "#111111", border: "1px solid #1E1E1E", borderRadius: 2, padding: "1px 5px", letterSpacing: "0.08em" }}>{s}</span>
                      ))}
                    </div>
                  </div>

                  {/* Right: status + eord */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span style={{ fontSize: 8, color: sb.color, background: sb.bg, border: `1px solid ${sb.border}`, borderRadius: 2, padding: "1px 6px", letterSpacing: "0.14em", fontWeight: 600 }}>{host.status}</span>
                    <div className="flex items-center gap-1">
                      <span style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.12em" }}>E_ord</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: EORD_COLOR[host.eord] }}>{host.eord}/5</span>
                    </div>
                    <span style={{ fontSize: 8, color: "#333333", letterSpacing: "0.1em" }}>{host.os}</span>
                  </div>
                </button>

                {/* Edge connector to next host */}
                {host.edges.map(edge => (
                  <div key={edge.to} className="flex items-stretch" style={{ marginLeft: 28 }}>
                    {/* Vertical line */}
                    <div style={{ width: 1, background: "#292929", margin: "0 0 0 4px", flexShrink: 0 }} />
                    {/* Edge label */}
                    <div className="flex flex-col justify-center" style={{ paddingLeft: 16, paddingTop: 6, paddingBottom: 6 }}>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: 8, color: "#E31B23", letterSpacing: "0.1em" }}>→</span>
                        <span style={{ fontSize: 9, color: "#555555", letterSpacing: "0.1em", fontWeight: 600 }}>{edge.label.toUpperCase()}</span>
                        <span style={{ fontSize: 8, color: "#333333", letterSpacing: "0.08em" }}>{edge.detail}</span>
                        <span style={{ fontSize: 7.5, color: EORD_COLOR[edge.eord], letterSpacing: "0.1em" }}>E_ord {edge.eord}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>

        {/* Caption */}
        <div className="mt-8 flex items-start gap-2" style={{ background: "#0B0B0B", border: "1px solid #1E1E1E", borderRadius: 2, padding: "10px 14px", maxWidth: 480 }}>
          <span style={{ fontSize: 10, color: "#E31B23", flexShrink: 0 }}>ⓘ</span>
          <span style={{ fontSize: 9, color: "#444444", letterSpacing: "0.06em", lineHeight: 1.7 }}>
            Topology represents <strong style={{ color: "#666666" }}>confirmed facts</strong> from the Environmental Layer only. Dashed edges are inferred from network scan data and have not been directly observed. This diagram is not the VDG attack graph.
          </span>
        </div>
      </div>

      {/* Right: host detail panel */}
      <div className="flex-shrink-0 overflow-y-auto" style={{ width: 280, background: "#0B0B0B" }}>
        {sel ? (
          <>
            <div className="px-5 pt-5 pb-4" style={{ borderBottom: "1px solid #1E1E1E" }}>
              <div style={{ fontSize: 8, color: "#444444", letterSpacing: "0.2em", marginBottom: 6 }}>HOST DETAIL</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F2F2F2", letterSpacing: "0.1em", marginBottom: 2 }}>{sel.ip}</div>
              <div style={{ fontSize: 9, color: "#E31B23", letterSpacing: "0.14em" }}>{sel.id}</div>
            </div>
            <div className="flex flex-col px-5 py-4 gap-3" style={{ borderBottom: "1px solid #1E1E1E" }}>
              {[
                { k: "HOSTNAME", v: sel.hostname },
                { k: "ROLE",     v: sel.role     },
                { k: "OS",       v: sel.os       },
                { k: "STATUS",   v: sel.status   },
                { k: "E_ord",    v: `${sel.eord} / 5` },
              ].map(r => (
                <div key={r.k}>
                  <div style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.18em", marginBottom: 1 }}>{r.k}</div>
                  <div style={{ fontSize: 10, color: "#888888", letterSpacing: "0.06em" }}>{r.v}</div>
                </div>
              ))}
            </div>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #1E1E1E" }}>
              <div style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.2em", marginBottom: 8 }}>OPEN SERVICES</div>
              <div className="flex flex-col gap-1.5">
                {sel.services.map(s => (
                  <div key={s} className="flex items-center gap-2">
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#3FB950", flexShrink: 0 }} />
                    <span style={{ fontSize: 9.5, color: "#666666", letterSpacing: "0.06em" }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
            {sel.edges.length > 0 && (
              <div className="px-5 py-4">
                <div style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.2em", marginBottom: 8 }}>LATERAL EDGES</div>
                {sel.edges.map(e => (
                  <div key={e.to} style={{ background: "#0D0D0D", border: "1px solid #1E1E1E", borderRadius: 2, padding: "8px 10px" }}>
                    <div style={{ fontSize: 9, color: "#E31B23", letterSpacing: "0.1em", marginBottom: 3 }}>→ {e.to}</div>
                    <div style={{ fontSize: 8.5, color: "#555555", letterSpacing: "0.06em", marginBottom: 2 }}>{e.label}</div>
                    <div style={{ fontSize: 8, color: "#444444", letterSpacing: "0.06em" }}>{e.detail}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full" style={{ color: "#222222", fontSize: 10, letterSpacing: "0.16em" }}>SELECT A HOST</div>
        )}
      </div>
    </div>
  );
}

const CREDS = [
  { username: "admin",           hash: "5f4dcc3b5aa765d61d8327deb882cf99", source: "DB DUMP /api/users",        scope: "ADMIN",   status: "CRACKED",    plain: "password123" },
  { username: "john.doe",        hash: "482c811da5d5b4bc6d497ffa98491e38", source: "RESPONSE BODY /api/users/1", scope: "USER",    status: "CRACKED",    plain: "password!1"  },
  { username: "sarah.admin",     hash: "e10adc3949ba59abbe56e057f20f883e", source: "DB DUMP /api/users",        scope: "ADMIN",   status: "CRACKED",    plain: "123456"      },
  { username: "api_service",     hash: "d8578edf8458ce06fbc5bb76a58c5ca4", source: "CONFIG /static/config.json", scope: "SERVICE", status: "CRACKED",    plain: "qwerty"      },
  { username: "backup_user",     hash: "1a1dc91c907325c69271ddf0c944bc72", source: "DB DUMP /api/users",        scope: "USER",    status: "UNCRACKED",  plain: ""            },
  { username: "monitor",         hash: "3fc0a7acf087f549ac2b266baf94b8b1", source: "NMAP BANNER :6379",         scope: "SERVICE", status: "UNCRACKED",  plain: ""            },
];

function CredentialsPanel() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const toggle = (u: string) => setRevealed(p => { const n = new Set(p); n.has(u) ? n.delete(u) : n.add(u); return n; });
  return (
    <>
      <div className="flex items-center justify-between px-6 py-2" style={{ borderBottom: "1px solid #1E1E1E", background: "#0B0B0B" }}>
        <span style={{ fontSize: 8.5, color: "#444444", letterSpacing: "0.16em" }}>{CREDS.length} CREDENTIALS EXTRACTED · SOURCE: DB DUMP + RESPONSE BODY · OBSERVED</span>
        <span style={{ fontSize: 8, color: "#D29922", letterSpacing: "0.14em" }}>4 CRACKED · 2 UNCRACKED</span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
        <thead>
          <tr style={{ background: "#0F0F0F" }}>
            {["USERNAME","PASSWORD / HASH","SOURCE","SCOPE","STATUS",""].map(h => (
              <th key={h} style={{ padding: "6px 16px", textAlign: "left", fontSize: 8, color: "#444444", letterSpacing: "0.18em", borderBottom: "1px solid #1A1A1A", whiteSpace: "nowrap", fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CREDS.map((row) => {
            const isRev = revealed.has(row.username);
            const cracked = row.status === "CRACKED";
            return (
              <tr key={row.username} style={{ borderBottom: "1px solid #111111" }}
                onMouseEnter={e => e.currentTarget.style.background="#0F0F0F"}
                onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                <td style={{ padding: "8px 16px", color: "#A0A0A0", fontWeight: 600, letterSpacing: "0.06em" }}>{row.username}</td>
                <td style={{ padding: "8px 16px" }}>
                  {isRev && cracked
                    ? <span style={{ color: "#E31B23", letterSpacing: "0.06em" }}>{row.plain}</span>
                    : <span style={{ color: "#333333", letterSpacing: "0.12em", fontFamily: "inherit" }}>{"●".repeat(12)}</span>}
                  {!cracked && <span style={{ fontSize: 9, color: "#333333", marginLeft: 8, letterSpacing: "0.06em" }}>{row.hash.slice(0,16)}…</span>}
                </td>
                <td style={{ padding: "8px 16px", color: "#444444", fontSize: 9 }}>{row.source}</td>
                <td style={{ padding: "8px 16px" }}>
                  <span style={{ fontSize: 9, color: row.scope === "ADMIN" ? "#E31B23" : row.scope === "SERVICE" ? "#D29922" : "#666666", letterSpacing: "0.12em" }}>{row.scope}</span>
                </td>
                <td style={{ padding: "8px 16px" }}>
                  <span style={{ fontSize: 9, color: cracked ? "#3FB950" : "#555555", letterSpacing: "0.12em", fontWeight: 600 }}>{row.status}</span>
                </td>
                <td style={{ padding: "8px 16px" }}>
                  {cracked && (
                    <button onClick={() => toggle(row.username)}
                      style={{ fontSize: 8.5, color: "#666666", background: "#111111", border: "1px solid #292929", borderRadius: 2, padding: "2px 8px", letterSpacing: "0.12em", cursor: "pointer", fontFamily: "inherit" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor="#E31B23"}
                      onMouseLeave={e => e.currentTarget.style.borderColor="#292929"}>
                      {isRev ? "HIDE" : "REVEAL"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

const METHOD_COLOR: Record<string, string> = { GET: "#3FB950", POST: "#D29922", PUT: "#8B8B8B", DELETE: "#FF2A32", PATCH: "#D29922" };
const STATUS_COLOR: Record<string, string> = { OPEN: "#3FB950", FILTERED: "#D29922", CLOSED: "#444444" };

export default function EnvironmentalLayer() {
  const [tab, setTab] = useState<ELTab>("ENDPOINTS");

  return (
    <div className="flex flex-col h-full" style={{ minHeight: 0 }}>
      {/* Header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-0" style={{ borderBottom: "1px solid #1E1E1E" }}>
        <div style={{ fontSize: 9, color: "#666666", letterSpacing: "0.22em", marginBottom: 3 }}>ENVIRONMENT</div>
        <div className="flex items-baseline gap-3 mb-3">
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#F2F2F2", letterSpacing: "0.12em" }}>ENVIRONMENTAL LAYER</h1>
          <span style={{ fontSize: 9, color: "#3FB950", background: "#0A1A10", border: "1px solid #1A4A20", borderRadius: 2, padding: "1px 7px", letterSpacing: "0.16em" }}>CONFIRMED</span>
        </div>
        {/* Tabs */}
        <div className="flex items-end gap-0" style={{ overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ fontSize: 9, letterSpacing: "0.14em", padding: "5px 12px", background: "transparent", border: "none", borderBottom: t===tab?"2px solid #E31B23":"2px solid transparent", color: t===tab?"#F2F2F2":"#444444", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap", marginBottom: -1 }}
              onMouseEnter={e => { if(t!==tab) e.currentTarget.style.color="#888888"; }}
              onMouseLeave={e => { if(t!==tab) e.currentTarget.style.color="#444444"; }}
            >{t}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {tab === "ENDPOINTS" && (
          <>
            <div className="flex items-center justify-between px-6 py-2" style={{ borderBottom: "1px solid #1E1E1E", background: "#0B0B0B" }}>
              <span style={{ fontSize: 8.5, color: "#444444", letterSpacing: "0.16em" }}>{ENDPOINTS.length} OBSERVED ENDPOINTS · SOURCE: SPIDER + INFERENCE · OBSERVED</span>
              <span style={{ fontSize: 8, color: "#3FB950", letterSpacing: "0.14em" }}>E_ord ≥ 3 — CLEAR</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
              <thead>
                <tr style={{ background: "#0F0F0F" }}>
                  {["ENDPOINT","METHOD","AUTH","PARAMETERS","SOURCE","LAST SEEN"].map(h => (
                    <th key={h} style={{ padding: "6px 16px", textAlign: "left", fontSize: 8, color: "#444444", letterSpacing: "0.18em", borderBottom: "1px solid #1A1A1A", whiteSpace: "nowrap", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ENDPOINTS.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #111111", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background="#0F0F0F"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding: "7px 16px", color: "#A0A0A0", fontFamily: "inherit", whiteSpace: "nowrap" }}>{row.endpoint}</td>
                    <td style={{ padding: "7px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 9, color: METHOD_COLOR[row.method] ?? "#666", background: `${METHOD_COLOR[row.method]}15`, border: `1px solid ${METHOD_COLOR[row.method]}33`, borderRadius: 2, padding: "1px 5px", letterSpacing: "0.1em", fontWeight: 600 }}>{row.method}</span>
                    </td>
                    <td style={{ padding: "7px 16px", color: "#555555", fontSize: 9.5, whiteSpace: "nowrap" }}>{row.auth}</td>
                    <td style={{ padding: "7px 16px", color: "#444444", fontSize: 9.5 }}>{row.params}</td>
                    <td style={{ padding: "7px 16px", color: "#333333", fontSize: 9, letterSpacing: "0.1em" }}>{row.source}</td>
                    <td style={{ padding: "7px 16px", color: "#333333", fontSize: 9, whiteSpace: "nowrap" }}>{row.seen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === "SERVICES" && (
          <>
            <div className="flex items-center justify-between px-6 py-2" style={{ borderBottom: "1px solid #1E1E1E", background: "#0B0B0B" }}>
              <span style={{ fontSize: 8.5, color: "#444444", letterSpacing: "0.16em" }}>{SERVICES.length} SERVICES DETECTED · SOURCE: NMAP 7.94 · DISCOVERED</span>
              <span style={{ fontSize: 8, color: "#3FB950", letterSpacing: "0.14em" }}>E_ord ≥ 4 — CONFIRMED</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
              <thead>
                <tr style={{ background: "#0F0F0F" }}>
                  {["HOST","PORT","SERVICE","VERSION","BANNER","STATUS"].map(h => (
                    <th key={h} style={{ padding: "6px 16px", textAlign: "left", fontSize: 8, color: "#444444", letterSpacing: "0.18em", borderBottom: "1px solid #1A1A1A", whiteSpace: "nowrap", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #111111", cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background="#0F0F0F"}
                    onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding: "7px 16px", color: "#666666", whiteSpace: "nowrap" }}>{row.host}</td>
                    <td style={{ padding: "7px 16px", color: "#A0A0A0", fontWeight: 700, textAlign: "right" }}>{row.port}</td>
                    <td style={{ padding: "7px 16px", color: "#A0A0A0", letterSpacing: "0.08em" }}>{row.service}</td>
                    <td style={{ padding: "7px 16px", color: "#555555", fontSize: 9.5 }}>{row.version}</td>
                    <td style={{ padding: "7px 16px", color: "#444444", fontSize: 9 }}>{row.banner}</td>
                    <td style={{ padding: "7px 16px", whiteSpace: "nowrap" }}>
                      <span style={{ fontSize: 9, color: STATUS_COLOR[row.status], letterSpacing: "0.12em", fontWeight: 600 }}>{row.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {tab === "HOSTS" && <HostTopology />}
        {tab === "CREDENTIALS" && <CredentialsPanel />}

        {!["ENDPOINTS","SERVICES","HOSTS","CREDENTIALS"].includes(tab) && (
          <div className="flex items-center justify-center h-full" style={{ color: "#222222", fontSize: 10, letterSpacing: "0.18em" }}>
            {tab} — NOT YET IMPLEMENTED
          </div>
        )}
      </div>
    </div>
  );
}
