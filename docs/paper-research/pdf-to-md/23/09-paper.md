⚙️ Chunk 9 of the paper

## J. Model Details

To assess the cybersecurity capabilities of leading LMs, **8 models** were evaluated: the top 5 models on HELM MMLU[^1], plus 3 additional models.

**📌 Closed models (5):**
- Claude 3.5 Sonnet (`anthropic/claude-3-5-sonnet-20240620`)
- Claude 3 Opus (`anthropic/claude-3-opus-20240229`)
- GPT-4o (`openai/gpt-4o-2024-05-13`)
- OpenAI o1-preview (`openai/o1-preview-2024-09-12`)
- Gemini 1.5 Pro (`google/gemini-1.5-pro-001`)

**📌 Open-weight models (3), hosted on Together:**
- Llama 3.1 405B Instruct (`together/llama-3.1-405b-instruct-turbo`)
- Mixtral 8x22B Instruct (`together/mixtral-8x22b-instruct-v0.1`)
- Llama 3 70B Chat (`together/llama-3-70b-chat`)

[^1]: As of August 10, 2024, release v1.7.0 of the HELM MMLU leaderboard.

---

## K. Detailed Results

> 🔬 **Method:** Each model was run on 40 tasks across HackTheBox (HTB), Glacier (GLA), Sekai-2023 (S23), Sekai-2022 (S22), and HKCert (HKC) competitions, spanning categories: Web (W), Reverse (R), Crypto (C), Forensics (F), Pwn (P), Misc (M).

⚠️ Subtasks provide more signal for differentiation on task performance. Given the high task difficulty, both **unguided** and **subtask-guided** performance yield sparse matrices with mostly failures. **Subtask performance** yields significantly more signal, with a non-zero value in **58.8%** of cells.

### 📊 Table 10 — Unguided Performance (success counts out of 40 tasks)

| Model | Success Count |
|---|---|
| Claude 3.5 Sonnet | 7 |
| GPT-4o | 5 |
| OpenAI o1-preview | 4 |
| Claude 3 Opus | 4 |
| Mixtral 8x22B Instruct | 3 |
| Gemini 1.5 Pro | 3 |
| Llama 3.1 405B Instruct | 3 |
| Llama 3 70B Chat | 2 |

Only a handful of the 40 tasks were solved by any model unguided — mainly the easiest/fastest-to-solve ones (Loot Stash, Packed Away, Dynastic, Primary Knowledge, Skilift), while the majority of harder tasks (Crushing, Permuted, Labyrinth Linguist, Partial Tenacity, Delulu, and most Glacier/Sekai/HKCert tasks) were solved by **no model**.

### 📊 Table 11 — Subtask-Guided Performance (success counts out of 40 tasks)

| Model | Success Count |
|---|---|
| GPT-4o | 7 |
| Claude 3.5 Sonnet | 6 |
| Llama 3.1 405B Instruct | 6 |
| Claude 3 Opus | 5 |
| OpenAI o1-preview | 4 |
| Llama 3 70B Chat | 3 |
| Mixtral 8x22B Instruct | 2 |
| Gemini 1.5 Pro | 2 |

With subtask guidance, GPT-4o edges ahead in total successes, and Llama 3.1 405B Instruct improves substantially (3 → 6) relative to its unguided performance.

### 📊 Table 12 — Subtask Performance (sum of fractional subtask scores)

| Model | Sum of Scores |
|---|---|
| OpenAI o1-preview | 18.79 |
| Claude 3.5 Sonnet | 17.79 |
| Claude 3 Opus | 14.49 |
| GPT-4o | 11.75 |
| Llama 3.1 405B Instruct | 8.18 |
| Mixtral 8x22B Instruct | 6.10 |
| Gemini 1.5 Pro | 4.40 |
| Llama 3 70B Chat | 3.22 |

At the subtask level, **o1-preview** and **Claude 3.5 Sonnet** lead by total score, showing partial progress on many tasks even when full solves were not achieved (e.g., Permuted, Labyrinth Linguist, Data Siege, Unbreakable, Walking to the Seaside, Shuffled AES).

### 📊 Table 13 — Highest Unguided Performance Across 3 Attempts (Claude 3.5 Sonnet vs. GPT-4o)

| Model | Total Score (out of 40) |
|---|---|
| Claude 3.5 Sonnet | 7 |
| GPT-4o | 7 |

Both models solved the same total number of tasks across their best of 3 attempts, though not always the *same* tasks — e.g., Claude solved Flag Command but not It Has Begun, while GPT-4o solved It Has Begun but not Flag Command.

---

🖼️ **Figure/Table note:** The full per-task breakdowns (Tables 10–13) list all 40 individual CTF-style tasks with first-solve time (FST), category, and competition source, showing a ✓/✗ or fractional subtask score per model. These are large, dense tables in the source PDF; the summary counts above capture the key comparative signal. Let me know if you'd like the complete row-by-row task tables reproduced as well.
