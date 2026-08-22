import { useEffect, useState } from "react";

import { type Report } from "@/features/reports/data/fixtures/reportsMockData";
import { ReportsRepository } from "@/features/reports/data/ReportsRepository";

export function useReportsData(page: number = 1, limit: number = 50) {
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
        const repo = new ReportsRepository();
        void Promise.all([
            repo.fetchAll({ page, limit }),
            ReportsRepository.getPreviewSections(),
        ]).then(([reportsData, previewData]) => {
            setReports(reportsData);
            setPreviewSections(previewData);
            if (reportsData.length > 0) {
                setSel(reportsData[0]);
            }
        });
    }, [page, limit]);

    return { sel, setSel, reports, previewSections };
}
