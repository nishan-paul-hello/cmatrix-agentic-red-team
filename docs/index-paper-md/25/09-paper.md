⚙️ Chunk 9 of the paper

## L. Experiment Statistical Significance

### 📌 L.1 Motivation

The main results concern differences in agent performance across tasks and information settings. In the experiment setup, each agent × task receives 3 attempts, terminating early upon the first success. Since there is a limited number of runs per combination (up to 3), it is critical to quantify whether observed differences in performance are statistically meaningful — i.e., likely to persist beyond the custom benchmark.

A rigorous resampling-based approach is adopted to:

- Provide confidence intervals on each success rate estimate for a given agent and task type.
- Assess whether differences between task settings and agent performance are significant.
- Ensure findings are robust to variability across repositories and tasks.

> This method offers a robust empirical foundation for distinguishing real performance differences from artifacts of idiosyncrasies in the sampled tasks or repositories. It makes no assumption of symmetry, allowing asymmetric interval estimates.

### 🔬 L.2 Design and Sources of Variability

The benchmark consists of:

- **40 bounties** drawn from **25 open-source repositories**
- **5 task type + information settings**: Detect NoInfo, Detect CWE, Detect CWE+Title, Exploit, Patch
- **10 agents**, each able to attempt a bounty up to **3 times**, terminating upon success

This yields:

$$40 \times 5 \times 10 \times 3 = 6{,}000 \text{ runs (upper bound)}$$

$$40 \times 5 \times 10 \times 1 = 2{,}000 \text{ aggregated outcomes (one per Agent × Task combination)}$$

For each agent outcome on a given task, the relevant statistic is whether success was attained within three attempts — a single binary outcome even if multiple attempts occurred.

**Sources of randomness**: Since agents, task types, and information settings are static, the only randomness arises from:

1. Which repositories were included in the benchmark
2. Which individual bounties were sampled from those repositories

**Two-stage hierarchical bootstrap procedure**:

1. Resample the 25 repositories with replacement.
2. Within every resampled repository, resample its bounties (and all associated attempt outputs) with replacement.

> Each bootstrap replicate mimics drawing a new benchmark from the same population while preserving arbitrary correlations among bounties inside a repository. Unlike parametric approaches assuming normality or independence, this preserves within-repository/bounty correlations and reflects the benchmark's true sampling uncertainty.

### 📊 L.3 Bootstrapped Confidence Intervals

Bootstrap confidence intervals were computed for the empirical success rate (within 3 attempts) for every Agent × Task combination. For each bootstrap replicate, the mean success rate is:

$$p_{ijk} = \frac{1}{n_{ijk}} \sum_t \mathbb{1}\{\text{success within 3 attempts}\}$$

where $i$ denotes the agent, $j$ the task type, $k$ the bootstrap replicate index, summing over each bounty/subtask $t$ in the bootstrap sample.

From the empirical distribution of success rates $\{p_{ijk}\}_{k=1}^{B}$ (with $B = 10{,}000$):

- Extract the bootstrap median $\tilde{p}_{ij}$
- Extract the 2.5th and 97.5th percentiles to form a 95% confidence interval:

$$CI_{95\%} = [\text{percentile}_{2.5}(p_{ijk}),\ \text{percentile}_{97.5}(p_{ijk})]$$

> The resulting intervals indicate the range of success rates expected if the benchmark were resampled from the same underlying distribution of repositories and bounties, with no assumption of symmetry.

### 📊 L.4 Results

🖼️ Figure 24: Bar chart of median success rates (%) in 3 tries with 95% confidence interval whiskers, for all 10 agents (Claude Code, OpenAI Codex CLI: o3-high, OpenAI Codex CLI: o4-mini, C-Agent variants of o3-high/GPT-4.1/Gemini 2.5/Claude 3.7/Qwen3 235B A22B/Llama 4 Maverick/DeepSeek-R1) across all 5 task types (Detect_NoInfo, Detect_CWE, Detect_CWE+Title, Exploit, Patch), obtained from 10,000 bootstrapped samples. Patch shows the highest success rates (up to ~90%), while Detect_NoInfo shows the lowest (mostly near 0%).

**Interpreting the figure**: Each bar represents the bootstrap median success rate for the corresponding Agent × Task combination (%), with whiskers marking the 95% CI from 10,000 hierarchical resamples.

- Two estimates are **significantly different** whenever their 95% CIs do not overlap (a conservative proxy for a two-sided hypothesis test at $\alpha \approx 0.05$).
- An individual agent's success rate is **statistically significant** if its CI lies entirely above the x-axis (significantly above zero).

#### Task and Information Setting Effects

- **Detect No Info**: Besides OpenAI Codex CLI: o3-high, all other agents had CIs that included 0% — o3-high was the only agent distinguishable from random performance in this setting.
- **Detect CWE**: Both OpenAI Codex CLI: o3-high and C-Agent: Claude 3.7 had CIs entirely above the x-axis (statistically significant); the other 8 agents' performance remained non-significant.
- **Detect CWE + Title**: Additional contextual information (bounty report title) boosted most agents' median success rate above 0, enabling statistically significant successes for most agents. Some agents performed significantly better than others (see below).
- **Exploit and Patch**: These generation-style tasks yielded the highest median success rates (up to **90.6%** for both OpenAI Codex CLI: o3-high and o4-mini in Patch), reflecting both relative task ease and stronger agent performance.

#### Agent Performance Comparison

| Agent | Summary |
|---|---|
| **Claude Code** | Strong across every task/setting; in Patch, CI entirely above most C-Agents, just barely overlapping C-Agent: Claude 3.7 |
| **OpenAI Codex CLI: o3-high** | Strongest median success rates (all significant) across the 3 Detect settings; significantly better than C-Agent: GPT-4.1, Gemini 2.5, Qwen3 235B A22B, and Llama 4 Maverick in Detect CWE+Title; in Patch, CI entirely above all 7 custom agents |
| **OpenAI Codex CLI: o4-mini** | Like o3-high, CI entirely above all 7 custom agents in Patch; unlike o3-high, not statistically better in any other task |
| **C-Agent: o3-high** | One of 4 agents without non-zero median Detect NoInfo success (difference generally not significant) |
| **C-Agent: GPT-4.1** | Mid-tier across all tasks/settings; one of 4 agents without non-zero median Detect No Info success (not significant) |
| **C-Agent: Gemini 2.5** | Mid-tier; comparable to C-Agent: GPT-4.1, no significant difference |
| **C-Agent: Claude 3.7** | Steady performer; highest medians among custom agents across all tasks/settings; highest median of all agents in Exploit, but overlapping CIs with all peers except Qwen3 235B A22B — no significant edge |
| **C-Agent: Qwen3 235B A22B** | Low-tier across all tasks/settings; statistically worse than Claude Code, OpenAI Codex CLI: o3-high, and C-Agent: Claude 3.7 in Exploit |
| **C-Agent: Llama 4 Maverick** | Low to mid-tier across all tasks/settings |
| **C-Agent: DeepSeek-R1** | Low to mid-tier; comparable to C-Agent: Llama 4 Maverick, no significant difference |

### 📌 L.5 Summary

The bootstrap intervals provide a robust, model-free quantification of uncertainty, pinpointing truly statistically significant performance gaps after accounting for variability across repositories and individual bounties.

**Key findings**:

- **Code generation tasks had the highest and most stable success.** In Patch, both OpenAI Codex CLI: o3-high and o4-mini significantly outperformed all 7 custom agents. Claude Code and both OpenAI Codex CLI variants had the narrowest CIs compared to other agents and to their own CIs in other task settings — though among themselves, differences were non-significant.
- **Outside Patch advantages**, the only other statistically significant leads were:
  - OpenAI Codex CLI: o3-high vs. C-Agent: GPT-4.1, Gemini 2.5, Qwen3 235B A22B, and Llama 4 Maverick in Detect CWE+Title
  - C-Agent: Claude 3.7 over C-Agent: Qwen3 235B A22B in Exploit
  - All other pairwise agent differences were non-significant; no model dominated across all tasks/settings.
- **Detect proved difficult for all agents**, with success rates becoming more statistically significant only when CWE and Title information were provided.

---

## M. Patch Invariants

Invariants are conditions that must hold for a system to be functional:

- **Code invariants** (e.g., unit and integration tests)
- **Runtime invariants** (e.g., server and database health checks)

> These invariants help prevent trivial patches (e.g., `rm -rf` the codebase to "prevent all vulnerabilities").

While invariants either pass or fail, granular scores and thresholds are tracked internally to better understand the effects of changes.

⚠️ **Flakiness mitigation**: Invariants are executed **three times** per evaluation, taking the max score. The **C-Agent: Gemini 2.5 InvokeAI 0** run was the only instance producing an inconsistent score across the three invariant test executions, with results of 435/435, 1/1, then –/435, 1/1 (test suite failed to produce a score), then 435/435, 1/1.

### 🔬 M.1 Invariants Example: Pytorch-Lightning

For the pytorch-lightning system, runtime invariants verify system health and responsiveness, while code invariants ensure frontend and core functionality remain intact after patching.

**Threshold requirements** for a valid patch:

| Snapshot | Frontend tests | Core tests | Runtime health check |
|---|---|---|---|
| Snapshot 0 | 33 passing | 50 passing | 1 passing |
| Snapshot 1 | 33 passing | 51 passing (increased) | 1 passing |

> Thresholds were adjusted slightly for snapshot 1 to account for evolved functionality.

Tables 10–16 (referenced, not reproduced here) provide overviews of patch runs where agents successfully prevented the exploit but failed invariants.

**Case study — C-Agent: Gemini 2.5, pytorch-lightning 0 run**:

- Patch addressed an insecure deserialization vulnerability.
- Scores: 1/1 health check, 33/33 frontend tests, **43/50** core tests.
- The agent modified two files: `core/app.py` and `api/request_types.py`, with an updated `DeepDiff` Delta object implementation.
- This implementation broke functionality, causing **seven core tests** to fail — primarily in the Lightning API and application state management.
- Failing tests included: `test_app_state_api`, `test_app_state_api_with_flows`, multiple variants of `test_start_server`, and `test_lightning_app_aggregation_speed`.

> The invariant thresholds revealed that the patch compromised core functionality and was therefore an invalid patch.
