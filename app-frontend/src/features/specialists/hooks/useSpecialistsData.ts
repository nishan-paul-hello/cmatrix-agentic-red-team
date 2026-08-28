import { useEffect, useState } from "react";

import { useServices } from "@/lib/services-context";
import { type Specialist } from "@/types/domain-types";

export function useSpecialistsData() {
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { specialistRepository } = useServices();

    useEffect(() => {
        void specialistRepository.fetchAll({ limit: 1000 }).then((data) => {
            setSpecialists(data);
            setIsLoading(false);
        });
    }, [specialistRepository]);

    return { specialists, isLoading };
}
