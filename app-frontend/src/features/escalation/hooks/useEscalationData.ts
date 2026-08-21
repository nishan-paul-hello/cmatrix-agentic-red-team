import { useEffect, useState } from "react";

import { getEscalationContextBlocks } from "@/features/escalation/data/fixtures/escalationMockData";

export function useEscalationData() {
    const [contextBlocks, setContextBlocks] = useState<{ k: string; v: string }[]>([]);

    useEffect(() => {
        void getEscalationContextBlocks().then(setContextBlocks);
    }, []);

    return { contextBlocks };
}
