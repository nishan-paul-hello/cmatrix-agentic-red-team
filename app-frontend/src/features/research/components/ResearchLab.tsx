import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AblationLab from "@/features/research/components/AblationLab";
import FailureAnalysis from "@/features/research/components/FailureAnalysis";
import StatisticalEval from "@/features/research/components/StatisticalEval";
import { type LabTab } from "@/features/research/data/fixtures/researchMockData";
import { useResearchData } from "@/features/research/hooks/useResearchData";

export default function ResearchLab({ initialTab }: { initialTab?: LabTab }) {
    const { tab, setTab } = useResearchData(initialTab);
    return (
        <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as LabTab)}
            className="flex h-full min-h-0 flex-col"
        >
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-0">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    RESEARCH
                </div>
                <h1 className="text-foreground mb-3 text-xs font-bold tracking-wide">
                    RESEARCH LAB
                </h1>
                <TabsList variant="line" className="flex justify-start overflow-x-auto p-0">
                    {(["ABLATION", "STATISTICAL EVALUATION", "FAILURE ANALYSIS"] as LabTab[]).map(
                        (t) => (
                            <TabsTrigger
                                key={t}
                                value={t}
                                className="h-auto rounded-none px-4 py-1 text-base tracking-widest whitespace-nowrap"
                            >
                                {t}
                            </TabsTrigger>
                        ),
                    )}
                </TabsList>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                <TabsContent value="ABLATION" className="m-0 flex min-h-0 flex-1 flex-col">
                    <AblationLab />
                </TabsContent>
                <TabsContent
                    value="STATISTICAL EVALUATION"
                    className="m-0 flex min-h-0 flex-1 flex-col"
                >
                    <StatisticalEval />
                </TabsContent>
                <TabsContent value="FAILURE ANALYSIS" className="m-0 flex min-h-0 flex-1 flex-col">
                    <FailureAnalysis />
                </TabsContent>
            </div>
        </Tabs>
    );
}
