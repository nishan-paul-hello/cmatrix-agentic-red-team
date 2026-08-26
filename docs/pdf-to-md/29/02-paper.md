⚙️ Chunk 2 of the paper

## 5.1 GPT-4 Case Studies

### 🔬 Complex Attack Walkthroughs

**SQL Injection (difficult case)**

The agent successfully:

1. Navigates between pages to determine which to attack.
2. Attempts a default username/password (e.g., `admin`).
3. Determines the default failed, attempts a classic SQL injection (e.g., appending `OR 1=1`).
4. Reads the source code to find a GET parameter in the SQL query.
5. Determines the site is vulnerable to a SQL union attack.
6. Performs the SQL union attack.

> Performing these steps requires extended context and memory, plus the ability to interact with the environment and adapt based on feedback — a capability missing in most open-source models.

**Server-Side Template Injection (SSTI)**

User input is directly concatenated into a template, in some cases allowing arbitrary code execution. To perform this attack, GPT-4 must:

1. Determine if a website is susceptible to SSTI.
2. Test the SSTI using a small test script.
3. Determine the location of the file to steal.
4. Perform the full SSTI attack.

> 📌 Key Point: Executing the attack requires context retained across steps (e.g., remembering the correct file path) and prior knowledge of SSTI techniques.

Across both examples, GPT-4 shows strong knowledge, adapts behavior from website feedback, and uses tools effectively.

### 📊 Tool Use Statistics

| Vulnerability | Avg. # function calls |
|---|---|
| LFI | 17 |
| CSRF | 5 |
| XSS | 21 |
| SQL Injection | 6 |
| Brute Force | 28.3 |
| SQL Union | 44.3 |
| SSTI | 19.5 |
| Webhook XSS | 48 |
| File upload | 17 |
| SSRF | 29 |
| Hard SQL union | 19 |

*Table 3 — Average number of function calls per successful hack (GPT-4). Totals can rise to as many as 48.*

- Complex hacks can require up to 48 function calls.
- The agent sometimes attempts one attack, fails, backtracks, and tries another — indicating planning across multiple exploitation attempts.
- The SQL union attack requires **44.3** actions on average (including backtracking), or **38** actions excluding backtracking — requiring the agent to extract column counts and database schema while maintaining that state in context.

### 📊 Success Rates

| Vulnerability | GPT-4 success rate | OpenChat 3.5 detection rate |
|---|---|---|
| LFI | 60% | 40% |
| CSRF | 100% | 60% |
| XSS | 80% | 40% |
| SQL Injection | 100% | 100% |
| Brute Force | 80% | 60% |
| SQL Union | 80% | 0% |
| SSTI | 40% | 0% |
| Webhook XSS | 20% | 0% |
| File upload | 40% | 80% |
| Authorization bypass | 0% | 0% |
| SSRF | 20% | 0% |
| Javascript attacks | 0% | 0% |
| Hard SQL injection | 0% | 0% |
| Hard SQL union | 20% | 0% |
| XSS + CSRF | 0% | 0% |

*Table 4 — GPT-4 success rate per vulnerability (5 trials each) and OpenChat 3.5 detection rate. OpenChat 3.5 failed to exploit any vulnerability despite detecting some.*

> ⚠️ As expected, harder vulnerabilities have lower success rates. SQL Injection and CSRF hit 100%, hypothesized to be due to their prevalence as common examples in GPT-4's training data. Even a 20% success rate on harder vulnerabilities is meaningful for an attacker, since a single successful attempt suffices.

## 5.2 Open-Source LLMs

- Base open-source LLMs are largely **incapable of using tools correctly** and fail to plan appropriately — including large models like Llama-70B and models fine-tuned on 1M+ GPT-4 examples (Nous Hermes-2 Yi 34B).
- **OpenChat-3.5** (7B parameters) is the most capable open-source model tested — it attempts the correct vulnerability 25.3% of the time.
- However, OpenChat-3.5 fails to use feedback from probing the website to adapt its attack, unlike GPT-4, which adjusts strategy dynamically.
- This aligns with prior findings that GPT-4 outperforms other models in multi-turn chat settings.

> 📌 Key Point: With further tuning, open-source models may become capable of website hacking — motivating discussion on responsible release practices.

## 6. Hacking Real Websites

### 🔬 Method

- Designed a sampling strategy to identify potentially vulnerable real-world websites.
- Filtered out static or securely-templated sites via static analysis.
- Prioritized older, likely-unmaintained sites as more probable candidates for vulnerabilities.
- Curated ~50 candidate websites and deployed the most capable agent against them.

### 📊 Results

- GPT-4 found an **XSS vulnerability** on 1 of the 50 websites.
- The site did not store personal information, so no concrete harm resulted.
- The team attempted responsible disclosure but could not locate the site owner's contact information; the site's identity is being withheld until disclosure is possible.

> 📌 Key Point: This demonstrates GPT-4 can autonomously discover vulnerabilities in real-world (not just sandboxed) websites.

## 7. Cost Analysis

### 🔬 Method

Compared the cost of autonomous GPT-4 hacking against human analyst effort (estimates are illustrative, not exact).

### 📊 Results

- Average cost across 5 runs (most capable agent): **$4.189**
- Overall success rate: **42.7%** → effective cost of **$9.81 per website**
- Human comparison: ~20 minutes per vulnerability check, at ~$50/hr (based on $100k/year analyst salary), over ~5 attempts ≈ **$80 per website**
- GPT-4 agent is roughly **8× cheaper** than a human analyst for the same task

### 📌 Key Points

- The agent doesn't need to know the vulnerability in advance — it can plan through a series of tests.
- Agents parallelize trivially.
- LLM costs have continued to drop since commercially viable LLMs emerged.

> ⚠️ These are rough approximations meant to convey intuition about cost differentials, not precise figures. Costs are expected to decrease further over time.

## 8. Related Work

### LLMs and Cybersecurity

- Prior work spans speculation on whether LLMs favor offense or defense, using LLMs to create malware, and LLM-driven spear-phishing (offense and defense).
- No prior work had systematically studied LLM agents autonomously conducting cybersecurity **offense** — this paper fills that gap.

### LLM Security

- Related work on "jailbreaking" LLMs and fine-tuning away RLHF safety protections shows no current defense fully prevents harmful outputs.
- At time of writing, public OpenAI APIs did not block the autonomous hacking behavior described; if vendors add such blocks, jailbreak research could be used to bypass them — framed as complementary to this work.

### Internet Security

- Website hacking is often an entry point for larger harms: data theft, ransomware/blackmail, deeper system penetration, and more.
- Automating website hacking could sharply lower attack costs, increasing prevalence — underscoring the need for LLM providers to carefully consider deployment mechanisms.

## 9. Conclusion and Discussion

- LLM agents can autonomously hack websites **without prior knowledge of the vulnerability**.
- The most capable agent can find vulnerabilities in real-world websites.
- Strong scaling trend observed:

| Model | Success rate hacking constructed websites |
|---|---|
| GPT-4 | 73% |
| GPT-3.5 | 7% |
| Open-source models | 0% |

- Cost of LLM-agent hacks is likely substantially lower than hiring a cybersecurity analyst.

> 📌 Key Findings
> 1. All tested open-source models are incapable of autonomous hacks; frontier models (GPT-4, GPT-3.5) are capable.
> 2. These results may represent the first concrete evidence of real-world harm capability from frontier models.

The authors call on both open- and closed-source model providers to carefully consider release policies for frontier models.

## Impact Statement and Responsible Disclosure

- The findings could be misused for black-hat hacking, which the authors state is immoral and illegal.
- Testing was conducted only on **sandboxed websites** to avoid affecting real-world systems or violating laws (Section 4).
- Following traditional cybersecurity norms, the authors describe their overall method but **will not release detailed steps or code** to reproduce the attacks — judging the risks of public release to outweigh the benefits.
- Findings were disclosed to OpenAI prior to publication.

## Acknowledgements

- Funded in part by the Open Philanthropy project.

## References

> 🖼️ Note: The remainder of this chunk is a standard bibliography/reference list (author names, titles, publication venues, years, and URLs for cited works spanning topics like GPT-4, jailbreaking, SQL injection, XSS, LLM agents, and related cybersecurity literature). Omitted here as a raw reference list carries no additional structured content beyond citation metadata.
