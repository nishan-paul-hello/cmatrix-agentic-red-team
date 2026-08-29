import { Button } from "@/components/ui/button";
import AblationLab from "@/features/research/components/AblationLab";
import FailureAnalysis from "@/features/research/components/FailureAnalysis";
import StatisticalEval from "@/features/research/components/StatisticalEval";
import { type LabTab } from "@/features/research/data/fixtures/researchMockData";
import { useResearchData } from "@/features/research/hooks/useResearchData";

export default function ResearchLab({ initialTab }: { initialTab?: LabTab }) {
    const { tab, setTab } = useResearchData(initialTab);
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-0">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    RESEARCH
                </div>
                <h1 className="text-foreground mb-3 text-xs font-bold tracking-wide">
                    RESEARCH LAB
                </h1>
                <div className="flex">
                    {(["ABLATION", "STATISTICAL EVALUATION", "FAILURE ANALYSIS"] as LabTab[]).map(
                        (t) => (
                            <Button
                                key={t}
                                variant="ghost"
                                onClick={() => setTab(t)}
                                className={`-mb-px h-auto rounded-none border-b-2 px-4 py-1 text-base tracking-widest whitespace-nowrap hover:bg-transparent ${t === tab ? "border-primary text-foreground" : "text-muted-foreground border-transparent"}`}
                            >
                                {t}
                            </Button>
                        ),
                    )}
                </div>
            </div>
            {tab === "ABLATION" && <AblationLab />}
            {tab === "STATISTICAL EVALUATION" && <StatisticalEval />}
            {tab === "FAILURE ANALYSIS" && <FailureAnalysis />}
        </div>
    );
}
