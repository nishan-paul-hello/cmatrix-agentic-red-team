import { useState } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttackPath from "@/features/findings/components/AttackPath";
import EvidenceViewer from "@/features/findings/components/EvidenceViewer";
import TrajectoryTab from "@/features/findings/components/TrajectoryTab";
import ValidationTab from "@/features/findings/components/ValidationTab";
import { SEV_C, STATUS_C, type Tab } from "@/features/findings/data/fixtures/findingsMockData";
import { type Finding } from "@/types/domain-types";

export default function FindingDetail({ f, onBack }: { f: Finding; onBack: () => void }) {
    const [tab, setTab] = useState<Tab>("OVERVIEW");
    const sc = SEV_C[f.severity];
    const stc = STATUS_C[f.status] ?? "text-muted-foreground";
    return (
        <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as Tab)}
            className="flex h-full min-h-0 flex-col"
        >
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-0">
                <Button
                    variant="ghost"
                    onClick={onBack}
                    className="text-muted-foreground hover:text-foreground mb-2 flex h-auto cursor-pointer items-center gap-2 p-0 text-xs font-semibold tracking-widest transition-colors hover:bg-transparent"
                >
                    <ArrowLeft className="h-4 w-4" /> FINDINGS
                </Button>
                <div className="mb-3 flex items-center gap-3">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">{f.id}</h1>
                    <span
                        className="rounded-sm px-1.5 py-0.5 text-base font-semibold tracking-widest"
                        style={{
                            color: sc.color,
                            background: sc.bg,
                            border: `1px solid ${sc.color}33`,
                        }}
                    >
                        {f.severity}
                    </span>
                    <span
                        className="text-base font-semibold tracking-wide"
                        style={{
                            color: stc,
                        }}
                    >
                        {f.status}
                    </span>
                </div>
                <TabsList
                    variant="line"
                    className="flex [scrollbar-width:none] justify-start overflow-x-auto overflow-y-hidden p-0 [&::-webkit-scrollbar]:hidden"
                >
                    {(
                        ["OVERVIEW", "EVIDENCE", "ATTACK PATH", "VALIDATION", "TRAJECTORY"] as Tab[]
                    ).map((t) => (
                        <TabsTrigger
                            key={t}
                            value={t}
                            className="h-auto rounded-none px-3.5 py-1 text-base tracking-widest"
                        >
                            {t}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>
            <div className="flex min-h-0 flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    <TabsContent value="OVERVIEW" className="m-0 h-full">
                        <div className="border-border mb-5 overflow-hidden rounded-sm border-[1px] border-solid">
                            {[
                                {
                                    k: "FINDING ID",
                                    v: f.id,
                                },
                                {
                                    k: "TYPE",
                                    v: f.type,
                                },
                                {
                                    k: "TARGET",
                                    v: f.target,
                                },
                                {
                                    k: "SEVERITY",
                                    v: f.severity,
                                },
                                {
                                    k: "STATUS",
                                    v: f.status,
                                },
                                {
                                    k: "E_ord",
                                    v: `${f.eord} / 5`,
                                },
                                {
                                    k: "FIRST SEEN",
                                    v: f.first,
                                },
                                {
                                    k: "VALIDATED",
                                    v: f.validated,
                                },
                            ].map((r) => (
                                <div key={r.k} className="border-border flex border-b">
                                    <div className="text-muted-foreground border-border w-panel-2xs shrink-0 border-r px-3.5 py-2 text-sm font-semibold tracking-widest">
                                        {r.k}
                                    </div>
                                    <div
                                        className="flex-1 px-3.5 py-2 text-xs"
                                        style={{
                                            color: (() => {
                                                if (r.k === "STATUS") {
                                                    return stc;
                                                }
                                                if (r.k === "SEVERITY") {
                                                    return sc.color;
                                                }
                                                return "text-muted-foreground";
                                            })(),
                                        }}
                                    >
                                        {r.v}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabsContent>
                    <TabsContent value="EVIDENCE" className="m-0 h-full">
                        <EvidenceViewer inline />
                    </TabsContent>
                    <TabsContent value="ATTACK PATH" className="m-0 h-full">
                        <AttackPath nodes={f.path} large />
                    </TabsContent>
                    <TabsContent value="VALIDATION" className="m-0 h-full">
                        <ValidationTab f={f} />
                    </TabsContent>
                    <TabsContent value="TRAJECTORY" className="m-0 h-full">
                        <TrajectoryTab f={f} />
                    </TabsContent>
                </div>
            </div>
        </Tabs>
    );
}
