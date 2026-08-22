import React, { useState } from "react";

export function SaveBar() {
    const [saved, setSaved] = useState(false);
    return (
        <div className="mt-8 flex gap-3">
            <button
                onClick={() => {
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2000);
                }}
                className="font-inherit cursor-pointer rounded-[2px] border-none bg-[var(--color-hex-e31b23)] px-[20px] py-[7px] text-[9.5px] tracking-[0.14em] text-[var(--color-hex-f2f2f2)]"
            >
                {saved ? "SAVED ✓" : "SAVE CHANGES"}
            </button>
            <button className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-292929)] bg-[transparent] px-[16px] py-[7px] text-[9.5px] tracking-[0.14em] text-[var(--color-hex-666666)]">
                RESET DEFAULTS
            </button>
        </div>
    );
}
