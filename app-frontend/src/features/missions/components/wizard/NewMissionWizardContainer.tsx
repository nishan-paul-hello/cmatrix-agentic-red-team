"use client";

import { useRouter } from "next/navigation";

import NewMissionWizardView from "@/features/missions/components/wizard/NewMissionWizardView";
import { type WizardProps } from "@/features/missions/data/fixtures/wizardMockData";
import { useNewMissionWizard } from "@/features/missions/hooks/useNewMissionWizard";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useMission } from "@/lib/mission-context";
import { useServices } from "@/lib/services-context";

export default function NewMissionWizardContainer({ onCancel, onStart }: WizardProps) {
    const wizardState = useNewMissionWizard();
    const { eventBus } = useServices();
    const { logEvent } = useTelemetry();
    const router = useRouter();
    const { setActiveMissionId } = useMission();

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            router.push("/missions");
        }
    };

    const handleStart = () => {
        if (onStart) {
            onStart();
        } else {
            setActiveMissionId("NEW-001");
            router.push("/missions/NEW-001");
        }
    };

    return (
        <NewMissionWizardView
            {...wizardState}
            eventBus={eventBus}
            logEvent={logEvent}
            onCancel={handleCancel}
            onStart={handleStart}
        />
    );
}
