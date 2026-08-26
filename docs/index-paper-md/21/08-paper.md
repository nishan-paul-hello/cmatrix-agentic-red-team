⚙️ Chunk 8 of the paper

## 📌 Example Self-Verification Prompts (continued)

> The following are example input/output pairs used to illustrate the self-verification module's reasoning process.

```json
Task: Mine 3 wood logs
RESPONSE:
{
  "reasoning": "You need to mine 3 wood logs. You have 2 oak logs and 2 spruce logs, which add up to 4 wood logs.",
  "success": true,
  "critique": ""
}
```

**INPUT:** Inventory (3/36): `{'crafting_table': 1, 'spruce_planks': 6, 'stick': 4}`

```json
Task: Craft a wooden pickaxe
RESPONSE:
{
  "reasoning": "You have enough materials to craft a wooden pickaxe, but you didn't craft it.",
  "success": false,
  "critique": "Craft a wooden pickaxe with a crafting table using 3 spruce planks and 2 sticks."
}
```

**INPUT:** Inventory (2/36): `{'raw_iron': 5, 'stone_pickaxe': 1}`

```json
Task: Mine 5 iron_ore
RESPONSE:
{
  "reasoning": "Mining iron_ore in Minecraft will get raw_iron. You have 5 raw_iron in your inventory.",
  "success": true,
  "critique": ""
}
```

**INPUT:**
- Biome: plains
- Nearby blocks: stone, dirt, grass_block, grass, farmland, wheat
- Inventory (26/36): ...

```json
Task: Plant 1 wheat seed.
RESPONSE:
{
  "reasoning": "For planting tasks, inventory information is useless. In nearby blocks, there is farmland and wheat, which means you succeed to plant the wheat seed.",
  "success": true,
  "critique": ""
}
```

**INPUT:** Inventory (11/36): `{..., 'rotten_flesh': 1}`

```json
Task: Kill 1 zombie
Context: ...
RESPONSE:
{
  "reasoning": "You have rotten flesh in your inventory, which means you successfully killed one zombie.",
  "success": true,
  "critique": ""
}
```

**INPUT:**
- Hunger: 20.0/20.0
- Inventory (11/36): ...

```json
Task: Eat 1 ...
Context: ...
RESPONSE:
{
  "reasoning": "For all eating tasks, if the player's hunger is 20.0, then the player successfully ate the food.",
  "success": true,
  "critique": ""
}
```

**INPUT:**
- Nearby blocks: chest
- Inventory (28/36): `{'rail': 1, 'coal': 2, 'oak_planks': 13, 'copper_block': 1, 'diorite': 7, 'cooked_beef': 4, 'granite': 22, 'cobbled_deepslate': 23, 'feather': 4, 'leather': 2, 'cooked_chicken': 3, 'white_wool': 2, 'stick': 3, 'black_wool': 1, 'stone_sword': 2, 'stone_hoe': 1, 'stone_axe': 2, 'stone_shovel': 2, 'cooked_mutton': 4, 'cobblestone_wall': 18, 'crafting_table': 1, 'furnace': 1, 'iron_pickaxe': 1, 'stone_pickaxe': 1, 'raw_copper': 12}`
- Chests at (81, 131, 16): `{'andesite': 2, 'dirt': 2, 'cobblestone': 75, 'wooden_pickaxe': 1, 'wooden_sword': 1}`

```json
Task: Deposit useless items into the chest at (81, 131, 16)
Context: ...
RESPONSE:
{
  "reasoning": "You have 28 items in your inventory after depositing, which is more than 20. You need to deposit more items from your inventory to the chest.",
  "success": false,
  "critique": "Deposit more useless items such as copper_block, diorite, granite, cobbled_deepslate, feather, and leather to meet the requirement of having only 20 occupied slots in your inventory."
}
```

---

## 🔬 A.6 System-Level Comparison Between VOYAGER and Prior Works

> VOYAGER is the only method combining automatic curriculum, iterative planning, and a skill library — and it requires no gradient updates to learn Minecraft.

**Table A.2 — System-level comparison between VOYAGER and prior works**

| Feature | VPT [8] | DreamerV3 [69] | DECKARD [53] | DEPS [55] | Plan4MC [71] | VOYAGER |
|---|---|---|---|---|---|---|
| Demos | Videos | None | Videos | None | None | None |
| Rewards | Sparse | Dense | Sparse | None | Dense | None |
| Observations | Pixels Only | Pixels & Meta | Pixels & Inventory | Feedback & Inventory | Pixels & Meta | Feedback & Meta & Inventory |
| Actions | Keyboard & Mouse | Discrete | Keyboard & Mouse | Keyboard & Mouse | Discrete | Code |
| Automatic Curriculum | | | | | | ✓ (in-context GPT-4 proposal) |
| Iterative Planning | | | | ✓ (3 types of feedback) | | ✓ |
| Skill Library | | | | | ✓ (pre-defined) | ✓ (self-generated) |
| Gradient-Free | | | | | | ✓ |

---

## 🔬 B Experiments

### B.1 Experimental Setup

- Built on **MineDojo** [23], using **Mineflayer** JavaScript APIs for motor control.
- `bot.chat()` calls are woven into Mineflayer functions to generate rich environment feedback.
- Condition checks and try-catch exceptions enable continuous execution.
- If the bot dies, it respawns near the closest ground with its inventory preserved.
- The bot recycles its crafting table and furnace after each program execution.

### B.2 Baselines

- **ReAct [29]** — Uses chain-of-thought prompting [46], generating reasoning traces and action plans together. Given environment feedback and agent state as observations. Runs one round of code generation followed by three rounds of refinement, repeated until the max prompting iteration is reached.

- **Reflexion [30]** — Builds on ReAct with self-reflection for more intuitive future actions. Given environment feedback, agent state, execution errors, and the self-verification module. Same generation/refinement cadence as ReAct.

- **AutoGPT [28]** — Decomposes a high-level goal into subgoals executed in a ReAct-style loop. Re-implemented using GPT-4 for task decomposition, given agent state, environment feedback, and execution errors.
  - Lacks: skill library, self-verification, automatic curriculum.
  - A subgoal is considered complete if no execution error occurs; otherwise the program is refined for up to three rounds (four generations total) before moving on.
  - If three consecutive subgoals fail to acquire a new item, task decomposition is rerun.

> 📌 All baselines share the same task: *"explore the world and get as many items as possible."*

---

## 📊 Table A.3 — Comparison Between VOYAGER and Baselines

| Feature | ReAct [29] | Reflexion [30] | AutoGPT [28] | VOYAGER |
|---|---|---|---|---|
| Chain-of-Thought [46] | ✓ | ✓ | ✓ | ✓ |
| Self Verification | | ✓ | | ✓ |
| Environment Feedback | ✓ | ✓ | ✓ | ✓ |
| Execution Errors | | ✓ | ✓ | ✓ |
| Agent State | ✓ | ✓ | ✓ | ✓ |
| Skill Library | | | | ✓ |
| Automatic Curriculum | | | | ✓ |

🖼️ Figure: A legend of Minecraft item icons (wood log, stick, raw copper, lapis lazuli, leather, ender pearl, wooden pickaxe, copper ingot, cooked mutton, pufferfish, etc.) mapped to their names, used elsewhere in the paper's figures.

---

## 🔬 B.3 Ablations

Six design choices in VOYAGER are ablated to study their impact on exploration performance:

1. **Manual Curriculum** — Replaces the automatic curriculum with a hand-designed sequence for mining a diamond:
   > Mine 3 wood log → Craft 1 crafting table → Craft 1 wooden pickaxe → Mine 11 cobblestone → Craft 1 stone pickaxe → Craft 1 furnace → Mine 3 iron ore → Smelt 3 iron ore → Craft 1 iron pickaxe → Mine 1 diamond

   ⚠️ Requires human effort and doesn't scale for open-ended exploration.

2. **Random Curriculum** — Curates 101 items obtained by VOYAGER and randomly selects the next task from that set.

3. **w/o Skill Library** — Removes the skill library, eliminating skill retrieval for code generation.

4. **w/o Environment Feedback** — Excludes environment feedback (chat log) from the code-generation prompt.

5. **w/o Execution Errors** — Excludes execution errors from the code-generation prompt.

6. **w/o Self-Verification** — Generates code without self-verification, iteratively refining for 3 rounds (4 total generations).

7. **GPT-3.5** — Replaces GPT-4 with GPT-3.5 for code generation only; GPT-4 is retained for the automatic curriculum and self-verification module.

---

## 📊 B.4 Evaluation Results

### B.4.1 Significantly Better Exploration

Three trials were run per method, tracking the distinct items collected.

#### VOYAGER

| Trial | Items Collected (count) |
|---|---|
| 1 | iron_ingot, stone_shovel, iron_leggings, fishing_rod, pufferfish, oak_log, cooked_mutton, green_dye, flint, chest, iron_sword, string, ender_pearl, raw_copper, crafting_table, cactus, lapis_lazuli, iron_pickaxe, copper_ingot, stone_pickaxe, wooden_hoe, scaffolding, stick, porkchop, copper_block, gravel, grass_block, white_bed, bone, dirt, mutton, white_wool, oak_sapling, coal, bamboo, wooden_pickaxe, rotten_flesh, cooked_porkchop, cod, iron_boots, lightning_rod, diorite, water_bucket, shears, furnace, andesite, granite, bucket, wooden_sword, sandstone, iron_helmet, raw_iron, sand, acacia_log, cooked_cod, oak_planks, azure_bluet, iron_shovel, acacia_planks, shield, iron_axe, iron_chestplate, cobblestone (63 items) |
| 2 | iron_ingot, tuff, stone_shovel, iron_leggings, fishing_rod, cooked_mutton, spruce_planks, gunpowder, amethyst_shard, chest, string, cooked_salmon, iron_sword, raw_copper, crafting_table, torch, lapis_lazuli, iron_pickaxe, copper_ingot, stone_pickaxe, wooden_hoe, stick, amethyst_block, salmon, calcite, gravel, white_bed, bone, dirt, mutton, white_wool, spyglass, coal, wooden_pickaxe, cod, iron_boots, lily_pad, cobbled_deepslate, lightning_rod, snowball, stone_axe, smooth_basalt, diorite, water_bucket, furnace, andesite, bucket, granite, shield, iron_helmet, raw_iron, cobblestone, spruce_log, cooked_cod, tripwire_hook, stone_hoe, iron_chestplate, stone_sword (58 items) |
| 3 | spruce_planks, dirt, shield, redstone, clock, diamond_sword, iron_chestplate, stone_pickaxe, leather, string, chicken, chest, diorite, iron_leggings, black_wool, cobblestone_wall, cobblestone, cooked_chicken, feather, stone_sword, raw_gold, gravel, birch_planks, coal, cobbled_deepslate, oak_planks, iron_pickaxe, granite, tuff, crafting_table, iron_helmet, stone_hoe, iron_ingot, stone_axe, birch_boat, stick, sand, bone, raw_iron, beef, rail, oak_sapling, kelp, gold_ingot, birch_log, wheat_seeds, cooked_mutton, furnace, arrow, stone_shovel, white_wool, andesite, jungle_slab, mutton, iron_sword, copper_ingot, diamond, torch, oak_log, cooked_beef, copper_block, flint, bone_meal, raw_copper, wooden_pickaxe, iron_boots, wooden_sword (65 items) |

#### ReAct [29]

| Trial | Items Collected |
|---|---|
| 1 | bamboo, dirt, sand, wheat_seeds |
| 2 | dirt, rabbit, spruce_log, spruce_sapling |
| 3 | dirt, pointed_dripstone |

#### Reflexion [30]

| Trial | Items Collected |
|---|---|
| 1 | crafting_table, orange_tulip, oak_planks, oak_log, dirt |
| 2 | spruce_log, dirt, clay_ball, sand, gravel |
| 3 | wheat_seeds, oak_log, dirt, birch_log, sand |

#### AutoGPT [28]

| Trial | Items Collected |
|---|---|
| 1 | feather, oak_log, leather, stick, porkchop, chicken, crafting_table, wheat_seeds, oak_planks, dirt, mutton |
| 2 | wooden_pickaxe, iron_ingot, stone, coal, spruce_planks, string, raw_copper, crafting_table, diorite, andesite, furnace, torch, spruce_sapling, granite, iron_pickaxe, stone_pickaxe, wooden_axe, raw_iron, stick, spruce_log, dirt, cobblestone |
| 3 | wooden_shovel, wooden_pickaxe, iron_ingot, stone, cod, coal, oak_log, flint, raw_copper, crafting_table, diorite, furnace, andesite, torch, granite, lapis_lazuli, iron_pickaxe, stone_pickaxe, raw_iron, stick, gravel, oak_planks, dirt, iron_axe, cobblestone |

> 📌 VOYAGER collects dramatically more distinct items per trial (~60) than ReAct (~3), Reflexion (~5), and AutoGPT (~11–25), illustrating the exploration benefit of the skill library, automatic curriculum, and self-verification combined.
