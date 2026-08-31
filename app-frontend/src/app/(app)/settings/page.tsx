import { PanelErrorBoundary } from "@/components/PanelErrorBoundary";
import SettingsPage from "@/features/settings/components/SettingsPage";

export default function Settings() {
    return (
        <PanelErrorBoundary>
            <SettingsPage />
        </PanelErrorBoundary>
    );
}
