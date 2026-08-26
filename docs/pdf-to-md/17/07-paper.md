⚙️ Chunk 7 of the paper

## Executor Behavior Over Time

🖼️ Figure 12a: Line chart of Executor input prompt size (in tokens) over 10 executor rounds, for four models (Gemini-2.5-Flash, GPT-4o, Qwen3, DeepSeek-V3). All models show growing input size as rounds progress, with DeepSeek-V3 growing fastest, peaking near 12,000 tokens around round 8 before dropping.

🖼️ Figure 12b: Scatter plot of percentage of cached executor input tokens over 10 rounds. GPT-4o and DeepSeek-V3 quickly reach high cache rates (~0.8–0.95), while Gemini-2.5-Flash stays low (~0.0–0.15) and Qwen3 stays near 0 throughout.

> **Fig. 12.** The Executor is given a task by the Planner and has up to 10 rounds to successfully finish this task. During each round, it can select new command line tool invocations to execute and analyzes the gathered result. Each round has all messages of previous rounds prefixed, thus the stored data grows over time. Modern LLMs implement input prefix caching to reduce LLM operation costs.

🖼️ Figure 13: Bar chart showing the percentage of tools by the number of executor runs they were used within (1 through 6). Roughly 53% of tools were used in only a single run, with smaller percentages spread across 2–6 runs, and about 10% of tools appearing in every run.

> **Fig. 13.** Inclusion of Tools within OpenAI's o1+GPT-4o experiment runs. This is an exact count — a tool counted at $n=1$ is not also counted at $n=2$. The graph indicates that many tools are only used within a single executor run, while approximately 10% of tools were included in every sample.

## 📌 Executor Tool-Call Errors

The Executor often proposed invalid tool calls (**35.9% on average**). The first author (a professional penetration-tester) split these erroneous calls into two classes:

- **Type 1 errors** — Direct parameter errors.
  - Occur when a mandatory parameter is missing.
  - Typically detected directly by the tool, producing an instant error message.
- **Type 2 errors** — Semantically defective parameter values that are still *accepted* by the tool.
  - Only "obvious" errors are counted as Type 2, e.g.:
    - `cat` or `ls` used with a local non-existent directory
    - A random IP address used as a parameter
    - Invalid hashes passed to `hashcat` or `john` (e.g., `"<enter hash here.>"`)
    - An invalid SQL expression used as a subcommand for `impacket-mssqlclient`
    - An invalid RPC subcommand used within `rpcclient`
    - An invalid path used within `smbclient` (e.g., `\\server\share\dir` instead of `\\server\share`)
  - ⚠️ Type 2 errors are typically **not detected by the tools themselves** and are instead reported as network errors — which can "confuse" the Executor.

## 📊 Table 8 — Tool Usage by OpenAI's o1+GPT-4o

| Command | % of runs | # | % errors | % Type 1 | % Type 2 | Description |
|---|---|---|---|---|---|---|
| Nxc / netexec | 100% | 244 | 46.72% | 39.75% | 6.96% | Multitool for SMB/LDAP, etc. |
| smbclient | 100% | 231 | 19.04% | 6.49% | 12.55% | Enumerating SMB shares, accessing files over SMB |
| cat | 100% | 100 | 21% | 3% | 18% | Outputting retrieved files |
| echo | 100% | 79 | 0% | 0% | 0% | Creating new files |
| nmap | 100% | 46 | 17.39% | 10.86% | 6.52% | Network scanner |
| rpcclient | 66% | 45 | 35.55% | 4.44% | 31.11% | Querying SMB resources |
| impacket-GetUserSPNs | 100% | 44 | 65.90% | 13.63% | 52.27% | Kerberoasting |
| john | 100% | 40 | 60% | 5% | 55% | Password cracking |
| impacket-GetNPUsers | 83% | 37 | 48.64% | 40.54% | 8.10% | AS-REP roasting |
| hashcat | 83% | 34 | 94.11% | 0% | 94.11% | Password cracking |
| impacket-mssqlclient | 33% | 32 | 68.75% | 43.75% | 25% | Accessing Microsoft SQL Servers |
| impacket-smbexec | 50% | 23 | 69.56% | 69.56% | 0% | Executing commands on remote servers over SMB |
| impacket-secretsdump | 66% | 21 | 9.52% | 9.52% | 0% | Dumping credentials from remote servers |
| impacket-getADUsers | 66% | 17 | 52.94% | 52.94% | 0% | Enumerating AD users |
| ls | 66% | 17 | 0% | 11.76% | 11.76% | Listing files |

> **Command** designates the executed command (`nxc` is an alias for `netexec`, grouped together). **% of runs** gives the percentage of runs a command was included in; **#** is the absolute invocation count. Errors are given as total (**% errors**), further split into syntactical (**% Type 1**) and semantical (**# Type 2**).

**Notable failure cases:**
- `hashcat` failed in **94.11%** of invocations, due to invalid hashes or invalid hash format.
- `impacket-mssqlclient` and `rpcclient` failed largely due to invalid sub-commands (**68.75%** and **35.55%** respectively).

The full command list is provided in Appendix Section D. Commands span:
- **Low-level tools:** e.g., `evil-winrm`, `certipy`
- **High-level/broad tools:** e.g., `bloodhound-python`
- **Non-offensive tools:** compilers/interpreters such as `python3`, `mono`/`mcs`, `pwsh`

## 📊 Table 9 — Mapping Tasks to MITRE ATT&CK Tactics and Techniques (o1+GPT-4o)

| MITRE Tactic | MITRE Technique | # | in % runs | Examples |
|---|---|---|---|---|
| Credential Access | T1110: Brute Force | 62 | 100% | Hashcat, nxc |
| Discovery | T1135: Network Share Discovery | 43 | 100% | Nxc, smbclient |
| Credential Access | T1558: Steal or Forge Kerberos Tickets | 26 | 100% | impacket-GetUserSPNs, impacket-GetNPUsers |
| Discovery | T1069: Permission Groups Discovery | 19 | 83% | Ldapsearch, nxc, bloodhound |
| Discovery | T1615: Group Policy Discovery | 17 | 83% | smbclient |
| Reconnaissance | T1595: Active Scanning | 11 | 100% | nmap |
| Discovery | T1087: Account Discovery | 9 | 66% | Ldapsearch, bloodhound, nxc |
| Credential Access | T1003: OS Credential Dumping | 8 | 50% | impacket-secretsdump, nxc |
| Lateral Movement | T1210: Exploitation of Remote Services | 8 | 66% | Nxc, impacket-mssql |
| Credential Access | T1552: Unsecured Credentials | 6 | 50% | smbclient |

> Sub-techniques were converted to their respective main techniques for clarity. **#** gives the absolute occurrence count, **in % runs** gives the percentage of runs the technique was detected in.

Overall, the top 10 techniques describe an attacker that has gained an initial foothold into Active Directory and proceeds through **lateral movement, execution, and privilege escalation** — indicating a healthy diversity of attack techniques and venues.

---

## 6 Discussion

Covers plan/trajectory and command quality, enhancement opportunities, future research, and safety/ethics/defense considerations.

### 6.1 The Problem with Qwen3

📌 **Key finding:** Qwen3:32b was unable to successfully compromise AD accounts (see Section 5.2).

- It could generate an initial Penetration Testing Tree (PTT), select an appropriate next task, and finish given tasks (typically network/service enumeration).
- It **failed to integrate results back into the PTT.** The updated PTT typically was either:
  - A copy of the original PTT,
  - An empty plan, or
  - A diversion into an unrelated new goal (e.g., "write incident response policies").
- Because the PTT wasn't updated, the Planner repeatedly chose the same task (e.g., "perform a network scan for 192.168.56.0/24"), leading to **no overall progress**.
- This is a genuine architectural limitation, not a knowledge gap — Retrieval-Augmented Generation (RAG) would **not** fix it, since the issue is lacking **integration and summarization skills**, not insufficient background knowledge.
- The effect on PTT growth (or lack thereof) is shown in Figure 11 (referenced from an earlier chunk).

⚠️ **Additional problematic behaviors of Qwen3:**
- Did not follow safety instructions in the scenario prompt (Section 3.2.5), targeting explicitly excluded systems (e.g., the VM host machine) and systems outside the test network.
- Sometimes abandoned the penetration-testing goal entirely, switching to writing incident response policies, then considering the task complete and stopping.
- Was the **only** evaluated LLM that routinely hallucinated facts, such as:
  - Successful exploitation of non-existent AD accounts with imagined passwords.
  - Falsely reporting "domain domination was achieved."

### 6.2 Planner: High-Level Attack Trajectories

📌 **Key finding:** Substantial use of diverse attack tactics/techniques (Figures 9 and 13, Table 8).

- LLMs follow best practices: starting with **Reconnaissance** and **Discovery**, then exploiting via **Credential Access** and **Lateral Movement** (per MITRE ATT&CK).
- **Execution** and **Privilege Escalation** tactics were observed less often, overlapping considerably with Lateral Movement in this scenario.
- Despite variation between individual attacks, the overall attack sequence logic remained consistent across runs.
- Models used diverse initial-access vectors; after gaining access, domain enumeration was typically followed by credentialed attacks.
- Gathered Kerberos tickets and NTLM hashes were cracked using `john` and `hashcat`.
- All evaluated models demonstrated pre-trained penetration-testing knowledge, without needing task-specific in-context learning or RAG.
- Penetration-testers involved in the study confirmed the pursued attack vectors are representative of vulnerabilities typical in SME AD networks.

#### 6.2.1 LLM Comparison

- **Qwen3:** Could not successfully update the PTT (see 6.1), and thus could not produce good trajectories.
- **o1:** Compromised the highest number of AD accounts among evaluated LLMs; produced more concise PTTs and better task descriptions than GPT-4o.
- **GPT-4o:** Produced less efficient tasks (e.g., interactive tasks or network sniffing attacks) that, while goal-appropriate, consumed disproportionate sampling time.
- **Reasoning models (excluding Qwen3):** Performed **80% more** high-level strategy rounds than non-reasoning models — indicating better task descriptions for the Executor and more efficient execution (including Auto-Fixing behavior, see Section 6.4.3).
- **Gemini-2.5-Flash:** More stable trajectories than o1 — similar task sequences leading to similar compromised accounts (or near-misses). It consistently hyper-focused on the same domain controller (MEREEN), while o1 switched between "low-hanging fruit" across multiple servers.
- **Temperature note:** All models except o1 used temperature = 0 to reduce variance (o1 doesn't support temperature configuration). A test run of Gemini-2.5-Flash at temperature 0.8 still produced stable trajectories — suggesting that a more creative/free-wheeling LLM might be advantageous specifically for strategy-making.

#### 6.2.2 Causal and Temporal Relationship between Tasks

- PTTs generally included causal task relationships, e.g.:
  1. Identify various AD servers
  2. Attack those servers to obtain an initial user password hash
  3. Crack the hash via `hashcat`/`john`
  4. Use resulting plaintext credentials for further authenticated attacks
- ⚠️ LLMs sometimes performed attacks **prematurely** — e.g., GPT-4o attempted Kerberoasting (which depends on known AD credentials) without having compromised any domain credentials first.
