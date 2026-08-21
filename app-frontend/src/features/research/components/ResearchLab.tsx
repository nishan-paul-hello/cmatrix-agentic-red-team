import React from "react";

import { type LabTab } from "../data/researchMockData";
import { useResearchData } from "../hooks/useResearchData";
import AblationLab from "./AblationLab";
import FailureAnalysis from "./FailureAnalysis";
import StatisticalEval from "./StatisticalEval";

export default function ResearchLab({ initialTab }: { initialTab?: LabTab }) {
    const { tab, setTab } = useResearchData(initialTab);
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-0"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    RESEARCH
                </div>
                <h1 className="mb-[12px] text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                    RESEARCH LAB
                </h1>
                <div className="flex">
                    {(["ABLATION", "STATISTICAL EVALUATION", "FAILURE ANALYSIS"] as LabTab[]).map(
                        (t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className="font-inherit cursor-pointer border-none bg-[transparent] px-[16px] py-[5px] text-[9px] tracking-[0.14em] whitespace-nowrap"
                                style={{
                                    borderBottom:
                                        t === tab
                                            ? "2px solid var(--color-hex-e31b23)"
                                            : "2px solid transparent",
                                    color:
                                        t === tab
                                            ? "var(--color-hex-f2f2f2)"
                                            : "var(--color-hex-444444)",
                                    marginBottom: -1,
                                }}
                            >
                                {t}
                            </button>
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
