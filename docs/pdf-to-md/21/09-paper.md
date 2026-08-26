⚙️ Chunk 9 of the paper

### B.4.2 Extensive Map Traversal

🖼️ Figure A.2: Two bird's-eye views of Minecraft maps showing trajectories for VOYAGER, ReAct, Reflexion, and AutoGPT. VOYAGER (orange path) traverses roughly 2.3× longer distances than the baselines while crossing more diverse terrain; trajectories are plotted at the positions where each agent interacts with GPT-4.

> Agent trajectories for map coverage are shown in Fig. A.2. Fig. 7 (main text) is derived from Fig. A.2 by drawing the smallest circle enclosing each trajectory.

**Terrains traversed by VOYAGER:**

| Trial | Terrains |
|---|---|
| 1 | meadow, desert, river, savanna, forest, plains, bamboo_jungle, dripstone_caves |
| 2 | snowy_plains, frozen_river, dripstone_caves, snowy_taiga, beach |
| 3 | flower_forest, meadow, old_growth_birch_forest, snowy_slopes, frozen_peaks, forest, river, beach, ocean, sunflower_plains, plains, stony_shore |

**Terrains traversed by ReAct [29]:**

| Trial | Terrains |
|---|---|
| 1 | plains, desert, jungle |
| 2 | snowy_plains, snowy_taiga, snowy_slopes |
| 3 | dark_forest, dripstone_caves, grove, jagged_peaks |

**Terrains traversed by Reflexion [30]:**

| Trial | Terrains |
|---|---|
| 1 | plains, flower_forest |
| 2 | snowy_taiga |
| 3 | old_growth_birch_forest, river, ocean, beach, plains |

**Terrains traversed by AutoGPT [28]:**

| Trial | Terrains |
|---|---|
| 1 | plains, dripstone_caves, savanna, meadow |
| 2 | snowy_taiga |
| 3 | plains, stony_shore, forest, ocean |

---

### B.4.3 Efficient Zero-Shot Generalization to Unseen Tasks

> Results of zero-shot generalization to unseen tasks for the remaining two tasks are shown in Fig. A.3. As with the main-text results, VOYAGER consistently solves all tasks while the baselines solve none within 50 prompting iterations. The skill library (built from lifelong learning) boosts not only VOYAGER but also AutoGPT [28].

🖼️ Figure A.3: Line plots ("Craft a Diamond Pickaxe" and "Craft a Compass") tracking intermediate progress — items obtained (wood log → crafting table → ... → diamond pickaxe / compass) versus prompting iterations in code generation, comparing VOYAGER, VOYAGER w/o Skill Library, AutoGPT, and AutoGPT w/ Skill Library. ReAct and Reflexion are excluded since they make no meaningful progress.

---

### B.4.4 Accurate Skill Retrieval

> Skill retrieval was evaluated on 309 samples total (Table A.4). Top-5 accuracy of 96.5% indicates the retrieval process is reliable — note the top-5 relevant skills are included in the prompt when synthesizing a new skill.

**Table A.4: Skill retrieval accuracy**

| Top-1 Acc | Top-2 Acc | Top-3 Acc | Top-4 Acc | Top-5 Acc |
|---|---|---|---|---|
| 80.2 ± 3.0 | 89.3 ± 1.8 | 93.2 ± 0.7 | 95.2 ± 1.8 | 96.5 ± 0.3 |

---

### B.4.5 Robust to Model Variations

> All main-paper experiments use `gpt-4-0314`. Additional experiments were run with `gpt-4-0613`, showing roughly equivalent performance (Fig. A.4) — demonstrating VOYAGER's robustness to model variations.

🖼️ Figure A.4: Line plot of "Number of Distinct Items" vs. "Prompting Iterations in Code Generation," comparing VOYAGER performance under GPT-4-0314 (orange) and GPT-4-0613 (purple); both curves track closely, rising to roughly 60 distinct items by ~160 iterations.
