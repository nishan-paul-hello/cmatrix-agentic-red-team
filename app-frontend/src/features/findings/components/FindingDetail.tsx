import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttackPath from "@/features/findings/components/AttackPath";
import EvidenceViewer from "@/features/findings/components/EvidenceViewer";
import TrajectoryTab from "@/features/findings/components/TrajectoryTab";
import ValidationTab from "@/features/findings/components/ValidationTab";
import { SEV_C, STATUS_C, type Tab } from "@/features/findings/data/fixtures/findingsMockData";
import { type Finding } from "@/types/domain-types";

export default function FindingDetail({ f, onBack }: { f: Finding; onBack: () => void }) {
    const [tab, setTab] = useState<Tab>("OVERVIEW");
    const [evOpen, setEvOpen] = useState(false);
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
                    className="text-muted-foreground hover:text-muted-foreground mb-2.5 h-auto p-0 text-base tracking-widest hover:bg-transparent"
                >
                    {"\u2190"} FINDINGS
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
                <TabsList variant="line" className="flex justify-start overflow-x-auto p-0">
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
                        <div className="text-muted-foreground mb-3.5 text-base tracking-widest">
                            ATTACK PATH
                        </div>
                        <AttackPath nodes={f.path} />
                        <div className="mt-6 flex gap-3">
                            <Button
                                onClick={() => setEvOpen(true)}
                                className="bg-primary text-foreground hover:bg-destructive h-auto rounded-sm px-4 py-1.5 text-base tracking-widest"
                            >
                                VIEW EVIDENCE
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setTab("ATTACK PATH")}
                                className="h-auto rounded-sm px-4 py-1.5 text-base tracking-widest"
                            >
                                VIEW PATH
                            </Button>
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
            <Dialog open={evOpen} onOpenChange={setEvOpen}>
                <DialogContent className="border-border bg-background w-panel-3xl sm:max-w-panel-3xl flex max-h-[80vh] max-w-full flex-col overflow-hidden p-0">
                    <DialogHeader className="border-border border-b px-5 py-4">
                        <DialogTitle className="text-foreground text-xs font-bold tracking-normal uppercase">
                            EVIDENCE VIEWER
                        </DialogTitle>
                    </DialogHeader>
                    <div className="overflow-auto p-5">
                        <EvidenceViewer />
                    </div>
                </DialogContent>
            </Dialog>
        </Tabs>
    );
}
