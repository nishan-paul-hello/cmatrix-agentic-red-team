import React from "react";

import { MODE_OPTIONS, type ModeType } from "../../data/wizardMockData";

export default function ModeCards({
    value,
    onChange,
}: {
    value: ModeType;
    onChange: (v: ModeType) => void;
}) {
    return (
        <div
            className="flex gap-5"
            style={{
                alignItems: "stretch",
            }}
        >
            {MODE_OPTIONS.map((opt) => {
                const selected = value === opt.value;
                return (
                    <button
                        key={opt.value}
                        onClick={() => onChange(opt.value)}
                        className={`font-inherit relative flex flex-1 cursor-pointer flex-col rounded-[2px] border border-solid text-left transition-colors duration-100 ${selected ? "border-[var(--color-hex-e31b23)] bg-[var(--color-hex-120608)]" : "border-[var(--color-hex-292929)] bg-[var(--color-hex-0d0d0d)] hover:border-[var(--color-hex-444444)] hover:bg-[var(--color-hex-111111)]"}`}
                        style={{
                            padding: "22px 20px 18px",
                        }}
                    >
                        {/* Top row: icon + title + selected dot */}
                        <div className="mb-1 flex items-start justify-between">
                            <div className="flex items-center gap-2.5">
                                <span
                                    className="text-[18px] leading-[1]"
                                    style={{
                                        color: selected
                                            ? "var(--color-hex-e31b23)"
                                            : "var(--color-hex-444444)",
                                    }}
                                >
                                    {opt.icon}
                                </span>
                                <span
                                    className="text-[16px] font-bold tracking-[0.14em]"
                                    style={{
                                        color: selected
                                            ? "var(--color-hex-f2f2f2)"
                                            : "var(--color-hex-555555)",
                                    }}
                                >
                                    {opt.value}
                                </span>
                            </div>
                            {selected && (
                                <div
                                    className="mt-[4px] h-[8px] w-[8px] shrink-0 bg-[var(--color-hex-e31b23)]"
                                    style={{
                                        borderRadius: "50%",
                                    }}
                                />
                            )}
                        </div>

                        {/* Hint + badges row */}
                        <div className="mb-5 flex items-center gap-2">
                            <span
                                className="text-[9px] font-semibold tracking-[0.2em]"
                                style={{
                                    color: selected
                                        ? "var(--color-hex-9e1118)"
                                        : "var(--color-hex-333333)",
                                }}
                            >
                                {opt.hint}
                            </span>
                            <span
                                className="rounded-[2px] px-[6px] py-[1px] text-[8.5px] font-semibold tracking-[0.16em]"
                                style={{
                                    color: opt.badgeColor,
                                    background: `${opt.badgeColor}18`,
                                    border: `1px solid ${opt.badgeColor}44`,
                                }}
                            >
                                {opt.badge}
                            </span>
                            <span className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-222222)] bg-[var(--color-hex-151515)] px-[6px] py-[1px] text-[8.5px] tracking-[0.14em] text-[var(--color-hex-555555)]">
                                {opt.difficulty}
                            </span>
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-[16px] h-[1px]"
                            style={{
                                background: selected
                                    ? "var(--color-hex-2a0a0c)"
                                    : "var(--color-hex-1a1a1a)",
                            }}
                        />

                        {/* Description */}
                        <div className="mb-[20px] grow text-[10px] leading-[1.7] tracking-[0.04em] text-[var(--color-hex-555555)]">
                            {opt.description}
                        </div>

                        {/* Divider */}
                        <div
                            className="mb-[14px] h-[1px]"
                            style={{
                                background: selected
                                    ? "var(--color-hex-2a0a0c)"
                                    : "var(--color-hex-1a1a1a)",
                            }}
                        />

                        {/* Implications list */}
                        <div className="flex flex-col gap-2">
                            {opt.implications.map((imp) => (
                                <div key={imp.label} className="flex items-start gap-2">
                                    <span
                                        className="min-w-[96px] shrink-0 text-[8.5px] font-semibold tracking-[0.16em]"
                                        style={{
                                            color: selected
                                                ? "var(--color-hex-e31b23)"
                                                : "var(--color-hex-333333)",
                                        }}
                                    >
                                        {imp.label}
                                    </span>
                                    <span className="text-[8.5px] leading-[1.5] tracking-[0.06em] text-[var(--color-hex-444444)]">
                                        {imp.detail}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
