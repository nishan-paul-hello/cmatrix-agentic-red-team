# 🕷️ LLM Agents Can Autonomously Hack Websites

> **Richard Fang · Rohan Bindu · Akul Gupta · Qiusi Zhan · Daniel Kang**
> University of Illinois Urbana-Champaign (UIUC)
> 📄 *arXiv:2402.06664v3 [cs.CR]* — 16 Feb 2024
> ✉️ Correspondence: `ddkang@illinois.edu`

---

## 📌 Abstract

> LLMs can now interact with tools, read documents, and recursively call themselves — making them capable of functioning as **autonomous agents**.

This paper shows, for the first time, that LLM agents can **autonomously hack websites** — performing complex tasks like *blind database schema extraction* and *SQL injection*, **without any human feedback**.

**Key takeaways:**

- 🎯 The agent does **not** need to know the vulnerability beforehand.
- 🚀 Enabled uniquely by **frontier models** (tool use + long context).
- ✅ **GPT-4** succeeds at these hacks — ❌ open-source models do not.
- 🌍 GPT-4 can even find vulnerabilities in **real-world websites in the wild**.
- ⚠️ Raises serious questions about the risks of widespread LLM deployment.

---

## 🧭 1. Introduction

Recent advances let LLMs call functions, read documents, and recursively prompt themselves — collectively enabling them to act as **agents**. Agents have already shown promise in scientific discovery, and speculation has grown around their role in **cybersecurity offense and defense**. Yet, until this work, little was empirically known about LLM agents' *offensive* capabilities.

### 🔑 Core Findings

```mermaid
flowchart LR
    A["🧑 User Prompt<br/>'Hack this website'"] --> B["🤖 LLM Agent (GPT-4)"]
    B --> C["🛠️ Tools<br/>(browser, terminal, code)"]
    B --> D["📚 Documents<br/>(web-hacking references)"]
    B --> E["🕓 History<br/>(prior actions/context)"]
    C --> F["💉 SQL Injection / XSS / etc."]
    F --> G["📝 Response:<br/>'The website is vulnerable to ...'"]
    D --> B
    E --> B
```

*Figure 1 — Schematic of an autonomous LLM agent hacking a website.*

- 🧩 Agents can perform **complex SQL union attacks** — a multi-step process (**38 actions**) covering schema extraction, data extraction, and final exploitation.
- 🏆 The most capable agent hacked **73.3%** (11/15, pass@5) of tested vulnerabilities.
- 🌐 Importantly, the agent finds vulnerabilities in **real-world websites**, not just sandboxed test sites.
- ⚙️ Implementable in as few as **85 lines of code** using standard tooling (OpenAI Assistants API).
- 📉 Removing key components (docs / detailed prompts) drops success rate to **13%**.
- 📊 Strong **scaling law**: GPT-3.5 → 6.7% success; **all** open-source models tested → **0%**.
- 💰 Cost to attempt a hack: **~$9.81** — roughly **8× cheaper** than a human analyst (~$80).

---

## 🧠 2. Background: LLM Agents & Web Security

### 2.1 What Makes an LLM Agent?

> An agent is *"a system that can use an LLM to reason through a problem, create a plan to solve the problem, and execute the plan with the help of a set of tools."*

Three capabilities matter most here:

| Capability | Why it matters |
|---|---|
| 🔧 **Tool / API use** | Lets the LLM *take actions* itself instead of relying on a human to relay results back |
| 🔁 **Planning & reacting** | Feeds tool outputs back as context, enabling multi-step reasoning and course-correction |
| 📖 **Document reading** | Grounds the agent with domain knowledge (similar to RAG) |

### 2.2 A Crash Course in Web Security

Websites split into a **front-end** (user-facing) and **back-end** (server + database). Vulnerabilities can live in either:

- 🎭 **Front-end exploits** — e.g., **Cross-Site Scripting (XSS)**: injecting malicious scripts to steal user data.
- 🗄️ **Back-end exploits** — e.g., **SQL Injection**: sending crafted input straight into a database query.

**Classic unsafe query example:**

```sql
uName = getRequestString("username")
uPass = getRequestString("userpassword")
sql = 'SELECT * FROM Users WHERE Name ="' + uName + '" AND Pass ="' + uPass + '"'
```

> 💥 An attacker entering `" or ""="` as both username and password makes the condition **always true**, leaking the entire user table.

This is just the *simplest* case — the paper's agents tackle far harder variants (blind SQL union attacks, SSTI, SSRF, XSS+CSRF chains, etc).

*(Scope note: the study only covers vulnerabilities in the websites themselves — not phishing attacks against maintainers.)*

---

## ⚙️ 3. Building the Hacking Agent

To turn an LLM into an autonomous website-hacking agent, the authors combined three ingredients:

```mermaid
flowchart TD
    subgraph Agent Stack
    T["🖥️ Headless Browser (Playwright)<br/>+ Terminal + Python interpreter"]
    D["📚 6 Curated Documents<br/>web-hacking · SQLi ×2 · XSS ×2 · SSRF"]
    P["🗣️ Detailed System Prompt<br/>(planning instructions)"]
    end
    T --> AG["🤖 GPT-4 Agent<br/>(OpenAI Assistants API + LangChain)"]
    D --> AG
    P --> AG
    AG --> W["🌐 Target Website"]
    W -->|"feedback"| AG
```

### 🛠️ Agent Setup

- **Browser control** — [Playwright](https://playwright.dev/) gives the agent programmatic, sandboxed control of a headless browser (clicking, form-filling, etc.) — *no visual/screenshot understanding used*.
- **Terminal + code interpreter** — access to tools like `curl` and a Python REPL.
- **Orchestration** — built on OpenAI's **Assistants API**, executed via the **LangChain** framework.

### 📚 Reference Documents

Six *publicly sourced, unmodified* documents were given to the agent:

- 1× general web hacking guide
- 2× SQL injection guides
- 2× XSS guides
- 1× SSRF guide

> ⚠️ None of the documents contained specific instructions for the paper's test websites — this measures *generalization*, not memorized answers.

### ✍️ Prompt Design

Since the agent gets **zero human feedback** mid-task, the initial prompt is critical. The best-performing prompt tells the agent to:

1. 🎨 Be **creative**
2. 🔀 Try **different strategies**
3. 🎯 **Pursue promising strategies to completion**
4. 🔄 **Switch strategies** after failure

*(Full prompt withheld from publication for safety reasons — available to researchers on request.)*

---

## 🧪 4. Experiments: Can LLM Agents Actually Hack Websites?

### 4.1 Setup

- 🏝️ **Sandboxed** real websites (real DB + backend + frontend, but isolated — no real-world impact).
- 🎯 **15 vulnerabilities** tested, spanning Easy → Hard.
- ⏱️ Attack = **failure** if not achieved within **10 minutes**.
- 🎲 **5 trials/vulnerability**; success = at least **1/5** succeeds (**pass@5**) — realistic for security, since one successful breach is enough.
- 🤖 **10 models tested**: GPT-4, GPT-3.5, and 8 open-source models (LLaMA-2 7B/13B/70B, Mixtral-8x7B, Mistral-7B, OpenHermes-2.5-Mistral-7B, Nous Hermes-2 Yi-34B, OpenChat 3.5).

### 🗂️ Vulnerability Roster

| Difficulty | Vulnerability | What it does |
|---|---|---|
| 🟢 Easy | LFI | Executes server files via unchecked input |
| 🟢 Easy | CSRF | Tricks an authenticated user into a malicious request |
| 🟢 Easy | XSS | Injects malicious script into a trusted site |
| 🟢 Easy | SQL Injection | Malicious SQL manipulates/exfiltrates a DB |
| 🟡 Medium | Brute Force | Tries many username/password combos |
| 🟡 Medium | SQL Union | Uses `UNION` to pull data across tables |
| 🟡 Medium | SSTI | Injects code into a server-side template engine |
| 🟡 Medium | Webhook XSS | `<img>`-based XSS exfiltrates admin's DOM to a webhook |
| 🟡 Medium | File Upload | Spoofs headers to upload `.php` as an image |
| 🟡 Medium | Authorization Bypass | Steals session tokens, edits hidden fields to act as admin |
| 🔴 Hard | SSRF | Bypasses filters to hit an admin-only endpoint |
| 🔴 Hard | JavaScript Attacks | Injects/manipulates JS to steal info or hijack actions |
| 🔴 Hard | Hard SQL Injection | SQLi with an unusual payload |
| 🔴 Hard | Hard SQL Union | Blind union attack — server gives **no error feedback** |
| 🔴 Hard | XSS + CSRF | XSS chained into a forced admin password reset |

---

### 🏆 4.2 Headline Results

| Agent | Pass@5 | Overall Success Rate |
|---|---:|---:|
| 🥇 **GPT-4 Assistant** | **73.3%** | **42.7%** |
| 🥈 GPT-3.5 Assistant | 6.7% | 2.7% |
| OpenHermes-2.5-Mistral-7B | 0.0% | 0.0% |
| LLaMA-2 Chat (70B) | 0.0% | 0.0% |
| LLaMA-2 Chat (13B) | 0.0% | 0.0% |
| LLaMA-2 Chat (7B) | 0.0% | 0.0% |
| Mixtral-8x7B Instruct | 0.0% | 0.0% |
| Mistral (7B) Instruct v0.2 | 0.0% | 0.0% |
| Nous Hermes-2 Yi (34B) | 0.0% | 0.0% |
| OpenChat 3.5 | 0.0% | 0.0% |

```mermaid
xychart-beta
    title "Pass@5 Success Rate by Agent"
    x-axis ["GPT-4", "GPT-3.5", "Open-source (all)"]
    y-axis "Success Rate (%)" 0 --> 80
    bar [73.3, 6.7, 0]
```

**🔍 Key observations:**

- GPT-4 solved **11 of 15** vulnerabilities, including a *Hard SQL Union* attack requiring **38 sequential actions** (blind schema extraction → targeted queries → final exploit).
- GPT-4 **failed** on: Authorization Bypass, JavaScript Attacks, Hard SQL Injection, XSS+CSRF.
- GPT-3.5 could reliably do only **one** thing: basic SQL injection — it failed even at "textbook" attacks like XSS/CSRF.
- A clean **capability scaling law** emerges: GPT-4 ➜ GPT-3.5 ➜ open-source, success rate collapses at each step.

---

### 🔬 4.3 Ablation Studies

What actually drives GPT-4's success? Four conditions were tested:

1. ✅ Docs **+** ✅ Detailed prompt *(full agent)*
2. ❌ Docs **+** ✅ Detailed prompt
3. ✅ Docs **+** ❌ Detailed prompt
4. ❌ Docs **+** ❌ Detailed prompt *(bare minimum)*

```mermaid
xychart-beta
    title "Ablation: Overall Success Rate (Pass@1)"
    x-axis ["-doc -prompt", "-doc", "-prompt", "GPT-4 (full)"]
    y-axis "Success Rate (%)" 0 --> 45
    bar [7, 17, 20, 42.7]
```

- 📉 Removing **either** documents or detailed prompting kills performance on **all hard vulnerabilities** and most medium ones.
- 📚 Removing **documents** hurts more than removing the detailed prompt.
- 💀 Removing **both** ≈ performance drops to **GPT-3.5 levels**.

> 🧩 **Takeaway:** Domain-knowledge grounding (docs) + good agentic planning (prompt) are *both* necessary — neither alone gets you there.

---

## 🔎 5. Understanding *How* the Agents Hack

### 5.1 GPT-4 Case Studies

**🧩 Case 1 — Complex SQL Injection (chained reasoning):**

```mermaid
flowchart LR
    A["1️⃣ Navigate pages<br/>to find target"] --> B["2️⃣ Try default creds<br/>(admin/admin)"]
    B --> C["3️⃣ Try classic SQLi<br/>(OR 1=1)"]
    C --> D["4️⃣ Read source code<br/>find GET param in query"]
    D --> E["5️⃣ Realize it's a<br/>SQL Union vuln"]
    E --> F["6️⃣ Execute the<br/>Union attack ✅"]
```

**🧩 Case 2 — Server-Side Template Injection (SSTI):**

1. Detects susceptibility to SSTI
2. Tests with a small probe script
3. Locates the target file on the server
4. Crafts and runs the full exploit payload (e.g., abusing Python's Jinja2-style `os.popen()` sandbox escape) to read a sensitive file

> 🧠 Both cases require the agent to **retain long context**, adapt based on live feedback, and chain multi-step tool calls — this is exactly what separates GPT-4 from weaker models.

### ⚡ Tool-Use Statistics

| Vulnerability | Avg. # of function calls per successful hack |
|---|---:|
| CSRF | 5 |
| SQL Injection | 6 |
| LFI | 17 |
| File Upload | 17 |
| SSTI | 19.5 |
| Hard SQL Union | 19 |
| XSS | 21 |
| SSRF | 29 |
| Brute Force | 28.3 |
| SQL Union | 44.3 |
| **Webhook XSS** | **48** (max observed) |

> 🔁 GPT-4 often attempts an approach, **fails, backtracks, and tries another** — true multi-step planning, not scripted behavior.

### 🎯 Per-Vulnerability Success Rate

| Vulnerability | GPT-4 Success | OpenChat 3.5 *Detection* Rate |
|---|---:|---:|
| SQL Injection | 100% | 100% |
| CSRF | 100% | 60% |
| XSS | 80% | 40% |
| Brute Force | 80% | 60% |
| SQL Union | 80% | 0% |
| LFI | 60% | 40% |
| File Upload | 40% | 80% |
| SSTI | 40% | 0% |
| Hard SQL Union | 20% | 0% |
| SSRF | 20% | 0% |
| Webhook XSS | 20% | 0% |
| Authorization Bypass | 0% | 0% |
| JavaScript Attacks | 0% | 0% |
| Hard SQL Injection | 0% | 0% |
| XSS + CSRF | 0% | 0% |

> 💡 SQLi and CSRF hit **100%** — likely because they're extremely common in training data. Even a "low" 20% success rate still matters in security: **one breach is a win for the attacker.**

### 5.2 Why Open-Source Models Fail

- Most fail at **basic tool use / planning**, regardless of scale (even 70B LLaMA-2, even models fine-tuned on 1M+ GPT-4 examples).
- 🌟 **Exception:** OpenChat-3.5 (only 7B!) — the best open-source model, correctly *identifying* the right vulnerability **25.3%** of the time...
- ...but it **couldn't act on website feedback** to actually complete attacks, unlike GPT-4's adaptive behavior. Detection ≠ exploitation.

---

## 🌍 6. Hacking *Real* Websites

To test real-world impact (not just sandboxes), the authors:

1. 🔎 Curated **~50 candidate websites** — favoring **older / unmaintained** sites (proxy for vulnerability), and filtering out static/templated sites unlikely to be exploitable.
2. 🚀 Deployed the best agent (GPT-4 + docs + detailed prompt) against all 50.

**Result:** GPT-4 found a genuine **XSS vulnerability** on **1 of 50** real websites.

- ✅ No concrete harm occurred (the site stored no personal data).
- 🤝 The team attempted **responsible disclosure** but couldn't locate the site owner's contact info — so the site identity remains **withheld**.

> 🌐 **Bottom line:** GPT-4 can autonomously **discover** — not just exploit known — vulnerabilities in real, live websites.

---

## 💵 7. Cost Analysis

| | Cost |
|---|---:|
| 🤖 Avg. GPT-4 agent run | **$4.19** |
| 🤖 GPT-4 cost *per successful hack* (accounting for 42.7% success rate) | **$9.81** |
| 🧑‍💻 Human cybersecurity analyst (≈20 min/attempt × 5 attempts, $50/hr) | **~$80** |

```mermaid
xychart-beta
    title "Cost per Successful Website Hack ($)"
    x-axis ["GPT-4 Agent", "Human Analyst"]
    y-axis "Cost (USD)" 0 --> 90
    bar [9.81, 80]
```

📉 **LLM agents are ~8× cheaper** than a human expert for the same task — and:

- 🔁 Don't need to know the vulnerability type in advance (can try many approaches).
- ⚡ Trivially **parallelizable** across many targets at once.
- 📉 LLM inference costs have been **falling steadily**, so this gap will likely widen.

---

## 📚 8. Related Work (Quick Map)

```mermaid
mindmap
  root(("LLMs & Security"))
    LLMs for Cyber Offense
      Malware generation
      Spear-phishing at scale
      "This paper: autonomous website hacking"
    LLM Security / Jailbreaking
      Prompt injection
      Adversarial attacks
      Fine-tuning away RLHF safety
    Internet Security
      Data breaches
      Ransomware
      Supply-chain attacks
```

- 🧪 Prior work speculated about LLMs in cyber offense/defense, or showed LLMs writing simple malware — **but none had shown autonomous agents actually executing attacks end-to-end**.
- 🔓 Related "jailbreaking" research is **complementary**: even if vendors patch these specific behaviors, jailbreak techniques could bypass such safeguards.
- 🌐 Web hacking is often the **entry point** for larger breaches — data theft, ransomware, deeper network penetration.

---

## ✅ 9. Conclusion

- 🤖 LLM agents (specifically **GPT-4**) can **autonomously hack real and sandboxed websites** — no prior knowledge of the vulnerability required.
- 📈 A sharp **scaling law**: GPT-4 (73%) ≫ GPT-3.5 (7%) ≫ all open-source models (0%).
- 💰 Substantially **cheaper than human labor**, and **infinitely scalable**.
- 🚨 This is presented as one of the **first concrete demonstrations of real-world harm capability** from a frontier model.

> 🗣️ **Call to action:** Both open- and closed-source LLM providers need to **carefully reconsider release and deployment policies** for increasingly capable frontier models.

---

## ⚠️ Impact Statement & Responsible Disclosure

- 🔒 All experiments ran on **sandboxed** websites — no real systems or laws were affected during testing.
- 🚫 Detailed attack prompts, documents, and exact methodology are **withheld from public release** (available to *researchers* on request) — standard responsible-disclosure practice in security research.
- 📨 Findings were **disclosed to OpenAI prior to publication**.
- 💚 Funded in part by the **Open Philanthropy** project.

---

<div align="center">

*📄 Summary based on: Fang, Bindu, Gupta, Zhan & Kang (2024). "LLM Agents can Autonomously Hack Websites." arXiv:2402.06664v3*

</div>
