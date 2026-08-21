import { useState } from "react";

import { type VFinding } from "@/features/validation/data/validationMockData";
import { type FindingStatus } from "@/types/domain-types";
import { canTransitionFinding } from "@/utils/FSM";

export function useValidationData() {
    const [modal, setModal] = useState(false);
    const [oracleOpen, setOracleOpen] = useState(false);
    const [selected, setSelected] = useState<VFinding | null>(null);
    const [stateMachineFinding, setStateMachineFinding] = useState<VFinding | null>(null);

    const updateFindingStatus = (finding: VFinding, newStatus: FindingStatus) => {
        if (!canTransitionFinding(finding.status as FindingStatus, newStatus)) {
            console.warn(
                `Cannot transition finding ${finding.id} from ${finding.status} to ${newStatus}`,
            );
            return false;
        }

        // In a real app we'd update the backend here
        if (selected?.id === finding.id) {
            setSelected({ ...selected, status: newStatus });
        }
        if (stateMachineFinding?.id === finding.id) {
            setStateMachineFinding({ ...stateMachineFinding, status: newStatus });
        }
        return true;
    };

    return {
        modal,
        setModal,
        oracleOpen,
        setOracleOpen,
        selected,
        setSelected,
        stateMachineFinding,
        setStateMachineFinding,
        updateFindingStatus,
    };
}
