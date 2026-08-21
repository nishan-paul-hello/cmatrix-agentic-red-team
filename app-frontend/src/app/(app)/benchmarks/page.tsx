"use client";

import dynamic from "next/dynamic";

const BenchmarksHub = dynamic(() => import("@/features/benchmarks/components/BenchmarksHub"), {
    ssr: false,
});

export default function Benchmarks() {
    return <BenchmarksHub />;
}
