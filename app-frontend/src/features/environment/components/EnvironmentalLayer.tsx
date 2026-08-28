import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import { Button } from "@/components/ui/button";
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
import { TABS } from "@/features/environment/data/mockData";
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
        <div className="flex h-full min-h-0 flex-col">
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
                <div className="flex items-end gap-0 overflow-x-auto">
                    {TABS.map((t) => (
                        <Button
                            key={t}
                            variant="ghost"
                            onClick={() => setActiveTab(t)}
                            className={`relative h-auto cursor-pointer rounded-none bg-transparent px-6 py-3 text-base font-bold tracking-widest transition-colors duration-150 ${
                                activeTab === t
                                    ? "text-foreground hover:text-foreground hover:bg-transparent"
                                    : "text-muted-foreground hover:text-muted-foreground hover:bg-transparent"
                            }`}
                        >
                            {t}
                            {activeTab === t && (
                                <div className="bg-primary absolute bottom-0 left-0 h-0.5 w-full" />
                            )}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto">
                {activeTab === "ENDPOINTS" && <EndpointsPanel />}

                {activeTab === "SERVICES" && <ServicesPanel />}

                {activeTab === "HOSTS" && <HostTopology />}
                {activeTab === "CREDENTIALS" && <CredentialsPanel />}
                {activeTab === "AUTH STATES" && <AuthStatesPanel />}
                {activeTab === "PARAMETERS" && <ParametersPanel />}
                {activeTab === "CVE CANDIDATES" && <CVECandidatesPanel />}
                {activeTab === "FINDINGS" && <ELFindingsPanel />}
                {activeTab === "EVIDENCE" && <EvidencePanel />}
                {activeTab === "FAILURES" && <FailuresPanel />}
            </div>
        </div>
    );
}

/* ─── AUTH STATES ─────────────────────────────────────── */
