import dynamic from "next/dynamic";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";

const BenchmarksHub = dynamic(() => import("@/features/benchmarks/components/BenchmarksHub"));

export default function Benchmarks() {
    return (
        <PanelErrorBoundary>
            <BenchmarksHub />
        </PanelErrorBoundary>
    );
}
