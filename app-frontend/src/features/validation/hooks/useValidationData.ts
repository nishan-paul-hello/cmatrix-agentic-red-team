import { useEffect, useState } from "react";

import { type VFinding } from "@/features/validation/data/validationMockData";
import { ValidationRepository } from "@/features/validation/data/ValidationRepository";
import { type FindingStatus, type GuardrailResult } from "@/types/domain-types";
import { canTransitionFinding } from "@/utils/FSM";

export function useValidationData() {
    const [findings, setFindings] = useState<VFinding[]>([]);
    const [modal, setModal] = useState(false);
    const [oracleOpen, setOracleOpen] = useState(false);
    const [selected, setSelected] = useState<VFinding | null>(null);
    const [stateMachineFinding, setStateMachineFinding] = useState<VFinding | null>(null);
    const [guardrails, setGuardrails] = useState<Record<string, GuardrailResult>>({});

    useEffect(() => {
        void ValidationRepository.getAll().then((data) => setFindings(data));
    }, []);

    const addGuardrailResult = (result: GuardrailResult) => {
        setGuardrails((prev) => ({ ...prev, [result.findingId]: result }));
    };

    const updateFindingStatus = (finding: VFinding, newStatus: FindingStatus) => {
        if (!canTransitionFinding(finding.status as FindingStatus, newStatus)) {
            console.warn(
                `Cannot transition finding ${finding.id} from ${finding.status} to ${newStatus}`,
            );
            return false;
        }

        // In a real app we'd update the backend here
        setFindings((prev) =>
            prev.map((f) => (f.id === finding.id ? { ...f, status: newStatus } : f)),
        );

        if (selected?.id === finding.id) {
            setSelected({ ...selected, status: newStatus });
        }
        if (stateMachineFinding?.id === finding.id) {
            setStateMachineFinding({ ...stateMachineFinding, status: newStatus });
        }
        return true;
    };

    return {
        findings,
        modal,
        setModal,
        oracleOpen,
        setOracleOpen,
        selected,
        setSelected,
        stateMachineFinding,
        setStateMachineFinding,
        updateFindingStatus,
        guardrails,
        addGuardrailResult,
    };
}
