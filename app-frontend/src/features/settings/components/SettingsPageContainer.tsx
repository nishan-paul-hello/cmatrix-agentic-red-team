import React from "react";

import SettingsPageView from "@/features/settings/components/SettingsPageView";
import { useSettingsData } from "@/features/settings/hooks/useSettingsData";

export default function SettingsPageContainer() {
    const data = useSettingsData();
    return <SettingsPageView data={data} />;
}
