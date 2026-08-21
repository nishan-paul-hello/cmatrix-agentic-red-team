import { useState } from "react";

type ELTab =
    | "ENDPOINTS"
    | "SERVICES"
    | "HOSTS"
    | "CREDENTIALS"
    | "AUTH STATES"
    | "PARAMETERS"
    | "CVE CANDIDATES"
    | "FINDINGS"
    | "EVIDENCE"
    | "FAILURES";
const TABS: ELTab[] = [
    "ENDPOINTS",
    "SERVICES",
    "HOSTS",
    "CREDENTIALS",
    "AUTH STATES",
    "PARAMETERS",
    "CVE CANDIDATES",
    "FINDINGS",
    "EVIDENCE",
    "FAILURES",
];
const ENDPOINTS = [
    {
        endpoint: "GET /api/users",
        method: "GET",
        auth: "SESSION",
        params: "id, limit, offset",
        source: "SPIDER",
        seen: "06:31:04",
    },
    {
        endpoint: "POST /api/auth/login",
        method: "POST",
        auth: "NONE",
        params: "username, password",
        source: "MANUAL",
        seen: "06:12:18",
    },
    {
        endpoint: "GET /api/users/:id",
        method: "GET",
        auth: "SESSION",
        params: "id (path)",
        source: "SPIDER",
        seen: "06:31:04",
    },
    {
        endpoint: "DELETE /api/users/:id",
        method: "DELETE",
        auth: "ADMIN",
        params: "id (path)",
        source: "SPIDER",
        seen: "06:29:44",
    },
    {
        endpoint: "GET /admin/dashboard",
        method: "GET",
        auth: "ADMIN",
        params: "—",
        source: "SPIDER",
        seen: "06:14:02",
    },
    {
        endpoint: "POST /api/upload",
        method: "POST",
        auth: "SESSION",
        params: "file, type",
        source: "SPIDER",
        seen: "06:22:31",
    },
    {
        endpoint: "GET /api/products",
        method: "GET",
        auth: "NONE",
        params: "category, sort",
        source: "SPIDER",
        seen: "06:31:04",
    },
    {
        endpoint: "PUT /api/users/:id",
        method: "PUT",
        auth: "SESSION",
        params: "id, body (JSON)",
        source: "SPIDER",
        seen: "06:30:11",
    },
    {
        endpoint: "GET /api/orders",
        method: "GET",
        auth: "SESSION",
        params: "user_id, status",
        source: "SPIDER",
        seen: "06:28:59",
    },
    {
        endpoint: "POST /api/password/reset",
        method: "POST",
        auth: "NONE",
        params: "email, token",
        source: "INFERENCE",
        seen: "06:19:43",
    },
    {
        endpoint: "GET /static/config.json",
        method: "GET",
        auth: "NONE",
        params: "—",
        source: "SPIDER",
        seen: "06:16:07",
    },
    {
        endpoint: "POST /api/graphql",
        method: "POST",
        auth: "SESSION",
        params: "query, variables",
        source: "SPIDER",
        seen: "06:25:33",
    },
];
const SERVICES = [
    {
        host: "app.targetcorp.com",
        port: "443",
        service: "HTTPS",
        version: "nginx/1.24.0",
        banner: "nginx",
        status: "OPEN",
    },
    {
        host: "app.targetcorp.com",
        port: "80",
        service: "HTTP",
        version: "nginx/1.24.0",
        banner: "→ 443 redirect",
        status: "OPEN",
    },
    {
        host: "app.targetcorp.com",
        port: "22",
        service: "SSH",
        version: "OpenSSH 8.9p1",
        banner: "SSH-2.0-OpenSSH_8.9",
        status: "OPEN",
    },
    {
        host: "app.targetcorp.com",
        port: "5432",
        service: "POSTGRESQL",
        version: "PostgreSQL 14.8",
        banner: "—",
        status: "FILTERED",
    },
    {
        host: "app.targetcorp.com",
        port: "6379",
        service: "REDIS",
        version: "Redis 7.0.11",
        banner: "—",
        status: "FILTERED",
    },
    {
        host: "app.targetcorp.com",
        port: "8080",
        service: "HTTP-ALT",
        version: "Gunicorn 20.1.0",
        banner: "Gunicorn/20.1",
        status: "OPEN",
    },
    {
        host: "app.targetcorp.com",
        port: "3306",
        service: "MYSQL",
        version: "—",
        banner: "—",
        status: "CLOSED",
    },
    {
        host: "app.targetcorp.com",
        port: "25",
        service: "SMTP",
        version: "—",
        banner: "—",
        status: "CLOSED",
    },
];
const HOSTS = [
    {
        id: "HOST-01",
        ip: "10.0.0.10",
        hostname: "app.targetcorp.com",
        role: "WEB APPLICATION SERVER",
        os: "Ubuntu 22.04 LTS",
        services: ["HTTPS :443", "HTTP :80", "SSH :22", "HTTP-ALT :8080"],
        status: "CONFIRMED",
        eord: 4,
        edges: [
            {
                to: "HOST-02",
                label: "credential",
                detail: "admin / SSH key",
                eord: 4,
            },
        ],
    },
    {
        id: "HOST-02",
        ip: "10.0.0.20",
        hostname: "db.targetcorp.internal",
        role: "DATABASE SERVER",
        os: "Ubuntu 20.04 LTS",
        services: ["POSTGRESQL :5432", "SSH :22"],
        status: "DISCOVERED",
        eord: 3,
        edges: [
            {
                to: "HOST-03",
                label: "network trust",
                detail: "subnet ACL — no auth",
                eord: 3,
            },
        ],
    },
    {
        id: "HOST-03",
        ip: "10.0.0.30",
        hostname: "mgmt.targetcorp.internal",
        role: "MANAGEMENT / BASTION",
        os: "CentOS 7",
        services: ["SSH :22", "RDP :3389"],
        status: "INFERRED",
        eord: 2,
        edges: [],
    },
];
const EORD_COLOR: Record<number, string> = {
    5: "var(--color-hex-ff2a32)",
    4: "var(--color-hex-e31b23)",
    3: "var(--color-hex-d29922)",
    2: "var(--color-hex-666666)",
    1: "var(--color-hex-444444)",
    0: "var(--color-hex-333333)",
};
const STATUS_BADGE: Record<
    string,
    {
        color: string;
        bg: string;
        border: string;
    }
> = {
    CONFIRMED: {
        color: "var(--color-hex-3fb950)",
        bg: "var(--color-hex-0a1a10)",
        border: "var(--color-hex-1a4a2044)",
    },
    DISCOVERED: {
        color: "var(--color-hex-d29922)",
        bg: "var(--color-hex-1a1200)",
        border: "var(--color-hex-d2992244)",
    },
    INFERRED: {
        color: "var(--color-hex-666666)",
        bg: "var(--color-hex-111111)",
        border: "var(--color-hex-33333344)",
    },
};
function HostTopology() {
    const [selected, setSelected] = useState<string | null>("HOST-01");
    const sel = HOSTS.find((h) => h.id === selected);
    return (
        <div className="flex h-full min-h-[0px]">
            {/* Topology diagram */}
            <div
                className="flex flex-1 flex-col overflow-y-auto px-10 py-8"
                style={{
                    borderRight: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-6 flex items-center gap-3">
                    <span className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a4a2044)] bg-[var(--color-hex-0a1a10)] px-[8px] py-[2px] text-[8.5px] tracking-[0.16em] text-[var(--color-hex-3fb950)]">
                        CONFIRMED TOPOLOGY
                    </span>
                    <span className="text-[8px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                        SOURCE: NMAP + CREDENTIAL REUSE · E_ord ≥ 3
                    </span>
                </div>

                <div
                    className="flex flex-col items-start"
                    style={{
                        gap: 0,
                    }}
                >
                    {HOSTS.map((host, i) => {
                        const isSel = selected === host.id;
                        const sb = STATUS_BADGE[host.status];
                        return (
                            <div key={host.id} className="flex flex-col items-start">
                                {/* Host card */}
                                <button
                                    onClick={() => setSelected(isSel ? null : host.id)}
                                    className="font-inherit flex w-[480px] cursor-pointer items-start gap-4 rounded-[2px] px-[18px] py-[14px] text-left"
                                    style={{
                                        background: isSel
                                            ? "var(--color-hex-120608)"
                                            : "var(--color-hex-0d0d0d)",
                                        border: `1px solid ${isSel ? "var(--color-hex-e31b23)" : "var(--color-hex-292929)"}`,
                                        transition: "border-color 0.1s, background 0.1s",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isSel) {
                                            e.currentTarget.style.borderColor =
                                                "var(--color-hex-444444)";
                                            e.currentTarget.style.background =
                                                "var(--color-hex-111111)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isSel) {
                                            e.currentTarget.style.borderColor =
                                                "var(--color-hex-292929)";
                                            e.currentTarget.style.background =
                                                "var(--color-hex-0d0d0d)";
                                        }
                                    }}
                                >
                                    {/* Left: id + status dot */}
                                    <div
                                        className="flex flex-shrink-0 flex-col items-center gap-1.5"
                                        style={{
                                            paddingTop: 2,
                                        }}
                                    >
                                        <div
                                            className="h-[10px] w-[10px] rounded-[2px]"
                                            style={{
                                                border: `1px solid ${isSel ? "var(--color-hex-e31b23)" : "var(--color-hex-333333)"}`,
                                                background: isSel
                                                    ? "var(--color-hex-e31b23)"
                                                    : "var(--color-hex-151515)",
                                            }}
                                        />
                                        <span
                                            className="text-[8px] font-bold tracking-[0.1em]"
                                            style={{
                                                color: isSel
                                                    ? "var(--color-hex-e31b23)"
                                                    : "var(--color-hex-444444)",
                                            }}
                                        >
                                            {host.id}
                                        </span>
                                    </div>

                                    {/* Center: details */}
                                    <div className="flex-1">
                                        <div className="mb-1 flex items-center gap-2">
                                            <span
                                                className="text-[11px] font-bold tracking-[0.08em]"
                                                style={{
                                                    color: isSel
                                                        ? "var(--color-hex-f2f2f2)"
                                                        : "var(--color-hex-888888)",
                                                }}
                                            >
                                                {host.ip}
                                            </span>
                                            <span className="text-[9px] text-[var(--color-hex-555555)]">
                                                ·
                                            </span>
                                            <span
                                                className="text-[10px] tracking-[0.04em]"
                                                style={{
                                                    color: isSel
                                                        ? "var(--color-hex-a0a0a0)"
                                                        : "var(--color-hex-555555)",
                                                }}
                                            >
                                                {host.hostname}
                                            </span>
                                        </div>
                                        <div className="mb-[8px] text-[9px] tracking-[0.14em] text-[var(--color-hex-444444)]">
                                            {host.role}
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {host.services.map((s) => (
                                                <span
                                                    key={s}
                                                    className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[5px] py-[1px] text-[8px] tracking-[0.08em] text-[var(--color-hex-555555)]"
                                                >
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Right: status + eord */}
                                    <div className="flex flex-shrink-0 flex-col items-end gap-2">
                                        <span
                                            className="rounded-[2px] px-[6px] py-[1px] text-[8px] font-semibold tracking-[0.14em]"
                                            style={{
                                                color: sb.color,
                                                background: sb.bg,
                                                border: `1px solid ${sb.border}`,
                                            }}
                                        >
                                            {host.status}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-[7.5px] tracking-[0.12em] text-[var(--color-hex-444444)]">
                                                E_ord
                                            </span>
                                            <span
                                                className="text-[10px] font-bold"
                                                style={{
                                                    color: EORD_COLOR[host.eord],
                                                }}
                                            >
                                                {host.eord}/5
                                            </span>
                                        </div>
                                        <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                            {host.os}
                                        </span>
                                    </div>
                                </button>

                                {/* Edge connector to next host */}
                                {host.edges.map((edge) => (
                                    <div key={edge.to} className="ml-[28px] flex items-stretch">
                                        {/* Vertical line */}
                                        <div
                                            className="w-[1px] shrink-0 bg-[var(--color-hex-292929)]"
                                            style={{
                                                margin: "0 0 0 4px",
                                            }}
                                        />
                                        {/* Edge label */}
                                        <div
                                            className="flex flex-col justify-center"
                                            style={{
                                                paddingLeft: 16,
                                                paddingTop: 6,
                                                paddingBottom: 6,
                                            }}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-[8px] tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                                                    →
                                                </span>
                                                <span className="text-[9px] font-semibold tracking-[0.1em] text-[var(--color-hex-555555)]">
                                                    {edge.label.toUpperCase()}
                                                </span>
                                                <span className="text-[8px] tracking-[0.08em] text-[var(--color-hex-333333)]">
                                                    {edge.detail}
                                                </span>
                                                <span
                                                    className="text-[7.5px] tracking-[0.1em]"
                                                    style={{
                                                        color: EORD_COLOR[edge.eord],
                                                    }}
                                                >
                                                    E_ord {edge.eord}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        );
                    })}
                </div>

                {/* Caption */}
                <div className="mt-8 flex max-w-[480px] items-start gap-2 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0b0b0b)] px-[14px] py-[10px]">
                    <span className="shrink-0 text-[10px] text-[var(--color-hex-e31b23)]">ⓘ</span>
                    <span className="text-[9px] leading-[1.7] tracking-[0.06em] text-[var(--color-hex-444444)]">
                        Topology represents{" "}
                        <strong className="text-[var(--color-hex-666666)]">confirmed facts</strong>{" "}
                        from the Environmental Layer only. Dashed edges are inferred from network
                        scan data and have not been directly observed. This diagram is not the VDG
                        attack graph.
                    </span>
                </div>
            </div>

            {/* Right: host detail panel */}
            <div className="w-[280px] flex-shrink-0 overflow-y-auto bg-[var(--color-hex-0b0b0b)]">
                {sel ? (
                    <>
                        <div
                            className="px-5 pt-5 pb-4"
                            style={{
                                borderBottom: "1px solid var(--color-hex-1e1e1e)",
                            }}
                        >
                            <div className="mb-[6px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                HOST DETAIL
                            </div>
                            <div className="mb-[2px] text-[13px] font-bold tracking-[0.1em] text-[var(--color-hex-f2f2f2)]">
                                {sel.ip}
                            </div>
                            <div className="text-[9px] tracking-[0.14em] text-[var(--color-hex-e31b23)]">
                                {sel.id}
                            </div>
                        </div>
                        <div
                            className="flex flex-col gap-3 px-5 py-4"
                            style={{
                                borderBottom: "1px solid var(--color-hex-1e1e1e)",
                            }}
                        >
                            {[
                                {
                                    k: "HOSTNAME",
                                    v: sel.hostname,
                                },
                                {
                                    k: "ROLE",
                                    v: sel.role,
                                },
                                {
                                    k: "OS",
                                    v: sel.os,
                                },
                                {
                                    k: "STATUS",
                                    v: sel.status,
                                },
                                {
                                    k: "E_ord",
                                    v: `${sel.eord} / 5`,
                                },
                            ].map((r) => (
                                <div key={r.k}>
                                    <div className="mb-[1px] text-[7.5px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                                        {r.k}
                                    </div>
                                    <div className="text-[10px] tracking-[0.06em] text-[var(--color-hex-888888)]">
                                        {r.v}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div
                            className="px-5 py-4"
                            style={{
                                borderBottom: "1px solid var(--color-hex-1e1e1e)",
                            }}
                        >
                            <div className="mb-[8px] text-[7.5px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                OPEN SERVICES
                            </div>
                            <div className="flex flex-col gap-1.5">
                                {sel.services.map((s) => (
                                    <div key={s} className="flex items-center gap-2">
                                        <div
                                            className="h-[5px] w-[5px] shrink-0 bg-[var(--color-hex-3fb950)]"
                                            style={{
                                                borderRadius: "50%",
                                            }}
                                        />
                                        <span className="text-[9.5px] tracking-[0.06em] text-[var(--color-hex-666666)]">
                                            {s}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {sel.edges.length > 0 && (
                            <div className="px-5 py-4">
                                <div className="mb-[8px] text-[7.5px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                    LATERAL EDGES
                                </div>
                                {sel.edges.map((e) => (
                                    <div
                                        key={e.to}
                                        className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[10px] py-[8px]"
                                    >
                                        <div className="mb-[3px] text-[9px] tracking-[0.1em] text-[var(--color-hex-e31b23)]">
                                            → {e.to}
                                        </div>
                                        <div className="mb-[2px] text-[8.5px] tracking-[0.06em] text-[var(--color-hex-555555)]">
                                            {e.label}
                                        </div>
                                        <div className="text-[8px] tracking-[0.06em] text-[var(--color-hex-444444)]">
                                            {e.detail}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center text-[10px] tracking-[0.16em] text-[var(--color-hex-222222)]">
                        SELECT A HOST
                    </div>
                )}
            </div>
        </div>
    );
}
const CREDS = [
    {
        username: "admin",
        hash: "5f4dcc3b5aa765d61d8327deb882cf99",
        source: "DB DUMP /api/users",
        scope: "ADMIN",
        status: "CRACKED",
        plain: "password123",
    },
    {
        username: "john.doe",
        hash: "482c811da5d5b4bc6d497ffa98491e38",
        source: "RESPONSE BODY /api/users/1",
        scope: "USER",
        status: "CRACKED",
        plain: "password!1",
    },
    {
        username: "sarah.admin",
        hash: "e10adc3949ba59abbe56e057f20f883e",
        source: "DB DUMP /api/users",
        scope: "ADMIN",
        status: "CRACKED",
        plain: "123456",
    },
    {
        username: "api_service",
        hash: "d8578edf8458ce06fbc5bb76a58c5ca4",
        source: "CONFIG /static/config.json",
        scope: "SERVICE",
        status: "CRACKED",
        plain: "qwerty",
    },
    {
        username: "backup_user",
        hash: "1a1dc91c907325c69271ddf0c944bc72",
        source: "DB DUMP /api/users",
        scope: "USER",
        status: "UNCRACKED",
        plain: "",
    },
    {
        username: "monitor",
        hash: "3fc0a7acf087f549ac2b266baf94b8b1",
        source: "NMAP BANNER :6379",
        scope: "SERVICE",
        status: "UNCRACKED",
        plain: "",
    },
];
function CredentialsPanel() {
    const [revealed, setRevealed] = useState<Set<string>>(new Set());
    const toggle = (u: string) =>
        setRevealed((p) => {
            const n = new Set(p);
            n.has(u) ? n.delete(u) : n.add(u);
            return n;
        });
    return (
        <>
            <div
                className="flex items-center justify-between bg-[var(--color-hex-0b0b0b)] px-6 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <span className="text-[8.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                    {CREDS.length} CREDENTIALS EXTRACTED · SOURCE: DB DUMP + RESPONSE BODY ·
                    OBSERVED
                </span>
                <span className="text-[8px] tracking-[0.14em] text-[var(--color-hex-d29922)]">
                    4 CRACKED · 2 UNCRACKED
                </span>
            </div>
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="bg-[var(--color-hex-0f0f0f)]">
                        {["USERNAME", "PASSWORD / HASH", "SOURCE", "SCOPE", "STATUS", ""].map(
                            (h) => (
                                <th
                                    key={h}
                                    className="px-[16px] py-[6px] text-left text-[8px] font-semibold tracking-[0.18em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                    }}
                                >
                                    {h}
                                </th>
                            ),
                        )}
                    </tr>
                </thead>
                <tbody>
                    {CREDS.map((row) => {
                        const isRev = revealed.has(row.username);
                        const cracked = row.status === "CRACKED";
                        return (
                            <tr
                                key={row.username}
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td className="px-[16px] py-[8px] font-semibold tracking-[0.06em] text-[var(--color-hex-a0a0a0)]">
                                    {row.username}
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    {isRev && cracked ? (
                                        <span className="tracking-[0.06em] text-[var(--color-hex-e31b23)]">
                                            {row.plain}
                                        </span>
                                    ) : (
                                        <span className="font-inherit tracking-[0.12em] text-[var(--color-hex-333333)]">
                                            {"●".repeat(12)}
                                        </span>
                                    )}
                                    {!cracked && (
                                        <span className="ml-[8px] text-[9px] tracking-[0.06em] text-[var(--color-hex-333333)]">
                                            {row.hash.slice(0, 16)}…
                                        </span>
                                    )}
                                </td>
                                <td className="px-[16px] py-[8px] text-[9px] text-[var(--color-hex-444444)]">
                                    {row.source}
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    <span
                                        className="text-[9px] tracking-[0.12em]"
                                        style={{
                                            color:
                                                row.scope === "ADMIN"
                                                    ? "var(--color-hex-e31b23)"
                                                    : row.scope === "SERVICE"
                                                      ? "var(--color-hex-d29922)"
                                                      : "var(--color-hex-666666)",
                                        }}
                                    >
                                        {row.scope}
                                    </span>
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    <span
                                        className="text-[9px] font-semibold tracking-[0.12em]"
                                        style={{
                                            color: cracked
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-555555)",
                                        }}
                                    >
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-[16px] py-[8px]">
                                    {cracked && (
                                        <button
                                            onClick={() => toggle(row.username)}
                                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[var(--color-hex-111111)] px-[8px] py-[2px] text-[8.5px] tracking-[0.12em] text-[var(--color-hex-666666)] hover:border-[var(--color-hex-e31b23)]"
                                        >
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
const METHOD_COLOR: Record<string, string> = {
    GET: "var(--color-hex-3fb950)",
    POST: "var(--color-hex-d29922)",
    PUT: "var(--color-hex-8b8b8b)",
    DELETE: "var(--color-hex-ff2a32)",
    PATCH: "var(--color-hex-d29922)",
};
const STATUS_COLOR: Record<string, string> = {
    OPEN: "var(--color-hex-3fb950)",
    FILTERED: "var(--color-hex-d29922)",
    CLOSED: "var(--color-hex-444444)",
};
export default function EnvironmentalLayer() {
    const [tab, setTab] = useState<ELTab>("ENDPOINTS");
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Header */}
            <div
                className="flex-shrink-0 px-6 pt-5 pb-0"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    ENVIRONMENT
                </div>
                <div className="mb-3 flex items-baseline gap-3">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        ENVIRONMENTAL LAYER
                    </h1>
                    <span className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a4a20)] bg-[var(--color-hex-0a1a10)] px-[7px] py-[1px] text-[9px] tracking-[0.16em] text-[var(--color-hex-3fb950)]">
                        CONFIRMED
                    </span>
                </div>
                {/* Tabs */}
                <div className="flex items-end gap-0 overflow-x-auto">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className="font-inherit cursor-pointer border-none bg-[transparent] px-[12px] py-[5px] text-[9px] tracking-[0.14em] whitespace-nowrap"
                            style={{
                                borderBottom:
                                    t === tab
                                        ? "2px solid var(--color-hex-e31b23)"
                                        : "2px solid transparent",
                                color:
                                    t === tab
                                        ? "var(--color-hex-f2f2f2)"
                                        : "var(--color-hex-444444)",
                                marginBottom: -1,
                            }}
                            onMouseEnter={(e) => {
                                if (t !== tab) {
                                    e.currentTarget.style.color = "var(--color-hex-888888)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (t !== tab) {
                                    e.currentTarget.style.color = "var(--color-hex-444444)";
                                }
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {tab === "ENDPOINTS" && (
                    <>
                        <div
                            className="flex items-center justify-between bg-[var(--color-hex-0b0b0b)] px-6 py-2"
                            style={{
                                borderBottom: "1px solid var(--color-hex-1e1e1e)",
                            }}
                        >
                            <span className="text-[8.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                {ENDPOINTS.length} OBSERVED ENDPOINTS · SOURCE: SPIDER + INFERENCE ·
                                OBSERVED
                            </span>
                            <span className="text-[8px] tracking-[0.14em] text-[var(--color-hex-3fb950)]">
                                E_ord ≥ 3 — CLEAR
                            </span>
                        </div>
                        <table className="w-full border-collapse text-[10.5px]">
                            <thead>
                                <tr className="bg-[var(--color-hex-0f0f0f)]">
                                    {[
                                        "ENDPOINT",
                                        "METHOD",
                                        "AUTH",
                                        "PARAMETERS",
                                        "SOURCE",
                                        "LAST SEEN",
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="px-[16px] py-[6px] text-left text-[8px] font-semibold tracking-[0.18em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                            style={{
                                                borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                            }}
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {ENDPOINTS.map((row, i) => (
                                    <tr
                                        key={i}
                                        className="cursor-pointer"
                                        style={{
                                            borderBottom: "1px solid var(--color-hex-111111)",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                "var(--color-hex-0f0f0f)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = "transparent")
                                        }
                                    >
                                        <td className="font-inherit px-[16px] py-[7px] whitespace-nowrap text-[var(--color-hex-a0a0a0)]">
                                            {row.endpoint}
                                        </td>
                                        <td className="px-[16px] py-[7px] whitespace-nowrap">
                                            <span
                                                className="rounded-[2px] px-[5px] py-[1px] text-[9px] font-semibold tracking-[0.1em]"
                                                style={{
                                                    color: METHOD_COLOR[row.method] ?? "#666",
                                                    background: `${METHOD_COLOR[row.method]}15`,
                                                    border: `1px solid ${METHOD_COLOR[row.method]}33`,
                                                }}
                                            >
                                                {row.method}
                                            </span>
                                        </td>
                                        <td className="px-[16px] py-[7px] text-[9.5px] whitespace-nowrap text-[var(--color-hex-555555)]">
                                            {row.auth}
                                        </td>
                                        <td className="px-[16px] py-[7px] text-[9.5px] text-[var(--color-hex-444444)]">
                                            {row.params}
                                        </td>
                                        <td className="px-[16px] py-[7px] text-[9px] tracking-[0.1em] text-[var(--color-hex-333333)]">
                                            {row.source}
                                        </td>
                                        <td className="px-[16px] py-[7px] text-[9px] whitespace-nowrap text-[var(--color-hex-333333)]">
                                            {row.seen}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </>
                )}

                {tab === "SERVICES" && (
                    <>
                        <div
                            className="flex items-center justify-between bg-[var(--color-hex-0b0b0b)] px-6 py-2"
                            style={{
                                borderBottom: "1px solid var(--color-hex-1e1e1e)",
                            }}
                        >
                            <span className="text-[8.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                {SERVICES.length} SERVICES DETECTED · SOURCE: NMAP 7.94 · DISCOVERED
                            </span>
                            <span className="text-[8px] tracking-[0.14em] text-[var(--color-hex-3fb950)]">
                                E_ord ≥ 4 — CONFIRMED
                            </span>
                        </div>
                        <table className="w-full border-collapse text-[10.5px]">
                            <thead>
                                <tr className="bg-[var(--color-hex-0f0f0f)]">
                                    {["HOST", "PORT", "SERVICE", "VERSION", "BANNER", "STATUS"].map(
                                        (h) => (
                                            <th
                                                key={h}
                                                className="px-[16px] py-[6px] text-left text-[8px] font-semibold tracking-[0.18em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                                style={{
                                                    borderBottom:
                                                        "1px solid var(--color-hex-1a1a1a)",
                                                }}
                                            >
                                                {h}
                                            </th>
                                        ),
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {SERVICES.map((row, i) => (
                                    <tr
                                        key={i}
                                        className="cursor-pointer"
                                        style={{
                                            borderBottom: "1px solid var(--color-hex-111111)",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.background =
                                                "var(--color-hex-0f0f0f)")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.background = "transparent")
                                        }
                                    >
                                        <td className="px-[16px] py-[7px] whitespace-nowrap text-[var(--color-hex-666666)]">
                                            {row.host}
                                        </td>
                                        <td className="px-[16px] py-[7px] text-right font-bold text-[var(--color-hex-a0a0a0)]">
                                            {row.port}
                                        </td>
                                        <td className="px-[16px] py-[7px] tracking-[0.08em] text-[var(--color-hex-a0a0a0)]">
                                            {row.service}
                                        </td>
                                        <td className="px-[16px] py-[7px] text-[9.5px] text-[var(--color-hex-555555)]">
                                            {row.version}
                                        </td>
                                        <td className="px-[16px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                            {row.banner}
                                        </td>
                                        <td className="px-[16px] py-[7px] whitespace-nowrap">
                                            <span
                                                className="text-[9px] font-semibold tracking-[0.12em]"
                                                style={{
                                                    color: STATUS_COLOR[row.status],
                                                }}
                                            >
                                                {row.status}
                                            </span>
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
    {
        id: "AS-001",
        session: "sess_8f4a2b",
        user: "admin@targetcorp.com",
        role: "ADMIN",
        method: "JWT/HS256",
        issued: "06:22:14",
        expiry: "07:22:14",
        status: "ACTIVE",
        csrf: "b3d9f1e2",
    },
    {
        id: "AS-002",
        session: "sess_2c7e9d",
        user: "user@targetcorp.com",
        role: "USER",
        method: "SESSION_COOKIE",
        issued: "06:12:18",
        expiry: "06:42:18",
        status: "EXPIRED",
        csrf: "—",
    },
    {
        id: "AS-003",
        session: "sess_forged",
        user: "admin@targetcorp.com",
        role: "ADMIN",
        method: "JWT/FORGED",
        issued: "06:22:50",
        expiry: "07:22:50",
        status: "ACTIVE",
        csrf: "—",
    },
];
function AuthStatesPanel() {
    return (
        <div className="flex-1 overflow-auto">
            <div
                className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                }}
            >
                <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-3fb950)]">
                    CONFIRMED
                </span>
                <span className="ml-[8px] text-[8px] tracking-[0.12em] text-[var(--color-hex-555555)]">
                    Active authentication sessions observed by Specialists
                </span>
            </div>
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                        {[
                            "ID",
                            "SESSION",
                            "USER",
                            "ROLE",
                            "METHOD",
                            "ISSUED",
                            "EXPIRY",
                            "STATUS",
                            "CSRF TOKEN",
                        ].map((h) => (
                            <th
                                key={h}
                                className="px-[12px] py-[6px] text-left text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {AUTH_STATES.map((a, i) => (
                        <tr
                            key={a.id}
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                            }
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                            <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                {a.id}
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                {a.session}
                            </td>
                            <td className="px-[12px] py-[7px] text-[var(--color-hex-a0a0a0)]">
                                {a.user}
                            </td>
                            <td className="px-[12px] py-[7px]">
                                <span
                                    className="text-[8.5px] font-semibold tracking-[0.1em]"
                                    style={{
                                        color:
                                            a.role === "ADMIN"
                                                ? "var(--color-hex-ff2a32)"
                                                : "var(--color-hex-666666)",
                                    }}
                                >
                                    {a.role}
                                </span>
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                {a.method}
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                {a.issued}
                            </td>
                            <td
                                className="px-[12px] py-[7px] text-[9px]"
                                style={{
                                    color:
                                        a.status === "EXPIRED"
                                            ? "var(--color-hex-333333)"
                                            : "var(--color-hex-444444)",
                                }}
                            >
                                {a.expiry}
                            </td>
                            <td className="px-[12px] py-[7px]">
                                <span
                                    className="text-[8.5px] font-semibold tracking-[0.12em]"
                                    style={{
                                        color:
                                            a.status === "ACTIVE"
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-444444)",
                                    }}
                                >
                                    {a.status}
                                </span>
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] tracking-[0.06em] text-[var(--color-hex-444444)]">
                                {a.csrf}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ─── PARAMETERS ─────────────────────────────────────── */
const PARAMS = [
    {
        id: "P-001",
        endpoint: "GET /api/users",
        param: "id",
        type: "INTEGER",
        source: "QUERY",
        injectable: true,
        lastVal: "1",
    },
    {
        id: "P-002",
        endpoint: "POST /api/auth/login",
        param: "username",
        type: "STRING",
        source: "BODY",
        injectable: false,
        lastVal: "admin@targetcorp.com",
    },
    {
        id: "P-003",
        endpoint: "POST /api/auth/login",
        param: "password",
        type: "STRING",
        source: "BODY",
        injectable: false,
        lastVal: "[REDACTED]",
    },
    {
        id: "P-004",
        endpoint: "GET /api/users/:id",
        param: "id",
        type: "PATH",
        source: "PATH",
        injectable: true,
        lastVal: "1",
    },
    {
        id: "P-005",
        endpoint: "GET /api/products",
        param: "category",
        type: "STRING",
        source: "QUERY",
        injectable: true,
        lastVal: "electronics",
    },
    {
        id: "P-006",
        endpoint: "GET /api/products",
        param: "sort",
        type: "STRING",
        source: "QUERY",
        injectable: false,
        lastVal: "asc",
    },
    {
        id: "P-007",
        endpoint: "POST /api/graphql",
        param: "query",
        type: "STRING",
        source: "BODY",
        injectable: true,
        lastVal: "{ users { id } }",
    },
    {
        id: "P-008",
        endpoint: "GET /api/orders",
        param: "user_id",
        type: "INTEGER",
        source: "QUERY",
        injectable: true,
        lastVal: "1",
    },
];
function ParametersPanel() {
    return (
        <div className="flex-1 overflow-auto">
            <div
                className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                }}
            >
                <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                    DISCOVERED PARAMETERS
                </span>
                <span className="ml-auto text-[8px] tracking-[0.12em] text-[var(--color-hex-e31b23)]">
                    {PARAMS.filter((p) => p.injectable).length} INJECTION ELIGIBLE
                </span>
            </div>
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                        {[
                            "ID",
                            "ENDPOINT",
                            "PARAMETER",
                            "TYPE",
                            "SOURCE",
                            "INJECTABLE",
                            "LAST VALUE",
                        ].map((h) => (
                            <th
                                key={h}
                                className="px-[12px] py-[6px] text-left text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {PARAMS.map((p, i) => (
                        <tr
                            key={p.id}
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                                background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    i % 2 ? "var(--color-hex-0b0b0b)" : "transparent")
                            }
                        >
                            <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                {p.id}
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                {p.endpoint}
                            </td>
                            <td className="px-[12px] py-[7px] font-semibold text-[var(--color-hex-a0a0a0)]">
                                {p.param}
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                {p.type}
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                {p.source}
                            </td>
                            <td className="px-[12px] py-[7px]">
                                <span
                                    className="text-[8.5px] font-semibold tracking-[0.12em]"
                                    style={{
                                        color: p.injectable
                                            ? "var(--color-hex-ff2a32)"
                                            : "var(--color-hex-333333)",
                                    }}
                                >
                                    {p.injectable ? "YES" : "—"}
                                </span>
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                {p.lastVal}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

/* ─── CVE CANDIDATES ──────────────────────────────────── */
const CVE_CANDIDATES = [
    {
        id: "CVE-2024-1187",
        tech: "PostgreSQL 14.8",
        class: "SQL INJECTION",
        epss: 0.71,
        poc: true,
        node: "SQLI-001",
        eord: 4,
    },
    {
        id: "CVE-2023-9921",
        tech: "nginx/1.24.0",
        class: "PATH TRAVERSAL",
        epss: 0.38,
        poc: false,
        node: "PATH-005",
        eord: 1,
    },
    {
        id: "CVE-2024-5532",
        tech: "Flask/Jinja2",
        class: "SSTI",
        epss: 0.55,
        poc: true,
        node: "SSTI-006",
        eord: 1,
    },
    {
        id: "CVE-2022-3916",
        tech: "OpenSSH 8.9p1",
        class: "AUTH BYPASS",
        epss: 0.22,
        poc: false,
        node: "AUTH-001",
        eord: 3,
    },
    {
        id: "CVE-2024-0012",
        tech: "Gunicorn 20.1.0",
        class: "REQUEST SMUGGLING",
        epss: 0.18,
        poc: false,
        node: "—",
        eord: 0,
    },
    {
        id: "CVE-2023-4863",
        tech: "Redis 7.0.11",
        class: "COMMAND INJECTION",
        epss: 0.63,
        poc: true,
        node: "RCE-007",
        eord: 0,
    },
];
function CVECandidatesPanel() {
    return (
        <div className="flex-1 overflow-auto">
            <div
                className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                }}
            >
                <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                    VDG HYPOTHESIS CANDIDATES
                </span>
                <span className="ml-auto text-[8px] tracking-[0.12em] text-[var(--color-hex-d29922)]">
                    {CVE_CANDIDATES.filter((c) => c.poc).length} WITH PoC
                </span>
            </div>
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                        {[
                            "CVE ID",
                            "TECHNOLOGY",
                            "VULN CLASS",
                            "EPSS",
                            "PoC",
                            "LINKED VDG NODE",
                            "E_ORD",
                        ].map((h) => (
                            <th
                                key={h}
                                className="px-[12px] py-[6px] text-left text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {[...CVE_CANDIDATES]
                        .sort((a, b) => b.epss - a.epss)
                        .map((c, i) => (
                            <tr
                                key={c.id}
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background = "transparent")
                                }
                            >
                                <td className="px-[12px] py-[7px] text-[9px] font-bold tracking-[0.06em] text-[var(--color-hex-e31b23)]">
                                    {c.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-[var(--color-hex-a0a0a0)]">
                                    {c.tech}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                    {c.class}
                                </td>
                                <td className="px-[12px] py-[7px]">
                                    <span
                                        className="text-[10px] font-bold"
                                        style={{
                                            color:
                                                c.epss > 0.5
                                                    ? "var(--color-hex-ff2a32)"
                                                    : c.epss > 0.3
                                                      ? "var(--color-hex-d29922)"
                                                      : "var(--color-hex-555555)",
                                        }}
                                    >
                                        {c.epss.toFixed(2)}
                                    </span>
                                </td>
                                <td className="px-[12px] py-[7px]">
                                    <span
                                        className="text-[8.5px] tracking-[0.12em]"
                                        style={{
                                            color: c.poc
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-333333)",
                                        }}
                                    >
                                        {c.poc ? "YES" : "NO"}
                                    </span>
                                </td>
                                <td
                                    className="px-[12px] py-[7px] text-[9px]"
                                    style={{
                                        color:
                                            c.node !== "—"
                                                ? "var(--color-hex-e31b23)"
                                                : "var(--color-hex-333333)",
                                        fontWeight: c.node !== "—" ? 700 : 400,
                                    }}
                                >
                                    {c.node}
                                </td>
                                <td className="px-[12px] py-[7px] text-[var(--color-hex-666666)]">
                                    {c.eord}/5
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}

/* ─── FINDINGS (EL cross-ref) ─────────────────────────── */
const EL_FINDINGS = [
    {
        id: "F-001",
        type: "SQL INJECTION",
        target: "/api/users?id=",
        eord: 5,
        vdgNode: "SQLI-001",
        evidence: ["ev-00483-req", "ev-00483-resp", "ev-00484-timing"],
    },
    {
        id: "F-002",
        type: "AUTH BYPASS",
        target: "/api/auth/login",
        eord: 4,
        vdgNode: "AUTH-001",
        evidence: ["ev-00241-jwt", "ev-00242-forged"],
    },
    {
        id: "F-003",
        type: "IDOR",
        target: "/api/users/:id",
        eord: 4,
        vdgNode: "IDOR-008",
        evidence: ["ev-00301-crossacc"],
    },
    {
        id: "F-004",
        type: "XSS REFLECTED",
        target: "/search?q=",
        eord: 3,
        vdgNode: "XSS-002",
        evidence: ["ev-00411-reflect"],
    },
    {
        id: "F-005",
        type: "SENSITIVE DATA",
        target: "/static/config.json",
        eord: 4,
        vdgNode: "ENUM-002",
        evidence: ["ev-00121-static"],
    },
];
function ELFindingsPanel() {
    return (
        <div className="flex-1 overflow-auto">
            <div
                className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                }}
            >
                <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                    EL FINDINGS CROSS-REFERENCE
                </span>
                <span className="ml-[8px] text-[8px] text-[var(--color-hex-555555)]">
                    confirmed findings linked to EL evidence artifacts
                </span>
            </div>
            <table className="w-full border-collapse text-[10.5px]">
                <thead>
                    <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                        {[
                            "FINDING",
                            "TYPE",
                            "TARGET",
                            "E_ORD",
                            "LINKED VDG NODE",
                            "EVIDENCE ARTIFACTS",
                        ].map((h) => (
                            <th
                                key={h}
                                className="px-[12px] py-[6px] text-left text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {EL_FINDINGS.map((f, i) => (
                        <tr
                            key={f.id}
                            style={{
                                borderBottom: "1px solid var(--color-hex-111111)",
                                background: i % 2 ? "var(--color-hex-0b0b0b)" : "transparent",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.background =
                                    i % 2 ? "var(--color-hex-0b0b0b)" : "transparent")
                            }
                        >
                            <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                {f.id}
                            </td>
                            <td className="px-[12px] py-[7px] text-[var(--color-hex-a0a0a0)]">
                                {f.type}
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                {f.target}
                            </td>
                            <td className="px-[12px] py-[7px] text-[var(--color-hex-666666)]">
                                {f.eord}/5
                            </td>
                            <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                {f.vdgNode}
                            </td>
                            <td className="px-[12px] py-[7px]">
                                <div className="flex flex-wrap gap-1">
                                    {f.evidence.map((e) => (
                                        <span
                                            key={e}
                                            className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[5px] py-[1px] text-[7.5px] tracking-[0.08em] text-[var(--color-hex-444444)]"
                                        >
                                            {e}
                                        </span>
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
    {
        id: "ev-00483-resp",
        type: "HTTP RESPONSE",
        finding: "F-001",
        ts: "06:30:51",
        size: "1,247B",
        note: "4.18s RTT — timing injection confirmed",
    },
    {
        id: "ev-00483-req",
        type: "HTTP REQUEST",
        finding: "F-001",
        ts: "06:30:47",
        size: "412B",
        note: "Time-based SLEEP(4) payload",
    },
    {
        id: "ev-00484-timing",
        type: "TIMING DELTA",
        finding: "F-001",
        ts: "06:30:58",
        size: "84B",
        note: "4,100ms above baseline, σ=12ms",
    },
    {
        id: "ev-00241-jwt",
        type: "TOKEN ARTIFACT",
        finding: "F-002",
        ts: "06:22:00",
        size: "312B",
        note: "HS256 JWT with weak secret cracked",
    },
    {
        id: "ev-00242-forged",
        type: "TOKEN ARTIFACT",
        finding: "F-002",
        ts: "06:22:14",
        size: "312B",
        note: "Forged admin token — access confirmed",
    },
    {
        id: "ev-00301-crossacc",
        type: "HTTP RESPONSE",
        finding: "F-003",
        ts: "06:25:33",
        size: "891B",
        note: "id=2 returned while auth as id=1",
    },
    {
        id: "ev-00411-reflect",
        type: "HTTP RESPONSE",
        finding: "F-004",
        ts: "06:28:47",
        size: "6,012B",
        note: "Input reflected unescaped in response",
    },
    {
        id: "ev-00121-static",
        type: "FILE CONTENT",
        finding: "F-005",
        ts: "06:16:07",
        size: "2,341B",
        note: "DB credentials exposed in config.json",
    },
];
function EvidencePanel() {
    const [sel, setSel] = useState<string | null>(null);
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex min-w-[0px] flex-1 flex-col overflow-y-auto">
                <div
                    className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                    style={{
                        borderBottom: "1px solid var(--color-hex-141414)",
                    }}
                >
                    <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                        RAW EVIDENCE ARTIFACTS
                    </span>
                    <span className="ml-auto text-[8px] text-[var(--color-hex-555555)]">
                        {EVIDENCE_ARTIFACTS.length} ARTIFACTS
                    </span>
                </div>
                <table className="w-full border-collapse text-[10.5px]">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                            {["ARTIFACT ID", "TYPE", "FINDING", "TIMESTAMP", "SIZE", "NOTE"].map(
                                (h) => (
                                    <th
                                        key={h}
                                        className="px-[12px] py-[6px] text-left text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                        style={{
                                            borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                        }}
                                    >
                                        {h}
                                    </th>
                                ),
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {EVIDENCE_ARTIFACTS.map((a, i) => (
                            <tr
                                key={a.id}
                                onClick={() => setSel(a.id === sel ? null : a.id)}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                    background:
                                        sel === a.id
                                            ? "var(--color-hex-0f0f0f)"
                                            : i % 2
                                              ? "var(--color-hex-0b0b0b)"
                                              : "transparent",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        sel === a.id
                                            ? "var(--color-hex-0f0f0f)"
                                            : i % 2
                                              ? "var(--color-hex-0b0b0b)"
                                              : "transparent")
                                }
                            >
                                <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                    {a.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                    {a.type}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                    {a.finding}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                    {a.ts}
                                </td>
                                <td className="px-[12px] py-[7px] text-right text-[9px] text-[var(--color-hex-444444)]">
                                    {a.size}
                                </td>
                                <td className="px-[12px] py-[7px] text-[var(--color-hex-555555)]">
                                    {a.note}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sel && (
                <div
                    className="w-[280px] shrink-0 overflow-y-auto bg-[var(--color-hex-0a0a0a)] px-[14px] py-[16px]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    {(() => {
                        const a = EVIDENCE_ARTIFACTS.find((x) => x.id === sel)!;
                        return (
                            <>
                                <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                    ARTIFACT DETAIL
                                </div>
                                {[
                                    {
                                        k: "ID",
                                        v: a.id,
                                    },
                                    {
                                        k: "TYPE",
                                        v: a.type,
                                    },
                                    {
                                        k: "FINDING",
                                        v: a.finding,
                                    },
                                    {
                                        k: "TIMESTAMP",
                                        v: a.ts,
                                    },
                                    {
                                        k: "SIZE",
                                        v: a.size,
                                    },
                                ].map((r) => (
                                    <div key={r.k} className="mb-[8px]">
                                        <div className="mb-[2px] text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                            {r.k}
                                        </div>
                                        <div className="text-[10px] text-[var(--color-hex-888888)]">
                                            {r.v}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-[12px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[10px] py-[8px] text-[9px] leading-[1.8] text-[var(--color-hex-555555)]">
                                    {a.note}
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}

/* ─── FAILURES ────────────────────────────────────────── */
const FAILURE_LOG = [
    {
        id: "FL-011",
        ts: "06:29:44",
        spec: "INJECT-SPEC",
        action: "SQLI_PROBE",
        target: "/api/users?id=1' UNION",
        error: "UNION SELECT column mismatch — HTTP 400",
        eord: 1,
        resolved: true,
    },
    {
        id: "FL-010",
        ts: "06:29:03",
        spec: "NETWORK-SPEC",
        action: "PORT_SCAN",
        target: "5432/tcp",
        error: "TIMEOUT after 120s — port filtered",
        eord: 0,
        resolved: false,
    },
    {
        id: "FL-009",
        ts: "06:28:12",
        spec: "INJECT-SPEC",
        action: "SQLI_ERROR_BASED",
        target: "/api/users?id=",
        error: "No SQL error — error-based ruled out",
        eord: 1,
        resolved: true,
    },
    {
        id: "FL-008",
        ts: "06:24:41",
        spec: "AUTH-SPEC",
        action: "BRUTE_FORCE",
        target: "/api/auth/login",
        error: "Rate limiting — 429 after 50 attempts",
        eord: 0,
        resolved: true,
    },
    {
        id: "FL-007",
        ts: "06:21:08",
        spec: "RECON-SPEC",
        action: "DIR_ENUM",
        target: "/admin/*",
        error: "403 Forbidden — directory listing off",
        eord: 0,
        resolved: false,
    },
    {
        id: "FL-006",
        ts: "06:18:33",
        spec: "INJECT-SPEC",
        action: "XSS_CANARY",
        target: "/search?q=",
        error: "CSP blocks inline scripts — adapting",
        eord: 2,
        resolved: false,
    },
];
function FailuresPanel() {
    const [sel, setSel] = useState<string | null>(null);
    return (
        <div className="flex min-h-[0px] flex-1 overflow-hidden">
            <div className="flex min-w-[0px] flex-1 flex-col overflow-y-auto">
                <div
                    className="flex flex-shrink-0 items-center gap-2 bg-[var(--color-hex-0a0a0a)] px-4 py-2"
                    style={{
                        borderBottom: "1px solid var(--color-hex-141414)",
                    }}
                >
                    <span className="text-[8px] tracking-[0.18em] text-[var(--color-hex-444444)]">
                        SPECIALIST FAILURE LOG
                    </span>
                    <span className="ml-auto text-[8px] tracking-[0.12em] text-[var(--color-hex-d29922)]">
                        {FAILURE_LOG.filter((f) => !f.resolved).length} UNRESOLVED
                    </span>
                </div>
                <table className="w-full border-collapse text-[10.5px]">
                    <thead>
                        <tr className="sticky top-0 bg-[var(--color-hex-0f0f0f)]">
                            {[
                                "ID",
                                "TIMESTAMP",
                                "SPECIALIST",
                                "ACTION",
                                "TARGET",
                                "ERROR",
                                "E_ORD",
                                "RESOLVED",
                            ].map((h) => (
                                <th
                                    key={h}
                                    className="px-[12px] py-[6px] text-left text-[8px] font-semibold tracking-[0.16em] whitespace-nowrap text-[var(--color-hex-444444)]"
                                    style={{
                                        borderBottom: "1px solid var(--color-hex-1a1a1a)",
                                    }}
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {FAILURE_LOG.map((f, i) => (
                            <tr
                                key={f.id}
                                onClick={() => setSel(f.id === sel ? null : f.id)}
                                className="cursor-pointer"
                                style={{
                                    borderBottom: "1px solid var(--color-hex-111111)",
                                    background:
                                        sel === f.id
                                            ? "var(--color-hex-110808)"
                                            : i % 2
                                              ? "var(--color-hex-0b0b0b)"
                                              : "transparent",
                                }}
                                onMouseEnter={(e) =>
                                    (e.currentTarget.style.background = "var(--color-hex-0f0f0f)")
                                }
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.background =
                                        sel === f.id
                                            ? "var(--color-hex-110808)"
                                            : i % 2
                                              ? "var(--color-hex-0b0b0b)"
                                              : "transparent")
                                }
                            >
                                <td className="px-[12px] py-[7px] text-[9px] font-bold text-[var(--color-hex-e31b23)]">
                                    {f.id}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-444444)]">
                                    {f.ts}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] font-semibold text-[var(--color-hex-a0a0a0)]">
                                    {f.spec}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                    {f.action}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-555555)]">
                                    {f.target}
                                </td>
                                <td className="px-[12px] py-[7px] text-[9px] text-[var(--color-hex-666666)]">
                                    {f.error}
                                </td>
                                <td className="px-[12px] py-[7px] text-[var(--color-hex-555555)]">
                                    {f.eord}/5
                                </td>
                                <td className="px-[12px] py-[7px]">
                                    <span
                                        className="text-[8.5px] font-semibold tracking-[0.12em]"
                                        style={{
                                            color: f.resolved
                                                ? "var(--color-hex-3fb950)"
                                                : "var(--color-hex-d29922)",
                                        }}
                                    >
                                        {f.resolved ? "YES" : "NO"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sel && (
                <div
                    className="w-[280px] shrink-0 overflow-y-auto bg-[var(--color-hex-0a0a0a)] px-[14px] py-[16px]"
                    style={{
                        borderLeft: "1px solid var(--color-hex-1e1e1e)",
                    }}
                >
                    {(() => {
                        const f = FAILURE_LOG.find((x) => x.id === sel)!;
                        return (
                            <>
                                <div className="mb-[12px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                                    FAILURE DETAIL
                                </div>
                                {[
                                    {
                                        k: "ID",
                                        v: f.id,
                                    },
                                    {
                                        k: "TIMESTAMP",
                                        v: f.ts,
                                    },
                                    {
                                        k: "SPECIALIST",
                                        v: f.spec,
                                    },
                                    {
                                        k: "ACTION",
                                        v: f.action,
                                    },
                                    {
                                        k: "TARGET",
                                        v: f.target,
                                    },
                                    {
                                        k: "E_ORD",
                                        v: `${f.eord}/5`,
                                    },
                                    {
                                        k: "RESOLVED",
                                        v: f.resolved ? "YES" : "NO",
                                    },
                                ].map((r) => (
                                    <div key={r.k} className="mb-[8px]">
                                        <div className="mb-[2px] text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                                            {r.k}
                                        </div>
                                        <div
                                            className="text-[10px]"
                                            style={{
                                                color:
                                                    r.k === "RESOLVED"
                                                        ? f.resolved
                                                            ? "var(--color-hex-3fb950)"
                                                            : "var(--color-hex-d29922)"
                                                        : "var(--color-hex-888888)",
                                            }}
                                        >
                                            {r.v}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-[12px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[10px] py-[8px] text-[9px] leading-[1.7] text-[var(--color-hex-ff2a32)]">
                                    {f.error}
                                </div>
                            </>
                        );
                    })()}
                </div>
            )}
        </div>
    );
}
