import React from "react";

import { BenchmarksSettings } from "@/features/settings/components/BenchmarksSettings";
import { CostSettings } from "@/features/settings/components/CostSettings";
import { GeneralSettings } from "@/features/settings/components/GeneralSettings";
import { MemorySettings } from "@/features/settings/components/MemorySettings";
import { MissionsSettings } from "@/features/settings/components/MissionsSettings";
import { ModelSettings } from "@/features/settings/components/ModelSettings";
import { SecuritySettings } from "@/features/settings/components/SecuritySettings";
import { ToolsSettings } from "@/features/settings/components/ToolsSettings";
import { ValidationSettings } from "@/features/settings/components/ValidationSettings";
import { VDGSettings } from "@/features/settings/components/VDGSettings";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";

export type SettingsTab =
    | "GENERAL"
    | "MODELS"
    | "MISSIONS"
    | "TOOLS"
    | "MEMORY"
    | "VDG"
    | "VALIDATION"
    | "BENCHMARKS"
    | "COST"
    | "SECURITY";
const TABS: SettingsTab[] = [
    "GENERAL",
    "MODELS",
    "MISSIONS",
    "TOOLS",
    "MEMORY",
    "VDG",
    "VALIDATION",
    "BENCHMARKS",
    "COST",
    "SECURITY",
];
export default function SettingsPageView({ data }: { data: SettingsData }) {
    const { tab, setTab } = data;
    return (
        <div className="flex h-full min-h-[0px]">
            {/* Left nav */}
            <div
                className="flex w-[160px] flex-shrink-0 flex-col overflow-y-auto bg-[var(--color-hex-0b0b0b)] py-4"
                style={{
                    borderRight: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div
                    className="tracking-widest-2 mb-[12px] text-base text-[var(--color-hex-666666)]"
                    style={{
                        paddingLeft: 16,
                    }}
                >
                    SYSTEM / SETTINGS
                </div>
                {TABS.map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className="font-inherit w-full cursor-pointer border-none px-4 py-2 text-left text-lg tracking-tight"
                        style={{
                            background: t === tab ? "var(--color-hex-1a0a0b)" : "transparent",
                            borderLeft: `2px solid ${t === tab ? "var(--color-brand)" : "transparent"}`,
                            color: t === tab ? "var(--color-fg)" : "var(--color-hex-555555)",
                        }}
                        onMouseEnter={(e) => {
                            if (t !== tab) {
                                e.currentTarget.style.color = "var(--color-hex-a0a0a0)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (t !== tab) {
                                e.currentTarget.style.color = "var(--color-hex-555555)";
                            }
                        }}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="min-h-[0px] flex-1 overflow-hidden">
                {tab === "GENERAL" && <GeneralSettings data={data.general} />}
                {tab === "MODELS" && <ModelSettings data={data.models} />}
                {tab === "MISSIONS" && <MissionsSettings data={data.missions} />}
                {tab === "TOOLS" && <ToolsSettings data={data.tools} />}
                {tab === "MEMORY" && <MemorySettings data={data.memory} />}
                {tab === "VDG" && <VDGSettings data={data.vdg} />}
                {tab === "VALIDATION" && <ValidationSettings data={data.validation} />}
                {tab === "BENCHMARKS" && <BenchmarksSettings data={data.benchmarks} />}
                {tab === "COST" && <CostSettings data={data.cost} />}
                {tab === "SECURITY" && <SecuritySettings data={data.security} />}
            </div>
        </div>
    );
}

/* ── Shared helpers ── */

/* ── GENERAL ── */

/* ── MODELS ── */

/* ── MISSIONS ── */

/* ── TOOLS ── */

/* ── MEMORY ── */

/* ── VDG ── */

/* ── VALIDATION ── */

/* ── BENCHMARKS ── */

/* ── COST ── */

/* ── SECURITY ── */
