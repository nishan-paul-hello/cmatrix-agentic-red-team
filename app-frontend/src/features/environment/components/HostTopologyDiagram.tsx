import { Button } from "@/components/ui/button";
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
        <div className="border-border flex flex-1 flex-col overflow-y-auto border-r px-10 py-8">
            <div className="mb-6 flex items-center gap-3">
                <span className="border-border bg-muted text-success rounded-sm border-[1px] border-solid px-2 py-0.5 text-sm tracking-widest">
                    CONFIRMED TOPOLOGY
                </span>
                <span className="text-muted-foreground text-sm tracking-widest">
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
                            <Button
                                variant="outline"
                                onClick={() => setSelected(isSel ? null : host.id)}
                                className={`max-w-panel-md-wide sm:w-panel-md-wide flex h-auto w-full cursor-pointer items-start justify-start gap-4 rounded-sm border border-solid px-4 py-3.5 text-left font-normal whitespace-normal transition-colors ${isSel ? "bg-border border-primary" : "bg-background border-border"} hover:bg-border hover:border-muted-foreground`}
                            >
                                {/* Left: id + status dot */}
                                <div
                                    className="flex flex-shrink-0 flex-col items-center gap-1.5"
                                    style={{
                                        paddingTop: 2,
                                    }}
                                >
                                    <div
                                        className={`h-2.5 w-2.5 rounded-sm border ${isSel ? "border-primary bg-primary" : "border-border bg-border"}`}
                                    />
                                    <span
                                        className={`text-sm font-bold tracking-normal ${isSel ? "text-primary" : "text-muted-foreground"}`}
                                    >
                                        {host.id}
                                    </span>
                                </div>

                                {/* Center: details */}
                                <div className="flex-1">
                                    <div className="mb-1 flex items-center gap-2">
                                        <span
                                            className={`text-xs font-bold tracking-tight ${isSel ? "text-foreground" : "text-muted-foreground"}`}
                                        >
                                            {host.ip}
                                        </span>
                                        <span className="text-muted-foreground text-base">·</span>
                                        <span className="text-muted-foreground text-xs tracking-tighter">
                                            {host.hostname}
                                        </span>
                                    </div>
                                    <div className="text-muted-foreground mb-2 text-base tracking-widest">
                                        {host.role}
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {host.services.map((s: string) => (
                                            <span
                                                key={s}
                                                className="border-border bg-card text-muted-foreground rounded-sm border-[1px] border-solid px-1 py-px text-sm tracking-tight"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: status + eord */}
                                <div className="flex flex-shrink-0 flex-col items-end gap-2">
                                    <span
                                        className="rounded-sm px-1.5 py-px text-sm font-semibold tracking-widest"
                                        style={{
                                            color: sb.color,
                                            background: sb.bg,
                                            border: `1px solid ${sb.border}`,
                                        }}
                                    >
                                        {host.status}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-muted-foreground text-xs tracking-normal">
                                            E_ord
                                        </span>
                                        <span
                                            className="text-xs font-bold"
                                            style={{
                                                color: EORD_COLOR[host.eord],
                                            }}
                                        >
                                            {host.eord}/5
                                        </span>
                                    </div>
                                    <span className="text-muted-foreground text-sm tracking-normal">
                                        {host.os}
                                    </span>
                                </div>
                            </Button>

                            {host.edges.map((edge) => (
                                <div key={edge.to} className="ml-7 flex items-stretch">
                                    {/* Vertical line */}
                                    <div className="bg-muted ml-1 w-px shrink-0" />
                                    {/* Edge label */}
                                    <div className="flex flex-col justify-center pt-1.5 pb-1.5 pl-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-primary text-sm tracking-normal">
                                                {"\u2192"}
                                            </span>
                                            <span className="text-muted-foreground text-base font-semibold tracking-normal">
                                                {edge.label.toUpperCase()}
                                            </span>
                                            <span className="text-muted-foreground text-sm tracking-tight">
                                                {edge.detail}
                                            </span>
                                            <span
                                                className="text-xs tracking-normal"
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
            <div className="border-border bg-background max-w-panel-md-wide mt-8 flex items-start gap-2 rounded-sm border-[1px] border-solid px-3.5 py-2.5">
                <span className="text-primary shrink-0 text-xs">ⓘ</span>
                <span className="text-muted-foreground text-base leading-relaxed tracking-tight">
                    Topology represents{" "}
                    <strong className="text-muted-foreground">confirmed facts</strong> from the
                    Environmental Layer only. Dashed edges are inferred from network scan data and
                    have not been directly observed. This diagram is not the VDG attack graph.
                </span>
            </div>
        </div>
    );
}
