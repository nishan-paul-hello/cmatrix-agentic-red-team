import React from "react";

import { Chips } from "@/features/settings/components/Chips";
import { Field } from "@/features/settings/components/Field";
import { SaveBar } from "@/features/settings/components/SaveBar";
import { SectionHead } from "@/features/settings/components/SectionHead";
import { TextInput } from "@/features/settings/components/TextInput";
import { Toggle } from "@/features/settings/components/Toggle";
import { type SettingsData } from "@/features/settings/hooks/useSettingsData";
import { sanitizeInput } from "@/utils/sanitize";

export function GeneralSettings({ data }: { data: SettingsData["general"] }) {
    const { runtime, setRuntime, ceiling, setCeiling, roe, setRoe, devRef, setDevRef } = data;
    return (
        <div className="max-w-[600px] flex-1 overflow-y-auto px-6 py-6">
            <SectionHead label="OPERATOR" />
            <Field label="OPERATOR ID">
                <TextInput value="usr-01" />
            </Field>
            <Field label="DISPLAY NAME">
                <TextInput value="Security Researcher" />
            </Field>
            <Field label="ORGANIZATION">
                <TextInput value="CMatrix Research Lab" />
            </Field>
            <SectionHead label="INTERFACE" />
            {[
                {
                    l: "AUTO-REFRESH LIVE FEED",
                    on: true,
                },
                {
                    l: "SHOW TIMESTAMPS IN UTC",
                    on: true,
                },
                {
                    l: "COMPACT TABLE ROWS",
                    on: false,
                },
                {
                    l: "SOUND ALERTS ON ESCALATION",
                    on: false,
                },
            ].map((s) => (
                <div
                    key={s.l}
                    className="mb-4 flex items-center justify-between"
                    style={{
                        borderBottom: "1px solid var(--color-hex-111111)",
                        paddingBottom: 10,
                    }}
                >
                    <span className="text-[10px] tracking-[0.06em] text-[var(--color-hex-888888)]">
                        {s.l}
                    </span>
                    <Toggle on={s.on} />
                </div>
            ))}
            <SectionHead label="DEFAULT RULES OF ENGAGEMENT" />
            <Field label="MAX RUNTIME">
                <div className="flex items-center gap-2 focus:border-[var(--color-hex-e31b23)]">
                    <input
                        value={runtime}
                        onChange={(e) => setRuntime(sanitizeInput(e.target.value))}
                        className="font-inherit w-[72px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[8px] py-[5px] text-right text-[10px] text-[var(--color-hex-a0a0a0)] outline-none"
                    />
                    <span className="text-[8.5px] text-[var(--color-hex-444444)]">hours</span>
                </div>
            </Field>
            <Field label="COST CEILING">
                <div className="flex items-center gap-2 focus:border-[var(--color-hex-e31b23)]">
                    <input
                        value={ceiling}
                        onChange={(e) => setCeiling(sanitizeInput(e.target.value))}
                        className="font-inherit w-[72px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[8px] py-[5px] text-right text-[10px] text-[var(--color-hex-a0a0a0)] outline-none"
                    />
                    <span className="text-[8.5px] text-[var(--color-hex-444444)]">USD</span>
                </div>
            </Field>
            <Field label="DEFAULT MODE">
                <Chips options={["ONE-DAY", "ZERO-DAY"]} value="ONE-DAY" onChange={() => {}} />
            </Field>
            <Field label="DEFAULT SURFACE">
                <Chips
                    options={["WEB APPLICATION", "GRAPHQL", "MULTI-HOST"]}
                    value="WEB APPLICATION"
                    onChange={() => {}}
                />
            </Field>
            <Field label="ROE TEXT">
                <textarea
                    value={roe}
                    onChange={(e) => setRoe(sanitizeInput(e.target.value))}
                    className="font-inherit min-h-[80px] w-full rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[var(--color-hex-0d0d0d)] px-[12px] py-[10px] text-[10px] leading-[1.8] tracking-[0.04em] text-[var(--color-hex-888888)] outline-none"
                    style={{
                        resize: "vertical",
                        boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--color-hex-e31b23)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--color-hex-1e1e1e)")}
                />
            </Field>
            <SectionHead label="DANGER ZONE" />
            <div className="rounded-[2px] border-[1px] border-solid border-[var(--color-hex-ff2a3244)] bg-[var(--color-hex-0a0605)] px-[16px] py-[14px]">
                <div className="mb-[8px] text-[9px] tracking-[0.16em] text-[var(--color-hex-ff2a32)]">
                    DESTRUCTIVE ACTIONS
                </div>
                <div className="flex gap-3">
                    {["CLEAR ALL MISSIONS", "RESET KNOWLEDGE BASE", "FACTORY RESET"].map((a) => (
                        <button
                            key={a}
                            className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-ff2a3266)] bg-[transparent] px-[10px] py-[5px] text-[8.5px] tracking-[0.1em] text-[var(--color-hex-ff2a32)]"
                        >
                            {a}
                        </button>
                    ))}
                </div>
            </div>
            {/* DEV REFERENCE collapsible */}
            <div className="mt-[24px]">
                <button
                    onClick={() => setDevRef(!devRef)}
                    className="font-inherit cursor-pointer rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1e1e1e)] bg-[transparent] px-[10px] py-[4px] text-[8px] tracking-[0.14em] text-[var(--color-hex-333333)]"
                >
                    {devRef ? "▾" : "▸"} DEV REFERENCE
                </button>
                {devRef && (
                    <div className="mt-[10px] rounded-[2px] border-[1px] border-solid border-[var(--color-hex-1a1a1a)] bg-[var(--color-hex-0b0b0b)] px-[14px] py-[10px] text-[9px] leading-[1.8] tracking-[0.06em] text-[var(--color-hex-444444)]">
                        Modal states: ELIGIBLE · IN_PROGRESS · EXPLOITED · BLOCKED · INFEASIBLE ·
                        DEPRIORITIZED
                        <br />
                        Finding states: PENDING · RETRY · VALIDATED · RULED OUT
                        <br />
                        Mission states: RUNNING · PAUSED · VALIDATING · QUEUED · COMPLETED ·
                        TERMINATED
                    </div>
                )}
            </div>
            <SaveBar />
        </div>
    );
}
