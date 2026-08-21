import { useState } from "react";

import { type VFinding } from "../data/validationMockData";

export function useValidationData() {
    const [modal, setModal] = useState(false);
    const [oracleOpen, setOracleOpen] = useState(false);
    const [selected, setSelected] = useState<VFinding | null>(null);
    const [stateMachineFinding, setStateMachineFinding] = useState<VFinding | null>(null);
    return {
        modal,
        setModal,
        oracleOpen,
        setOracleOpen,
        selected,
        setSelected,
        stateMachineFinding,
        setStateMachineFinding,
    };
}
