import { useMemo, useState } from "react";

import { filterAuditEntries } from "@/features/audit/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { type AuditEntry } from "@/types/domain-types";

export function useAuditFilters(entries: AuditEntry[]) {
    const [typeFilter, setTypeFilter] = useState<string>("ALL");
    const [resultFilter, setResultFilter] = useState<string>("ALL");
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    const visible = useMemo(
        () => filterAuditEntries(entries, typeFilter, resultFilter, debouncedSearch),
        [entries, typeFilter, resultFilter, debouncedSearch],
    );

    return { typeFilter, setTypeFilter, resultFilter, setResultFilter, search, setSearch, visible };
}
