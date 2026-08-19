const EORD_LABELS = ["UNSEEN","NOTHING","WEAK","CLEAR","CONFIRMED","ORACLE"];

export default function VDGNodeDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-col h-full" style={{ width: 320, borderLeft: "1px solid #292929", background: "#0D0D0D", flexShrink: 0 }}>
      {/* Header */}
      <div className="flex items-start justify-between px-4 pt-4 pb-3" style={{ borderBottom: "1px solid #1E1E1E" }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F2F2F2", letterSpacing: "0.12em" }}>SQLI-001</span>
            <span style={{ fontSize: 8.5, color: "#FF2A32", background: "#1A0608", border: "1px solid #6F171B", borderRadius: 2, padding: "1px 6px", letterSpacing: "0.14em", fontWeight: 600 }}>ELIGIBLE</span>
          </div>
          <div style={{ fontSize: 9, color: "#6F171B", letterSpacing: "0.18em" }}>SQL INJECTION</div>
        </div>
        <button onClick={onClose} style={{ fontSize: 14, color: "#444444", background: "transparent", border: "none", cursor: "pointer", lineHeight: 1, padding: 2 }} onMouseEnter={e => e.currentTarget.style.color="#A0A0A0"} onMouseLeave={e => e.currentTarget.style.color="#444444"}>✕</button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Attack intent */}
        <Section label="ATTACK INTENT">
          <p style={{ fontSize: 10, color: "#666666", letterSpacing: "0.04em", lineHeight: 1.7 }}>Exploit time-based blind SQL injection in the <span style={{ color: "#A0A0A0" }}>/api/users</span> endpoint via the <span style={{ color: "#A0A0A0" }}>id</span> parameter to enumerate the database schema and extract credential hashes.</p>
        </Section>

        {/* Stat grid */}
        <Section label="SCORES & METRICS">
          <div className="grid grid-cols-2 gap-0" style={{ border: "1px solid #1E1E1E", borderRadius: 2, overflow: "hidden" }}>
            {[
              { k: "UCB SCORE",    v: "0.824", red: true  },
              { k: "PATH SCORE",   v: "0.612", red: false },
              { k: "PROMISE φ",    v: "0.81",  red: false },
              { k: "DIFFICULTY δ", v: "0.32",  red: false },
              { k: "E_ord",        v: "3 / 5", red: true  },
              { k: "EPSS PRIOR",   v: "0.42",  red: false },
              { k: "RETRY",        v: "1 / 3", red: false },
              { k: "COST EST.",    v: "$0.18", red: false },
            ].map((r, i) => (
              <div key={r.k} style={{ padding: "7px 10px", borderRight: i%2===0?"1px solid #1A1A1A":"none", borderBottom: i<6?"1px solid #1A1A1A":"none", background: i%2===0?"#0D0D0D":"#0B0B0B" }}>
                <div style={{ fontSize: 7.5, color: "#444444", letterSpacing: "0.16em", marginBottom: 2 }}>{r.k}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: r.red ? "#E31B23" : "#A0A0A0" }}>{r.v}</div>
              </div>
            ))}
          </div>
        </Section>

        {/* E_ord indicator */}
        <Section label="EVIDENCE LEVEL">
          <EOrdIndicator value={3} />
        </Section>

        {/* Prerequisites */}
        <Section label="PREREQUISITES">
          <div className="flex flex-col gap-1.5">
            {[{ id: "AUTH-001", done: true }, { id: "RECON-004", done: true }].map(p => (
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
            {["DB-ACCESS-002", "RCE-007"].map(id => (
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
            {[
              { k: "ENDPOINT",   v: "GET /api/users" },
              { k: "PARAMETER",  v: "id (integer, unsanitised)" },
              { k: "AUTH STATE", v: "SESSION admin@targetcorp.com" },
              { k: "TECH",       v: "Flask 2.3 / SQLite 3.39" },
              { k: "EVIDENCE",   v: "HTTP 500 on id=1' observed (E_ord 3)" },
            ].map((r, i, a) => (
              <div key={r.k} className="flex gap-3" style={{ padding: "6px 10px", borderBottom: i<a.length-1?"1px solid #141414":"none", background: "#0B0B0B" }}>
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
                  <div style={{ width: 6, height: 6, borderRadius: "50%", border: `1px solid ${t.color}`, background: i===a.length-1?t.color:"transparent", marginTop: 2 }} />
                  {i < a.length-1 && <div style={{ width: 1, height: 18, background: "#1E1E1E" }} />}
                </div>
                <div className="flex items-center gap-2" style={{ paddingBottom: i<a.length-1?0:0 }}>
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
        <div style={{ position: "absolute", top: 6, left: 4, width: `${(value/5)*92}%`, height: 1, background: "#E31B23" }} />
        {EORD_LABELS.map((lbl, i) => (
          <div key={lbl} className="flex flex-col items-center" style={{ zIndex: 1 }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, border: `1px solid ${i<=value?"#E31B23":"#292929"}`, background: i<value?"#E31B23":i===value?"#FF2A32":"transparent", marginBottom: 2 }} />
            {i === value && <div style={{ width: 0, height: 0, borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "5px solid #FF2A32", position: "absolute", top: 10 }} />}
            <span style={{ fontSize: 6.5, color: i===value?"#E31B23":"#333333", letterSpacing: "0.1em", marginTop: 14, whiteSpace: "nowrap" }}>{lbl}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 8.5, color: "#666666", letterSpacing: "0.1em", marginTop: 4 }}>Current: <span style={{ color: "#E31B23" }}>E_ord {value} — {EORD_LABELS[value]}</span></div>
    </div>
  );
}
