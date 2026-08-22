import React from "react";

import { useSettingsData } from "@/features/settings/hooks/useSettingsData";

import SettingsPageView from "./SettingsPageView";

export default function SettingsPageContainer() {
    const data = useSettingsData();
    return <SettingsPageView data={data} />;
}
