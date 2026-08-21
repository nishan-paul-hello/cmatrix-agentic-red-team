import { useState } from "react";
import { MISSIONS } from "@/lib/data";
import StatusBadge from "@/components/ui/StatusBadge";

// ─── Types & constants ────────────────────────────────────────────────────────

type MissionFilter = "ALL" | "RUNNING" | "PAUSED" | "VALIDATING" | "QUEUED" | "COMPLETED";

const FILTERS: MissionFilter[] = [
  "ALL",
  "RUNNING",
  "PAUSED",
  "VALIDATING",
  "QUEUED",
  "COMPLETED",
];

const TABLE_HEADERS = [
  "ID", "TARGET", "SURFACE", "MODE", "STATUS", "NODES", "FINDINGS", "COST", "STARTED",
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface MissionsPageProps {
  onNewMission?: () => void;
  onOpenMission?: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MissionsPage({ onNewMission, onOpenMission }: MissionsPageProps) {
  const [filter, setFilter] = useState<MissionFilter>("ALL");

  const filtered =
    filter === "ALL" ? MISSIONS : MISSIONS.filter((m) => m.status === filter);

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Page header */}
      <div className="flex-shrink-0 px-6 pt-5 pb-4 border-b border-[var(--color-hex-1e1e1e)]">
        <div className="page-eyebrow">OPERATIONS</div>
        <div className="flex items-baseline justify-between">
          <h1 className="text-[20px] font-bold text-[var(--color-hex-f2f2f2)] tracking-[0.12em]">
            MISSIONS
          </h1>
          <button
            onClick={onNewMission}
            className="text-[9px] text-[var(--color-hex-e31b23)] bg-transparent border border-[var(--color-hex-6f171b)] rounded-[2px] py-[4px] px-[12px] tracking-[0.14em] cursor-pointer font-semibold hover:bg-[var(--color-hex-1a0608)] hover:border-[var(--color-hex-e31b23)] transition-colors duration-100"
          >
            NEW MISSION →
          </button>
        </div>
      </div>

      {/* Filter strip */}
      <div
        className="flex-shrink-0 flex items-center gap-1 px-6 py-3 bg-[var(--color-hex-0b0b0b)] border-b border-[var(--color-hex-1e1e1e)]"
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
                ? "bg-[var(--color-hex-120608)] border-[var(--color-hex-e31b23)] text-[var(--color-hex-ff2a32)]"
                : "bg-transparent border-[var(--color-hex-1e1e1e)] text-[var(--color-hex-555555)] hover:text-[var(--color-hex-a0a0a0)]",
            ].join(" ")}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-[8.5px] text-[var(--color-hex-444444)] tracking-[0.12em]">
          {filtered.length} MISSIONS
        </span>
      </div>

      {/* Missions table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="bg-[var(--color-hex-111111)] sticky top-0 z-10">
              {TABLE_HEADERS.map((h) => (
                <th
                  key={h}
                  className="py-[6px] px-[16px] text-left text-[8.5px] text-[var(--color-hex-444444)] tracking-[0.18em] font-semibold whitespace-nowrap border-b border-[var(--color-hex-1e1e1e)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr
                key={m.id}
                onClick={() => onOpenMission?.(m.id)}
                className="cursor-pointer border-b border-[var(--color-hex-191919)] hover:bg-[var(--color-hex-131313)] transition-colors duration-75"
              >
                <td className="py-[8px] px-[16px] text-[var(--color-hex-e31b23)] font-semibold tracking-[0.08em] whitespace-nowrap">
                  {m.id}
                </td>
                <td className="py-[8px] px-[16px] text-[var(--color-hex-a0a0a0)] whitespace-nowrap max-w-[180px] cell-truncate">
                  {m.target}
                </td>
                <td className="py-[8px] px-[16px] text-[var(--color-hex-666666)] whitespace-nowrap text-[10px]">
                  {m.surface}
                </td>
                <td className="py-[8px] px-[16px] text-[var(--color-hex-666666)] whitespace-nowrap text-[10px]">
                  {m.mode}
                </td>
                <td className="py-[8px] px-[16px] whitespace-nowrap">
                  <StatusBadge status={m.status} />
                </td>
                <td className="py-[8px] px-[16px] text-[var(--color-hex-a0a0a0)] text-right">
                  {m.nodes}
                </td>
                <td
                  className="py-[8px] px-[16px] text-right"
                  style={{
                    color:
                      m.findings > 0
                        ? "var(--color-hex-ff2a32)"
                        : "var(--color-hex-666666)",
                    fontWeight: m.findings > 0 ? 600 : 400,
                  }}
                >
                  {m.findings}
                </td>
                <td className="py-[8px] px-[16px] text-[var(--color-hex-a0a0a0)] text-right">
                  {m.cost}
                </td>
                <td className="py-[8px] px-[16px] text-[var(--color-hex-555555)] text-[9.5px] whitespace-nowrap">
                  {m.started}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
