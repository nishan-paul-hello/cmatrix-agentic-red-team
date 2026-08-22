import { useEffect, useState } from "react";

import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { EORD_COLOR, STATUS_BADGE } from "@/features/environment/data/mockData";
import { type HostNode } from "@/types/domain-types";

export default function HostTopology() {
    const [HOSTS, setData] = useState<HostNode[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<HostNode>({ collection: "HOSTS", limit: 1000 })
            .then(setData);
    }, []);

    const [selected, setSelected] = useState<string | null>("HOST-01");

    if (HOSTS.length === 0) {
        return null;
    }
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
                    {HOSTS.map((host) => {
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
                                            {host.services.map((s: string) => (
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
                                {sel.services.map((s: string) => (
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
