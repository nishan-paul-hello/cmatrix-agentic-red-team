import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthStatesPanel from "@/features/environment/components/AuthStatesPanel";
import CredentialsPanel from "@/features/environment/components/CredentialsPanel";
import CVECandidatesPanel from "@/features/environment/components/CVECandidatesPanel";
import ELFindingsPanel from "@/features/environment/components/ELFindingsPanel";
import EndpointsPanel from "@/features/environment/components/EndpointsPanel";
import EvidencePanel from "@/features/environment/components/EvidencePanel";
import FailuresPanel from "@/features/environment/components/FailuresPanel";
import HostTopology from "@/features/environment/components/HostTopology";
import ParametersPanel from "@/features/environment/components/ParametersPanel";
import ServicesPanel from "@/features/environment/components/ServicesPanel";
import { TABS, type ELTab } from "@/features/environment/data/mockData";
import { useEnvironmentalData } from "@/features/environment/hooks/useEnvironmentalData";

export default function EnvironmentalLayer() {
    return (
        <PanelErrorBoundary>
            <EnvironmentalLayerInner />
        </PanelErrorBoundary>
    );
}

function EnvironmentalLayerInner() {
    const { activeTab, setActiveTab } = useEnvironmentalData();
    return (
        <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as ELTab)}
            className="flex h-full min-h-0 flex-col"
        >
            {/* Header */}
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-0">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    ENVIRONMENT
                </div>
                <div className="mb-3 flex items-baseline gap-3">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">
                        ENVIRONMENTAL LAYER
                    </h1>
                    <span className="border-border bg-muted text-success rounded-sm border-[1px] border-solid px-1.5 py-px text-base tracking-widest">
                        CONFIRMED
                    </span>
                </div>
                {/* Tabs */}
                <TabsList
                    variant="line"
                    className="[&::-webkit-scrollbar-thumb]:bg-border flex !h-auto w-full items-end justify-start gap-0 overflow-x-auto overflow-y-hidden p-0 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-transparent"
                >
                    {TABS.map((t) => (
                        <TabsTrigger
                            key={t}
                            value={t}
                            className={`relative h-auto flex-none cursor-pointer rounded-none bg-transparent px-6 py-3 text-base font-bold tracking-widest transition-colors duration-150 ${
                                activeTab === t
                                    ? "text-foreground hover:text-foreground hover:bg-transparent"
                                    : "text-muted-foreground hover:text-muted-foreground hover:bg-transparent"
                            }`}
                        >
                            {t}
                            {activeTab === t && (
                                <div className="bg-primary absolute bottom-0 left-0 h-0.5 w-full" />
                            )}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                <TabsContent value="ENDPOINTS" className="m-0 h-full">
                    <EndpointsPanel />
                </TabsContent>
                <TabsContent value="SERVICES" className="m-0 h-full">
                    <ServicesPanel />
                </TabsContent>
                <TabsContent value="HOSTS" className="m-0 h-full">
                    <HostTopology />
                </TabsContent>
                <TabsContent value="CREDENTIALS" className="m-0 h-full">
                    <CredentialsPanel />
                </TabsContent>
                <TabsContent value="AUTH STATES" className="m-0 h-full">
                    <AuthStatesPanel />
                </TabsContent>
                <TabsContent value="PARAMETERS" className="m-0 h-full">
                    <ParametersPanel />
                </TabsContent>
                <TabsContent value="CVE CANDIDATES" className="m-0 h-full">
                    <CVECandidatesPanel />
                </TabsContent>
                <TabsContent value="FINDINGS" className="m-0 h-full">
                    <ELFindingsPanel />
                </TabsContent>
                <TabsContent value="EVIDENCE" className="m-0 h-full">
                    <EvidencePanel />
                </TabsContent>
                <TabsContent value="FAILURES" className="m-0 h-full">
                    <FailuresPanel />
                </TabsContent>
            </div>
        </Tabs>
    );
}

/* ─── AUTH STATES ─────────────────────────────────────── */
