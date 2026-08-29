"use client";

import BenchmarkDetail from "@/features/benchmarks/components/BenchmarkDetail";
import BenchmarkList from "@/features/benchmarks/components/BenchmarkList";
import { useBenchmarksData } from "@/features/benchmarks/hooks/useBenchmarksData";

export default function BenchmarksHub() {
    const { detail, setDetail } = useBenchmarksData();
    return detail ? (
        <BenchmarkDetail bench={detail} onBack={() => setDetail(null)} />
    ) : (
        <BenchmarkList onSelect={setDetail} />
    );
}
