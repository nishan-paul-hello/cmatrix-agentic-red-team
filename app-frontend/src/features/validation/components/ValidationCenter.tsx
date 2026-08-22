import Btn from "@/features/validation/components/Btn";
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
            color: "var(--color-hex-d29922)",
        },
        {
            label: "VALIDATED",
            value: "21",
            color: "var(--color-hex-3fb950)",
        },
        {
            label: "RULED OUT",
            value: "13",
            color: "var(--color-hex-555555)",
        },
        {
            label: "RETRIES",
            value: "17",
            color: "var(--color-hex-ff2a32)",
        },
    ];
    return (
        <div className="flex h-full min-h-[0px] flex-col">
            <div
                className="flex-shrink-0 px-6 pt-5 pb-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                <div className="mb-[3px] text-[9px] tracking-[0.22em] text-[var(--color-hex-666666)]">
                    MISSION / CVE-001
                </div>
                <div className="flex items-center justify-between">
                    <h1 className="text-[20px] font-bold tracking-[0.12em] text-[var(--color-hex-f2f2f2)]">
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
            <div
                className="grid flex-shrink-0 grid-cols-4"
                style={{
                    borderBottom: "1px solid var(--color-hex-1e1e1e)",
                }}
            >
                {metrics.map((m, i) => (
                    <div
                        key={m.label}
                        className="bg-[var(--color-hex-0d0d0d)] px-[20px] py-[14px]"
                        style={{
                            borderRight: i < 3 ? "1px solid var(--color-hex-1e1e1e)" : "none",
                        }}
                    >
                        <div className="mb-[6px] text-[8px] tracking-[0.2em] text-[var(--color-hex-444444)]">
                            {m.label}
                        </div>
                        <div
                            className="text-[28px] leading-[1] font-bold"
                            style={{
                                color: m.color,
                            }}
                        >
                            {m.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Body */}
            <div className="flex min-h-[0px] flex-1 overflow-hidden">
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
