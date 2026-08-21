import { useEffect, useState } from "react";

import { getReportsData, type Report } from "../data/fixtures/reportsMockData";

export function useReportsData() {
    const [sel, setSel] = useState<Report | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [previewSections, setPreviewSections] = useState<
        {
            title: string;
            content?: string;
            items?: { sev: string; id: string; name: string; target: string; eord: string }[];
        }[]
    >([]);

    useEffect(() => {
        void getReportsData().then((data) => {
            setReports(data.reports);
            setPreviewSections(data.previewSections);
            if (data.reports.length > 0) {
                setSel(data.reports[0]);
            }
        });
    }, []);

    return { sel, setSel, reports, previewSections };
}
