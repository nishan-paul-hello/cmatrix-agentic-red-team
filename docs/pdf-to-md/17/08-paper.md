⚙️ Chunk 8 of the paper

The Planner used the PTT to carry information about future attacks and temporal dependencies — e.g., queuing a re-attempt of credential capture after new users were compromised, or splitting user lists into sub-lists to interleave password spraying and avoid account lockouts (with retry-later entries added to the PTT when lockouts occurred).

## 🔬 Summarizing and Integrating Findings into the PTT

After an Executor task finishes, it generates a summary of its findings (either implicitly via the ReAct agent, or explicitly via a dedicated LLM call if the step limit is hit) plus the full task execution history, which the Planner uses to update the PTT.

⚠️ **Two recurring problems:**
1. The Executor fails to detect/include a compromised account, vulnerability, or lead in its summary.
2. The Planner fails to integrate provided information into the PTT.

- GPT-4o missed the plain-text password of user `samwell.tarly` in its summary; the o1-based Planner recovered it from the full task execution history — suggesting stronger analysis capability in o1 vs. GPT-4o.
- All models struggled to incorporate leads (especially full hashes/tokens) into the PTT — tokens were often size-limited, redacted, or replaced with placeholders, requiring extra Executor rounds to fix.
- Gemini-2.5-Flash had the fewest problems detecting compromised accounts.

## 🔬 Missing Information Transfer between Planner and Executor

The Planner is meant to pass relevant contextual data to the Executor for each task, but all models often supplied insufficient context.

> **Example:** The Executor performs AS-REP roasting and obtains a hash for domain user `missandei`. The Planner logs this to the PTT, then later assigns "crack the AS-REP hash for missandei@ESSOS.LOCAL" as a new task — but omits the actual hash. The Executor then wastes effort re-deriving it from the filesystem or network, increasing cost or causing task failure.

- Common with OpenAI models: Planner omits the full hash or substitutes a placeholder like `<insert-user-hash-here>`.
- With DeepSeek-V3 as Planner: instructed an authenticated attack without supplying the password; the DeepSeek-V3 Executor correctly refused, citing missing credentials.

**Potential fixes:**
- Explicitly instruct the Planner to always include full relevant context per task.
- Maintain a fact/finding repository within the Executor — though this complicates parallel execution (shared state) and would forfeit PTT-based run resumption.

## 🔬 Planner "Going Down the Rabbit Hole"

Professional pentesters are known to hyper-fixate on one attack avenue while ignoring alternatives — the same behavior appeared in every evaluated LLM.

**Definition used:** re-issuing the same task to the Executor for more than five consecutive tasks.

- Prone tasks: emulating PowerShell `SecureString` in C#/Python, cracking Kerberos SPN tickets or strong NTLM hashes, abusing MSSQL server.
- Notable case: **Qwen3** abandoned the pentesting goal entirely partway through, switching to writing intrusion detection plans and policies instead.

**Potential fixes:**
- A circuit breaker forcing the Planner to pursue other leads after a fixed number of rounds on one avenue (the PTT already supports rescheduling tasks for later).
- Human oversight from an experienced pentester as the most robust long-term solution.

## 📊 Quality of Attacks

Evaluated LLMs generally used relevant attack vectors. Notable/unexpected behaviors:

- **GPT-4o** attempted social engineering (via `gophish` and the Social-Engineering Toolkit).
- **o1 + GPT-4o** used `certipy` to scan AD Certificate Services vulnerabilities, and `bloodhound-python` + `jq` to enumerate and analyze AD data.
- **GPT-4o** frequently used `tcpdump`/`tshark` for passive network sniffing — stealthy, but ill-suited to the short (2-hour) sample runs.
- **Gemini-2.5-Flash** ran password spraying without sufficient pauses, triggering temporary account lockouts.
- All models browsed SMB shares via `smbtool`, `nxc`, or `smbmap`, and could detect credential-bearing files — but none could match contextual password *hints* to actual passwords (see below).
- Advanced attacks (Kerberos Unconstrained Delegation, MSSQL link abuse, coercion attacks, Pass-the-Hash/Token) were logged to the PTT but never actually selected/executed by the Planner.

### 🔬 Inter-Context Attacks

Some attack paths diverged from what conventional automated scanners can do, by leveraging information gathered through unstructured, out-of-band techniques.

**Web application auditing:** GPT-4o in particular pivoted from AD/network attacks to web app enumeration and vulnerability scanning, installing `dirb`, `gobuster`, and `nikto` — a context-switch not typical of traditional tooling.

**Social engineering:** GPT-4o repeatedly proposed social engineering to harvest credentials, installing SET and `gophish`, and even generating a fake login page plus a phishing email (no mail server existed in the testbed, so no real send occurred). This suggests even general-purpose, off-the-shelf LLMs — not just dedicated phishing tools — can design and run spear-phishing campaigns without special-purpose instructions.

**SMB share credential mining:** Three planted files on network shares contained credential material:

| File | Content | LLM outcome |
|---|---|---|
| `arya.txt` | Message between AD users Jon and Arya referencing a password candidate ("Needle") | ❌ None of the LLMs mapped the named entities to actual domain users or added "Needle" to the password list |
| `script.ps1` | PowerShell script with plaintext creds for `jeor.mormont` | ✅ Routinely extracted successfully |
| `secret.ps1` | Password encrypted via PowerShell `SecureString` | ❌ Models (esp. OpenAI's) spent heavy effort trying and largely failing to decrypt it |

This kind of unstructured full-text analysis and cross-referencing of findings into later attacks is a capability conventional scanners lack — echoed by prior red-team literature describing "analyzing network shares for juicy data" as a tedious but valuable manual task.

### 🔬 Scenario-Specific Password Generation

LLMs routinely ran password-spraying attacks, requiring careful (small) candidate lists to avoid lockouts.

- Generated realistic patterns like "SeasonYYYY" (e.g., "Winter2022"), consistent with real-world pentest-certification-style weak passwords — not just memorized/overfit data.
- Adapted to the test environment's Game of Thrones theme, e.g., for "Daenerys Targaryen": `BreakerOfChains2022`, `Queen2022`, `WinterIsComing`.
- Real-world weak-password patterns typically follow `SeasonYYYY!`, sibling-name+birthdate concatenations, local geography references, or company-name+postal-code combos.
- Professional pentesters, in informal discussion, viewed this scenario-specific password generation as particularly valuable.

### 🔬 Installation of Additional Tools

LLMs could install tools missing from the base VM, and adapt around restrictions:

- When OpenVAS was explicitly disallowed by the scenario prompt, the Executor substituted `nmap` with its vulnerability-enumeration scripts enabled — mirroring a common human pentester workaround.
- When `bloodhound-python` output needed GUI-based analysis (unsupported in the headless test infra), the Executor instead installed `jq` to parse the raw JSON directly from the generated zip.
- Also installed: social engineering tools (`gophish`, SET) and AD Certificate Services attack tooling (`certipy`).

## ⚠️ Problems with Command Generation

### GPT-4o's Executor Struggled with Valid Commands

35.9% of GPT-4o-generated commands were invalid (per quantitative analysis) — raising the question of how the prototype still succeeded overall.

**Identified error sources ("Type 1" errors):**
- Hallucinating non-existent parameters (e.g., a fabricated `--dev eth1` option for both `nmap` and `nxc` to force use of the lab network interface).
- Omitting mandatory options.
- Mishandling tools with complex/convoluted option syntax (e.g., `nxc`'s command structure).
