"use client";

import dynamic from "next/dynamic";

import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";

const BenchmarksHub = dynamic(() => import("@/features/benchmarks/components/BenchmarksHub"), {
    ssr: false,
});

export default function Benchmarks() {
    return (
        <PanelErrorBoundary>
            <BenchmarksHub />
        </PanelErrorBoundary>
    );
}
