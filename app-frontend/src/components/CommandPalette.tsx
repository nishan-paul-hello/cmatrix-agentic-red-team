import { useState, useEffect, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PaletteItem {
  id: string;
  label: string;
  sub: string;
  category: "MISSION" | "FINDING" | "SPECIALIST" | "ACTION" | "NAV" | "SETTING";
  kbd?: string;
}

interface CategoryStyle {
  color: string;
  bg: string;
}

// ─── Static data ──────────────────────────────────────────────────────────────

const ALL_ITEMS: PaletteItem[] = [
  { id: "go-dashboard",  label: "Dashboard",        sub: "Go to command center",         category: "NAV",       kbd: "G D" },
  { id: "go-missions",   label: "Missions",         sub: "Go to missions list",           category: "NAV",       kbd: "G M" },
  { id: "go-benchmarks", label: "Benchmarks",       sub: "Go to benchmark results",       category: "NAV" },
  { id: "go-reports",    label: "Reports",          sub: "Go to generated reports",       category: "NAV" },
  { id: "go-audit",      label: "Audit Log",        sub: "View system audit events",      category: "NAV" },
  { id: "go-settings",   label: "Settings",         sub: "Open system settings",          category: "NAV",       kbd: "G S" },
  { id: "m-cve001",      label: "CVE-001",          sub: "app.targetcorp.com · ACTIVE",   category: "MISSION" },
  { id: "m-bench014",    label: "BENCH-014",        sub: "CVE-BENCH v2 Full · COMPLETE",  category: "MISSION" },
  { id: "m-bench013",    label: "BENCH-013",        sub: "PrediQL Reasoning · COMPLETE",  category: "MISSION" },
  { id: "f-001",         label: "F-001 SQL INJECTION", sub: "/api/users?id= · CRITICAL",  category: "FINDING" },
  { id: "f-002",         label: "F-002 AUTH BYPASS",   sub: "/api/auth/login · HIGH",     category: "FINDING" },
  { id: "f-003",         label: "F-003 IDOR",          sub: "/api/users/:id · HIGH",      category: "FINDING" },
  { id: "s-inject",      label: "INJECT-SPEC",      sub: "RUNNING · sqli_blind_time()",  category: "SPECIALIST" },
  { id: "s-auth",        label: "AUTH-SPEC",        sub: "COMPLETED · exploit_auth()",   category: "SPECIALIST" },
  { id: "s-recon",       label: "RECON-SPEC",       sub: "COMPLETED · recon_target()",   category: "SPECIALIST" },
  { id: "act-new",       label: "New Mission",      sub: "Start a new VAPT mission",      category: "ACTION",    kbd: "N" },
  { id: "act-pause",     label: "Pause Mission",    sub: "Pause active mission agents",   category: "ACTION" },
  { id: "act-escalate",  label: "Human Escalation", sub: "Open escalation panel",        category: "ACTION" },
  { id: "act-report",    label: "Generate Report",  sub: "Generate mission report",       category: "ACTION" },
  { id: "set-roe",       label: "ROE Defaults",     sub: "Edit rules of engagement",      category: "SETTING" },
  { id: "set-models",    label: "Model Settings",   sub: "Configure LLM assignments",     category: "SETTING" },
];

const CAT_STYLE: Record<PaletteItem["category"], CategoryStyle> = {
  NAV:        { color: "var(--color-hex-a0a0a0)", bg: "var(--color-hex-111111)" },
  MISSION:    { color: "var(--color-hex-e31b23)", bg: "var(--color-hex-120608)" },
  FINDING:    { color: "var(--color-hex-ff2a32)", bg: "var(--color-hex-1a0608)" },
  SPECIALIST: { color: "var(--color-hex-d29922)", bg: "var(--color-hex-110e00)" },
  ACTION:     { color: "var(--color-hex-3fb950)", bg: "var(--color-hex-061a0c)" },
  SETTING:    { color: "var(--color-hex-555555)", bg: "var(--color-hex-111111)" },
};

const HELP_KEYS = [
  { k: "↑↓", v: "navigate" },
  { k: "↵",  v: "open"     },
  { k: "ESC", v: "close"   },
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface CommandPaletteProps {
  onClose: () => void;
  onNavigate: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CommandPalette({ onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? ALL_ITEMS.filter(
        (i) =>
          i.label.toLowerCase().includes(query.toLowerCase()) ||
          i.sub.toLowerCase().includes(query.toLowerCase()) ||
          i.category.includes(query.toUpperCase()),
      )
    : ALL_ITEMS;

  // Focus input on mount.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function updateQuery(value: string) {
    setQuery(value);
    setCursor(0);
  }

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setCursor((c) => Math.min(c + 1, filtered.length - 1));
          break;
        case "ArrowUp":
          e.preventDefault();
          setCursor((c) => Math.max(c - 1, 0));
          break;
        case "Enter":
          if (filtered[cursor]) {
            onNavigate(filtered[cursor].id);
            onClose();
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    },
    [filtered, cursor, onNavigate, onClose],
  );

  // Scroll highlighted item into view.
  useEffect(() => {
    const el = listRef.current?.children[cursor] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  // Group visible items by category (preserving order of first appearance).
  const cats = Array.from(new Set(filtered.map((i) => i.category)));

  return (
    <div
      className="fixed inset-0 flex items-start justify-center bg-[var(--color-hex-00000099)] z-[100] pt-[120px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="w-[600px] bg-[var(--color-hex-0d0d0d)] border border-[var(--color-hex-292929)] rounded-[3px] overflow-hidden"
        style={{ boxShadow: "0 24px 48px var(--color-hex-000000cc)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 h-[48px] border-b border-[var(--color-hex-1e1e1e)]">
          <span className="text-[14px] text-[var(--color-hex-333333)]" aria-hidden="true">
            ⌘
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => updateQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search missions, findings, actions…"
            aria-label="Search command palette"
            aria-autocomplete="list"
            className="flex-1 bg-transparent border-none outline-none text-[12px] text-[var(--color-hex-f2f2f2)] tracking-[0.04em]"
          />
          {query && (
            <button
              onClick={() => updateQuery("")}
              aria-label="Clear search"
              className="text-[var(--color-hex-333333)] bg-transparent border-none cursor-pointer text-[12px] hover:text-[var(--color-hex-666666)] transition-colors duration-100"
            >
              ✕
            </button>
          )}
          <kbd className="text-[8px] text-[var(--color-hex-333333)] bg-[var(--color-hex-111111)] border border-[var(--color-hex-1e1e1e)] rounded-[2px] py-[2px] px-[6px]">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div ref={listRef} className="overflow-y-auto max-h-[420px]">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="text-[20px] text-[var(--color-hex-1e1e1e)] mb-[8px]" aria-hidden="true">
                ◇
              </div>
              <div className="text-[10px] text-[var(--color-hex-333333)] tracking-[0.14em]">
                NO RESULTS
              </div>
            </div>
          ) : (
            cats.map((cat) => (
              <div key={cat}>
                {/* Category header */}
                <div className="text-[7.5px] text-[var(--color-hex-333333)] tracking-[0.2em] bg-[var(--color-hex-0a0a0a)] px-[16px] py-[6px] pb-[3px] border-t border-[var(--color-hex-111111)]">
                  {cat}
                </div>

                {/* Items */}
                {filtered
                  .filter((i) => i.category === cat)
                  .map((item) => {
                    const idx = filtered.indexOf(item);
                    const cc = CAT_STYLE[item.category];
                    const active = idx === cursor;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          onClose();
                        }}
                        onMouseEnter={() => setCursor(idx)}
                        role="option"
                        aria-selected={active}
                        className={[
                          "flex items-center gap-3 py-[9px] px-[16px] cursor-pointer border-l-2 transition-colors duration-75",
                          active
                            ? "bg-[var(--color-hex-141414)] border-[var(--color-hex-e31b23)]"
                            : "border-transparent",
                        ].join(" ")}
                      >
                        {/* Category badge */}
                        <span
                          className="text-[9px] rounded-[2px] py-[1px] px-[6px] tracking-[0.1em] font-semibold shrink-0"
                          style={{
                            color: cc.color,
                            background: cc.bg,
                            border: `1px solid ${cc.color}33`,
                          }}
                        >
                          {item.category}
                        </span>

                        {/* Label + sub */}
                        <div className="flex-1 min-w-0">
                          <div
                            className="text-[10.5px] tracking-[0.04em] overflow-hidden whitespace-nowrap text-ellipsis"
                            style={{
                              color: active
                                ? "var(--color-hex-f2f2f2)"
                                : "var(--color-hex-a0a0a0)",
                              fontWeight: active ? 700 : 400,
                            }}
                          >
                            {item.label}
                          </div>
                          <div className="text-[8.5px] text-[var(--color-hex-444444)] tracking-[0.04em] mt-[1px] overflow-hidden whitespace-nowrap text-ellipsis">
                            {item.sub}
                          </div>
                        </div>

                        {/* Keyboard shortcut */}
                        {item.kbd && (
                          <kbd className="text-[8px] text-[var(--color-hex-333333)] bg-[var(--color-hex-111111)] border border-[var(--color-hex-1e1e1e)] rounded-[2px] py-[2px] px-[6px] shrink-0">
                            {item.kbd}
                          </kbd>
                        )}
                      </div>
                    );
                  })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-[var(--color-hex-0a0a0a)] border-t border-[var(--color-hex-141414)]">
          <div className="flex items-center gap-4">
            {HELP_KEYS.map((h) => (
              <div key={h.k} className="flex items-center gap-1">
                <kbd className="text-[7.5px] text-[var(--color-hex-333333)] bg-[var(--color-hex-111111)] border border-[var(--color-hex-1e1e1e)] rounded-[2px] py-[1px] px-[5px]">
                  {h.k}
                </kbd>
                <span className="text-[7.5px] text-[var(--color-hex-333333)] tracking-[0.1em]">
                  {h.v}
                </span>
              </div>
            ))}
          </div>
          <span className="text-[7.5px] text-[var(--color-hex-222222)] tracking-[0.12em]">
            {filtered.length} RESULTS
          </span>
        </div>
      </div>
    </div>
  );
}
