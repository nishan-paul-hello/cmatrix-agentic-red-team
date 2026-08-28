import { EmptyState } from "@/components/ui/EmptyState";
import StatusBadge from "@/components/ui/StatusBadge";
import { useMissionsData } from "@/features/missions/hooks/useMissionsData";
import { type MissionFilter } from "@/features/missions/utils";
import { MISSION_STATUS } from "@/types/domain-types";

// ─── Types & constants ────────────────────────────────────────────────────────

const FILTERS: MissionFilter[] = [
    "ALL",
    MISSION_STATUS.RUNNING,
    MISSION_STATUS.PAUSED,
    MISSION_STATUS.VALIDATING,
    MISSION_STATUS.QUEUED,
    MISSION_STATUS.COMPLETED,
];

const TABLE_HEADERS = [
    "ID",
    "TARGET",
    "SURFACE",
    "MODE",
    "STATUS",
    "NODES",
    "FINDINGS",
    "COST",
    "STARTED",
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface MissionsPageProps {
    onNewMission?: () => void;
    onOpenMission?: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MissionsPage({ onNewMission, onOpenMission }: MissionsPageProps) {
    const { filter, setFilter, isLoading, filtered } = useMissionsData();

    return (
        <div className="flex h-full min-h-0 flex-col">
            {/* Page header */}
            <div className="flex-shrink-0 border-b border-[var(--color-hex-1e1e1e)] px-6 pt-5 pb-4">
                <div className="page-eyebrow">OPERATIONS</div>
                <div className="flex items-baseline justify-between">
                    <h1 className="text-9xl font-bold tracking-wide text-[var(--color-fg)]">
                        MISSIONS
                    </h1>
                    <button
                        onClick={onNewMission}
                        className="tracking-wider-1 cursor-pointer rounded-[2px] border border-[var(--color-hex-6f171b)] bg-transparent px-[12px] py-[4px] text-base font-semibold text-[var(--color-brand)] transition-colors duration-100 hover:border-[var(--color-brand)] hover:bg-[var(--color-hex-1a0608)]"
                    >
                        NEW MISSION →
                    </button>
                </div>
            </div>

            {/* Filter strip */}
            <div
                className="flex flex-shrink-0 items-center gap-1 border-b border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0b0b0b)] px-6 py-3"
                role="group"
                aria-label="Filter missions by status"
            >
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        aria-pressed={filter === f}
                        className={[
                            "filter-btn transition-colors duration-100",
                            filter === f
                                ? "border-[var(--color-brand)] bg-[var(--color-hex-120608)] text-[var(--color-danger)]"
                                : "border-[var(--color-hex-1e1e1e)] bg-transparent text-[var(--color-hex-555555)] hover:text-[var(--color-hex-a0a0a0)]",
                        ].join(" ")}
                    >
                        {f}
                    </button>
                ))}
                <span className="text-base-tight ml-auto tracking-wide text-[var(--color-hex-444444)]">
                    {filtered.length} MISSIONS
                </span>
            </div>

            {/* Missions table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full border-collapse text-xl">
                    <thead>
                        <tr className="sticky top-0 z-10 bg-[var(--color-hex-111111)]">
                            {TABLE_HEADERS.map((h) => (
                                <th
                                    key={h}
                                    className="text-base-tight tracking-wider-3 border-b border-[var(--color-hex-1e1e1e)] px-[16px] py-[6px] text-left font-semibold whitespace-nowrap text-[var(--color-hex-444444)]"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {(() => {
                            if (isLoading) {
                                return (
                                    <EmptyState message="LOADING MISSIONS..." isTable colSpan={9} />
                                );
                            }
                            if (filtered.length === 0) {
                                return (
                                    <EmptyState message="NO MISSIONS FOUND" isTable colSpan={9} />
                                );
                            }
                            return filtered.map((m) => (
                                <tr
                                    key={m.id}
                                    onClick={() => onOpenMission?.(m.id)}
                                    className="cursor-pointer border-b border-[var(--color-hex-191919)] transition-colors duration-75 hover:bg-[var(--color-hex-131313)]"
                                >
                                    <td className="px-[16px] py-[8px] font-semibold tracking-tight whitespace-nowrap text-[var(--color-brand)]">
                                        {m.id}
                                    </td>
                                    <td className="cell-truncate max-w-[var(--width-cell-max)] px-[16px] py-[8px] whitespace-nowrap text-[var(--color-hex-a0a0a0)]">
                                        {m.target}
                                    </td>
                                    <td className="px-[16px] py-[8px] text-lg whitespace-nowrap text-[var(--color-hex-666666)]">
                                        {m.surface}
                                    </td>
                                    <td className="px-[16px] py-[8px] text-lg whitespace-nowrap text-[var(--color-hex-666666)]">
                                        {m.mode}
                                    </td>
                                    <td className="px-[16px] py-[8px] whitespace-nowrap">
                                        <StatusBadge status={m.status} />
                                    </td>
                                    <td className="px-[16px] py-[8px] text-right text-[var(--color-hex-a0a0a0)]">
                                        {m.nodes}
                                    </td>
                                    <td
                                        className="px-[16px] py-[8px] text-right"
                                        style={{
                                            color:
                                                m.findings > 0
                                                    ? "var(--color-danger)"
                                                    : "var(--color-hex-666666)",
                                            fontWeight: m.findings > 0 ? 600 : 400,
                                        }}
                                    >
                                        {m.findings}
                                    </td>
                                    <td className="px-[16px] py-[8px] text-right text-[var(--color-hex-a0a0a0)]">
                                        {m.cost}
                                    </td>
                                    <td className="text-lg-tight px-[16px] py-[8px] whitespace-nowrap text-[var(--color-hex-555555)]">
                                        {m.started}
                                    </td>
                                </tr>
                            ));
                        })()}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
