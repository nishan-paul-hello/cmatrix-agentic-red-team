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
    const { activeTab, setActiveTab } = useEnvironmentalData();
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            {/* Header */}
            <div
                className="flex-shrink-0 px-6 pt-5 pb-0"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    ENVIRONMENT
                </div>
                <div className="mb-3 flex items-baseline gap-3">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
                        ENVIRONMENTAL LAYER
                    </h1>
                    <span className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a4a20)] bg-[var(--color-hex-0a1a10)] px-[7px] py-[1px] text-[9px] tracking-[0.16em] text-[var(--color-hex-3fb950)]">
                        CONFIRMED
                    </span>
                </div>
                {/* Tabs */}
                <div className="flex items-end gap-0 overflow-x-auto">
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setActiveTab(t)}
                            className={`font-inherit relative cursor-pointer bg-transparent px-[24px] py-[12px] text-[9.5px] font-bold tracking-[0.2em] transition-colors duration-150 ${
                                activeTab === t
                                    ? "text-[var(--color-hex-f2f2f2)]"
                                    : "text-[var(--color-hex-555555)] hover:text-[var(--color-hex-a0a0a0)]"
                            }`}
                        >
                            {t}
                            {activeTab === t && (
                                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--color-hex-e31b23)]" />
                            )}
                        </button>
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
