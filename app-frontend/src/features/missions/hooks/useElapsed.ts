import { useEffect, useState } from "react";

export function useElapsed(start: number) {
    const [elapsed, setElapsed] = useState(start);
    useEffect(() => {
        const iv = setInterval(() => setElapsed((s) => s + 1), 1000);
        return () => clearInterval(iv);
    }, []);
    const m = Math.floor(elapsed / 60)
        .toString()
        .padStart(2, "0");
    const s = (elapsed % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}
