import { useEffect, useState } from "react";

import {
    type MODE_OPTIONS,
    type STEPS,
    type SURFACE_OPTIONS,
    type SurfaceType,
} from "@/features/missions/data/fixtures/wizardMockData";
import { WizardRepository } from "@/features/missions/data/WizardRepository";

export function useWizardData() {
    const [steps, setSteps] = useState<typeof STEPS>([]);
    const [surfaceOptions, setSurfaceOptions] = useState<typeof SURFACE_OPTIONS>([]);
    const [modeOptions, setModeOptions] = useState<typeof MODE_OPTIONS>([]);
    const [surfaceSpecialists, setSurfaceSpecialists] = useState<Record<SurfaceType, string[]>>(
        {} as Record<SurfaceType, string[]>,
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        async function load() {
            setLoading(true);
            try {
                const [st, so, mo, sSp] = await Promise.all([
                    WizardRepository.getSteps(),
                    WizardRepository.getSurfaceOptions(),
                    WizardRepository.getModeOptions(),
                    WizardRepository.getSurfaceSpecialists(),
                ]);
                if (!ignore) {
                    setSteps(st);
                    setSurfaceOptions(so);
                    setModeOptions(mo);
                    setSurfaceSpecialists(sSp);
                }
            } catch (error) {
                if (!ignore) {
                    console.error("Failed to load wizard data", error);
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }
        void load();
        return () => {
            ignore = true;
        };
    }, []);

    return { steps, surfaceOptions, modeOptions, surfaceSpecialists, loading };
}
