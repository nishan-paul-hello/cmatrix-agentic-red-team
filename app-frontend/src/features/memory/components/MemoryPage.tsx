import ContextUtilization from "@/features/memory/components/ContextUtilization";
import FailureMemory from "@/features/memory/components/FailureMemory";
import SkillLibrary from "@/features/memory/components/SkillLibrary";
import StrategyBranching from "@/features/memory/components/StrategyBranching";
import TechnicalActions from "@/features/memory/components/TechnicalActions";
import VulnPatterns from "@/features/memory/components/VulnPatterns";
import { type MemTab } from "@/features/memory/data/mockData";
import { useMemoryData } from "@/features/memory/hooks/useMemoryData";

export default function MemoryPage({
    initialTab = "VULNERABILITY PATTERNS",
}: {
    initialTab?: MemTab;
} = {}) {
    const { activeTab, setActiveTab } = useMemoryData(initialTab);
    // Use initialTab on initial render
    const tabs: MemTab[] = [
        "VULNERABILITY PATTERNS",
        "STRATEGY BRANCHING",
        "TECHNICAL ACTIONS",
        "FAILURE MEMORY",
        "SKILL LIBRARY",
        "CONTEXT UTILIZATION",
    ];
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-0"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <h1 className="mb-[12px] text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                    MEMORY
                </h1>
                <div className="flex overflow-x-auto">
                    {tabs.map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className="font-inherit cursor-pointer border-none bg-[transparent] px-[14px] py-[5px] text-[8.5px] tracking-[0.12em] whitespace-nowrap"
                            style={{
                                borderBottom:
                                    t === activeTab
                                        ? "2px solid var(--color-hex-e31b23)"
                                        : "2px solid transparent",
                                color:
                                    t === activeTab
                                        ? "var(--color-hex-f2f2f2)"
                                        : "var(--color-hex-444444)",
                                marginBottom: -1,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            {t}
                            {}
                            <span className="ml-[4px] rounded-[2px] bg-[var(--color-hex-1a1a1a)] px-[4px] py-[0px] text-[7.5px] text-[var(--color-hex-444444)]">
                                {(() => {
                                    if (t === "CONTEXT UTILIZATION") {
                                        return "T1";
                                    }
                                    if (t === "SKILL LIBRARY") {
                                        return "T3";
                                    }
                                    return "T2";
                                })()}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
            {/* G2: Tier legend row */}
            <div
                className="shrink-0 px-[24px] py-[6px]"
                style={{
                    borderBottom: "1px solid var(--color-hex-141414)",
                    display: "flex",
                    gap: 20,
                }}
            >
                {[
                    {
                        n: 1,
                        label: "WORKING CONTEXT",
                        color: "var(--color-hex-d29922)",
                    },
                    {
                        n: 2,
                        label: "EPISODIC MEMORY",
                        color: "var(--color-hex-666666)",
                    },
                    {
                        n: 3,
                        label: "SKILL LIBRARY",
                        color: "var(--color-hex-e31b23)",
                    },
                ].map((t) => (
                    <div
                        key={t.n}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                        }}
                    >
                        <div
                            className="h-[6px] w-[6px] rounded-[1px]"
                            style={{
                                background: t.color,
                            }}
                        />
                        <span className="text-[7.5px] tracking-[0.16em] text-[var(--color-hex-444444)]">
                            TIER {t.n} — {t.label}
                        </span>
                    </div>
                ))}
            </div>
            <div className="flex-1 overflow-auto bg-[var(--color-hex-0b0b0b)]">
                {activeTab === "VULNERABILITY PATTERNS" && <VulnPatterns />}
                {activeTab === "STRATEGY BRANCHING" && <StrategyBranching />}
                {activeTab === "TECHNICAL ACTIONS" && <TechnicalActions />}
                {activeTab === "FAILURE MEMORY" && <FailureMemory />}
                {activeTab === "SKILL LIBRARY" && <SkillLibrary />}
                {activeTab === "CONTEXT UTILIZATION" && <ContextUtilization />}
            </div>
        </div>
    );
}
