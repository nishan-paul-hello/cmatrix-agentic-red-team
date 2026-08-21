import React from "react";

import { useBenchmarksData } from "../hooks/useBenchmarksData";
import BenchmarkDetail from "./BenchmarkDetail";
import BenchmarkList from "./BenchmarkList";

export default function BenchmarksHub() {
    const { detail, setDetail } = useBenchmarksData();
    return detail ? (
        <BenchmarkDetail bench={detail} onBack={() => setDetail(null)} />
    ) : (
        <BenchmarkList onSelect={setDetail} />
    );
}
