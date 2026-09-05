# RedGrid — Inception Defense Script
**Total runtime target: ~11 minutes | 21 slides | Speak at a confident, conversational pace**

> Delivery notes are in *italics*. Everything else is what you say, memorize word-for-word or paraphrase in your own voice — the beats matter more than exact wording.

---

## SLIDE 1 — Title
*(~30 sec — smile, make eye contact, don't rush)*

Good morning. We're Nishan Paul and Rakibur Rahman, and today we're presenting our inception-stage project — **RedGrid**.

The full title is *"Dependency-Constrained UCB Exploration for Autonomous Penetration Testing."* That's a mouthful, so here's the one-sentence version: **we're teaching an AI agent to hack like a strategist, not like a script.**

Let's get into why that matters.

---

## SLIDE 2 — Motivation
*(~45 sec — pause after the quote)*

Here's the reality of cybersecurity today:

*"Attackers move fast. Defenders move slow. Automated testers don't move at all."*

New vulnerabilities show up every single day — in web apps, in APIs, in networks. Human penetration testers can't keep up; they're expensive and there just aren't enough of them. And the automated scanners we do have? They follow fixed rule-sets. They can't reason. They can't adapt. They definitely can't chain one exploit into the next.

So we asked one question: **can an LLM agent actually run a penetration test on its own — without a human guiding every step?**

That question is the seed of this entire project.

---

## SLIDE 3 — Literature We Surveyed
*(~30 sec — keep this brisk, it's a scope-setter)*

To answer that, we didn't start from scratch — we went deep into the literature. Eight autonomous agent systems, from AutoHack to PrediQL. Two hard benchmarks. One broad survey.

The headline finding across all of it: **benchmarks — not the agent papers themselves — are where the real failure data lives.** That's what pointed us toward our research gap.

---

## SLIDE 4 — What the Literature Agrees On
*(~40 sec — this is your first big "aha" moment, land it)*

Across six independent papers, one sentence kept repeating in different words:

*"Architecture, not model scale, is the dominant variable."*

In plain terms — throwing a bigger model at this problem doesn't fix it. What separates the winners from the losers is **structure**. Look at the difference: unstructured agents fall into tunnel vision, lose context over long sessions, and can't recover from failure. Structured pipelines explore broadly, keep scoped context, and retry when something breaks.

That's the first clue: **the fix isn't a smarter brain — it's a smarter skeleton.**

---

## SLIDE 5 — Failure Mode 1: Insufficient Exploration
*(~40 sec — let the number land, pause before "root cause")*

Now let's get specific. On CVE-Bench — forty critical, real-world CVEs — even the *best* agent only exploits 13% of one-day vulnerabilities, and 10% of zero-days.

Read that again: **ninety percent failure**, from top-performing systems.

And the reason isn't that these agents reason badly. It's that they commit to one narrow attack path early — and never look back. Exploration failure rates range from 37.5% all the way up to 80% across every agent tested.

**Root cause: this isn't a smarter-model problem. It's a search problem.**

---

## SLIDE 6 — Failure Mode 2: The Dependency-Reasoning Gap
*(~40 sec)*

Here's the second failure mode, and it's just as important. On PentestEval — 12 real-world scenarios, 346 tasks — researchers ran an experiment: what if you just *hand* the agent the correct next attack decision?

The score jumps by **+0.14** — the single largest gain of any intervention tested. That tells us Attack Decision-Making is the weakest link in the entire pipeline — a Spearman correlation of just 0.25.

So agents are decent at *finding* weaknesses. They're bad at **deciding what to do about them.**

---

## SLIDE 7 — The Gap No System Has Closed
*(~40 sec — this is the pivot slide, slow down)*

Put those two failures side by side and something interesting happens.

Systems like HPTSA and VulnBot are great at wide exploration — but they have no dependency model. Systems like CHECKMATE are great at dependency reasoning — but only if you *hand-feed* them a pre-built list of weaknesses first.

**Nobody combines open-ended exploration with dynamic, on-the-fly dependency reasoning.**

That gap — right in the middle — is exactly where RedGrid lives.

---

## SLIDE 8 — Prior System Comparison
*(~30 sec — quick scan, don't read every cell)*

We compared eleven systems across four dimensions: architecture, dependency modeling, memory, and benchmark coverage. Every single one is missing at least one piece. RedGrid is the only proposed system in this table checking all four boxes at once — that's the target we're building toward.

---

## SLIDE 9 — The Identified Gap
*(~35 sec — read the three-part gap slowly and clearly)*

So here's our research gap, stated precisely:

The literature does not contain a system that combines — one — broad, open-ended exploration of an unfamiliar attack surface; two — an explicit, dynamically constructed dependency model; and three — evaluation across more than one benchmarked attack-surface family.

Three numbers back this up: exploration failure up to **80%**. Decision-making correlation of just **0.25**. And every prior system tested on exactly **one** attack surface.

**This is the gap RedGrid is designed to investigate.**

---

## SLIDE 10 — Introducing RedGrid
*(~45 sec — this is your "reveal" slide, energy up)*

So — what is RedGrid, actually? Three ideas, and we promise they're simpler than they sound.

**VDG** — Vulnerability Dependency Graph. Instead of a flat to-do list of weaknesses, we model them as a graph, with edges showing "you need this before you can do that."

**UCB** — Upper Confidence Bound. A well-known bandit algorithm that helps the agent pick its *next best move* along that graph, balancing what looks promising against what's still unexplored.

**Memory** — the agent doesn't forget. It carries strategies forward from one mission to the next.

Picture it like this: SQLi and XSS are open doors, sitting there. Auth Bypass has the highest score — that's next. RCE is locked behind a prerequisite. **The agent always goes after the smartest next move, not just the closest one.**

---

## SLIDE 11 — Research Objectives
*(~40 sec — five items, keep pace snappy)*

Five working goals for this inception stage:

One — does a prerequisite graph actually beat a flat priority list?
Two — can we separate confirmed facts from inferred hypotheses in the world model?
Three — design a four-layer agent hierarchy matching the strongest systems we surveyed.
Four — does cross-mission memory help, or does it risk negative transfer?
And five — evaluate everything on oracle-backed benchmarks, across three or more attack surfaces.

We want to be upfront: **these are directions, not conclusions. Scope will evolve as we implement.**

---

## SLIDE 12 — Expected Contributions
*(~35 sec — say this with intellectual honesty, not overselling)*

We're framing our contributions as **questions**, because that's what they honestly are at this stage.

Can modeling vulnerabilities as a dependency graph help an agent explore smarter? Can an agent carry forward lessons from one engagement into the next? And can one architecture be evaluated fairly across web, GraphQL, and multi-host targets using the same standard?

To be clear: **these are research questions. The answers come from experiments — not from this report.**

---

## SLIDE 13 — RedGrid: The Core Idea
*(~35 sec — this is your simplest, most quotable slide)*

If you remember only one slide, remember this one. RedGrid is three verbs, connected in a loop:

**Explore** — search the full attack surface, don't commit early.
**Guide** — use the dependency graph to pick the smartest next step.
**Learn** — remember what worked, carry it forward.

The question we're really asking: **does connecting exploration, dependency reasoning, and memory make autonomous penetration testing meaningfully better?**

---

## SLIDE 14 — Architecture: A Rough Sketch
*(~35 sec — this is a technical slide, stay grounded and clear)*

Here's roughly how the pieces fit together. A **World Model** keeps confirmed facts strictly separate from attack hypotheses. A **Mission Planner** takes the target and stays in control of the run. A **Decision-Maker** picks what to attack next, using the dependency graph. **Specialist agents** — one for web, one for GraphQL, one for network — each focus on a single attack type. And an **execute-and-validate** step actually runs the attack and checks if it worked. **Memory** sits underneath all of it, remembering strategies and failures.

We want to stress — this is a sketch. It's the current best guess, not a locked design.

---

## SLIDE 15 — How RedGrid Will Work
*(~35 sec)*

Operationally, it's a four-step loop: **Recon** — scan the target. **Plan** — decide the next move using the graph. **Attack** — send in a specialist agent. **Learn** — check if it worked, update the graph, store the lesson, repeat.

Two design principles underpin this: every attack attempt starts with a **clean slate** — no leftover noise from the last step — and facts the agent has *confirmed* are always kept separate from things it's only *guessing.*

---

## SLIDE 16 — Evaluation: Three Attack Surfaces
*(~35 sec)*

We're testing this on three fronts, and we're being strict about it: **only published, oracle-backed benchmarks — no custom benchmarks of our own.**

Web applications, using CVE-Bench's 40 real critical CVEs. GraphQL APIs, using PrediQL's real-world schemas. And multi-host networks, using MHBench's 40 environments, to test whether the agent can move laterally and escalate privilege.

Three very different battlefields, one architecture.

---

## SLIDE 17 — Project Timeline
*(~25 sec — quick, factual, confident)*

Six months, three checkpoints. Today, September 5th — our Inception Defense, where literature and architecture get locked. November 21st — Mid Defense, where we integrate the VDG mechanism and run the first agentic loop end-to-end. February 20th — Final Defense: full benchmark evaluation, comparative analysis, and submission.

---

## SLIDE 18 — Challenges We Are Aware Of
*(~35 sec — show self-awareness, this builds credibility)*

We're not pretending this will be easy. Four risks, ranked honestly.

**Critical** — inferring dependencies with an LLM instead of a human will be noisy; we have to measure that gap directly. **High** — what works in a sandbox may fail in the real world, so we test both. **Medium** — memory could backfire if a strategy that worked on one software version breaks on the next; we need a safety mechanism. **Low** — the system has tunable parameters, and results need to hold up without one lucky setup.

---

## SLIDE 19 — Where We Are
*(~35 sec — this is your closing status check)*

So, where does that leave us today? We've synthesized eleven key papers, identified two quantified failure modes, formalized the research gap, proposed three research directions, and sketched the architecture. The inception report is submitted.

**The blueprint is ready. We're asking for the greenlight to start building.**

Next up: the prototype, early experiments, full benchmark evaluation, and — eventually — the thesis itself.

And here's the honest question we want to leave the committee with: **given the ambitious scope of VDG plus dependency-aware exploration, should we pursue the full architecture — or constrain scope to one subsystem before we start implementing?**

---

## SLIDE 20 — Thank You
*(~15 sec — smile, open posture)*

That's RedGrid. Thank you for your time — we'd love to take your questions.

---

## SLIDE 21 — References
*(~10 sec, only if committee lingers here — otherwise skip straight to Q&A)*

All eleven core papers and three foundational algorithms — VDG, UCB, and Reflexion — are listed here for reference.

---

### Timing cheat-sheet
| Section | Slides | Approx. time |
|---|---|---|
| Hook & Motivation | 1–2 | 1.5 min |
| Literature & Gap | 3–9 | 4 min |
| RedGrid Introduced | 10–13 | 2.5 min |
| Architecture & Method | 14–15 | 1.5 min |
| Evaluation, Timeline, Risks | 16–18 | 1.5 min |
| Wrap-up | 19–21 | 1 min |
| **Total** | | **~11–12 min** |

### Delivery reminders
- Slides 5, 6, 9 have the hard numbers — don't rush these, let the silence after a stat do the work.
- Slide 13 is your "quotable" line — say it slowly, it's the thesis of the whole talk in one breath.
- Slide 19's closing question is a genuine invitation for discussion — pause and actually look at the committee before moving to Slide 20.
