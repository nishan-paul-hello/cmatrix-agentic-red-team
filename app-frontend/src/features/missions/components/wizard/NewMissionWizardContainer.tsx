import NewMissionWizardView from "@/features/missions/components/wizard/NewMissionWizardView";
import { type WizardProps } from "@/features/missions/data/wizardMockData";
import { useNewMissionWizard } from "@/features/missions/hooks/useNewMissionWizard";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useServices } from "@/lib/services-context";

export default function NewMissionWizardContainer({ onCancel, onStart }: WizardProps) {
    const wizardState = useNewMissionWizard();
    const { eventBus } = useServices();
    const { logEvent } = useTelemetry();

    return (
        <NewMissionWizardView
            {...wizardState}
            eventBus={eventBus}
            logEvent={logEvent}
            onCancel={onCancel}
            onStart={onStart}
        />
    );
}
