const pptxgen = require("pptxgenjs");

// ---------- Palette & fonts ----------
const BG = "0D1117";
const SURFACE = "161B22";
const RED = "FF3B3B";
const CYAN = "00D4FF";
const AMBER = "FFB347";
const TEXT = "F0F6FC";
const TEXT2 = "8B949E";
const BORDER = "30363D";
const GREEN = "3FB950";
const BLOCKED = "F85149";

const F_TITLE = "Syne";
const F_BODY = "Inter";
const F_MONO = "JetBrains Mono";

const W = 13.333, H = 7.5;

let pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5

function baseSlide(pageNum, opts) {
  opts = opts || {};
  const s = pres.addSlide();
  s.background = { color: BG };

  // progress bar
  if (!opts.noProgress) {
    const pct = pageNum / 20;
    s.addShape("rect", { x: 0, y: 0, w: W, h: 0.03, fill: { color: BORDER } });
    s.addShape("rect", { x: 0, y: 0, w: W * pct, h: 0.03, fill: { color: CYAN } });
  }
  // page number
  if (!opts.noPageNum) {
    s.addText(`${String(pageNum).padStart(2, "0")} / 20`, {
      x: W - 1.6, y: H - 0.42, w: 1.3, h: 0.3, fontFace: F_MONO, fontSize: 10,
      color: TEXT2, align: "right", margin: 0, isTextBox: true
    });
  }
  // watermark
  if (!opts.noWatermark) {
    s.addText("RedGrid", {
      x: 0.5, y: H - 0.42, w: 2, h: 0.3, fontFace: F_MONO, fontSize: 10,
      color: TEXT2, align: "left", margin: 0, isTextBox: true, transparency: 30
    });
  }
  return s;
}

function title(s, text, opts) {
  opts = opts || {};
  s.addText(text, Object.assign({
    x: 0.5, y: 0.35, w: W - 1, h: 0.6, fontFace: F_TITLE, bold: true,
    fontSize: opts.size || 26, color: TEXT, align: "left", margin: 0, isTextBox: true
  }, opts));
}

function sublabel(s, text, y, opts) {
  opts = opts || {};
  s.addText(text, Object.assign({
    x: 0.5, y: y || 0.85, w: W - 1, h: 0.3, fontFace: F_MONO, fontSize: 11,
    color: opts.color || TEXT2, align: "left", margin: 0, isTextBox: true
  }, opts));
}

function chip(s, text, x, y, w, opts) {
  opts = opts || {};
  const color = opts.color || AMBER;
  s.addShape("roundRect", {
    x, y, w: w || 3.2, h: 0.32, rectRadius: 0.16,
    fill: { color: color, transparency: 88 },
    line: { color: color, width: 1 }
  });
  s.addText(text, {
    x, y, w: w || 3.2, h: 0.32, fontFace: F_MONO, fontSize: 9.5, color: color,
    align: "center", valign: "middle", margin: 0, isTextBox: true
  });
}

function card(s, x, y, w, h, opts) {
  opts = opts || {};
  s.addShape("roundRect", {
    x, y, w, h, rectRadius: opts.radius || 0.08,
    fill: { color: opts.fill || SURFACE },
    line: { color: opts.line || BORDER, width: opts.lineW || 1 }
  });
}

// ============================================================
// SLIDE 1 — Title
// ============================================================
(function slide01() {
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addText("MSc Thesis · Inception Stage · Sep 2026", {
    x: 0.5, y: 0.4, w: 5, h: 0.3, fontFace: F_MONO, fontSize: 11, color: TEXT2,
    margin: 0, isTextBox: true
  });
  s.addText("RedGrid", {
    x: 0, y: 2.5, w: W, h: 1.6, fontFace: F_TITLE, bold: true, fontSize: 72,
    color: TEXT, align: "center", margin: 0, isTextBox: true
  });
  s.addText("Dependency-Constrained UCB Exploration for Autonomous Penetration Testing", {
    x: 1.5, y: 4.05, w: W - 3, h: 0.5, fontFace: F_BODY, fontSize: 16, color: CYAN,
    align: "center", margin: 0, isTextBox: true
  });
  s.addShape("line", {
    x: (W - 2.5) / 2, y: 4.7, w: 2.5, h: 0,
    line: { color: RED, width: 2 }
  });
  s.addText("[Author Names]", {
    x: 0, y: 4.95, w: W, h: 0.3, fontFace: F_BODY, bold: true, fontSize: 13, color: TEXT,
    align: "center", margin: 0, isTextBox: true
  });
  s.addText("[University Name] · Department of Computer Science", {
    x: 0, y: 5.25, w: W, h: 0.3, fontFace: F_BODY, fontSize: 11, color: TEXT2,
    align: "center", margin: 0, isTextBox: true
  });
  chip(s, "EARLY STAGE — INCEPTION REPORT", W - 3.9, H - 0.85, 3.4, { color: RED });
})();

// ============================================================
// SLIDE 2 — Motivation Hook
// ============================================================
(function slide02() {
  const s = baseSlide(2);
  sublabel(s, "WHY THIS MATTERS", 0.55, { color: AMBER });
  s.addText("Attackers move fast. Defenders move slow. Automated testers don't move at all.", {
    x: 0.5, y: 0.95, w: 7.2, h: 1.4, fontFace: F_TITLE, bold: true, fontSize: 25, color: TEXT,
    margin: 0, isTextBox: true, valign: "top"
  });
  s.addText("Security vulnerabilities are found daily in web apps, APIs, and networks. Human pen testers are scarce and expensive. Automated scanners use fixed rule-sets — they can't reason, adapt, or chain exploits.", {
    x: 0.5, y: 2.5, w: 7.0, h: 1.2, fontFace: F_BODY, fontSize: 13.5, color: TEXT2,
    margin: 0, isTextBox: true, lineSpacing: 20
  });
  card(s, 0.5, 3.85, 7.0, 1.15, { fill: AMBER, line: AMBER });
  s.addShape("roundRect", { x: 0.5, y: 3.85, w: 7.0, h: 1.15, rectRadius: 0.06, fill: { color: AMBER, transparency: 92 }, line: { color: AMBER, width: 1 } });
  s.addText("The question: Can an LLM agent carry out penetration testing autonomously — without step-by-step human direction?", {
    x: 0.75, y: 3.95, w: 6.5, h: 0.95, fontFace: F_BODY, fontSize: 13, color: TEXT,
    margin: 0, isTextBox: true, valign: "middle", lineSpacing: 18
  });

  // right illustration: concentric target rings + shields
  const cx = 10.6, cy = 3.6;
  [1.7, 1.15, 0.6].forEach((r, i) => {
    s.addShape("ellipse", {
      x: cx - r, y: cy - r, w: r * 2, h: r * 2, fill: { type: "none" },
      line: { color: RED, width: 2, transparency: i * 15 }
    });
  });
  s.addShape("ellipse", { x: cx - 0.06, y: cy - 0.06, w: 0.12, h: 0.12, fill: { color: RED } });
  [[9.3, 1.6], [11.7, 1.4], [11.9, 5.3], [9.1, 5.3]].forEach(([x, y]) => {
    s.addShape("pentagon", { x, y, w: 0.4, h: 0.42, fill: { type: "none" }, line: { color: CYAN, width: 1.4, transparency: 30 }, rotate: 180 });
  });
})();

// ============================================================
// SLIDE 3 — Literature Scope (11 cards)
// ============================================================
(function slide03() {
  const s = baseSlide(3);
  title(s, "The Literature We Surveyed", { size: 26 });
  sublabel(s, "11 papers · Focused reading · Sep 2026");

  const papers = [
    ["Fang et al. 2024a", "Foundational: GPT-4 hacks websites", "15 CVEs"],
    ["Fang et al. 2024b", "GPT-4 exploits one-day CVEs (87%)", "87%"],
    ["HPTSA (Zhu 2024)", "Hierarchical multi-agent, zero-day CVEs", "14 CVEs"],
    ["PentestGPT (Deng 2024)", "Context-loss failure mode identified", "HTB/VulnHub"],
    ["VulnBot (Kong 2025)", "Role-specialised multi-agent dispatch", "HTB-style"],
    ["CHECKMATE (Wang 2025)", "Classical planning + LLM agents", "Curated"],
    ["Incalmo (Singer 2025)", "Multi-host / Active Directory red team", "MHBench 40"],
    ["PrediQL (Liu 2025)", "GraphQL schema-aware LLM fuzzer", "6 APIs"],
    ["CVE-Bench (Zhu 2025)", "40 critical web CVEs, oracle-backed", "Benchmark"],
    ["PentestEval (Yang 2025)", "Stage-level pipeline breakdown", "346 tasks"],
    ["Wang et al. 2025", "General LLM agent survey", "Survey"],
  ];
  const cols = 4, gap = 0.18, startX = 0.5, startY = 1.35, cw = (W - 1 - gap * (cols - 1)) / cols, ch = 1.35;
  papers.forEach((p, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = startX + col * (cw + gap), y = startY + row * (ch + gap);
    card(s, x, y, cw, ch, {});
    s.addText(p[0], { x: x + 0.12, y: y + 0.1, w: cw - 0.24, h: 0.28, fontFace: F_MONO, fontSize: 10.5, color: CYAN, margin: 0, isTextBox: true, bold: true });
    s.addText(p[1], { x: x + 0.12, y: y + 0.42, w: cw - 0.24, h: 0.6, fontFace: F_BODY, fontSize: 10, color: TEXT, margin: 0, isTextBox: true, lineSpacing: 12 });
    chip(s, p[2], x + 0.12, y + ch - 0.4, cw - 0.7, { color: AMBER });
  });
})();

// ============================================================
// SLIDE 4 — Dominant Survey Finding
// ============================================================
(function slide04() {
  const s = baseSlide(4);
  sublabel(s, "WHAT THE LITERATURE AGREES ON", 0.5, { color: AMBER });
  s.addText([{ text: "Architecture, not model scale, is the dominant variable." }], {
    x: 0.8, y: 0.85, w: W - 1.6, h: 0.85, fontFace: F_TITLE, bold: true, fontSize: 26, color: TEXT,
    align: "center", margin: 0, isTextBox: true
  });
  s.addText("Six independent papers confirm: a well-structured pipeline with a cheap model beats an unstructured ReAct loop with a frontier model — AWE, AutoPT, VulnBot, PentestGPT, D-CIPHER, Incalmo", {
    x: 1.2, y: 1.7, w: W - 2.4, h: 0.6, fontFace: F_BODY, fontSize: 12, color: TEXT2,
    align: "center", margin: 0, isTextBox: true, lineSpacing: 16
  });

  const rows = [
    ["Depth-first tunnel vision", "Broad, structured exploration"],
    ["Context loss in long sessions", "Scoped per-invocation context"],
    ["No failure recovery", "Retry / adapt / escalate loops"],
    ["Implicit planning", "Explicit dependency modeling"],
  ];
  const tableRows = [
    [
      { text: "Unstructured ReAct + GPT-4", options: { bold: true, color: RED, fill: { color: RED, transparency: 90 } } },
      { text: "Structured Pipeline + GPT-4o-mini", options: { bold: true, color: CYAN, fill: { color: CYAN, transparency: 90 } } },
    ],
  ].concat(rows.map(r => [
    { text: r[0], options: { color: TEXT, fill: { color: RED, transparency: 95 } } },
    { text: r[1], options: { color: TEXT, fill: { color: CYAN, transparency: 95 } } },
  ]));

  s.addTable(tableRows, {
    x: 1.5, y: 2.55, w: W - 3, h: 3.3, fontFace: F_BODY, fontSize: 12.5,
    border: { type: "solid", color: BORDER, pt: 0.75 },
    autoPage: false, valign: "middle", margin: 6,
    rowH: 0.6
  });
})();

// ============================================================
// SLIDE 5 — Failure Mode 1 (bar chart)
// ============================================================
(function slide05() {
  const s = baseSlide(5);
  title(s, "Failure Mode 1 — Insufficient Exploration", { size: 23 });

  sublabel(s, "CVE-BENCH · 40 CRITICAL WEB CVES (CVSS 9.0+)", 1.05, { color: AMBER });
  s.addText("Even the best agent exploits only 13% (one-day) / 10% (zero-day).", {
    x: 0.5, y: 1.4, w: 5.7, h: 0.95, fontFace: F_TITLE, bold: true, fontSize: 19, color: TEXT,
    margin: 0, isTextBox: true
  });
  s.addShape("roundRect", { x: 0.5, y: 2.5, w: 5.7, h: 1.15, rectRadius: 0.05, fill: { color: RED, transparency: 92 }, line: { color: RED, width: 1 } });
  s.addText("The dominant failure is not reasoning quality — it's breadth of search. Agents commit early to a narrow attack path and never come back.", {
    x: 0.7, y: 2.58, w: 5.3, h: 1.0, fontFace: F_BODY, fontSize: 11.5, color: TEXT, valign: "middle",
    margin: 0, isTextBox: true, lineSpacing: 15
  });
  const bullets = ["37.5%–80% failure rates", "Not a smarter model problem", "CVE-Bench Table 5 documents this"];
  s.addText(bullets.map(b => ({ text: b, options: { bullet: { code: "25B8", indent: 14 }, color: TEXT2, breakLine: true } })), {
    x: 0.5, y: 3.85, w: 5.7, h: 1.0, fontFace: F_BODY, fontSize: 11.5, margin: 0, isTextBox: true, paraSpaceAfter: 6
  });

  const chartData = [{
    name: "Exploration failure %",
    labels: ["T-Agent (0-day)", "AutoGPT (0-day)", "Cy-Agent (0-day)", "T-Agent (1-day)", "AutoGPT (1-day)", "Cy-Agent (1-day)"],
    values: [80.0, 72.5, 67.5, 55.0, 45.0, 37.5]
  }];
  s.addChart(pres.ChartType.bar, chartData, {
    x: 6.5, y: 1.15, w: 6.3, h: 4.6,
    barDir: "bar",
    showTitle: true, title: "Exploration Failure Rate by Agent", titleFontSize: 12, titleColor: TEXT, titleFontFace: F_BODY,
    showValue: true, dataLabelColor: TEXT, dataLabelFontSize: 10, dataLabelPosition: "outEnd", dataLabelFormatCode: '0.0"%"',
    chartColors: [RED],
    catAxisLabelColor: TEXT2, catAxisLabelFontSize: 9.5, catAxisLabelFontFace: F_MONO,
    valAxisLabelColor: TEXT2, valAxisLabelFontSize: 9, valAxisMaxVal: 90, valAxisMinVal: 0,
    valGridLine: { color: BORDER, size: 0.5 }, catGridLine: { style: "none" },
    showLegend: false, plotArea: { fill: { color: BG } }, chartArea: { fill: { color: BG } },
    border: { pt: 0, color: BG }
  });
  s.addText("Source: CVE-Bench (Zhu et al. 2025), Table 5", {
    x: 6.5, y: 5.85, w: 6.3, h: 0.3, fontFace: F_MONO, fontSize: 9.5, color: TEXT2, margin: 0, isTextBox: true
  });
})();

// ============================================================
// SLIDE 6 — Failure Mode 2 (waterfall)
// ============================================================
(function slide06() {
  const s = baseSlide(6);
  title(s, "Failure Mode 2 — The Dependency-Reasoning Gap", { size: 22 });

  // manual waterfall bars
  const baseX = 0.6, baseY = 1.4, chartW = 6.0, chartH = 3.6;
  const bars = [
    { label: "SMP\nBaseline", val: 0.31, delta: null, hero: false },
    { label: "+ GT Weakness\nGathering (WG)", val: 0.50, delta: "+0.19", hero: false },
    { label: "+ GT Weakness\nFiltering (WF)", val: 0.53, delta: "+0.03", hero: false },
    { label: "+ GT Attack\nDecision-Making (ADM)", val: 0.67, delta: "+0.14", hero: true },
  ];
  const maxVal = 0.75;
  const bw = 1.15, gap = 0.35;
  bars.forEach((b, i) => {
    const bh = (b.val / maxVal) * chartH;
    const x = baseX + i * (bw + gap);
    const y = baseY + (chartH - bh);
    s.addShape("rect", { x, y, w: bw, h: bh, fill: { color: b.hero ? AMBER : CYAN }, line: { type: "none" } });
    s.addText(b.val.toFixed(2), { x, y: y - 0.32, w: bw, h: 0.28, fontFace: F_MONO, fontSize: 12, color: TEXT, align: "center", margin: 0, isTextBox: true, bold: true });
    if (b.delta) {
      s.addText(b.delta, { x, y: y - 0.58, w: bw, h: 0.24, fontFace: F_MONO, fontSize: 9.5, color: b.hero ? AMBER : GREEN, align: "center", margin: 0, isTextBox: true, bold: b.hero });
    }
    s.addText(b.label, { x: x - 0.1, y: baseY + chartH + 0.08, w: bw + 0.2, h: 0.5, fontFace: F_BODY, fontSize: 9, color: TEXT2, align: "center", margin: 0, isTextBox: true, lineSpacing: 11 });
  });
  s.addShape("line", { x: baseX, y: baseY + chartH, w: chartW, h: 0, line: { color: BORDER, width: 1 } });
  s.addText("★ Largest single-stage gain", { x: baseX + 3 * (bw + gap) - 0.3, y: baseY - 0.85, w: bw + 0.8, h: 0.25, fontFace: F_BODY, fontSize: 9, color: AMBER, align: "center", margin: 0, isTextBox: true });
  s.addText("Source: PentestEval (Yang et al. 2025)", { x: baseX, y: baseY + chartH + 0.65, w: chartW, h: 0.25, fontFace: F_MONO, fontSize: 9, color: TEXT2, margin: 0, isTextBox: true });

  // right column
  const rx = 7.1;
  sublabel(s, "PENTESTEVAL · 12 REAL-WORLD SCENARIOS · 346 TASKS", 1.3, { color: AMBER });
  s.addText("Attack Decision-Making (ADM) is the single weakest stage — Spearman rho = 0.25.", {
    x: rx, y: 1.65, w: 5.7, h: 1.0, fontFace: F_TITLE, bold: true, fontSize: 17, color: TEXT, margin: 0, isTextBox: true
  });
  s.addText("ADM is the stage where an agent decides which discovered weakness to pursue next, given what has already been confirmed.", {
    x: rx, y: 2.7, w: 5.7, h: 0.75, fontFace: F_BODY, fontSize: 11.5, color: TEXT2, margin: 0, isTextBox: true, lineSpacing: 15
  });
  s.addShape("roundRect", { x: rx, y: 3.55, w: 5.7, h: 1.15, rectRadius: 0.05, fill: { color: CYAN, transparency: 92 }, line: { color: CYAN, width: 1 } });
  s.addText("Ground-truth ADM injection adds +0.14 on top of already-perfect weakness discovery — the largest marginal gain available. No existing system closes it.", {
    x: rx + 0.2, y: 3.62, w: 5.3, h: 1.0, fontFace: F_BODY, fontSize: 11, color: TEXT, valign: "middle", margin: 0, isTextBox: true, lineSpacing: 15
  });
  s.addText("Any system-grown dependency structure has a realistic ceiling below 0.67", {
    x: rx, y: 4.9, w: 5.7, h: 0.5, italic: true, fontFace: F_BODY, fontSize: 10.5, color: TEXT2, margin: 0, isTextBox: true
  });
})();

// ============================================================
// SLIDE 7 — Two-Sided Gap
// ============================================================
(function slide07() {
  const s = baseSlide(7);
  s.addText("The Gap No System Has Closed", {
    x: 0.5, y: 0.4, w: W - 1, h: 0.6, fontFace: F_TITLE, bold: true, fontSize: 26, color: TEXT,
    align: "center", margin: 0, isTextBox: true
  });

  const y0 = 1.35, hh = 3.6;
  const leftW = 4.6, centerW = 2.7, rightW = 4.6;
  const lx = 0.5, cx = lx + leftW, rx = cx + centerW;

  card(s, lx, y0, leftW, hh, {});
  s.addText("Wide Exploration", { x: lx + 0.25, y: y0 + 0.2, w: leftW - 0.5, h: 0.35, fontFace: F_TITLE, bold: true, fontSize: 15, color: TEXT, margin: 0, isTextBox: true });
  s.addText("HPTSA · VulnBot · T-Agent · AutoGPT", { x: lx + 0.25, y: y0 + 0.55, w: leftW - 0.5, h: 0.3, fontFace: F_MONO, fontSize: 9.5, color: TEXT2, margin: 0, isTextBox: true });
  const leftPts = [
    ["✓", "Finds many candidate weaknesses", GREEN],
    ["✕", "No prerequisite/dependency model", BLOCKED],
    ["✕", "Flat task dispatch", BLOCKED],
  ];
  leftPts.forEach((p, i) => {
    const py = y0 + 1.15 + i * 0.55;
    s.addText(p[0], { x: lx + 0.25, y: py, w: 0.3, h: 0.4, fontFace: F_BODY, bold: true, fontSize: 13, color: p[2], margin: 0, isTextBox: true });
    s.addText(p[1], { x: lx + 0.6, y: py, w: leftW - 0.9, h: 0.4, fontFace: F_BODY, fontSize: 11.5, color: TEXT, margin: 0, isTextBox: true, valign: "middle" });
  });

  s.addShape("roundRect", { x: cx, y: y0, w: centerW, h: hh, rectRadius: 0.05, fill: { color: AMBER, transparency: 90 }, line: { color: AMBER, width: 1, dashType: "dash" } });
  s.addText("UNEXPLORED\nTERRITORY", { x: cx + 0.1, y: y0 + 1.35, w: centerW - 0.2, h: 0.7, fontFace: F_TITLE, bold: true, fontSize: 14, color: AMBER, align: "center", margin: 0, isTextBox: true });
  s.addText("The compound gap", { x: cx + 0.1, y: y0 + 2.05, w: centerW - 0.2, h: 0.3, fontFace: F_BODY, fontSize: 10, color: TEXT2, align: "center", margin: 0, isTextBox: true });

  card(s, rx, y0, rightW, hh, {});
  s.addText("Dependency Reasoning", { x: rx + 0.25, y: y0 + 0.2, w: rightW - 0.5, h: 0.35, fontFace: F_TITLE, bold: true, fontSize: 15, color: TEXT, margin: 0, isTextBox: true });
  s.addText("CHECKMATE · PentestEval SMP", { x: rx + 0.25, y: y0 + 0.55, w: rightW - 0.5, h: 0.3, fontFace: F_MONO, fontSize: 9.5, color: TEXT2, margin: 0, isTextBox: true });
  const rightPts = [
    ["✓", "Explicit prerequisite modeling", GREEN],
    ["✕", "Requires pre-enumerated weakness sets", BLOCKED],
    ["✕", "Does not scale to open-ended discovery", BLOCKED],
  ];
  rightPts.forEach((p, i) => {
    const py = y0 + 1.15 + i * 0.55;
    s.addText(p[0], { x: rx + 0.25, y: py, w: 0.3, h: 0.4, fontFace: F_BODY, bold: true, fontSize: 13, color: p[2], margin: 0, isTextBox: true });
    s.addText(p[1], { x: rx + 0.6, y: py, w: rightW - 0.9, h: 0.4, fontFace: F_BODY, fontSize: 11.5, color: TEXT, margin: 0, isTextBox: true, valign: "middle" });
  });

  s.addText("No system combines open-ended exploration WITH dynamic dependency-aware planning. RedGrid investigates this combination.", {
    x: 0.8, y: y0 + hh + 0.25, w: W - 1.6, h: 0.5, fontFace: F_BODY, bold: true, fontSize: 13, color: AMBER,
    align: "center", margin: 0, isTextBox: true
  });
})();

// ============================================================
// SLIDE 8 — Comparative Analysis Table
// ============================================================
(function slide08() {
  const s = baseSlide(8);
  title(s, "Prior System Comparison", { size: 25 });
  sublabel(s, "Four dimensions that matter most");

  const header = ["System", "Architecture", "Dependency Modeling", "Cross-Session Memory", "Benchmark"];
  const rowsRaw = [
    ["Fang et al. 2024", "Single agent (ReAct)", "None", "None", "15 CVEs"],
    ["HPTSA", "Hierarchical planner+tasks", "Flat dispatch", "None", "14 zero-day CVEs"],
    ["PentestGPT", "Split reasoning/parsing", "Implicit (LLM only)", "None", "HTB/VulnHub"],
    ["VulnBot", "Multi-agent, role-specialised", "Flat dispatch", "None", "HTB-style"],
    ["CHECKMATE", "Agent + classical planner", "Explicit, pre-enumerated", "None", "Curated only"],
    ["Incalmo", "Multi-host orchestration", "Partial (host/cred)", "None", "MHBench (40)"],
    ["PrediQL", "LLM-guided fuzzer", "Schema-derived", "None", "6 GraphQL APIs"],
    ["RedGrid (proposed)", "4-layer multi-agent", "Dynamic VDG", "3-tier memory", "Web+GraphQL+Multi-host"],
  ];
  function cellColor(v) {
    if (v === "None") return BLOCKED;
    if (["Dynamic VDG", "3-tier memory", "Explicit, pre-enumerated"].includes(v)) return GREEN;
    if (["Flat dispatch", "Implicit (LLM only)", "Partial (host/cred)", "Schema-derived"].includes(v)) return AMBER;
    return TEXT;
  }
  const tableRows = [header.map((h, i) => ({
    text: h, options: { bold: true, color: TEXT2, fontSize: 10.5, fill: { color: SURFACE } }
  }))];
  rowsRaw.forEach((r, ri) => {
    const isHero = ri === rowsRaw.length - 1;
    tableRows.push(r.map((cellText, ci) => ({
      text: cellText,
      options: {
        color: ci === 0 ? (isHero ? CYAN : TEXT) : cellColor(cellText),
        bold: ci === 0 && isHero,
        fontSize: 10,
        fill: { color: isHero ? CYAN : BG, transparency: isHero ? 90 : 0 }
      }
    })));
  });
  s.addTable(tableRows, {
    x: 0.5, y: 1.35, w: W - 1, h: 5.0, fontFace: F_BODY,
    border: { type: "solid", color: BORDER, pt: 0.5 },
    autoPage: false, valign: "middle", margin: 4, rowH: 0.5,
    colW: [2.2, 2.9, 2.4, 2.15, 2.0]
  });
  s.addText("Preliminary reading — 11-paper focused review", {
    x: 0.5, y: 6.55, w: 6, h: 0.3, fontFace: F_MONO, fontSize: 9.5, color: TEXT2, margin: 0, isTextBox: true
  });
})();

// ============================================================
// SLIDE 9 — Research Gap Statement
// ============================================================
(function slide09() {
  const s = baseSlide(9);
  title(s, "Research Gap", { size: 26 });

  s.addShape("rect", { x: 0.5, y: 1.2, w: 0.06, h: 1.9, fill: { color: RED } });
  s.addText(
    [
      { text: "The reviewed literature does not contain a system that combines:\n", options: { breakLine: true } },
      { text: "(1) ", options: { color: CYAN, bold: true } },
      { text: "broad, open-ended exploration of an unfamiliar attack surface\n", options: { breakLine: true } },
      { text: "(2) ", options: { color: CYAN, bold: true } },
      { text: "with an explicit, dynamically constructed dependency model\n", options: { breakLine: true } },
      { text: "(3) ", options: { color: CYAN, bold: true } },
      { text: "evaluated across more than one benchmarked attack-surface family.", options: {} },
    ],
    { x: 0.75, y: 1.25, w: W - 1.5, h: 1.85, fontFace: F_TITLE, bold: true, fontSize: 17, color: TEXT, margin: 0, isTextBox: true, lineSpacing: 22, valign: "middle" }
  );

  const cols = [
    ["Exploration gap", "CVE-Bench: insufficient exploration = dominant failure (37–80%)"],
    ["Planning gap", "PentestEval: ADM is weakest stage, Spearman rho = 0.25"],
    ["Coverage gap", "Every prior system evaluated on ONE surface only"],
  ];
  const gap = 0.3, cw = (W - 1 - gap * 2) / 3;
  cols.forEach((c, i) => {
    const x = 0.5 + i * (cw + gap);
    card(s, x, 3.35, cw, 1.55, {});
    s.addText(c[0], { x: x + 0.2, y: 3.5, w: cw - 0.4, h: 0.35, fontFace: F_TITLE, bold: true, fontSize: 13.5, color: AMBER, margin: 0, isTextBox: true });
    s.addText(c[1], { x: x + 0.2, y: 3.9, w: cw - 0.4, h: 0.9, fontFace: F_BODY, fontSize: 10.5, color: TEXT2, margin: 0, isTextBox: true, lineSpacing: 14 });
  });

  s.addText("This is the gap RedGrid is designed to investigate.", {
    x: 0.5, y: 5.25, w: W - 1, h: 0.4, italic: true, bold: true, fontFace: F_BODY, fontSize: 15, color: AMBER,
    align: "center", margin: 0, isTextBox: true
  });
  s.addText("Working hypothesis at early thesis stage — not a finalized claim", {
    x: 0.5, y: 5.7, w: W - 1, h: 0.3, fontFace: F_BODY, fontSize: 10, color: TEXT2, align: "center", margin: 0, isTextBox: true
  });
})();

// ============================================================
// SLIDE 10 — Introducing RedGrid
// ============================================================
(function slide10() {
  const s = baseSlide(10);
  title(s, "Introducing RedGrid", { size: 24 });

  s.addText("RedGrid", { x: 0.5, y: 1.3, w: 6, h: 0.85, fontFace: F_TITLE, bold: true, fontSize: 40, color: CYAN, margin: 0, isTextBox: true });
  s.addText("Dependency-Constrained UCB Exploration for Autonomous Penetration Testing", {
    x: 0.5, y: 2.15, w: 6, h: 0.5, fontFace: F_BODY, fontSize: 11.5, color: TEXT2, margin: 0, isTextBox: true, lineSpacing: 15
  });

  const dirs = [
    ["VDG:", "Model vulnerabilities as a graph with prerequisite edges, not a flat list"],
    ["UCB:", "Guide exploration with Upper Confidence Bound over dependency-constrained frontier"],
    ["Memory:", "Retain and reuse strategies across missions"],
  ];
  dirs.forEach((d, i) => {
    const y = 2.85 + i * 0.65;
    s.addShape("ellipse", { x: 0.55, y: y + 0.08, w: 0.09, h: 0.09, fill: { color: CYAN } });
    s.addText([{ text: d[0] + " ", options: { bold: true, color: TEXT } }, { text: d[1], options: { color: TEXT2 } }], {
      x: 0.8, y, w: 5.7, h: 0.6, fontFace: F_BODY, fontSize: 11.5, margin: 0, isTextBox: true, lineSpacing: 15
    });
  });
  chip(s, "Early stage — direction under active investigation", 0.5, 5.05, 5.3, { color: AMBER });

  // right: VDG mini diagram
  const rx0 = 7.3;
  function node(x, y, r, label, sub, color, dashed) {
    s.addShape("ellipse", { x: x - r, y: y - r, w: r * 2, h: r * 2, fill: { color: SURFACE }, line: { color, width: 2, dashType: dashed ? "dash" : "solid" } });
    s.addText(label, { x: x - r, y: y - 0.16, w: r * 2, h: 0.24, fontFace: F_BODY, bold: true, fontSize: 10, color: TEXT, align: "center", margin: 0, isTextBox: true });
    s.addText(sub, { x: x - r, y: y + 0.06, w: r * 2, h: 0.2, fontFace: F_MONO, fontSize: 7.5, color, align: "center", margin: 0, isTextBox: true });
  }
  s.addShape("line", { x: rx0 + 0.7, y: 1.9, w: 1.3, h: 0.9, line: { color: GREEN, width: 1.5, endArrowType: "triangle" }, flipV: false });
  s.addShape("line", { x: rx0 + 0.7, y: 3.7, w: 1.3, h: -0.9, line: { color: CYAN, width: 1.5, endArrowType: "triangle" } });
  s.addShape("line", { x: rx0 + 2.3, y: 2.85, w: 1.2, h: 0, line: { color: AMBER, width: 1.5, endArrowType: "triangle" } });
  node(rx0 + 0.7, 1.9, 0.42, "SQLi", "ELIGIBLE", GREEN);
  node(rx0 + 0.7, 3.7, 0.42, "XSS", "ELIGIBLE", CYAN);
  node(rx0 + 2.3, 2.85, 0.46, "Auth Bypass", "IN_PROGRESS", AMBER);
  node(rx0 + 4.1, 2.85, 0.42, "RCE", "BLOCKED", TEXT2, true);
  s.addText("Vulnerability Dependency Graph (VDG) — conceptual", {
    x: rx0, y: 4.6, w: 5.3, h: 0.3, fontFace: F_MONO, fontSize: 9.5, color: TEXT2, align: "center", margin: 0, isTextBox: true
  });
})();

// ============================================================
// SLIDE 11 — Research Objectives
// ============================================================
(function slide11() {
  const s = baseSlide(11);
  title(s, "Research Objectives", { size: 25 });
  sublabel(s, "5 working goals — under active investigation");

  const objs = [
    ["01", "VDG Formalization", "Investigate whether a prerequisite-edge graph improves agent exploration over a flat priority list"],
    ["02", "Dual-Layer World Model", "Separate confirmed facts from inferred hypotheses for independent ablation"],
    ["03", "Multi-Layer Orchestration", "Design a four-layer agent hierarchy matching strongest surveyed systems"],
    ["04", "Cross-Mission Memory", "Determine whether strategy reuse offers measurable benefit vs. negative-transfer risk"],
    ["05", "Benchmark-Grounded Evaluation", "Evaluate on oracle-backed benchmarks across 3+ attack surfaces"],
  ];
  const gap = 0.2, cw = (W - 1 - gap) / 2, ch = 1.35;
  objs.forEach((o, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * (cw + gap), y = 1.35 + row * (ch + gap);
    const w = (i === 4) ? cw : cw; // last card spans one column, kept simple
    card(s, x, y, w, ch, {});
    s.addText(o[0], { x: x + 0.15, y: y + 0.15, w: 0.6, h: 0.5, fontFace: F_TITLE, bold: true, fontSize: 22, color: CYAN, margin: 0, isTextBox: true });
    s.addText(o[1], { x: x + 0.75, y: y + 0.15, w: w - 0.95, h: 0.35, fontFace: F_TITLE, bold: true, fontSize: 13, color: TEXT, margin: 0, isTextBox: true });
    s.addText(o[2], { x: x + 0.75, y: y + 0.5, w: w - 0.95, h: 0.8, fontFace: F_BODY, fontSize: 10, color: TEXT2, margin: 0, isTextBox: true, lineSpacing: 13 });
  });

  s.addText("These reflect the research direction at inception stage. Scope will evolve with implementation.", {
    x: 0.5, y: 6.65, w: W - 1, h: 0.3, italic: true, fontFace: F_BODY, fontSize: 9.5, color: TEXT2, align: "center", margin: 0, isTextBox: true
  });
})();

// ============================================================
// SLIDE 12 — Expected Contributions
// ============================================================
(function slide12() {
  const s = baseSlide(12);
  title(s, "Expected Contributions", { size: 25 });
  sublabel(s, "Working hypotheses — not yet results", 0.85, { color: AMBER });

  const cards = [
    { kicker: "C1 — PRIMARY", t: "Dependency-Aware Attack Graph Exploration", body: "Combining UCB exploration with a dynamically grown prerequisite graph improves attack-path success over flat dispatch and pre-enumerated dependency planning.", gate: "Ablation (d) > (c) on CVE-Bench + PentestEval", metrics: "CVE-Bench zero-day pass@1 ≥ 25% · PentestEval ADM ≥ 0.50", color: RED },
    { kicker: "C2 — SUPPORTING", t: "Cross-Mission Memory + Skill Promotion", body: "3-tier memory with security-specific conditional branching strategies and oracle-gated skill promotion improves performance on seen-technology targets.", gate: "Ablation A2 shows measurable improvement on seen-technology subset", metrics: null, color: CYAN },
    { kicker: "C3 — METHODOLOGICAL", t: "Cross-Benchmark Evaluation", body: "First rigorous evaluation of a single VAPT architecture across CVE-Bench (web), PrediQL (GraphQL), and MHBench (multi-host) with standardized oracles.", gate: "Holds by construction — requires completing all benchmark tiers", metrics: null, color: GREEN },
  ];
  const gap = 0.25, cw = (W - 1 - gap * 2) / 3;
  cards.forEach((c, i) => {
    const x = 0.5 + i * (cw + gap), y = 1.35, ch = 4.6;
    s.addShape("rect", { x, y, w: cw, h: 0.05, fill: { color: c.color } });
    card(s, x, y + 0.05, cw, ch - 0.05, {});
    s.addText(c.kicker, { x: x + 0.18, y: y + 0.2, w: cw - 0.36, h: 0.25, fontFace: F_MONO, fontSize: 9, color: TEXT2, margin: 0, isTextBox: true });
    s.addText(c.t, { x: x + 0.18, y: y + 0.48, w: cw - 0.36, h: 0.75, fontFace: F_TITLE, bold: true, fontSize: 12.5, color: TEXT, margin: 0, isTextBox: true, lineSpacing: 15 });
    s.addText(c.body, { x: x + 0.18, y: y + 1.3, w: cw - 0.36, h: 1.7, fontFace: F_BODY, fontSize: 9.5, color: TEXT2, margin: 0, isTextBox: true, lineSpacing: 13 });
    chip(s, c.gate, x + 0.18, y + 3.15, cw - 0.36, { color: AMBER });
    if (c.metrics) {
      s.addText(c.metrics, { x: x + 0.18, y: y + 3.6, w: cw - 0.36, h: 0.5, fontFace: F_MONO, fontSize: 8.5, color: TEXT2, margin: 0, isTextBox: true, lineSpacing: 12 });
    }
  });
  s.addText("At this stage: direction, not result. Implementation begins next.", {
    x: 0.5, y: 6.15, w: W - 1, h: 0.3, fontFace: F_BODY, fontSize: 10.5, color: TEXT2, align: "center", margin: 0, isTextBox: true
  });
})();

// ============================================================
// SLIDE 13 — System Architecture Overview
// ============================================================
(function slide13() {
  const s = baseSlide(13);
  title(s, "RedGrid Architecture — Overview", { size: 23 });
  sublabel(s, "4-layer hierarchy · Under development", 0.8, { color: AMBER });

  const layers = [
    { n: "LAYER 1", t: "Orchestrator (Mission Planner)", comps: ["Scope Intake", "Auto-prompter", "FullCompact Trigger (85% context)"], color: RED },
    { n: "LAYER 2", t: "Team Manager", comps: ["VDG / Attack Decision-Making", "Declarative Dispatch", "Handoff Bridge"], color: CYAN },
    { n: "LAYER 3", t: "Specialist Agents", comps: ["Recon", "SQLi", "XSS", "GraphQL", "Auth/Session", "Lateral-Movement"], color: AMBER },
    { n: "LAYER 4", t: "Execution and Validation", comps: ["Execution Agent", "Evaluation Agent", "Validation Agent (Diagnosis-Adapt-Cap)"], color: GREEN },
  ];
  const lx = 0.5, lw = 9.2, lh = 0.78, gap = 0.1, ly0 = 1.3;
  layers.forEach((l, i) => {
    const y = ly0 + i * (lh + gap);
    s.addShape("roundRect", { x: lx, y, w: lw, h: lh, rectRadius: 0.05, fill: { color: l.color, transparency: 88 }, line: { color: l.color, width: 1 } });
    s.addText(l.n, { x: lx + 0.15, y: y + 0.08, w: 1.1, h: 0.25, fontFace: F_MONO, fontSize: 8.5, color: TEXT2, margin: 0, isTextBox: true });
    s.addText(l.t, { x: lx + 0.15, y: y + 0.32, w: 2.4, h: 0.4, fontFace: F_TITLE, bold: true, fontSize: 12.5, color: TEXT, margin: 0, isTextBox: true, valign: "middle" });
    const compsText = l.comps.map(c => ({ text: c, options: { fontSize: 9, color: TEXT, breakLine: false } }));
    s.addText(l.comps.join("   ·   "), { x: lx + 2.7, y: y, w: lw - 2.85, h: lh, fontFace: F_BODY, fontSize: 9.5, color: TEXT, margin: 0, isTextBox: true, valign: "middle", lineSpacing: 13 });
  });

  // memory bar
  const my = ly0 + 4 * (lh + gap) + 0.1;
  s.addShape("roundRect", { x: lx, y: my, w: lw, h: 0.5, rectRadius: 0.05, fill: { type: "none" }, line: { color: BORDER, width: 1, dashType: "dash" } });
  s.addText("MEMORY SERVICES:  Skill Library · 3-Tier FAISS Memory (Vuln-Pattern / Strategy / Technical-Action) · Episodic Failure Memory", {
    x: lx + 0.15, y: my, w: lw - 0.3, h: 0.5, fontFace: F_MONO, fontSize: 8, color: TEXT2, margin: 0, isTextBox: true, valign: "middle"
  });

  // side panel: dual-layer world model
  const sx = lx + lw + 0.25, sw = W - sx - 0.5;
  card(s, sx, ly0, sw, 3.9, {});
  s.addText("Dual-Layer\nWorld Model", { x: sx + 0.15, y: ly0 + 0.2, w: sw - 0.3, h: 0.6, fontFace: F_TITLE, bold: true, fontSize: 12.5, color: TEXT, margin: 0, isTextBox: true, lineSpacing: 15 });
  s.addText("EL — Environmental\nLayer\n(confirmed facts only)", { x: sx + 0.15, y: ly0 + 1.0, w: sw - 0.3, h: 0.9, fontFace: F_MONO, fontSize: 9.5, color: CYAN, margin: 0, isTextBox: true, lineSpacing: 13 });
  s.addText("↕", { x: sx + 0.15, y: ly0 + 1.95, w: sw - 0.3, h: 0.3, fontFace: F_BODY, fontSize: 16, color: TEXT2, align: "center", margin: 0, isTextBox: true });
  s.addText("VDG / AL — Attack\nLayer\n(scored hypotheses only)", { x: sx + 0.15, y: ly0 + 2.3, w: sw - 0.3, h: 0.9, fontFace: F_MONO, fontSize: 9.5, color: AMBER, margin: 0, isTextBox: true, lineSpacing: 13 });

  s.addText("Full formalized pseudocode specified in architecture document", {
    x: 0.5, y: my + 0.65, w: 9, h: 0.3, fontFace: F_BODY, fontSize: 9.5, color: TEXT2, margin: 0, isTextBox: true
  });
})();

// ============================================================
// SLIDE 14 — VDG Algorithm
// ============================================================
(function slide14() {
  const s = baseSlide(14);
  title(s, "The VDG Algorithm — Core Idea", { size: 23 });
  sublabel(s, "Dependency-Constrained UCB Selection");

  card(s, 0.5, 1.35, 5.9, 3.9, {});
  const codeLines = [
    "UCB_score(v) =",
    "    (w_v / n_v)           <- exploitation",
    "  + C * sqrt(ln N / n_v)  <- exploration bonus",
    "  + alpha * phi_v         <- LLM promise score",
    "  + gamma * (E_ord / 5)   <- ordinal evidence",
    "  - kappa * context_load  <- cost penalty",
    "  + lambda * epss_prior   <- CVE prior",
    "",
    "Selection rule:",
    "eligible = {v | status==ELIGIBLE",
    "             AND all prerequisites EXPLOITED}",
    "selected = argmax UCB_score(eligible)",
  ];
  s.addText(codeLines.join("\n"), {
    x: 0.75, y: 1.55, w: 5.4, h: 3.5, fontFace: F_MONO, fontSize: 11, color: TEXT, margin: 0, isTextBox: true, lineSpacing: 17
  });
  s.addText("phi = LLM-assessed exploitability · E_ord = calibrated evidence scale 0–5", {
    x: 0.5, y: 5.35, w: 5.9, h: 0.3, fontFace: F_MONO, fontSize: 9, color: TEXT2, margin: 0, isTextBox: true
  });

  // right: 5-node graph
  function node(x, y, r, label, sub, color, dashed, pulse) {
    if (pulse) {
      s.addShape("ellipse", { x: x - r - 0.1, y: y - r - 0.1, w: (r + 0.1) * 2, h: (r + 0.1) * 2, fill: { type: "none" }, line: { color: RED, width: 1.5, transparency: 40 } });
    }
    s.addShape("ellipse", { x: x - r, y: y - r, w: r * 2, h: r * 2, fill: { color: SURFACE }, line: { color, width: 2, dashType: dashed ? "dash" : "solid" } });
    s.addText(label, { x: x - r, y: y - 0.18, w: r * 2, h: 0.22, fontFace: F_BODY, bold: true, fontSize: 9.5, color: TEXT, align: "center", margin: 0, isTextBox: true });
    s.addText(sub, { x: x - r, y: y + 0.02, w: r * 2, h: 0.4, fontFace: F_MONO, fontSize: 7, color, align: "center", margin: 0, isTextBox: true, lineSpacing: 9 });
  }
  const gx = 6.9;
  node(gx + 0.7, 1.9, 0.4, "SQLi", "UCB 2.31\nELIGIBLE", GREEN, false, true);
  node(gx + 0.85, 3.6, 0.38, "XSS", "UCB 1.87\nELIGIBLE", GREEN);
  node(gx + 2.35, 2.75, 0.42, "Auth Bypass", "UCB 2.10\nBLOCKED", BLOCKED, true);
  node(gx + 4.1, 3.6, 0.36, "SSRF", "UCB 0.94\nELIGIBLE", GREEN);
  node(gx + 4.1, 1.7, 0.4, "RCE", "UCB 3.40\nBLOCKED", BLOCKED, true);
  s.addShape("line", { x: gx + 1.1, y: 2.15, w: 1.0, h: 0.35, line: { color: TEXT2, width: 1, dashType: "dash" } });
  s.addShape("line", { x: gx + 1.55, y: 2.9, w: 0.5, h: 0.5, line: { color: TEXT2, width: 1, dashType: "dash" }, flipV: true });
  s.addShape("line", { x: gx + 2.75, y: 2.6, w: 1.05, h: -0.65, line: { color: TEXT2, width: 1, dashType: "dash" } });

  s.addShape("roundRect", { x: 6.9, y: 5.35, w: 5.9, h: 1.1, rectRadius: 0.05, fill: { color: AMBER, transparency: 92 }, line: { color: AMBER, width: 1 } });
  s.addText("Unlike flat UCB, only ELIGIBLE nodes are considered — nodes blocked by unmet prerequisites are invisible to selection until their dependencies are satisfied.", {
    x: 7.1, y: 5.42, w: 5.5, h: 0.98, fontFace: F_BODY, fontSize: 9.5, color: TEXT, margin: 0, isTextBox: true, valign: "middle", lineSpacing: 13
  });
})();

// ============================================================
// SLIDE 15 — Methodology Overview
// ============================================================
(function slide15() {
  const s = baseSlide(15);
  title(s, "Methodology — High-Level Overview", { size: 22 });
  chip(s, "Planned — implementation not yet started", W - 4.6, 0.42, 4.1, { color: AMBER });

  const boxes = [
    ["1", "Scope Intake", "Target, rules of engagement, mode, surface family", true],
    ["2", "Recon", "nmap -p-, WhatWeb, ZAP passive, ffuf; seeds EL", true],
    ["3", "VDG Seed", "Team Manager infers nodes from EL; assigns UCB", true],
    ["4", "UCB Selection", "Picks highest-scoring eligible node", true],
    ["5", "Specialist Dispatch", "Fresh-context specialist runs FSM; writes to EL", false],
    ["6", "Evaluate & Validate", "E_ord scoring; oracle check; Diagnosis-Adapt-Cap", false],
    ["7", "VDG Update", "Update reward, propagate status, check termination", false],
    ["8", "Repeat / Terminate", "Dual-termination condition check", false],
  ];
  const bw = 1.42, gap = 0.06, bh = 1.85, startX = 0.4, y0 = 1.3;
  boxes.forEach((b, i) => {
    const x = startX + i * (bw + gap);
    s.addShape("roundRect", {
      x, y: y0, w: bw, h: bh, rectRadius: 0.05,
      fill: { color: SURFACE },
      line: { color: b[3] ? CYAN : AMBER, width: 1, dashType: b[3] ? "solid" : "dash" }
    });
    s.addText(b[0], { x: x + 0.08, y: y0 + 0.06, w: 0.5, h: 0.22, fontFace: F_MONO, fontSize: 8.5, color: TEXT2, margin: 0, isTextBox: true });
    s.addText(b[1], { x: x + 0.08, y: y0 + 0.28, w: bw - 0.16, h: 0.42, fontFace: F_TITLE, bold: true, fontSize: 10, color: TEXT, margin: 0, isTextBox: true, lineSpacing: 11 });
    s.addText(b[2], { x: x + 0.08, y: y0 + 0.72, w: bw - 0.16, h: bh - 0.8, fontFace: F_BODY, fontSize: 7.8, color: TEXT2, margin: 0, isTextBox: true, lineSpacing: 10 });
    if (i < boxes.length - 1) {
      s.addText("→", { x: x + bw - 0.02, y: y0 + bh / 2 - 0.15, w: 0.14, h: 0.3, fontFace: F_BODY, fontSize: 12, color: TEXT2, align: "center", margin: 0, isTextBox: true });
    }
  });
  s.addText("● solid border = design complete      ○ dashed border = design in progress", {
    x: 0.5, y: y0 + bh + 0.15, w: 9, h: 0.3, fontFace: F_BODY, fontSize: 9, color: TEXT2, margin: 0, isTextBox: true
  });

  const decisions = [
    ["Fresh context per Specialist", "Prevents context pollution (validated by PentestGPT, D-CIPHER, VulnBot)"],
    ["Dual-Layer World Model", "EL (confirmed facts) strictly separated from VDG (attack hypotheses)"],
  ];
  const dgap = 0.25, dw = (W - 1 - dgap) / 2;
  decisions.forEach((d, i) => {
    const x = 0.5 + i * (dw + dgap), y = y0 + bh + 0.6;
    card(s, x, y, dw, 1.15, {});
    s.addText(d[0], { x: x + 0.18, y: y + 0.12, w: dw - 0.36, h: 0.3, fontFace: F_TITLE, bold: true, fontSize: 12, color: CYAN, margin: 0, isTextBox: true });
    s.addText(d[1], { x: x + 0.18, y: y + 0.44, w: dw - 0.36, h: 0.65, fontFace: F_BODY, fontSize: 10, color: TEXT2, margin: 0, isTextBox: true, lineSpacing: 13 });
  });
})();

// ============================================================
// SLIDE 16 — Evaluation Plan
// ============================================================
(function slide16() {
  const s = baseSlide(16);
  title(s, "Evaluation Plan — Benchmark Suite", { size: 22 });
  chip(s, "Planned — no results yet", W - 3.4, 0.42, 2.9, { color: AMBER });

  const cards = [
    {
      t: "Web Application",
      rows: [["Primary", "CVE-Bench (40 critical CVEs, CVSS 9.0+)"], ["Also", "HPTSA 14-CVE zero-day · PentestEval 346 tasks · BountyBench (25 systems)"], ["Oracle", "8-attack-type (DoS, File Access, DB Mod, SSRF...)"]],
      target: "zero-day pass@1 ≥ 25% · one-day pass@1 ≥ 50%",
      vulns: "SQLi · XSS · CSRF · SSRF · SSTI · LFI · RCE · IDOR"
    },
    {
      t: "GraphQL APIs",
      rows: [["Primary", "PrediQL (6 APIs)"], ["Baselines", "ZAP · Burp Suite · EvoMaster · GraphQLer"]],
      target: "Schema coverage % · Vulnerability count vs. baselines",
      vulns: "Schema abuse · Dependency-chain injection · IDOR · Auth bypass"
    },
    {
      t: "Multi-Host / Active Directory",
      rows: [["Primary", "Incalmo MHBench (40 environments)"], ["Baseline", "Incalmo (37/40 floor)"]],
      target: "Host-compromise success rate",
      vulns: "Lateral movement · Credential reuse · Privilege escalation"
    },
  ];
  const gap = 0.22, cw = (W - 1 - gap * 2) / 3;
  cards.forEach((c, i) => {
    const x = 0.5 + i * (cw + gap), y = 1.35, ch = 3.35;
    card(s, x, y, cw, ch, {});
    s.addText(c.t, { x: x + 0.18, y: y + 0.15, w: cw - 0.36, h: 0.4, fontFace: F_TITLE, bold: true, fontSize: 13, color: CYAN, margin: 0, isTextBox: true });
    let ry = y + 0.6;
    c.rows.forEach(r => {
      s.addText([{ text: r[0] + ": ", options: { bold: true, color: TEXT } }, { text: r[1], options: { color: TEXT2 } }], {
        x: x + 0.18, y: ry, w: cw - 0.36, h: 0.55, fontFace: F_BODY, fontSize: 8.7, margin: 0, isTextBox: true, lineSpacing: 11
      });
      ry += 0.58;
    });
    chip(s, c.target, x + 0.18, ry + 0.02, cw - 0.36, { color: AMBER });
    s.addText(c.vulns, { x: x + 0.18, y: ry + 0.45, w: cw - 0.36, h: 0.5, fontFace: F_BODY, fontSize: 8, color: TEXT2, margin: 0, isTextBox: true, lineSpacing: 11 });
  });

  card(s, 0.5, 4.95, W - 1, 1.4, {});
  s.addText("Methodological Principles", { x: 0.7, y: 5.08, w: 8, h: 0.3, fontFace: F_TITLE, bold: true, fontSize: 12, color: TEXT, margin: 0, isTextBox: true });
  const principles = [
    "All baselines re-run under same model + compute budget (not copied from papers)",
    "McNemar's test · 95% Wilson CI · 10 runs on primary metric (CVE-Bench)",
    "Cost-per-exploit reported alongside every pass rate",
  ];
  s.addText(principles.map(p => ({ text: p, options: { bullet: { code: "25B8", indent: 14 }, color: TEXT2, breakLine: true } })), {
    x: 0.7, y: 5.4, w: W - 1.4, h: 0.9, fontFace: F_BODY, fontSize: 9.5, margin: 0, isTextBox: true, paraSpaceAfter: 4
  });
})();

// ============================================================
// SLIDE 17 — Project Timeline
// ============================================================
(function slide17() {
  const s = baseSlide(17);
  title(s, "Project Timeline", { size: 25 });
  sublabel(s, "6-month thesis program · Started Sep 2026");

  const segs = [
    { label: "Lit. Review + Architecture", w: 1.6, fill: GREEN, done: true },
    { label: "VDG Implementation + Pilot Study", w: 3.0, fill: AMBER, done: false, next: true },
    { label: "Evaluation Runs", w: 2.8, fill: null, done: false },
    { label: "Thesis Writing + Submission", w: 2.6, fill: null, done: false },
  ];
  const months = ["Sep 2026", "Oct – Nov 2026", "Dec – Jan 2027", "Feb – Mar 2027"];
  let x = 0.5, y = 1.4, th = 0.65;
  const totalW = segs.reduce((a, b) => a + b.w, 0);
  segs.forEach((seg, i) => {
    s.addText(months[i], { x, y: y - 0.32, w: seg.w, h: 0.28, fontFace: F_MONO, fontSize: 9, color: TEXT2, margin: 0, isTextBox: true });
    if (seg.done) {
      s.addShape("rect", { x, y, w: seg.w, h: th, fill: { color: GREEN, transparency: 78 }, line: { color: BORDER, width: 0.5 } });
    } else if (seg.next) {
      s.addShape("rect", { x, y, w: seg.w, h: th, fill: { color: AMBER, transparency: 78 }, line: { color: BORDER, width: 0.5 } });
    } else {
      s.addShape("rect", { x, y, w: seg.w, h: th, fill: { type: "none" }, line: { color: BORDER, width: 1, dashType: "dash" } });
    }
    s.addText(seg.label, { x: x + 0.05, y, w: seg.w - 0.1, h: th, fontFace: F_BODY, fontSize: 9, color: TEXT, margin: 0, isTextBox: true, valign: "middle", align: "center", lineSpacing: 11 });
    x += seg.w;
  });

  // milestones
  const flags = [
    { pos: 0.5 + 1.6, label: "M1 · Oct 2026\nPilot precision gate ≥ 50%" },
    { pos: 0.5 + 1.6 + 3.0 + 1.4, label: "M2 · Dec 2026\nCVE-Bench prelim run" },
    { pos: 0.5 + totalW, label: "M3 · Mar 2027\nFinal evaluation complete" },
  ];
  flags.forEach(f => {
    s.addShape("ellipse", { x: f.pos - 0.05, y: y + th + 0.08, w: 0.1, h: 0.1, fill: { color: CYAN } });
    s.addText(f.label, { x: f.pos - 0.9, y: y + th + 0.22, w: 1.8, h: 0.55, fontFace: F_MONO, fontSize: 8, color: TEXT2, align: "center", margin: 0, isTextBox: true, lineSpacing: 10 });
  });

  const chipsY = 3.7;
  const groups = [
    { h: "COMPLETE", items: ["Literature review", "Architecture specification", "Inception report"], color: GREEN },
    { h: "NEXT", items: ["VDG prototype", "Pilot study"], color: AMBER },
    { h: "PLANNED", items: ["Benchmark runs", "Ablations", "Thesis writing"], color: TEXT2 },
  ];
  let gy = chipsY;
  groups.forEach(g => {
    s.addText(g.h, { x: 0.5, y: gy, w: 2, h: 0.25, fontFace: F_MONO, fontSize: 9, color: TEXT2, margin: 0, isTextBox: true });
    let gx = 1.9;
    g.items.forEach(it => {
      const chW = 0.14 * it.length / 2 + 1.0;
      chip(s, it, gx, gy - 0.03, chW, { color: g.color });
      gx += chW + 0.15;
    });
    gy += 0.55;
  });
})();

// ============================================================
// SLIDE 18 — Known Challenges
// ============================================================
(function slide18() {
  const s = baseSlide(18);
  title(s, "Known Challenges", { size: 25 });
  sublabel(s, "Surfaced during literature review — addressed proactively");

  const risks = [
    { t: "Edge Inference Without Ground Truth", badge: "HIGH RISK", color: RED, desc: "VDG prerequisite edges are LLM-inferred. Noise weakens the dependency contribution.", mit: "Mandatory pilot study on PentestEval GT dependencies. Precision ≥ 50% gate before C1 claim." },
    { t: "Sandbox vs. Real World Gap", badge: "MEDIUM RISK", color: AMBER, desc: "Fang et al.: 1 exploitable XSS in 50 real sites (2%) vs. 73.3% in sandbox. WAFs inflate numbers.", mit: "Report sandbox and real-world (BountyBench, HTB Season 8) separately." },
    { t: "Negative Transfer in Memory", badge: "MEDIUM RISK", color: AMBER, desc: "A strategy for Framework A v1 could be harmful against v2. No surveyed paper addresses this.", mit: "Negative transfer guard in skill promotion. Ablation A2 split: seen vs. unseen technology." },
    { t: "UCB Hyperparameter Sensitivity", badge: "MANAGEABLE", color: CYAN, desc: "7 tunable parameters. Narrow optimal range may not generalize.", mit: "Grid search on Tier 1 (PentestEval). Report ±10% perturbation sensitivity." },
  ];
  const gap = 0.2, cw = (W - 1 - gap) / 2, ch = 2.4;
  risks.forEach((r, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = 0.5 + col * (cw + gap), y = 1.35 + row * (ch + gap);
    s.addShape("rect", { x, y, w: 0.05, h: ch, fill: { color: r.color } });
    card(s, x + 0.05, y, cw - 0.05, ch, {});
    s.addText(r.t, { x: x + 0.25, y: y + 0.15, w: cw - 1.6, h: 0.4, fontFace: F_TITLE, bold: true, fontSize: 12.5, color: TEXT, margin: 0, isTextBox: true });
    chip(s, r.badge, x + cw - 1.35, y + 0.15, 1.2, { color: r.color });
    s.addText(r.desc, { x: x + 0.25, y: y + 0.62, w: cw - 0.5, h: 0.75, fontFace: F_BODY, fontSize: 10, color: TEXT2, margin: 0, isTextBox: true, lineSpacing: 13 });
    s.addText([{ text: "Mitigation: ", options: { bold: true, color: CYAN } }, { text: r.mit, options: { color: TEXT } }], {
      x: x + 0.25, y: y + 1.45, w: cw - 0.5, h: 0.85, fontFace: F_BODY, fontSize: 9.5, margin: 0, isTextBox: true, lineSpacing: 13,
      fill: { color: "FFFFFF", transparency: 97 }
    });
  });
})();

// ============================================================
// SLIDE 19 — Summary
// ============================================================
(function slide19() {
  const s = baseSlide(19);
  title(s, "What We Have Accomplished (Inception Stage)", { size: 21 });

  const done = [
    "Systematic review of 11 papers",
    "Two failure modes identified with quantitative evidence",
    "Research gap formalized",
    "Three contribution hypotheses (C1, C2, C3) with validation gates",
    "Architecture specified at implementation level",
    "Full evaluation plan: 7-tier benchmark suite, ablation design",
    "Inception report submitted",
  ];
  const next = [
    "VDG prototype implementation",
    "Pilot study — edge inference precision on PentestEval GT",
    "Full CVE-Bench + PentestEval evaluation runs",
    "GraphQL and multi-host evaluation",
    "Ablation studies (A1–A8)",
    "Thesis writing and final submission",
  ];
  s.addText("What's Done", { x: 0.6, y: 1.25, w: 5.9, h: 0.35, fontFace: F_TITLE, bold: true, fontSize: 14, color: GREEN, margin: 0, isTextBox: true });
  s.addText(done.map(d => ({ text: d, options: { bullet: { code: "2713", indent: 18 }, color: TEXT, breakLine: true } })), {
    x: 0.6, y: 1.65, w: 5.9, h: 3.4, fontFace: F_BODY, fontSize: 11, margin: 0, isTextBox: true, paraSpaceAfter: 8, lineSpacing: 14
  });

  s.addText("What's Next", { x: 6.9, y: 1.25, w: 5.9, h: 0.35, fontFace: F_TITLE, bold: true, fontSize: 14, color: CYAN, margin: 0, isTextBox: true });
  s.addText(next.map(n => ({ text: n, options: { bullet: { code: "25CB", indent: 18 }, color: TEXT, breakLine: true } })), {
    x: 6.9, y: 1.65, w: 5.9, h: 3.4, fontFace: F_BODY, fontSize: 11, margin: 0, isTextBox: true, paraSpaceAfter: 8, lineSpacing: 14
  });

  s.addText('"The gap is identified. The direction is set. RedGrid investigates whether dependency-aware exploration can make autonomous penetration testing meaningfully better."', {
    x: 1.0, y: 5.5, w: W - 2, h: 1.0, fontFace: F_TITLE, bold: true, fontSize: 15, color: TEXT, align: "center", margin: 0, isTextBox: true, lineSpacing: 20, valign: "top"
  });
})();

// ============================================================
// SLIDE 20 — Thank You / Q&A
// ============================================================
(function slide20() {
  const s = pres.addSlide();
  s.background = { color: BG };
  s.addShape("rect", { x: 0, y: 0, w: W, h: 0.03, fill: { color: CYAN } });

  s.addText("RedGrid", { x: 0, y: 0.55, w: W, h: 0.6, fontFace: F_TITLE, bold: true, fontSize: 26, color: CYAN, align: "center", margin: 0, isTextBox: true });
  s.addText("Thank You", { x: 0, y: 1.15, w: W, h: 0.95, fontFace: F_TITLE, bold: true, fontSize: 52, color: TEXT, align: "center", margin: 0, isTextBox: true });
  s.addText("Questions welcome", { x: 0, y: 2.1, w: W, h: 0.4, fontFace: F_BODY, fontSize: 14, color: CYAN, align: "center", margin: 0, isTextBox: true });
  s.addShape("line", { x: (W - 2) / 2, y: 2.65, w: 2, h: 0, line: { color: RED, width: 2 } });

  const numbers = [
    ["11", "papers surveyed"], ["3", "contribution hypotheses"], ["4", "architecture layers"],
    ["3", "benchmarked attack surfaces"], ["40", "critical CVEs (primary benchmark)"], ["7", "UCB hyperparameters"],
  ];
  const terms = [
    ["VDG", "Vulnerability Dependency Graph"], ["UCB", "Upper Confidence Bound (exploration strategy)"],
    ["EL", "Environmental Layer (confirmed facts only)"], ["ADM", "Attack Decision-Making (PentestEval stage)"],
    ["E_ord", "Ordinal evidence confidence score (0–5)"], ["FullCompact", "Context reconstruction from EL+AL at 85% utilization"],
  ];
  s.addText("KEY NUMBERS", { x: 2.6, y: 3.1, w: 3.8, h: 0.25, fontFace: F_MONO, fontSize: 9.5, color: TEXT2, margin: 0, isTextBox: true });
  s.addText(numbers.map(n => ({ text: `${n[0]}  `, options: { color: AMBER, bold: true, fontFace: F_MONO } })).flatMap((seg, i) => [
    { text: numbers[i][0] + "  ", options: { color: AMBER, bold: true, fontFace: F_MONO, breakLine: false } },
    { text: numbers[i][1] + "\n", options: { color: TEXT, breakLine: true } }
  ]), {
    x: 2.6, y: 3.4, w: 3.8, h: 2.0, fontFace: F_BODY, fontSize: 10.5, margin: 0, isTextBox: true, lineSpacing: 17
  });

  s.addText("KEY TERMS", { x: 7.0, y: 3.1, w: 5.5, h: 0.25, fontFace: F_MONO, fontSize: 9.5, color: TEXT2, margin: 0, isTextBox: true });
  s.addText(terms.flatMap((t, i) => [
    { text: t[0] + "  ", options: { color: CYAN, bold: true, fontFace: F_MONO, breakLine: false } },
    { text: t[1] + "\n", options: { color: TEXT, breakLine: true } }
  ]), {
    x: 7.0, y: 3.4, w: 5.7, h: 2.0, fontFace: F_BODY, fontSize: 10.5, margin: 0, isTextBox: true, lineSpacing: 17
  });

  s.addText("[Author Names] · [University] · Sep 2026", { x: 0.6, y: H - 0.55, w: 5, h: 0.3, fontFace: F_MONO, fontSize: 10, color: TEXT2, margin: 0, isTextBox: true });
  s.addText("Target venue: USENIX Security / IEEE S&P", { x: W - 5.6, y: H - 0.55, w: 5, h: 0.3, fontFace: F_MONO, fontSize: 10, color: TEXT2, align: "right", margin: 0, isTextBox: true });
})();

// ---------- write ----------
pres.writeFile({ fileName: "/home/nishan/Documents/cmatrix-agentic-red-team/docs/files/RedGrid-Presentation.pptx" }).then(() => {
  console.log("PPTX written successfully");
}).catch(err => {
  console.error("ERROR:", err);
  process.exit(1);
});
