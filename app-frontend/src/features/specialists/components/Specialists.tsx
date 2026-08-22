import React, { useState } from "react";

import { SpecDetail } from "@/features/specialists/components/SpecDetail";
import { SpecGrid } from "@/features/specialists/components/SpecGrid";
import { useSpecialistsData } from "@/features/specialists/hooks/useSpecialistsData";
import { type Specialist } from "@/types/domain-types";

export default function Specialists() {
    const [detail, setDetail] = useState<Specialist | null>(null);
    const { specialists, isLoading } = useSpecialistsData();

    return detail ? (
        <SpecDetail spec={detail} onBack={() => setDetail(null)} />
    ) : (
        <SpecGrid onSelect={setDetail} specialists={specialists} isLoading={isLoading} />
    );
}
