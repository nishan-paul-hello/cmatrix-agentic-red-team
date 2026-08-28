import { EORD_COLOR, STATUS_BADGE } from "@/features/environment/data/mockData";
import { type HostNode } from "@/types/domain-types";

export function HostTopologyDiagram({
    hosts,
    selected,
    setSelected,
}: {
    hosts: HostNode[];
    selected: string | null;
    setSelected: (id: string | null) => void;
}) {
    return (
        <div
            className="flex flex-1 flex-col overflow-y-auto px-10 py-8"
            style={{
                borderRight: "1px solid var(--color-hex-1e1e1e)",
            }}
        >
            <div className="mb-6 flex items-center gap-3">
                <span className="text-base-tight tracking-wider-2 rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a4a2044)] bg-[var(--color-hex-0a1a10)] px-[8px] py-[2px] text-[var(--color-success)]">
                    CONFIRMED TOPOLOGY
                </span>
                <span className="tracking-wider-1 text-sm text-[var(--color-hex-444444)]">
                    SOURCE: NMAP + CREDENTIAL REUSE · E_ord ≥ 3
                </span>
            </div>

            <div
                className="flex flex-col items-start"
                style={{
                    gap: 0,
                }}
            >
                {hosts.map((host) => {
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
                                    border: `1px solid ${isSel ? "var(--color-brand)" : "var(--color-hex-292929)"}`,
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
                                            border: `1px solid ${isSel ? "var(--color-brand)" : "var(--color-hex-333333)"}`,
                                            background: isSel
                                                ? "var(--color-brand)"
                                                : "var(--color-hex-151515)",
                                        }}
                                    />
                                    <span
                                        className="text-sm font-bold tracking-normal"
                                        style={{
                                            color: isSel
                                                ? "var(--color-brand)"
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
                                            className="text-xl font-bold tracking-tight"
                                            style={{
                                                color: isSel
                                                    ? "var(--color-fg)"
                                                    : "var(--color-hex-888888)",
                                            }}
                                        >
                                            {host.ip}
                                        </span>
                                        <span className="text-base text-[var(--color-hex-555555)]">
                                            ·
                                        </span>
                                        <span
                                            className="text-lg tracking-tighter"
                                            style={{
                                                color: isSel
                                                    ? "var(--color-hex-a0a0a0)"
                                                    : "var(--color-hex-555555)",
                                            }}
                                        >
                                            {host.hostname}
                                        </span>
                                    </div>
                                    <div className="tracking-wider-1 mb-[8px] text-base text-[var(--color-hex-444444)]">
                                        {host.role}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {host.services.map((s: string) => (
                                            <span
                                                key={s}
                                                className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-111111)] px-[5px] py-[1px] text-sm tracking-tight text-[var(--color-hex-555555)]"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: status + eord */}
                                <div className="flex flex-shrink-0 flex-col items-end gap-2">
                                    <span
                                        className="tracking-wider-1 rounded-[2px] px-[6px] py-[1px] text-sm font-semibold"
                                        style={{
                                            color: sb.color,
                                            background: sb.bg,
                                            border: `1px solid ${sb.border}`,
                                        }}
                                    >
                                        {host.status}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm-tight tracking-normal text-[var(--color-hex-444444)]">
                                            E_ord
                                        </span>
                                        <span
                                            className="text-lg font-bold"
                                            style={{
                                                color: EORD_COLOR[host.eord],
                                            }}
                                        >
                                            {host.eord}/5
                                        </span>
                                    </div>
                                    <span className="text-sm tracking-normal text-[var(--color-hex-333333)]">
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
                                            <span className="text-sm tracking-normal text-[var(--color-brand)]">
                                                →
                                            </span>
                                            <span className="text-base font-semibold tracking-normal text-[var(--color-hex-555555)]">
                                                {edge.label.toUpperCase()}
                                            </span>
                                            <span className="text-sm tracking-tight text-[var(--color-hex-333333)]">
                                                {edge.detail}
                                            </span>
                                            <span
                                                className="text-sm-tight tracking-normal"
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
                <span className="shrink-0 text-lg text-[var(--color-brand)]">ⓘ</span>
                <span className="tracking-tight-1 text-base leading-relaxed text-[var(--color-hex-444444)]">
                    Topology represents{" "}
                    <strong className="text-[var(--color-hex-666666)]">confirmed facts</strong> from
                    the Environmental Layer only. Dashed edges are inferred from network scan data
                    and have not been directly observed. This diagram is not the VDG attack graph.
                </span>
            </div>
        </div>
    );
}
