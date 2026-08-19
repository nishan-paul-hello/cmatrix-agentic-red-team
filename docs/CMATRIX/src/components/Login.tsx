import { useState } from "react";

function GeometricMark({ size = 28 }: { size?: number }) {
  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="11" height="11" stroke="#E31B23" strokeWidth="1" fill="none" />
      <rect x="8.5" y="8.5" width="11" height="11" stroke="#9E1118" strokeWidth="1" fill="none" />
      <rect x="16.5" y="16.5" width="11" height="11" stroke="#6F171B" strokeWidth="1" fill="none" />
      <line x1="6" y1="6" x2="22" y2="22" stroke="#E31B23" strokeWidth="0.75" />
    </svg>
  );
}

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#080808" }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(41,41,41,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(41,41,41,0.18) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="relative flex flex-col items-center" style={{ width: 360 }}>
        <div className="flex items-center gap-3 mb-8">
          <GeometricMark />
          <div className="flex flex-col">
            <span className="font-bold tracking-widest" style={{ fontSize: 22, color: "#F2F2F2", letterSpacing: "0.22em" }}>CMATRIX</span>
            <span className="font-normal" style={{ fontSize: 9, color: "#666666", letterSpacing: "0.28em" }}>AUTONOMOUS VAPT</span>
          </div>
        </div>
        <div className="w-full mb-8" style={{ height: 1, background: "linear-gradient(90deg, #E31B23 0%, #9E1118 60%, transparent 100%)" }} />
        <div className="w-full" style={{ background: "#111111", border: "1px solid #292929", borderRadius: 2, padding: "32px 32px 28px" }}>
          <form onSubmit={handleSubmit} autoComplete="off">
            <div className="mb-4">
              <label htmlFor="username" className="block mb-1.5" style={{ fontSize: 10, color: "#666666", letterSpacing: "0.18em" }}>USERNAME</label>
              <input
                id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                autoComplete="off" spellCheck={false} className="w-full outline-none"
                style={{ background: "#191919", border: "1px solid #292929", borderRadius: 2, color: "#F2F2F2", fontSize: 12, padding: "9px 12px", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#E31B23")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#292929")}
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-1.5" style={{ fontSize: 10, color: "#666666", letterSpacing: "0.18em" }}>PASSWORD</label>
              <input
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password" className="w-full outline-none"
                style={{ background: "#191919", border: "1px solid #292929", borderRadius: 2, color: "#F2F2F2", fontSize: 12, padding: "9px 12px", fontFamily: "inherit" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#E31B23")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#292929")}
              />
            </div>
            <button
              type="submit" className="w-full"
              style={{ background: loading ? "#9E1118" : "#E31B23", border: "none", borderRadius: 2, color: "#F2F2F2", fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", padding: "11px 0", cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#FF2A32"; }}
              onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = "#E31B23"; }}
              disabled={loading}
            >
              {loading ? "AUTHENTICATING..." : "SIGN IN"}
            </button>
          </form>
          <div className="my-6" style={{ height: 1, background: "#1E1E1E" }} />
          <div className="flex items-center gap-2 justify-center">
            <div style={{ width: 5, height: 5, background: "#3FB950", borderRadius: "50%", flexShrink: 0 }} />
            <span style={{ fontSize: 9, color: "#666666", letterSpacing: "0.22em" }}>SECURE RESEARCH ENVIRONMENT</span>
          </div>
        </div>
        <div className="mt-5 flex justify-between w-full">
          <span style={{ fontSize: 9, color: "#333333", letterSpacing: "0.1em" }}>v2.4.1</span>
          <span style={{ fontSize: 9, color: "#333333", letterSpacing: "0.1em" }}>CMATRIX © 2026</span>
        </div>
      </div>
    </div>
  );
}
