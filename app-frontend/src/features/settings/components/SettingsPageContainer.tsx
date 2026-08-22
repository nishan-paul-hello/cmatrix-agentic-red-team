import { useState } from "react";

import SettingsPageView, {
    type SettingsTab,
} from "@/features/settings/components/SettingsPageView";

export default function SettingsPageContainer() {
    const [tab, setTab] = useState<SettingsTab>("GENERAL");
    return <SettingsPageView tab={tab} setTab={setTab} />;
}
