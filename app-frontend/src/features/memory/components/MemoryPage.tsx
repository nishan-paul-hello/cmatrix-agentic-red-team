import { Button } from "@/components/ui/button";
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
    missionId,
}: {
    initialTab?: MemTab;
    /**
     * When provided, this is a per-mission view (reached from inside a mission workspace).
     * Header reads "MISSION / {missionId}".
     * When absent (reached from the global KNOWLEDGE nav), header reads "KNOWLEDGE"
     * and the content is the cross-mission aggregate view via MemoryBrowser.
     */
    missionId?: string;
} = {}) {
    const { activeTab, setActiveTab } = useMemoryData(initialTab);
    const tabs: MemTab[] = [
        "VULNERABILITY PATTERNS",
        "STRATEGY BRANCHING",
        "TECHNICAL ACTIONS",
        "FAILURE MEMORY",
        "SKILL LIBRARY",
        "CONTEXT UTILIZATION",
    ];
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-0">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    {missionId ? `MISSION / ${missionId}` : "KNOWLEDGE"}
                </div>
                <h1 className="text-foreground mb-3 text-xs font-bold tracking-wide">MEMORY</h1>
                <div className="flex overflow-x-auto">
                    {tabs.map((t) => (
                        <Button
                            key={t}
                            variant="ghost"
                            onClick={() => setActiveTab(t)}
                            className="flex h-auto items-center gap-1 rounded-none px-3.5 py-1 text-sm tracking-wide whitespace-nowrap hover:bg-transparent"
                            style={{
                                borderBottom:
                                    t === activeTab
                                        ? "2px solid var(--primary)"
                                        : "2px solid transparent",
                                color:
                                    t === activeTab
                                        ? "var(--foreground)"
                                        : "var(--muted-foreground)",
                                marginBottom: -1,
                            }}
                        >
                            {t}
                            <span className="bg-card text-muted-foreground ml-1 rounded-sm px-1 py-0 text-xs">
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
                        </Button>
                    ))}
                </div>
            </div>
            {/* G2: Tier legend row */}
            <div className="border-border shrink-0 border-b px-6 py-1.5">
                {[
                    {
                        n: 1,
                        label: "WORKING CONTEXT",
                        color: "var(--warning)",
                    },
                    {
                        n: 2,
                        label: "EPISODIC MEMORY",
                        color: "var(--muted-foreground)",
                    },
                    {
                        n: 3,
                        label: "SKILL LIBRARY",
                        color: "var(--primary)",
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
                            className="h-1.5 w-1.5 rounded-none"
                            style={{
                                background: t.color,
                            }}
                        />
                        <span className="text-muted-foreground text-xs tracking-widest">
                            TIER {t.n} — {t.label}
                        </span>
                    </div>
                ))}
                {/* Cross-mission scope indicator — only shown in global (no missionId) view */}
                {!missionId && (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            marginLeft: "auto",
                        }}
                    >
                        <span className="text-success text-xs tracking-widest">
                            ◈ CROSS-MISSION AGGREGATE
                        </span>
                    </div>
                )}
            </div>
            <div className="bg-background flex-1 overflow-auto">
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
