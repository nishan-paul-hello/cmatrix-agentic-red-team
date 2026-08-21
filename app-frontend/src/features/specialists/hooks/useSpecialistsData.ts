import { useEffect, useState } from "react";

import { SpecialistRepository } from "@/repositories/SpecialistRepository";
import { type Specialist } from "@/types/domain-types";

export function useSpecialistsData() {
    const [specialists, setSpecialists] = useState<Specialist[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        void SpecialistRepository.getSpecialists().then((data) => {
            setSpecialists(data);
            setIsLoading(false);
        });
    }, []);

    return { specialists, isLoading };
}
