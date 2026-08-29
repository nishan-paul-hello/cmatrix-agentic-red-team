import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { getStatusColor } from "@/components/ui/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ExecEntry } from "@/types/domain-types";

import { ExecDrawerElChangesTab } from "./exec-drawer-tabs/ExecDrawerElChangesTab";
import { ExecDrawerParsedTab } from "./exec-drawer-tabs/ExecDrawerParsedTab";
import { ExecDrawerRawTab } from "./exec-drawer-tabs/ExecDrawerRawTab";
import { ExecDrawerSummaryTab } from "./exec-drawer-tabs/ExecDrawerSummaryTab";
import { ExecDrawerTrajectoryTab } from "./exec-drawer-tabs/ExecDrawerTrajectoryTab";

export function ExecDrawer({
    entry,
    parsedRows,
    onClose,
}: {
    entry: ExecEntry;
    parsedRows: Record<string, string | number | boolean>[];
    onClose: () => void;
}) {
    const [tab, setTab] = useState<
        "SUMMARY" | "RAW OUTPUT" | "PARSED OUTPUT" | "EL CHANGES" | "TRAJECTORY"
    >("SUMMARY");
    const sc = getStatusColor(entry.status).color;
    return (
        <div className="bg-background border-border flex w-full lg:w-[480px] xl:w-[560px] flex-col overflow-hidden border-l shrink-0 h-full">
            <div className="border-border flex items-center justify-between border-b px-4 pt-4 pb-3">
                    <div>
                        <div
                            id="exec-drawer-title"
                            className="text-foreground text-xs font-bold tracking-wide"
                        >
                            EXECUTION #{entry.id}
                        </div>
                        <div className="text-muted-foreground mt-0.5 text-sm tracking-wide">
                            {entry.specialist} · {entry.command.tool.id}
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={onClose}
                        className="text-muted-foreground"
                        aria-label="Close"
                    >
                        ✕
                    </Button>
                </div>

                <Tabs
                    value={tab}
                    onValueChange={(v) =>
                        setTab(
                            v as
                                | "SUMMARY"
                                | "RAW OUTPUT"
                                | "PARSED OUTPUT"
                                | "EL CHANGES"
                                | "TRAJECTORY",
                        )
                    }
                    className="flex h-full flex-col overflow-hidden"
                >
                    {/* Tabs */}
                    <TabsList
                        variant="line"
                        className="border-border flex flex-shrink-0 justify-start overflow-x-auto border-b p-0"
                    >
                        {(
                            [
                                "SUMMARY",
                                "RAW OUTPUT",
                                "PARSED OUTPUT",
                                "EL CHANGES",
                                "TRAJECTORY",
                            ] as const
                        ).map((t) => (
                            <TabsTrigger
                                key={t}
                                value={t}
                                className="h-auto rounded-none px-2 py-2 text-sm tracking-normal"
                            >
                                {t}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <TabsContent value="SUMMARY" className="m-0 h-full p-0">
                            <ExecDrawerSummaryTab entry={entry} statusColor={sc} />
                        </TabsContent>
                        <TabsContent value="PARSED OUTPUT" className="m-0 h-full p-0">
                            <ExecDrawerParsedTab entry={entry} parsedRows={parsedRows} />
                        </TabsContent>
                        <TabsContent value="RAW OUTPUT" className="m-0 h-full p-0">
                            <ExecDrawerRawTab />
                        </TabsContent>
                        <TabsContent value="EL CHANGES" className="m-0 h-full p-0">
                            <ExecDrawerElChangesTab />
                        </TabsContent>
                        <TabsContent value="TRAJECTORY" className="m-0 h-full p-0">
                            <ExecDrawerTrajectoryTab entry={entry} />
                        </TabsContent>
                    </div>
                </Tabs>
        </div>
    );
}
