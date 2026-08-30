# RedGrid Landing Page — Full Redesign Prompt

## Diagnosis: why the current page is generic AI-slop

Be explicit with yourself about this before writing a single line — the current page is a template, not a description of RedGrid. Specifically:

- **The hero is content-free.** "Agentic Red Team" + a red gradient/glow on one word is a stock pattern (every AI-tool landing page built in the last two years does exactly this: dark background, one word in a saturated accent color with a glow, centered). It could be the hero for literally any "AI does security" product. It says nothing about *how* RedGrid works or what makes it different from the twenty other "autonomous pentesting agent" projects that already exist.
- **The three feature cards are adjective soup.** "Real-time Monitoring", "Autonomous Execution", "Comprehensive Coverage" — icon-in-a-rounded-square, bold title, two-line gray description — is the single most reused layout block in AI-generated marketing sites. None of the three descriptions contains a fact that's true of RedGrid and false of a competitor. "Deploy self-directed agents that adapt to your environment and chain vulnerabilities intelligently" describes nothing — it's a Mad Libs sentence that any vendor could paste under their own logo.
- **The pill badge, the two-button CTA row ("Go to Dashboard" / "View Demo"), and the "Built by 🤖" footer credit** are all lifted wholesale from generic SaaS-launch templates. None of it is wrong exactly — it's just interchangeable.
- **The page treats RedGrid like a product being sold to a buyer**, when it's actually a research system aimed at reviewers, collaborators, and other security researchers. The audience, tone, and evidence standard should look like a project page for a systems/security paper (think: an ICLR/USENIX project page, or how Anthropic/DeepMind describe a new method), not a Series A startup homepage.

The fix isn't "make it look more unique" as a styling exercise — it's **replace invented marketing copy with the actual, specific research content**, and let the visual design follow from that content instead of the other way around.

## What RedGrid actually is (ground every section in this — do not invent facts beyond it)

Before writing copy, pull the following from the project's own architecture document / README (the actual up-to-date numbers, names, and claims live there — the summary below is a starting map of what to look for, not a copy-paste script):

- RedGrid is a **four-layer orchestration framework** for autonomous vulnerability assessment and penetration testing (VAPT), driven by a **Vulnerability Dependency Graph (VDG)** — a scored DAG of prerequisite/enables edges between vulnerabilities.
- Node selection over the dependency-constrained frontier of that graph uses **UCB (Upper Confidence Bound)-guided exploration**, with **path-level impact optimization** and **ordinal evidence backpropagation** up the graph as findings are confirmed.
- A **dual-layer world model** separates confirmed environmental facts from inferred attack hypotheses — this is the mechanism that keeps the agents from treating a guess as a fact.
- RedGrid is **scoped deliberately**: it only targets attack surfaces that already have a dedicated, reusable, oracle-backed benchmark in the literature — it does not invent new benchmarks to inflate apparent coverage. In scope: web applications (CVE-Bench, HPTSA, MAPTA/XBOW, HackWorld, PentestEval, Cybench, the PentestGPT set, HTB Season 8), GraphQL APIs (PrediQL), multi-host/Active Directory networks (Incalmo MHBench), and a production-system corpus (BountyBench) as a cross-cutting hard tier. It explicitly does **not** claim general REST API attack, binary exploitation, physical/network-layer attacks, or social engineering.
- It makes **three specific, falsifiable contribution claims** — pull the exact current wording from the architecture doc, but they are approximately: (1) dependency-aware attack graph exploration via the VDG with UCB-guided selection, validated against a precision gate on ground-truth data; (2) cross-mission memory with oracle-gated skill promotion and a negative-transfer guard; (3) the first cross-benchmark evaluation spanning multiple standardized benchmark families under one orchestration layer.
- Target venues are top-tier systems/security research venues (USENIX Security, IEEE S&P, NDSS, AsiaCCS) — this is a paper-track research artifact, not a commercial product.
- The live system already runs real missions with named agent roles visible in its own dashboard telemetry (e.g. a team-manager agent doing UCB node selection, a recon specialist, a per-vulnerability-class exploit specialist, an evaluation agent parsing responses, a validation agent invoking benchmark oracles, an execution agent running tools) — this is real, running telemetry, not a mockup, and is one of the strongest things the landing page can show, because almost no competing "agentic pentest" project can show a live multi-agent trace instead of a slide.

If any of the above is stale or wrong relative to the current architecture doc, defer to the doc — but the *shape* of what belongs on the page (real mechanism names, real scoping decisions, real contribution claims, real benchmark names) is what matters, whether or not every noun above is still exactly current.

## Content architecture — replace the current sections with these

Build the page as a **research project page**, not a product marketing page. Suggested section order:

1. **Header** — name + one factual line, no tagline fluff. Example shape (rewrite with current facts): "RedGrid — a four-layer LLM-orchestrated framework for autonomous vulnerability assessment and penetration testing, evaluated across CVE-Bench, PrediQL, and MHBench." One sentence. No adjectives that aren't backed by a claim made later on the page.
2. **The problem, stated technically** — 2-3 sentences on why naive "give an LLM a shell and a goal" pentesting agents fail (they don't model *why* one vulnerability leads to another, they can't tell a confirmed fact from a hypothesis, they don't remember what worked last time in a safe way). This motivates the VDG and the dual-layer world model — don't state the mechanism before the reader knows what problem it solves.
3. **Architecture diagram** — an actual diagram of the four layers and how the VDG, UCB selection, dual-layer world model, and evidence backpropagation fit together. This replaces the three feature cards entirely. If no diagram asset exists yet, this is the single highest-priority thing to build — either as a proper SVG/diagram component or, at minimum, a clean labeled schematic. A real architecture diagram is worth more than any amount of hero copy.
4. **Scope, stated as a table or explicit list, not prose** — in-scope attack surfaces on the left, the specific oracle-backed benchmark backing each one on the right (web apps → CVE-Bench/HPTSA/MAPTA/HackWorld/PentestEval/Cybench/HTB S8; GraphQL → PrediQL; multi-host/AD → MHBench; production corpus → BountyBench), and a short, plainly-stated "explicitly out of scope" line underneath (general REST, binary exploitation, physical/network-layer, social engineering). Stating the boundary honestly is itself a credibility signal to a research audience — don't hide it in fine print, put it on the page.
5. **Contributions** — the three claims (C1/C2/C3), each as a short heading + one sentence, written the way a paper's contribution list is written: specific enough to be falsifiable, no hype adjectives. If a claim has a validation gate (e.g. a precision threshold on ground-truth data), state the number.
6. **The system, live** — this is where the current dashboard screenshot belongs, but shown *in the context of a real mission trace* (the live activity feed with named agents doing UCB_UPDATE, RESPONSE_PARSE, ORACLE_TEST, etc. is genuinely differentiated content — most competing tools can only show a static diagram). Caption it factually: name what's happening in the trace, don't just caption it "Live Dashboard."
7. **Evaluation methodology** — one paragraph on the cross-benchmark evaluation approach (what makes evaluating across CVE-Bench + PrediQL + MHBench under one orchestration layer a real methodological contribution, not just "we tested it a lot").
8. **Target venues / research context** — state plainly that this is aimed at USENIX Security / IEEE S&P (primary) and NDSS / AsiaCCS (secondary). This is normal and expected on a research project page and signals seriousness rather than needing to be hidden.
9. **CTA row** — replace "Go to Dashboard" / "View Demo" with actions that make sense for this audience: e.g. "Explore a live mission" (goes to the actual dashboard) and something like "Read the architecture" (links to the full architecture doc/paper draft if one is publishable) or a repo/contact link. The CTA should match what a visiting researcher or collaborator would actually want to do next, not what a SaaS trial signup wants.
10. **Footer** — author/institution attribution as it would appear on a paper or lab project page (name, affiliation, contact/citation info if applicable). Drop the generic "Built by 🤖" line — attribute the actual project to actual people, the way real research software does.

## Visual direction

- **No glow/gradient hero text.** State the name and one factual line in clean, confident typography. Confidence should come from precision of the copy, not a lighting effect.
- **No icon-in-rounded-square feature-card grid.** If you need to show discrete concepts (e.g. the four layers, or the four in-scope surface types), use a diagram, a labeled architecture graphic, or a real table — not a card grid with a lucide icon standing in for the actual idea.
- **No decorative particles/blurred gradient blobs/glassmorphism panels** unless a specific piece of real content (e.g. an actual VDG node-graph visualization) benefits from that treatment. Decoration should never be load-bearing for visual interest — the content should be interesting enough to not need it.
- **Reference the actual dashboard's existing visual language** (monospace/mono-adjacent type, sharp corners on data surfaces, hairline dividers, dense red/dark palette, uppercase tracked labels) so the landing page reads as the front door of the same system, not a different product's marketing site bolted onto it.
- **Diagrams and tables carry the page.** A dense, technical, diagram-forward page is the correct register for this audience — resist the urge to "simplify for a general audience"; the audience is other researchers and reviewers.
- Keep the existing dark-only theme (no light mode) and the app's real typography/color tokens — don't introduce a new visual system just for this page.

## Copy rules

- Every sentence must be falsifiable or removable. If a sentence would still sound true with RedGrid's name replaced by a competitor's, cut it or make it specific enough that it wouldn't.
- No unquantified superlatives ("comprehensive", "cutting-edge", "seamless", "powerful") unless immediately followed by the specific fact that earns the word.
- Prefer real nouns from the architecture (VDG, UCB selection, dual-layer world model, oracle-gated skill promotion, negative-transfer guard, ordinal evidence backpropagation) over generic ones (AI, intelligent, autonomous) wherever the real noun is available and correct.
- If you don't have a specific fact for a section, don't backfill it with a vaguer sentence — flag it as a gap and ask for the missing detail (a number, a diagram asset, a current claim wording) rather than inventing something that sounds plausible.

## What "done" looks like

A visiting security researcher who has never seen RedGrid should, from this page alone, be able to state: what the four-layer architecture does, which specific benchmarks it's evaluated against, what its three research contributions are, and what it explicitly does not claim to do. If a reader can't answer those four things after reading the page, the page has failed regardless of how it looks.
