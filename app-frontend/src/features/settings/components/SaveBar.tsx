import React, { useState } from "react";

import { Button } from "@/components/ui/button";

export function SaveBar() {
    const [saved, setSaved] = useState(false);
    return (
        <div className="mt-8 flex gap-3">
            <Button
                onClick={() => {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2000);
                }}
                className="cursor-pointer text-xs tracking-widest uppercase"
            >
                {saved ? "SAVED ✓" : "SAVE CHANGES"}
            </Button>
            <Button
                variant="outline"
                className="text-muted-foreground text-xs tracking-widest uppercase"
            >
                RESET DEFAULTS
            </Button>
        </div>
    );
}
