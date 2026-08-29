import Btn from "@/features/validation/components/Btn";
import { cn } from "@/lib/utils";
import OraclePanel from "@/features/validation/components/OraclePanel";
import StateMachineModal from "@/features/validation/components/StateMachineModal";
import { useValidationData } from "@/features/validation/hooks/useValidationData";
import { useTelemetry } from "@/hooks/useTelemetry";

import { FindingDetailDrawer } from "./FindingDetailDrawer";
import { ValidationTable } from "./ValidationTable";

export default function ValidationCenter() {
    const { logEvent } = useTelemetry();
    const {
        modal,
        setModal,
        oracleOpen,
        setOracleOpen,
        selected,
        setSelected,
        stateMachineFinding,
        setStateMachineFinding,
        findings,
        updateFindingStatus,
        addGuardrailResult,
        guardrails,
    } = useValidationData();
    const metrics = [
        {
            label: "PENDING VALIDATION",
            value: "08",
            color: "text-warning",
        },
        {
            label: "VALIDATED",
            value: "21",
            color: "text-success",
        },
        {
            label: "RULED OUT",
            value: "13",
            color: "text-muted-foreground",
        },
        {
            label: "RETRIES",
            value: "17",
            color: "text-destructive",
        },
    ];
    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="border-border flex-shrink-0 border-b px-6 pt-5 pb-4">
                <div className="text-muted-foreground mb-0.5 text-base tracking-widest">
                    MISSION / CVE-001
                </div>
                <div className="flex items-center justify-between">
                    <h1 className="text-foreground text-xs font-bold tracking-wide">
                        VALIDATION CENTER
                    </h1>
                    <div className="flex gap-2">
                        <Btn
                            onClick={() => {
                                setStateMachineFinding(selected);
                                setModal(true);
                            }}
                            label="STATE MACHINE"
                        />
                        <Btn onClick={() => setOracleOpen((v) => !v)} label="ORACLE PANEL" red />
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="border-border grid flex-shrink-0 grid-cols-1 border-b sm:grid-cols-2 lg:grid-cols-4">
                {metrics.map((m) => (
                    <div key={m.label} className="bg-background border-border border-r px-5 py-3.5">
                        <div className="text-muted-foreground mb-1.5 text-sm tracking-widest">
                            {m.label}
                        </div>
                        <div
                            className={cn("text-sm leading-none font-bold", m.color)}
                        >
                            {m.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden lg:flex-row">
                {/* Table */}
                <ValidationTable
                    findings={findings}
                    selected={selected}
                    setSelected={setSelected}
                />

                {/* Oracle panel */}
                {oracleOpen && <OraclePanel onClose={() => setOracleOpen(false)} />}
            </div>

            {/* State machine modal */}
            {modal && (
                <StateMachineModal onClose={() => setModal(false)} finding={stateMachineFinding} />
            )}

            {/* Finding detail drawer */}
            {selected && (
                <FindingDetailDrawer
                    selected={selected}
                    setSelected={setSelected}
                    guardrails={guardrails}
                    updateFindingStatus={updateFindingStatus}
                    addGuardrailResult={addGuardrailResult}
                    logEvent={logEvent}
                />
            )}
        </div>
    );
}
