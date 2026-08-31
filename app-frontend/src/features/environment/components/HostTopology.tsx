import { useEffect, useState } from "react";

import { HostDetailPanel } from "@/features/environment/components/HostDetailPanel";
import { HostTopologyDiagram } from "@/features/environment/components/HostTopologyDiagram";
import { EnvironmentRepository } from "@/features/environment/data/EnvironmentRepository";
import { type HostNode } from "@/types/domain-types";

export default function HostTopology() {
    const [HOSTS, setData] = useState<HostNode[]>([]);
    useEffect(() => {
        void new EnvironmentRepository()
            .fetchAll<HostNode>({ collection: "HOSTS", limit: 1000 })
            .then(setData)
            .catch(console.error);
    }, []);

    const [selected, setSelected] = useState<string | null>("HOST-01");

    if (HOSTS.length === 0) {
        return null;
    }
    const sel = HOSTS.find((h) => h.id === selected);
    return (
        <div className="flex h-full min-h-0 flex-col lg:flex-row">
            {/* Topology diagram */}
            <HostTopologyDiagram hosts={HOSTS} selected={selected} setSelected={setSelected} />

            {/* Right: host detail panel */}
            <HostDetailPanel sel={sel} />
        </div>
    );
}
