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
        {tab === "AUTH STATES" && <AuthStatesPanel />}
        {tab === "PARAMETERS" && <ParametersPanel />}
        {tab === "CVE CANDIDATES" && <CVECandidatesPanel />}
        {tab === "FINDINGS" && <ELFindingsPanel />}
        {tab === "EVIDENCE" && <EvidencePanel />}
        {tab === "FAILURES" && <FailuresPanel />}
      </div>
    </div>
  );
}

/* ─── AUTH STATES ─────────────────────────────────────── */
const AUTH_STATES = [
  {id:"AS-001",session:"sess_8f4a2b",user:"admin@targetcorp.com",role:"ADMIN",method:"JWT/HS256",issued:"06:22:14",expiry:"07:22:14",status:"ACTIVE",csrf:"b3d9f1e2"},
  {id:"AS-002",session:"sess_2c7e9d",user:"user@targetcorp.com", role:"USER", method:"SESSION_COOKIE",issued:"06:12:18",expiry:"06:42:18",status:"EXPIRED",csrf:"—"},
  {id:"AS-003",session:"sess_forged",user:"admin@targetcorp.com",role:"ADMIN",method:"JWT/FORGED", issued:"06:22:50",expiry:"07:22:50",status:"ACTIVE",csrf:"—"},
];
function AuthStatesPanel() {
  return (
    <div className="overflow-auto flex-1">
      <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0" style={{borderBottom:"1px solid #141414",background:"#0A0A0A"}}>
        <span style={{fontSize:8,color:"#3FB950",letterSpacing:"0.18em"}}>CONFIRMED</span>
        <span style={{fontSize:8,color:"#555555",letterSpacing:"0.12em",marginLeft:8}}>Active authentication sessions observed by Specialists</span>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:10.5}}>
        <thead><tr style={{background:"#0F0F0F",position:"sticky",top:0}}>
          {["ID","SESSION","USER","ROLE","METHOD","ISSUED","EXPIRY","STATUS","CSRF TOKEN"].map(h=>(
            <th key={h} style={{padding:"6px 12px",textAlign:"left",fontSize:8,color:"#444444",letterSpacing:"0.16em",borderBottom:"1px solid #1A1A1A",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {AUTH_STATES.map((a,i)=>(
            <tr key={a.id} style={{borderBottom:"1px solid #111111"}} onMouseEnter={e=>e.currentTarget.style.background="#0F0F0F"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"7px 12px",color:"#E31B23",fontWeight:700,fontSize:9}}>{a.id}</td>
              <td style={{padding:"7px 12px",color:"#555555",fontSize:9}}>{a.session}</td>
              <td style={{padding:"7px 12px",color:"#A0A0A0"}}>{a.user}</td>
              <td style={{padding:"7px 12px"}}><span style={{fontSize:8.5,color:a.role==="ADMIN"?"#FF2A32":"#666666",letterSpacing:"0.1em",fontWeight:600}}>{a.role}</span></td>
              <td style={{padding:"7px 12px",color:"#666666",fontSize:9}}>{a.method}</td>
              <td style={{padding:"7px 12px",color:"#444444",fontSize:9}}>{a.issued}</td>
              <td style={{padding:"7px 12px",color:a.status==="EXPIRED"?"#333333":"#444444",fontSize:9}}>{a.expiry}</td>
              <td style={{padding:"7px 12px"}}><span style={{fontSize:8.5,color:a.status==="ACTIVE"?"#3FB950":"#444444",letterSpacing:"0.12em",fontWeight:600}}>{a.status}</span></td>
              <td style={{padding:"7px 12px",color:"#444444",fontSize:9,letterSpacing:"0.06em"}}>{a.csrf}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── PARAMETERS ─────────────────────────────────────── */
const PARAMS = [
  {id:"P-001",endpoint:"GET /api/users",       param:"id",       type:"INTEGER",source:"QUERY",injectable:true, lastVal:"1"},
  {id:"P-002",endpoint:"POST /api/auth/login", param:"username", type:"STRING", source:"BODY",injectable:false,lastVal:"admin@targetcorp.com"},
  {id:"P-003",endpoint:"POST /api/auth/login", param:"password", type:"STRING", source:"BODY",injectable:false,lastVal:"[REDACTED]"},
  {id:"P-004",endpoint:"GET /api/users/:id",   param:"id",       type:"PATH",   source:"PATH",injectable:true, lastVal:"1"},
  {id:"P-005",endpoint:"GET /api/products",    param:"category", type:"STRING", source:"QUERY",injectable:true, lastVal:"electronics"},
  {id:"P-006",endpoint:"GET /api/products",    param:"sort",     type:"STRING", source:"QUERY",injectable:false,lastVal:"asc"},
  {id:"P-007",endpoint:"POST /api/graphql",    param:"query",    type:"STRING", source:"BODY",injectable:true, lastVal:"{ users { id } }"},
  {id:"P-008",endpoint:"GET /api/orders",      param:"user_id",  type:"INTEGER",source:"QUERY",injectable:true, lastVal:"1"},
];
function ParametersPanel() {
  return (
    <div className="overflow-auto flex-1">
      <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0" style={{borderBottom:"1px solid #141414",background:"#0A0A0A"}}>
        <span style={{fontSize:8,color:"#444444",letterSpacing:"0.18em"}}>DISCOVERED PARAMETERS</span>
        <span style={{marginLeft:"auto",fontSize:8,color:"#E31B23",letterSpacing:"0.12em"}}>{PARAMS.filter(p=>p.injectable).length} INJECTION ELIGIBLE</span>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:10.5}}>
        <thead><tr style={{background:"#0F0F0F",position:"sticky",top:0}}>
          {["ID","ENDPOINT","PARAMETER","TYPE","SOURCE","INJECTABLE","LAST VALUE"].map(h=>(
            <th key={h} style={{padding:"6px 12px",textAlign:"left",fontSize:8,color:"#444444",letterSpacing:"0.16em",borderBottom:"1px solid #1A1A1A",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {PARAMS.map((p,i)=>(
            <tr key={p.id} style={{borderBottom:"1px solid #111111",background:i%2?"#0B0B0B":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background="#0F0F0F"} onMouseLeave={e=>e.currentTarget.style.background=i%2?"#0B0B0B":"transparent"}>
              <td style={{padding:"7px 12px",color:"#E31B23",fontWeight:700,fontSize:9}}>{p.id}</td>
              <td style={{padding:"7px 12px",color:"#555555",fontSize:9}}>{p.endpoint}</td>
              <td style={{padding:"7px 12px",color:"#A0A0A0",fontWeight:600}}>{p.param}</td>
              <td style={{padding:"7px 12px",color:"#666666",fontSize:9}}>{p.type}</td>
              <td style={{padding:"7px 12px",color:"#555555",fontSize:9}}>{p.source}</td>
              <td style={{padding:"7px 12px"}}><span style={{fontSize:8.5,color:p.injectable?"#FF2A32":"#333333",letterSpacing:"0.12em",fontWeight:600}}>{p.injectable?"YES":"—"}</span></td>
              <td style={{padding:"7px 12px",color:"#444444",fontSize:9}}>{p.lastVal}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── CVE CANDIDATES ──────────────────────────────────── */
const CVE_CANDIDATES = [
  {id:"CVE-2024-1187",tech:"PostgreSQL 14.8",  class:"SQL INJECTION",    epss:0.71,poc:true, node:"SQLI-001",eord:4},
  {id:"CVE-2023-9921",tech:"nginx/1.24.0",     class:"PATH TRAVERSAL",   epss:0.38,poc:false,node:"PATH-005",eord:1},
  {id:"CVE-2024-5532",tech:"Flask/Jinja2",     class:"SSTI",             epss:0.55,poc:true, node:"SSTI-006",eord:1},
  {id:"CVE-2022-3916",tech:"OpenSSH 8.9p1",    class:"AUTH BYPASS",      epss:0.22,poc:false,node:"AUTH-001",eord:3},
  {id:"CVE-2024-0012",tech:"Gunicorn 20.1.0",  class:"REQUEST SMUGGLING",epss:0.18,poc:false,node:"—",       eord:0},
  {id:"CVE-2023-4863",tech:"Redis 7.0.11",     class:"COMMAND INJECTION",epss:0.63,poc:true, node:"RCE-007", eord:0},
];
function CVECandidatesPanel() {
  return (
    <div className="overflow-auto flex-1">
      <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0" style={{borderBottom:"1px solid #141414",background:"#0A0A0A"}}>
        <span style={{fontSize:8,color:"#444444",letterSpacing:"0.18em"}}>VDG HYPOTHESIS CANDIDATES</span>
        <span style={{marginLeft:"auto",fontSize:8,color:"#D29922",letterSpacing:"0.12em"}}>{CVE_CANDIDATES.filter(c=>c.poc).length} WITH PoC</span>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:10.5}}>
        <thead><tr style={{background:"#0F0F0F",position:"sticky",top:0}}>
          {["CVE ID","TECHNOLOGY","VULN CLASS","EPSS","PoC","LINKED VDG NODE","E_ORD"].map(h=>(
            <th key={h} style={{padding:"6px 12px",textAlign:"left",fontSize:8,color:"#444444",letterSpacing:"0.16em",borderBottom:"1px solid #1A1A1A",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {[...CVE_CANDIDATES].sort((a,b)=>b.epss-a.epss).map((c,i)=>(
            <tr key={c.id} style={{borderBottom:"1px solid #111111"}} onMouseEnter={e=>e.currentTarget.style.background="#0F0F0F"} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <td style={{padding:"7px 12px",color:"#E31B23",fontWeight:700,fontSize:9,letterSpacing:"0.06em"}}>{c.id}</td>
              <td style={{padding:"7px 12px",color:"#A0A0A0"}}>{c.tech}</td>
              <td style={{padding:"7px 12px",color:"#666666",fontSize:9}}>{c.class}</td>
              <td style={{padding:"7px 12px"}}><span style={{fontSize:10,fontWeight:700,color:c.epss>0.5?"#FF2A32":c.epss>0.3?"#D29922":"#555555"}}>{c.epss.toFixed(2)}</span></td>
              <td style={{padding:"7px 12px"}}><span style={{fontSize:8.5,color:c.poc?"#3FB950":"#333333",letterSpacing:"0.12em"}}>{c.poc?"YES":"NO"}</span></td>
              <td style={{padding:"7px 12px",color:c.node!=="—"?"#E31B23":"#333333",fontSize:9,fontWeight:c.node!=="—"?700:400}}>{c.node}</td>
              <td style={{padding:"7px 12px",color:"#666666"}}>{c.eord}/5</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── FINDINGS (EL cross-ref) ─────────────────────────── */
const EL_FINDINGS = [
  {id:"F-001",type:"SQL INJECTION",       target:"/api/users?id=", eord:5,vdgNode:"SQLI-001",evidence:["ev-00483-req","ev-00483-resp","ev-00484-timing"]},
  {id:"F-002",type:"AUTH BYPASS",         target:"/api/auth/login",eord:4,vdgNode:"AUTH-001", evidence:["ev-00241-jwt","ev-00242-forged"]},
  {id:"F-003",type:"IDOR",               target:"/api/users/:id",  eord:4,vdgNode:"IDOR-008", evidence:["ev-00301-crossacc"]},
  {id:"F-004",type:"XSS REFLECTED",      target:"/search?q=",      eord:3,vdgNode:"XSS-002",  evidence:["ev-00411-reflect"]},
  {id:"F-005",type:"SENSITIVE DATA",     target:"/static/config.json",eord:4,vdgNode:"ENUM-002",evidence:["ev-00121-static"]},
];
function ELFindingsPanel() {
  return (
    <div className="overflow-auto flex-1">
      <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0" style={{borderBottom:"1px solid #141414",background:"#0A0A0A"}}>
        <span style={{fontSize:8,color:"#444444",letterSpacing:"0.18em"}}>EL FINDINGS CROSS-REFERENCE</span>
        <span style={{fontSize:8,color:"#555555",marginLeft:8}}>confirmed findings linked to EL evidence artifacts</span>
      </div>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:10.5}}>
        <thead><tr style={{background:"#0F0F0F",position:"sticky",top:0}}>
          {["FINDING","TYPE","TARGET","E_ORD","LINKED VDG NODE","EVIDENCE ARTIFACTS"].map(h=>(
            <th key={h} style={{padding:"6px 12px",textAlign:"left",fontSize:8,color:"#444444",letterSpacing:"0.16em",borderBottom:"1px solid #1A1A1A",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {EL_FINDINGS.map((f,i)=>(
            <tr key={f.id} style={{borderBottom:"1px solid #111111",background:i%2?"#0B0B0B":"transparent"}} onMouseEnter={e=>e.currentTarget.style.background="#0F0F0F"} onMouseLeave={e=>e.currentTarget.style.background=i%2?"#0B0B0B":"transparent"}>
              <td style={{padding:"7px 12px",color:"#E31B23",fontWeight:700,fontSize:9}}>{f.id}</td>
              <td style={{padding:"7px 12px",color:"#A0A0A0"}}>{f.type}</td>
              <td style={{padding:"7px 12px",color:"#555555",fontSize:9}}>{f.target}</td>
              <td style={{padding:"7px 12px",color:"#666666"}}>{f.eord}/5</td>
              <td style={{padding:"7px 12px",color:"#E31B23",fontSize:9,fontWeight:700}}>{f.vdgNode}</td>
              <td style={{padding:"7px 12px"}}>
                <div className="flex flex-wrap gap-1">
                  {f.evidence.map(e=>(
                    <span key={e} style={{fontSize:7.5,color:"#444444",background:"#111111",border:"1px solid #1E1E1E",borderRadius:2,padding:"1px 5px",letterSpacing:"0.08em"}}>{e}</span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─── EVIDENCE ────────────────────────────────────────── */
const EVIDENCE_ARTIFACTS = [
  {id:"ev-00483-resp",  type:"HTTP RESPONSE",  finding:"F-001",ts:"06:30:51",size:"1,247B",note:"4.18s RTT — timing injection confirmed"},
  {id:"ev-00483-req",   type:"HTTP REQUEST",   finding:"F-001",ts:"06:30:47",size:"412B",  note:"Time-based SLEEP(4) payload"},
  {id:"ev-00484-timing",type:"TIMING DELTA",   finding:"F-001",ts:"06:30:58",size:"84B",   note:"4,100ms above baseline, σ=12ms"},
  {id:"ev-00241-jwt",   type:"TOKEN ARTIFACT", finding:"F-002",ts:"06:22:00",size:"312B",  note:"HS256 JWT with weak secret cracked"},
  {id:"ev-00242-forged",type:"TOKEN ARTIFACT", finding:"F-002",ts:"06:22:14",size:"312B",  note:"Forged admin token — access confirmed"},
  {id:"ev-00301-crossacc",type:"HTTP RESPONSE",finding:"F-003",ts:"06:25:33",size:"891B",  note:"id=2 returned while auth as id=1"},
  {id:"ev-00411-reflect",type:"HTTP RESPONSE", finding:"F-004",ts:"06:28:47",size:"6,012B",note:"Input reflected unescaped in response"},
  {id:"ev-00121-static",type:"FILE CONTENT",   finding:"F-005",ts:"06:16:07",size:"2,341B",note:"DB credentials exposed in config.json"},
];
function EvidencePanel() {
  const [sel,setSel] = useState<string|null>(null);
  return (
    <div className="flex flex-1 overflow-hidden" style={{minHeight:0}}>
      <div className="flex flex-col overflow-y-auto" style={{flex:1,minWidth:0}}>
        <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0" style={{borderBottom:"1px solid #141414",background:"#0A0A0A"}}>
          <span style={{fontSize:8,color:"#444444",letterSpacing:"0.18em"}}>RAW EVIDENCE ARTIFACTS</span>
          <span style={{marginLeft:"auto",fontSize:8,color:"#555555"}}>{EVIDENCE_ARTIFACTS.length} ARTIFACTS</span>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:10.5}}>
          <thead><tr style={{background:"#0F0F0F",position:"sticky",top:0}}>
            {["ARTIFACT ID","TYPE","FINDING","TIMESTAMP","SIZE","NOTE"].map(h=>(
              <th key={h} style={{padding:"6px 12px",textAlign:"left",fontSize:8,color:"#444444",letterSpacing:"0.16em",borderBottom:"1px solid #1A1A1A",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {EVIDENCE_ARTIFACTS.map((a,i)=>(
              <tr key={a.id} onClick={()=>setSel(a.id===sel?null:a.id)} style={{borderBottom:"1px solid #111111",cursor:"pointer",background:sel===a.id?"#0F0F0F":i%2?"#0B0B0B":"transparent"}}
                onMouseEnter={e=>e.currentTarget.style.background="#0F0F0F"} onMouseLeave={e=>e.currentTarget.style.background=sel===a.id?"#0F0F0F":i%2?"#0B0B0B":"transparent"}>
                <td style={{padding:"7px 12px",color:"#E31B23",fontWeight:700,fontSize:9}}>{a.id}</td>
                <td style={{padding:"7px 12px",color:"#666666",fontSize:9}}>{a.type}</td>
                <td style={{padding:"7px 12px",color:"#E31B23",fontSize:9,fontWeight:700}}>{a.finding}</td>
                <td style={{padding:"7px 12px",color:"#444444",fontSize:9}}>{a.ts}</td>
                <td style={{padding:"7px 12px",color:"#444444",fontSize:9,textAlign:"right"}}>{a.size}</td>
                <td style={{padding:"7px 12px",color:"#555555"}}>{a.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel && (
        <div style={{width:280,borderLeft:"1px solid #1E1E1E",background:"#0A0A0A",padding:"16px 14px",flexShrink:0,overflowY:"auto"}}>
          {(()=>{const a=EVIDENCE_ARTIFACTS.find(x=>x.id===sel)!;return (
            <>
              <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:12}}>ARTIFACT DETAIL</div>
              {[{k:"ID",v:a.id},{k:"TYPE",v:a.type},{k:"FINDING",v:a.finding},{k:"TIMESTAMP",v:a.ts},{k:"SIZE",v:a.size}].map(r=>(
                <div key={r.k} style={{marginBottom:8}}><div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.16em",marginBottom:2}}>{r.k}</div><div style={{fontSize:10,color:"#888888"}}>{r.v}</div></div>
              ))}
              <div style={{marginTop:12,padding:"8px 10px",background:"#111111",border:"1px solid #1E1E1E",borderRadius:2,fontSize:9,color:"#555555",lineHeight:1.8}}>{a.note}</div>
            </>
          );})()}
        </div>
      )}
    </div>
  );
}

/* ─── FAILURES ────────────────────────────────────────── */
const FAILURE_LOG = [
  {id:"FL-011",ts:"06:29:44",spec:"INJECT-SPEC",action:"SQLI_PROBE",      target:"/api/users?id=1' UNION",error:"UNION SELECT column mismatch — HTTP 400",eord:1,resolved:true},
  {id:"FL-010",ts:"06:29:03",spec:"NETWORK-SPEC",action:"PORT_SCAN",      target:"5432/tcp",               error:"TIMEOUT after 120s — port filtered",    eord:0,resolved:false},
  {id:"FL-009",ts:"06:28:12",spec:"INJECT-SPEC",action:"SQLI_ERROR_BASED",target:"/api/users?id=",         error:"No SQL error — error-based ruled out",  eord:1,resolved:true},
  {id:"FL-008",ts:"06:24:41",spec:"AUTH-SPEC",  action:"BRUTE_FORCE",     target:"/api/auth/login",        error:"Rate limiting — 429 after 50 attempts",  eord:0,resolved:true},
  {id:"FL-007",ts:"06:21:08",spec:"RECON-SPEC", action:"DIR_ENUM",        target:"/admin/*",               error:"403 Forbidden — directory listing off",  eord:0,resolved:false},
  {id:"FL-006",ts:"06:18:33",spec:"INJECT-SPEC",action:"XSS_CANARY",      target:"/search?q=",             error:"CSP blocks inline scripts — adapting",   eord:2,resolved:false},
];
function FailuresPanel() {
  const [sel,setSel] = useState<string|null>(null);
  return (
    <div className="flex flex-1 overflow-hidden" style={{minHeight:0}}>
      <div className="flex flex-col overflow-y-auto" style={{flex:1,minWidth:0}}>
        <div className="flex items-center gap-2 px-4 py-2 flex-shrink-0" style={{borderBottom:"1px solid #141414",background:"#0A0A0A"}}>
          <span style={{fontSize:8,color:"#444444",letterSpacing:"0.18em"}}>SPECIALIST FAILURE LOG</span>
          <span style={{marginLeft:"auto",fontSize:8,color:"#D29922",letterSpacing:"0.12em"}}>{FAILURE_LOG.filter(f=>!f.resolved).length} UNRESOLVED</span>
        </div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:10.5}}>
          <thead><tr style={{background:"#0F0F0F",position:"sticky",top:0}}>
            {["ID","TIMESTAMP","SPECIALIST","ACTION","TARGET","ERROR","E_ORD","RESOLVED"].map(h=>(
              <th key={h} style={{padding:"6px 12px",textAlign:"left",fontSize:8,color:"#444444",letterSpacing:"0.16em",borderBottom:"1px solid #1A1A1A",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {FAILURE_LOG.map((f,i)=>(
              <tr key={f.id} onClick={()=>setSel(f.id===sel?null:f.id)} style={{borderBottom:"1px solid #111111",cursor:"pointer",background:sel===f.id?"#110808":i%2?"#0B0B0B":"transparent"}}
                onMouseEnter={e=>e.currentTarget.style.background="#0F0F0F"} onMouseLeave={e=>e.currentTarget.style.background=sel===f.id?"#110808":i%2?"#0B0B0B":"transparent"}>
                <td style={{padding:"7px 12px",color:"#E31B23",fontWeight:700,fontSize:9}}>{f.id}</td>
                <td style={{padding:"7px 12px",color:"#444444",fontSize:9}}>{f.ts}</td>
                <td style={{padding:"7px 12px",color:"#A0A0A0",fontSize:9,fontWeight:600}}>{f.spec}</td>
                <td style={{padding:"7px 12px",color:"#666666",fontSize:9}}>{f.action}</td>
                <td style={{padding:"7px 12px",color:"#555555",fontSize:9}}>{f.target}</td>
                <td style={{padding:"7px 12px",color:"#666666",fontSize:9}}>{f.error}</td>
                <td style={{padding:"7px 12px",color:"#555555"}}>{f.eord}/5</td>
                <td style={{padding:"7px 12px"}}><span style={{fontSize:8.5,color:f.resolved?"#3FB950":"#D29922",letterSpacing:"0.12em",fontWeight:600}}>{f.resolved?"YES":"NO"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sel && (
        <div style={{width:280,borderLeft:"1px solid #1E1E1E",background:"#0A0A0A",padding:"16px 14px",flexShrink:0,overflowY:"auto"}}>
          {(()=>{const f=FAILURE_LOG.find(x=>x.id===sel)!;return (
            <>
              <div style={{fontSize:8,color:"#444444",letterSpacing:"0.2em",marginBottom:12}}>FAILURE DETAIL</div>
              {[{k:"ID",v:f.id},{k:"TIMESTAMP",v:f.ts},{k:"SPECIALIST",v:f.spec},{k:"ACTION",v:f.action},{k:"TARGET",v:f.target},{k:"E_ORD",v:`${f.eord}/5`},{k:"RESOLVED",v:f.resolved?"YES":"NO"}].map(r=>(
                <div key={r.k} style={{marginBottom:8}}><div style={{fontSize:7.5,color:"#444444",letterSpacing:"0.16em",marginBottom:2}}>{r.k}</div><div style={{fontSize:10,color:r.k==="RESOLVED"?(f.resolved?"#3FB950":"#D29922"):"#888888"}}>{r.v}</div></div>
              ))}
              <div style={{marginTop:12,padding:"8px 10px",background:"#111111",border:"1px solid #1E1E1E",borderRadius:2,fontSize:9,color:"#FF2A32",lineHeight:1.7}}>{f.error}</div>
            </>
          );})()}
        </div>
      )}
    </div>
  );
}
