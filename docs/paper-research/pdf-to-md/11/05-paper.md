⚙️ Chunk 5 of the paper

### 📊 Table 13: TDI Weight Sensitivity Analysis

Performance (subtask completion %) across weight configurations. **Bold** indicates selected weights.

| $w_H$ | $w_E$ | $w_C$ | $w_S$ | Performance (%) |
|---|---|---|---|---|
| 0.25 | 0.25 | 0.25 | 0.25 | 71.2 |
| **0.30** | **0.30** | **0.20** | **0.20** | **73.8** |
| 0.35 | 0.25 | 0.20 | 0.20 | 72.4 |
| 0.25 | 0.35 | 0.20 | 0.20 | 73.1 |
| 0.30 | 0.25 | 0.25 | 0.20 | 72.9 |
| 0.40 | 0.30 | 0.15 | 0.15 | 70.8 |

### 📊 Table 14: Mode Selection Threshold Sensitivity

Performance (subtask completion %) across threshold configurations.

| $\theta_{explore}$ | $\theta_{exploit}$ | Performance (%) |
|---|---|---|
| 0.5 | 0.2 | 72.1 |
| 0.5 | 0.3 | 72.8 |
| 0.6 | 0.2 | 73.2 |
| **0.6** | **0.3** | **73.8** |
| 0.6 | 0.4 | 72.4 |
| 0.7 | 0.3 | 73.0 |
| 0.7 | 0.4 | 71.6 |

### 📊 Table 15: Pruning Parameter Sensitivity

Metrics: subtask completion (%), branches incorrectly pruned (%), wasted attempts on intractable branches (mean count).

| $\theta_{prune}$ | $k_{min}$ | Completion (%) | False Prune (%) | Wasted (mean) |
|---|---|---|---|---|
| 0.7 | 2 | 71.2 | 8.4 | 2.1 |
| 0.7 | 3 | 72.4 | 5.2 | 3.4 |
| **0.8** | **3** | **73.8** | **2.8** | **4.1** |
| 0.8 | 4 | 73.2 | 1.9 | 5.8 |
| 0.9 | 3 | 72.1 | 1.2 | 6.9 |

### 📊 Table 16: UCB Difficulty Penalty ($\lambda$) Sensitivity

| $\lambda$ | Completion (%) | Backtrack Rate (%) |
|---|---|---|
| 0.0 (standard UCB) | 68.4 | 12 |
| 0.25 | 71.2 | 21 |
| **0.5** | **73.8** | **34** |
| 0.75 | 72.1 | 42 |
| 1.0 | 69.8 | 51 |
