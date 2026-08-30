import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as MemTab)}
            className="flex h-full min-h-0 flex-col"
        >
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-0">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    {missionId ? `MISSION / ${missionId}` : "KNOWLEDGE"}
                </div>
                <h1 className="text-foreground mb-3 text-xs font-bold tracking-wide">MEMORY</h1>
                <TabsList
                    variant="line"
                    className="flex [scrollbar-width:none] justify-start overflow-x-auto p-0 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                >
                    {tabs.map((t) => (
                        <TabsTrigger
                            key={t}
                            value={t}
                            className="flex h-auto items-center gap-1 rounded-none px-3.5 py-1 text-sm tracking-wide"
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
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            {/* G2: Tier legend row */}
            <div className="border-border flex shrink-0 flex-row flex-wrap items-center gap-6 border-b px-6 py-1.5">
                {[
                    {
                        n: 1,
                        label: "WORKING CONTEXT",
                        color: "bg-warning",
                    },
                    {
                        n: 2,
                        label: "EPISODIC MEMORY",
                        color: "bg-muted-foreground",
                    },
                    {
                        n: 3,
                        label: "SKILL LIBRARY",
                        color: "bg-primary",
                    },
                ].map((t) => (
                    <div key={t.n} className="flex items-center gap-[5px]">
                        <div className={`h-1.5 w-1.5 rounded-none ${t.color}`} />
                        <span className="text-muted-foreground text-xs tracking-widest">
                            TIER {t.n} - {t.label}
                        </span>
                    </div>
                ))}
                {/* Cross-mission scope indicator — only shown in global (no missionId) view */}
                {!missionId && (
                    <div className="ml-auto flex items-center gap-[5px]">
                        <span className="text-success text-xs tracking-widest">
                            ◈ CROSS-MISSION AGGREGATE
                        </span>
                    </div>
                )}
            </div>
            <div className="bg-background flex-1 overflow-auto">
                <TabsContent value="VULNERABILITY PATTERNS" className="m-0 h-full">
                    <VulnPatterns />
                </TabsContent>
                <TabsContent value="STRATEGY BRANCHING" className="m-0 h-full">
                    <StrategyBranching />
                </TabsContent>
                <TabsContent value="TECHNICAL ACTIONS" className="m-0 h-full">
                    <TechnicalActions />
                </TabsContent>
                <TabsContent value="FAILURE MEMORY" className="m-0 h-full">
                    <FailureMemory />
                </TabsContent>
                <TabsContent value="SKILL LIBRARY" className="m-0 h-full">
                    <SkillLibrary />
                </TabsContent>
                <TabsContent value="CONTEXT UTILIZATION" className="m-0 h-full">
                    <ContextUtilization />
                </TabsContent>
            </div>
        </Tabs>
    );
}
