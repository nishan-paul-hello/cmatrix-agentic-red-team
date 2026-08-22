import React, { useCallback, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

import ExecutionConsoleView from "@/features/execution/components/ExecutionConsoleView";
import { getParsedRows } from "@/features/execution/data/fixtures/executionMockData";
import { useExecutionFeed } from "@/features/execution/hooks/useExecutionFeed";
import { type ExecEntry } from "@/types/domain-types";

export default function ExecutionConsoleContainer() {
    const entries = useExecutionFeed();
    const [parsedRows, setParsedRows] = React.useState<
        { port: string; state: string; service: string; version: string }[]
    >([]);

    React.useEffect(() => {
        void getParsedRows().then(setParsedRows);
    }, []);

    const [drawer, setDrawer] = useState<ExecEntry | null>(null);
    const parentRef = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line react-hooks/incompatible-library
    const rowVirtualizer = useVirtualizer({
        count: entries.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 33, // Approximate row height based on paddings (7px top/bottom + text)
        overscan: 10,
    });

    const handleRowClick = useCallback((e: ExecEntry) => {
        setDrawer(e);
    }, []);

    return (
        <ExecutionConsoleView
            entries={entries}
            parsedRows={parsedRows}
            drawer={drawer}
            setDrawer={setDrawer}
            parentRef={parentRef}
            rowVirtualizer={rowVirtualizer}
            handleRowClick={handleRowClick}
        />
    );
}
