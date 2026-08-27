# VOYAGER: An Open-Ended Embodied Agent with Large Language Models

**Authors:** Guanzhi Wang, Yuqi Xie, Yunfan Jiang, Ajay Mandlekar, Chaowei Xiao, Yuke Zhu, Linxi "Jim" Fan, Anima Anandkumar

**Affiliations:** NVIDIA, Caltech, UT Austin, Stanford, UW Madison

**Project page:** https://voyager.minedojo.org

## 📌 Abstract

> We introduce **VOYAGER**, the first LLM-powered embodied lifelong learning agent in Minecraft that continuously explores the world, acquires diverse skills, and makes novel discoveries without human intervention.

VOYAGER consists of three key components:

1. An **automatic curriculum** that maximizes exploration
2. An **ever-growing skill library** of executable code for storing and retrieving complex behaviors
3. A new **iterative prompting mechanism** that incorporates environment feedback, execution errors, and self-verification for program improvement

- Interacts with **GPT-4** via blackbox queries — no model fine-tuning required
- Skills are temporally extended, interpretable, and compositional, compounding the agent's abilities and alleviating catastrophic forgetting

**📊 Results highlights:**
- 3.3× more unique items discovered
- 2.3× longer distances traveled
- Up to 15.3× faster unlocking of tech tree milestones vs. prior SOTA
- Learned skill library transfers to solve novel tasks in a new world from scratch, where other techniques struggle to generalize

🖼️ **Figure 1:** Line chart showing "Number of Distinct Items" (y-axis, 0–65) vs. "Number of Prompting Iterations" (x-axis, 0–150+) for Voyager (Ours), Voyager w/o Skill Library, ReAct, Reflexion, and AutoGPT. Voyager's curve rises well above all baselines, passing tech-tree milestones (Wooden → Stone → Iron → Diamond Tool) far earlier than the others, which plateau at much lower item counts.

---

## 1. Introduction

Building generally capable embodied agents that continuously explore, plan, and develop new skills in open-ended worlds is a grand challenge for AI.

- Classical **reinforcement learning** and **imitation learning** approaches operate on primitive actions, making systematic exploration, interpretability, and generalization difficult.
- Recent **LLM-based agents** leverage pretrained world knowledge to generate action plans/policies, applied to embodied tasks (games, robotics) and non-embodied NLP tasks.
- ⚠️ **Limitation:** these agents are not *lifelong learners* — they can't progressively acquire, update, accumulate, and transfer knowledge over extended time spans.

### Why Minecraft?

Minecraft has no fixed storyline or predefined end goal — it offers a vast, procedurally generated 3D world with a tech tree to unlock through gathered resources.

An effective lifelong learning agent, like a human player, should be able to:

1. **Propose suitable tasks** based on current skill level and world state (e.g., harvest sand/cactus before iron if in a desert)
2. **Refine skills** from environmental feedback and **commit mastered skills to memory** for reuse in similar situations (e.g., fighting zombies ≈ fighting spiders)
3. **Continually explore** the world and seek new tasks in a self-driven manner

### 🔬 The VOYAGER Approach

VOYAGER is introduced as the first LLM-powered embodied lifelong learning agent that drives exploration, masters skills, and makes discoveries without human intervention in Minecraft — via three modules:

```mermaid
flowchart LR
    A[Automatic Curriculum] --> B[Iterative Prompting Mechanism]
    B --> C[Skill Library]
    C -->|Skill Retrieval| B
    B -->|Code as Actions| D[Minecraft Environment]
    D -->|Env Feedback / Execution Errors| B
    B -->|Self-Verification| E{Task Success?}
    E -->|Yes| F[Add New Skill to Library]
    E -->|No| B
    F --> C
    F --> A
```

🖼️ **Figure 2:** VOYAGER consists of three key components: an automatic curriculum for open-ended exploration, a skill library for increasingly complex behaviors, and an iterative prompting mechanism that uses code as action space.

- Uses **code as the action space** instead of low-level motor commands, since programs naturally represent temporally extended and compositional actions.
- Interacts with a blackbox LLM (GPT-4) purely through prompting and in-context learning — no gradient-based training/finetuning needed.
- The **automatic curriculum** proposes progressively harder tasks based on exploration progress and agent state, functioning as an in-context form of *novelty search* toward the goal "discover as many diverse things as possible."
- The **skill library** incrementally stores action programs that successfully solved tasks.

### ⚠️ Challenge: LLMs struggle to produce correct code in one shot

To address this, the **iterative prompting mechanism**:

1. Executes the generated program to obtain observations (inventory, nearby creatures) and error traces from the interpreter
2. Incorporates that feedback into GPT-4's prompt for another round of refinement
3. Repeats until a **self-verification module** confirms task completion — then the program is committed to the skill library (e.g., `craftStoneShovel()`, `combatZombieWithSword()`) and the curriculum is queried for the next milestone

### 📊 Empirical Results

VOYAGER was evaluated against ReAct, Reflexion, and AutoGPT in **MineDojo** (an open-source Minecraft AI framework):

| Metric | Improvement over prior SOTA |
|---|---|
| Unique items obtained | 3.3× more |
| Tech tree milestones unlocked | up to 15.3× faster |
| Distance traveled | 2.3× longer |

VOYAGER also transfers its learned skill library to solve novel tasks from scratch in a new Minecraft world, while other methods struggle to generalize.

---

## 2. Method

VOYAGER consists of three novel components:

1. **Automatic Curriculum** (§2.1) — suggests objectives for open-ended exploration
2. **Skill Library** (§2.2) — develops increasingly complex behaviors
3. **Iterative Prompting Mechanism** (§2.3) — generates executable code for embodied control

### 2.1 Automatic Curriculum

An automatic curriculum offers benefits for open-ended exploration: a challenging-but-manageable learning process, curiosity-driven intrinsic motivation, and development of general, flexible problem-solving strategies.

- GPT-4 is prompted to provide a steady stream of new tasks/challenges.
- The curriculum unfolds **bottom-up**, adapting to exploration progress and agent state.
- As VOYAGER tackles harder self-driven goals, it naturally learns varied skills (e.g., "mining a diamond").

🖼️ **Figure 3:** Five example curriculum steps, each showing agent state (inventory, biome, nearby entities, health/hunger, time, equipment) fed to GPT-4, which produces a **Reasoning** string and a resulting **Task**. Examples: craft a stone pickaxe (given wooden pickaxe + stone), catch a fish (near river with a fishing rod), kill a pig (hunger at 0, pigs nearby), smelt raw iron (have furnace + raw iron + coal), kill a zombie (nighttime, zombie nearby, sword + shield equipped).

**Input prompt to GPT-4 consists of:**

1. **Directives encouraging diverse behaviors and constraints** — e.g., *"My ultimate goal is to discover as many diverse things as possible … The next task should not be too hard since I may not have the necessary resources or have learned enough skills to complete it yet."*
2. **The agent's current state** — inventory, equipment, nearby blocks/entities, biome, time, health/hunger bars, position
3. **Previously completed and failed tasks** — reflects exploration progress and capability frontier
4. **Additional context** — GPT-3.5 self-asks and self-answers questions based on current state/progress (GPT-3.5 used instead of GPT-4 for standard NLP sub-tasks for budget reasons)

### 2.2 Skill Library

Since the curriculum proposes increasingly complex tasks, a skill library is needed as a basis for learning and evolution. Each skill is represented as **executable code** scaffolding temporally extended actions for a specific task, inspired by the generality, interpretability, and universality of programs.

```mermaid
flowchart TB
    subgraph Adding["Adding a New Skill"]
        P[Program generated by GPT-4] --> D[Program Description via GPT-3.5]
        D --> EMB1[Embedding = Key]
        P --> VAL[Program = Value]
        EMB1 --> SL[(Skill Library / Vector DB)]
        VAL --> SL
    end
    subgraph Retrieval["Skill Retrieval"]
        T[New Task from Curriculum] --> Q[GPT-3.5: general suggestion]
        Q --> CTX[Combine with Environment Feedback]
        CTX --> EMB2[Embedding = Query]
        EMB2 --> SL
        SL --> R[Top-5 Relevant Skills]
    end
```

🖼️ **Figure 4:** Skill library structure.
- **Top (Adding a new skill):** Each time GPT-4 generates and verifies a new skill, it is added to the skill library (represented by a vector database). The key is the embedding vector of the program description (generated by GPT-3.5), while the value is the executable program itself.
- **Bottom (Skill retrieval):** When faced with a new task proposed by the automatic curriculum, GPT-3.5 first generates a general suggestion for solving the task, which is combined with environment feedback as query context. Querying the vector database returns the top-5 relevant skills.

**Input prompt to GPT-4 for code generation includes:**

1. **Guidelines for code generation** — e.g., *"Your function will be reused for building more complex functions. Therefore, you should make it generic and reusable."*
2. **Control primitive APIs** and **relevant skills retrieved** from the skill library (crucial for in-context learning)
3. **Generated code from the last round, environment feedback, execution errors, and critique** — enabling self-improvement
4. **The agent's current state** — inventory, equipment, nearby blocks/entities, biome, time, health/hunger bars, position
5. **Chain-of-thought prompting** — reasoning before code generation

- New skills are refined iteratively (§2.3), added to the library, and indexed by the embedding of their description.
- Retrieval queries the library using embeddings of self-generated task plans + environment feedback, returning the top-5 relevant skills.
- Continuous expansion/refinement of the library lets VOYAGER learn, adapt, and excel across a wide task spectrum.

### 2.3 Iterative Prompting Mechanism

Three types of feedback drive self-improvement:

1. **🌍 Environment feedback** — illustrates intermediate execution progress, e.g., *"I cannot make an iron chestplate because I need: 7 more iron ingots."* Generated via `bot.chat()` inside control primitive APIs; GPT-4 is prompted to use this function too during code generation.
2. **⚠️ Execution errors** — from the program interpreter, revealing invalid operations or syntax errors, useful for bug fixing.
3. **✅ Self-verification for task success** — rather than hand-coding success checkers per task, a separate GPT-4 agent acts as a **critic**: given VOYAGER's current state and the task, it judges success/failure and, on failure, provides a critique suggesting how to complete the task. This is more comprehensive than prior self-reflection methods since it both checks success *and* reflects on mistakes.

🖼️ **Figure 5:** Two code-diff examples.
- **Left (Environment feedback):** GPT-4 revises `craftStoneShovelWithTable()` after learning it needs 2 more planks before crafting sticks — adds a check for stick count and mines/crafts extra planks first.
- **Right (Execution error):** GPT-4 corrects a failed `craftAcaciaAxe()` (no such item as "acacia_axe" in Minecraft) by rewriting it as `craftWoodenAxe()` using wooden planks instead.

Each round of code generation executes the program, gathers environment feedback + execution errors, and feeds them back into GPT-4's prompt for refinement — repeating until self-verification validates task completion.


#### 🔬 Self-Verification Examples

🖼️ **Figure 6:** Self-verification examples. GPT-4 evaluates task completion from inventory state changes and provides critique on failure (see Appendix, Sec. A.5 for full prompt structure).

VOYAGER uses GPT-4 to verify whether a task was completed, based on inventory state changes and reasoning about what those changes imply.

```mermaid
flowchart LR
    A[Inventory State] --> B[GPT-4 Reasoning]
    B --> C{Success?}
    C -->|True| D[Add Skill to Library]
    C -->|False| E[Critique + Retry]
```

**Example verifications:**

| Task | Inventory Evidence | Result | Critique |
|---|---|---|---|
| Mine 5 coal ores | `coal: 5` | ✅ True | — |
| Craft a spyglass | `copper_ingot: 3`, no amethyst shard | ❌ False | Find and mine an amethyst shard underground |
| Kill 3 sheep | `white_wool: 2`, `mutton: 6` (implies 2 sheep killed) | ❌ False | Find and kill one more sheep |
| Kill 1 zombie | `rotten_flesh: 1` | ✅ True | — |

> 📌 If the agent gets stuck after **4 rounds** of code generation, the automatic curriculum is queried for a different task instead. This iterative prompting loop drives continuous skill acquisition without human intervention.

---

## 🔬 3. Experiments

### 3.1 Experimental Setup

- **Text completion:** `gpt-4-0314` and `gpt-3.5-turbo-0301`
- **Text embedding:** `text-embedding-ada-002`
- **Temperature:** 0 for all components, except the automatic curriculum (temperature = 0.1, to encourage task diversity)
- **Simulation environment:** built on **MineDojo**, using **Mineflayer** JavaScript APIs for motor control

### 3.2 Baselines

No out-of-the-box LLM-based Minecraft agents exist, so baselines were adapted from NLP-only agent methods:

- **ReAct** — chain-of-thought prompting; generates reasoning traces + action plans, given environment feedback and agent state as observations.
- **Reflexion** — ReAct + self-reflection, using execution errors and the self-verification module for more intuitive future actions.
- **AutoGPT** — decomposes a high-level goal into subgoals, executed in a ReAct-style loop (re-implemented with GPT-4). Lacks VOYAGER's skill library, self-verification, and automatic curriculum.

> ⚠️ **Note:** Prior pixel-input/low-level-control Minecraft agents are *not* directly compared, since VOYAGER relies on the high-level Mineflayer API rather than solving 3D perception/sensorimotor control. VOYAGER is considered orthogonal to — and combinable with — gradient-based approaches like VPT, as long as the controller exposes a code API.

---

### 📊 3.3 Evaluation Results

Evaluated across: exploration performance, tech tree mastery, map coverage, and zero-shot generalization.

#### Significantly Better Exploration
- VOYAGER discovers **63 unique items** within 160 prompting iterations — **3.3×** more than baselines.
- AutoGPT lags considerably; ReAct and Reflexion struggle due to the abstract, curriculum-less nature of open-ended exploration.

#### Consistent Tech Tree Mastery

**Table 1 — Tech tree mastery** (iterations averaged over 3 trials; fractions = successful trials out of 3; N/A = fails within 160 iterations)

| Method | Wooden Tool | Stone Tool | Iron Tool | Diamond Tool |
|---|---|---|---|---|
| ReAct | N/A (0/3) | N/A (0/3) | N/A (0/3) | N/A (0/3) |
| Reflexion | N/A (0/3) | N/A (0/3) | N/A (0/3) | N/A (0/3) |
| AutoGPT | 92 ± 72 (3/3) | 94 ± 72 (3/3) | 135 ± 103 (3/3) | N/A (0/3) |
| VOYAGER w/o Skill Library | **7 ± 2** (3/3) | **9 ± 4** (3/3) | 29 ± 11 (3/3) | N/A (0/3) |
| **VOYAGER (Ours)** | 6 ± 2 (3/3) | 11 ± 2 (3/3) | **21 ± 7** (3/3) | **102 (1/3)** |

- VOYAGER unlocks: wooden **15.3× faster**, stone **8.5× faster**, iron **6.4× faster** than baselines.
- VOYAGER is the **only** method to reach the diamond tool level.

#### Extensive Map Traversal

```mermaid
graph LR
    Voyager((Voyager)) -->|2.3x longer distance| Coverage[Map Coverage]
    ReAct((ReAct)) --> Coverage
    Reflexion((Reflexion)) --> Coverage
    AutoGPT((AutoGPT)) --> Coverage
```

🖼️ *Figure 7: Bird's-eye view maps showing VOYAGER's traversal circle far exceeding ReAct, Reflexion, and AutoGPT — VOYAGER covers 2.3× longer distances across diverse terrain, while baselines stay confined to local areas.*

---

#### 📊 Zero-Shot Generalization to Unseen Tasks

Test setup: clear inventory → reset to a new world → attempt unseen tasks. Both VOYAGER and AutoGPT use GPT-4 to decompose tasks into subgoals.

**Table 2 — Zero-shot generalization** (max 50 iterations; fractions = successful trials out of 3)

| Method | Diamond Pickaxe | Golden Sword | Lava Bucket | Compass |
|---|---|---|---|---|
| ReAct | N/A (0/3) | N/A (0/3) | N/A (0/3) | N/A (0/3) |
| Reflexion | N/A (0/3) | N/A (0/3) | N/A (0/3) | N/A (0/3) |
| AutoGPT | N/A (0/3) | N/A (0/3) | N/A (0/3) | N/A (0/3) |
| AutoGPT w/ Our Skill Library | 39 (1/3) | 30 (1/3) | N/A (0/3) | 30 (2/3) |
| VOYAGER w/o Skill Library | 36 (2/3) | 30 ± 9 (3/3) | 27 ± 9 (3/3) | 26 ± 3 (3/3) |
| **VOYAGER (Ours)** | **19 ± 3 (3/3)** | **18 ± 7 (3/3)** | **21 ± 5 (3/3)** | **18 ± 2 (3/3)** |

🖼️ *Figure 8: Progress curves (subgoal step vs. prompting iteration) for "Craft a Golden Sword" and "Collect a Lava Bucket," comparing Voyager, Voyager w/o Skill Library, AutoGPT, and AutoGPT w/ Our Skill Library. Voyager reaches the final subgoal fastest in both cases; ReAct/Reflexion omitted since they make no meaningful progress.*

> 📌 **Key insight:** VOYAGER solves all four unseen tasks consistently, while baselines solve none within 50 iterations. Notably, the skill library built during lifelong learning *also* boosts AutoGPT's performance — showing it acts as a **plug-and-play asset** transferable across methods.

---

### 🔬 3.4 Ablation Studies

Six design choices ablated: automatic curriculum, skill library, environment feedback, execution errors, self-verification, and GPT-4 (vs. GPT-3.5) for code generation.

🖼️ *Figure 9 (left): Ablation curves for automatic curriculum, skill library, and GPT-4 — comparing Ours, w/o Skill Library, GPT-3.5, Manual Curriculum, and Random Curriculum against number of distinct items discovered over prompting iterations.*

🖼️ *Figure 9 (right): Ablation curves for the iterative prompting mechanism — comparing Ours, w/o Environment Feedback, w/o Execution Error, and w/o Self-Verification.*

Key findings:

- **Automatic curriculum is crucial.** Replacing it with a random curriculum drops discovered items by **93%**, since attempting tasks out of order can make them too hard. A manually designed curriculum needs deep Minecraft expertise and ignores the agent's live situation, so it underperforms the automatic version.
- **Skill library prevents plateauing.** Without it, VOYAGER's exploration tends to plateau in later stages — the library lets new skills build compositionally on older ones.
- **Self-verification is the single most important feedback type.** Removing it causes a **73% drop** in discovered items; it's the critical mechanism for deciding whether to advance to a new task or retry a failed one.
- **GPT-4 vastly outperforms GPT-3.5** for code generation, yielding **5.7×** more unique items discovered — consistent with other literature on GPT-4's coding capability jump.

---

### 🖼️ 3.5 Multimodal Feedback from Humans

Since the GPT-4 API used was text-only at the time of writing, VOYAGER lacks native visual perception. However, it can be augmented with human-provided multimodal feedback to build complex 3D structures (e.g., a Nether Portal and a house).

🖼️ *Figure 10: Sequential build progress photos for "Build Nether Portal" and "Build House," shown left-to-right as human feedback incorporates.*

Two integration modes:

1. **Human as critic** *(≈ self-verification module)* — humans give visual critique so VOYAGER can revise its code; needed to correct spatial errors VOYAGER can't perceive directly.
2. **Human as curriculum** *(≈ automatic curriculum module)* — humans decompose a complex build task into smaller steps, guiding incremental completion of sophisticated 3D constructions.

---

## ⚠️ 4. Limitations and Future Work

- **Cost:** The GPT-4 API is **15× more expensive** than GPT-3.5. Still, VOYAGER needs GPT-4's code-generation quality, which GPT-3.5 and open-source LLMs can't yet match.
- **Inaccuracies:** The agent can still get stuck and fail to generate correct skills despite iterative prompting. The curriculum can reattempt such tasks later. Self-verification itself can occasionally fail — e.g., not recognizing spider string as a success signal for defeating a spider.
- **Hallucinations:**
  - The curriculum sometimes proposes unachievable tasks (e.g., a nonexistent "copper sword" or "copper chestplate").
  - Code generation hallucinations occur too — e.g., GPT-4 may try to use cobblestone as fuel (invalid in-game), or call undefined API functions, causing execution errors.
- Future improvements in GPT models and open-source LLM fine-tuning are expected to address these issues.

---

## 📚 5. Related Work

### Decision-Making Agents in Minecraft

Built on benchmarks like MineDojo, Minecraft learning algorithms split into two categories:

1. **Low-level controllers** — hierarchical RL from human demonstrations; curriculum design based on success rates (limited to curated items); MineDojo and VPT use YouTube pre-training; DreamerV3 learns a world model to explore and collect diamonds.
2. **High-level planners** — few-shot prompting with Codex to generate executable policies (requires human interaction); recent LLM-as-planner works decompose tasks into subgoals following Minecraft recipes, but lack full exploration flexibility.

> 📌 VOYAGER also uses an LLM (GPT-4) as high-level planner with Mineflayer as low-level controller, but uniquely adds a **bottom-up, curiosity-driven automatic curriculum** enabling open-ended exploration — unlike prior recipe-following approaches.

### Large Language Models for Agent Planning

Two groups of related efforts:

1. **LLMs for robot learning** — generating subgoals for robot planning; Inner Monologue incorporates environment feedback; Code as Policies and ProgPrompt generate executable robot policies directly; VIMA and PaLM-E fine-tune LLMs for multimodal prompts.
2. **LLMs for text agents** — ReAct (chain-of-thought reasoning + actions); Reflexion (ReAct + self-reflection); AutoGPT (subgoal curriculum + ReAct loops); DERA (task as dialogue between two GPT-4 agents); Generative Agents (ChatGPT-based memory storage/retrieval for simulating human behavior, but non-executable actions); SPRING (concurrent work extracting game mechanics from manuals via GPT-4, using a DAG of questions to predict next actions).

> 📌 All these methods lack a **skill library** for building increasingly complex behaviors — a key differentiator underlying VOYAGER's lifelong-learning success.

### Code Generation with Execution

Code generation remains a long-standing NLP challenge, with various works leveraging execution results/feedback to improve program synthesis. Execution-guided approaches leverage intermediate execution outcomes to guide program synthesis, while other work uses majority voting over execution results to select candidates. LEVER trains a verifier to distinguish and reject incorrect programs based on execution outcomes, and CLAIRIFY generates code for chemistry-experiment planning with a rule-based verifier providing iterative error feedback. VOYAGER differs from these by combining environment feedback, execution errors, and self-verification of task success into one iterative prompting loop for embodied control.

## 6. Conclusion

> 📌 **Key Point:** VOYAGER is the first LLM-powered embodied lifelong learning agent.

It uses GPT-4 to continuously explore the world, build increasingly sophisticated skills, and make new discoveries without human intervention. VOYAGER shows superior performance in:

- Discovering novel items
- Unlocking the Minecraft tech tree
- Traversing diverse terrains
- Applying its learned skill library to unseen tasks in a newly instantiated world

VOYAGER is presented as a starting point for building powerful generalist agents without fine-tuning model parameters.

## 7. ⚠️ Broader Impacts

The research takes place within Minecraft, described as a safe and harmless 3D video game environment. While VOYAGER is intended to generalize to other domains such as robotics, applying it to physical robots would require additional human-implemented safety constraints to ensure responsible and secure deployment.

## 8. Acknowledgements

We are extremely grateful to Ziming Zhu, Kaiyu Yang, Rafał Kocielnik, Colin White, Or Sharir, Sahin Lale, De-An Huang, Jean Kossaifi, Yuncong Yang, Charles Zhang, Minchao Huang, and many other colleagues and friends for their helpful feedback and insightful discussions. This work is done during Guanzhi Wang's internship at NVIDIA. Guanzhi Wang is supported by the Kortschak fellowship in Computing and Mathematical Sciences at Caltech.

## References

1. Kolve et al. — *AI2-THOR: An Interactive 3D Environment for Visual AI* (2017)
2. Savva et al. — *Habitat: A Platform for Embodied AI Research*, ICCV 2019
3. Zhu et al. — *robosuite: A Modular Simulation Framework and Benchmark for Robot Learning* (2020)
4. Xia et al. — *Interactive Gibson Benchmark (iGibson 0.5)* (2019)
5. Shen et al. — *iGibson 1.0: A Simulation Environment for Interactive Tasks in Large Realistic Scenes* (2020)
6. Kober, Bagnell, Peters — *Reinforcement Learning in Robotics: A Survey*, IJRR 32(11) (2013)
7. Arulkumaran et al. — *Deep Reinforcement Learning: A Brief Survey*, IEEE Signal Processing Magazine (2017)
8. Baker et al. — *Video PreTraining (VPT): Learning to Act by Watching Unlabeled Online Videos* (2022)
9. DeepMind Interactive Agents Team — *Creating Multimodal Interactive Agents with Imitation and Self-Supervised Learning* (2021)
10. Vinyals et al. — *AlphaStar: Mastering the Real-Time Strategy Game StarCraft II*, DeepMind Blog (2019)
11. Ecoffet et al. — *Go-Explore: A New Approach for Hard-Exploration Problems* (2019)
12. Huizinga & Clune — *Evolving Multimodal Robot Behavior via Many Stepping Stones*, Evolutionary Computation 30(2) (2022)
13. Wang et al. — *Enhanced POET*, ICML 2020
14. Kanitscheider et al. — *Multi-Task Curriculum Learning in a Complex, Visual, Hard-Exploration Domain: Minecraft* (2021)
15. Dennis et al. — *Emergent Complexity and Zero-Shot Transfer via Unsupervised Environment Design*, NeurIPS 2020
16. Liang et al. — *Code as Policies: Language Model Programs for Embodied Control* (2022)
17. Sun, Wu, Lim — *Program Guided Agent*, ICLR 2020
18. Zhao et al. — *PROTO: Program-Guided Transformer for Program-Guided Tasks*, NeurIPS 2021
19. Jiang et al. — *VIMA: General Robot Manipulation with Multimodal Prompts* (2022)
20. Shridhar, Manuelli, Fox — *CLIPort: What and Where Pathways for Robotic Manipulation* (2021)
21. Fan et al. — *SECANT: Self-Expert Cloning for Zero-Shot Generalization of Visual Policies*, ICML 2021
22. Singh et al. — *ProgPrompt: Generating Situated Robot Task Plans Using LLMs* (2022)
23. Fan et al. — *MineDojo: Building Open-Ended Embodied Agents with Internet-Scale Knowledge* (2022)
24. Zeng et al. — *Socratic Models: Composing Zero-Shot Multimodal Reasoning with Language* (2022)
25. Ahn et al. — *Do As I Can, Not As I Say: Grounding Language in Robotic Affordances* (2022)
26. Huang et al. — *Inner Monologue: Embodied Reasoning through Planning with Language Models* (2022)
27. Huang, Abbeel, Pathak, Mordatch — *Language Models as Zero-Shot Planners*, ICML 2022
28. *Auto-GPT: An Experimental Open-Source Attempt to Make GPT-4 Fully Autonomous* (2023)
29. Yao et al. — *ReAct: Synergizing Reasoning and Acting in Language Models* (2022)
30. Shinn, Labash, Gopinath — *Reflexion: An Autonomous Agent with Dynamic Memory and Self-Reflection* (2023)
31. Parisi et al. — *Continual Lifelong Learning with Neural Networks: A Review*, Neural Networks 113 (2019)
32. Wang et al. — *A Comprehensive Survey of Continual Learning* (2023)
33. Mnih et al. — *Playing Atari with Deep Reinforcement Learning* (2013)
34. OpenAI et al. — *Dota 2 with Large Scale Deep Reinforcement Learning* (2019)
35. OpenAI — *GPT-4 Technical Report* (2023)
36. Wei et al. — *Emergent Abilities of Large Language Models* (2022)
37. Brown et al. — *Language Models are Few-Shot Learners*, NeurIPS 2020
38. Raffel et al. — *Exploring the Limits of Transfer Learning with a Unified Text-to-Text Transformer*, JMLR 21 (2020)
39. Eysenbach et al. — *Diversity is All You Need: Learning Skills without a Reward Function*, ICLR 2019
40. Conti et al. — *Improving Exploration in Evolution Strategies via a Population of Novelty-Seeking Agents*, NeurIPS 2018
41. Chen et al. — *Evaluating Large Language Models Trained on Code* (2021)
42. Wang, Lehman, Clune, Stanley — *Paired Open-Ended Trailblazer (POET)* (2019)
43. Portelas et al. — *Automatic Curriculum Learning for Deep RL: A Short Survey*, IJCAI 2020
44. Forestier, Portelas, Mollard, Oudeyer — *Intrinsically Motivated Goal Exploration Processes with Automatic Curriculum Learning*, JMLR 23(1) (2022)
45. Ellis et al. — *DreamCoder: Growing Generalizable, Interpretable Knowledge with Wake-Sleep Bayesian Program Learning* (2020)
46. Wei et al. — *Chain-of-Thought Prompting Elicits Reasoning in Large Language Models* (2022)
47. Mnih et al. — *Asynchronous Methods for Deep Reinforcement Learning*, ICML 2016
48. Schulman et al. — *Proximal Policy Optimization Algorithms* (2017)
49. Lillicrap et al. — *Continuous Control with Deep Reinforcement Learning*, ICLR 2016
50. *Introducing ChatGPT* (2022)
51. *New and Improved Embedding Model* (2022)
52. PrismarineJS — *Mineflayer: Create Minecraft Bots with a Powerful, Stable, High-Level JavaScript API* (2013)
53. Nottingham et al. — *Do Embodied Agents Dream of Pixelated Sheep?* (2023)
54. Cai et al. — *Open-World Multi-Task Control through Goal-Aware Representation Learning and Adaptive Horizon Prediction* (2023)
55. Wang et al. — *Describe, Explain, Plan and Select: Interactive Planning with LLMs Enables Open-World Multi-Task Agents* (2023)
56. Bubeck et al. — *Sparks of Artificial General Intelligence: Early Experiments with GPT-4* (2023)
57. Liu et al. — *Summary of ChatGPT/GPT-4 Research and Perspective towards the Future of Large Language Models* (2023)
58. Liu et al. — *Prismer: A Vision-Language Model with an Ensemble of Experts* (2023)

- [59] Driess et al. — *PaLM-E: An Embodied Multimodal Language Model*, arXiv:2303.03378, 2023.
- [60] Touvron et al. — *LLaMA: Open and Efficient Foundation Language Models*, arXiv:2302.13971, 2023.
- [61] Guss et al. — *MineRL: A Large-Scale Dataset of Minecraft Demonstrations*, IJCAI 2019, pp. 2442–2448.
- [62] Guss et al. — *The MineRL 2019 Competition on Sample Efficient Reinforcement Learning Using Human Priors*, arXiv:1904.10079, 2019.
- [63] Guss et al. — *The MineRL 2020 Competition on Sample Efficient Reinforcement Learning Using Human Priors*, arXiv:2101.11071, 2021.
- [64] Kanervisto et al. — *MineRL Diamond 2021 Competition: Overview, Results, and Lessons Learned*, arXiv:2202.10583, 2022.
- [65] Johnson et al. — *The Malmo Platform for Artificial Intelligence Experimentation*, IJCAI 2016, pp. 4246–4247.
- [66] Lin et al. — *Juewu-MC: Playing Minecraft with Sample-Efficient Hierarchical Reinforcement Learning*, arXiv:2112.04907, 2021.
- [67] Mao et al. — *SEIHAI: A Sample-Efficient Hierarchical AI for the MineRL Competition*, arXiv:2111.08857, 2021.
- [68] Skrynnik et al. — *Hierarchical Deep Q-Network from Imperfect Demonstrations in Minecraft*, Cogn. Syst. Res., 65:74–78, 2021.
- [69] Hafner et al. — *Mastering Diverse Domains through World Models*, arXiv:2301.04104, 2023.
- [70] Volum et al. — *Craft an Iron Sword: Dynamically Generating Interactive Game Characters by Prompting LLMs Tuned on Code*, Wordplay Workshop 2022, pp. 25–43.
- [71] Yuan et al. — *Plan4MC: Skill Reinforcement Learning and Planning for Open-World Minecraft Tasks*, arXiv:2303.16563, 2023.
- [72] Bommasani et al. — *On the Opportunities and Risks of Foundation Models*, arXiv:2108.07258, 2021.
- [73] Chowdhery et al. — *PaLM: Scaling Language Modeling with Pathways*, arXiv:2204.02311, 2022.
- [74] Chung et al. — *Scaling Instruction-Finetuned Language Models*, arXiv:2210.11416, 2022.
- [75] Duan et al. — *A Survey of Embodied AI: From Simulators to Research Tasks*, IEEE Trans. Emerg. Top. Comput. Intell., 6(2):230–244, 2022.
- [76] Batra et al. — *Rearrangement: A Challenge for Embodied AI*, arXiv:2011.01975, 2020.
- [77] Ravichandar et al. — *Recent Advances in Robot Learning from Demonstration*, Annual Review of Control, Robotics, and Autonomous Systems, 3:297–330, 2020.
- [78] Collins et al. — *A Review of Physics Simulators for Robotic Applications*, IEEE Access, 9:51416–51431, 2021.
- [79] Min et al. — *FILM: Following Instructions in Language with Modular Methods*, ICLR 2021.
- [80] Blukis et al. — *A Persistent Spatial Semantic Representation for High-Level Natural Language Instruction Execution*, CoRL 2021.
- [81] Nair et al. — *DERA: Enhancing Large Language Model Completions with Dialog-Enabled Resolving Agents*, arXiv:2303.17071, 2023.
- [82] Park et al. — *Generative Agents: Interactive Simulacra of Human Behavior*, arXiv:2304.03442, 2023.
- [83] Wu et al. — *SPRING: GPT-4 Out-Performs RL Algorithms by Studying Papers and Reasoning*, arXiv:2305.15486, 2023.
- [84] Nijkamp et al. — *A Conversational Paradigm for Program Synthesis*, arXiv:2203.13474, 2022.
- [85] Le et al. — *CodeRL: Mastering Code Generation through Pretrained Models and Deep Reinforcement Learning*, arXiv:2207.01780, 2022.
- [86] Chen, Liu, Song — *Execution-Guided Neural Program Synthesis*, ICLR 2019.
- [87] Chen, Song, Tian — *Latent Execution for Neural Program Synthesis*, arXiv:2107.00101, 2021.
- [88] Ellis et al. — *Write, Execute, Assess: Program Synthesis with a REPL*, NeurIPS 2019, pp. 9165–9174.
- [89] Li et al. — *Competition-Level Code Generation with AlphaCode*, arXiv:2203.07814, 2022.
- [90] Cobbe et al. — *Training Verifiers to Solve Math Word Problems*, arXiv:2110.14168, 2021.
- [91] Ni et al. — *LEVER: Learning to Verify Language-to-Code Generation with Execution*, arXiv:2302.08468, 2023.
- [92] Skreta et al. — *Errors Are Useful Prompts: Instruction Guided Task Programming with Verifier-Assisted Iterative Prompting*, arXiv:2303.14100, 2023.

---

## 🔬 A. Method

### A.1 VOYAGER Algorithm

📌 High-level control loop coordinating the four agents (curriculum, action, critic, skill manager) against the environment.

```mermaid
flowchart TD
    A[Reset environment] --> B[Get exploration progress]
    B --> C[Curriculum agent proposes next task]
    C --> D[Retrieve relevant skills]
    D --> E[Action agent generates code]
    E --> F[Environment executes code]
    F --> G[Critic agent checks task success]
    G -->|Success| H[Add skill to skill manager]
    H --> I[Mark task completed]
    I --> B
    G -->|Failure, attempts < 4| D
    G -->|Failure, attempts = 4| J[Mark task failed]
    J --> B
```

```python
def voyager(
    environment,       # environment that uses code as action space
    curriculum_agent,  # curriculum agent for proposing the next task
    action_agent,       # action agent for code generation
    critic_agent,        # critic agent for self-verification
    skill_manager,        # skill manager for adding new skills and skill retrieval
):
    agent_state = environment.reset()
    while True:
        exploration_progress = curriculum_agent.get_exploration_progress(
            curriculum_agent.get_completed_tasks(),
            curriculum_agent.get_failed_tasks(),
        )
        task = curriculum_agent.propose_next_task(agent_state, exploration_progress)

        code = None
        environment_feedback = None
        execution_errors = None
        critique = None
        success = False

        # try at most 4 rounds before moving on to the next task
        for i in range(4):
            skills = skill_manager.retrieve_skills(task, environment_feedback)
            code = action_agent.generate_code(
                task, code, environment_feedback, execution_errors, critique, skills
            )
            agent_state, environment_feedback, execution_errors = environment.step(code)
            success, critique = critic_agent.check_task_success(task, agent_state)
            if success:
                break

        if success:
            skill_manager.add_skill(code)
            curriculum_agent.add_completed_task(task)
        else:
            curriculum_agent.add_failed_task(task)
```

### A.2 Prompting

> GPT-4 and GPT-3.5 expose three message roles used to structure the conversation:

| Role | Purpose |
|------|---------|
| **System** | High-level instruction guiding model behavior for the whole conversation; sets tone and objective |
| **User** | Detailed instruction guiding the assistant's next immediate response |
| **Assistant** | A response message generated by the model |

⚠️ To save tokens, VOYAGER does **not** use multi-round conversations — a system prompt and user prompt are concatenated to produce each agent's response.

### A.3 Automatic Curriculum

#### A.3.1 Components in the Prompt

The GPT-4 input prompt is composed of:

1. **Directives** — encourage diverse behavior and impose constraints so proposed tasks are achievable and verifiable.
2. **Agent's current state:**
   - **Inventory** — item/count dictionary, e.g. `{cobblestone: 4, furnace: 1, stone_pickaxe: 1, oak_planks: 7, dirt: 6, wooden_pickaxe: 1, crafting_table: 1, raw_iron: 4, coal: 1}`
   - **Equipment** — armor/weapons equipped
   - **Nearby blocks** — block names within 32-block radius (e.g. `dirt`, `water`, `spruce_planks`, `grass_block`, `dirt_path`, `sugar_cane`, `fern`)
   - **Other recently seen blocks** — blocks not currently nearby or in inventory
   - **Nearby entities** — entity names within 32-block radius (e.g. `pig`, `cat`, `villager`, `zombie`)
   - **Seen chests** — external containers; contents shown once opened, otherwise "Unknown"
   - **Biome** — e.g. `plains`, `flower_forest`, `meadow`, `river`, `beach`, `forest`, `snowy_slopes`, `frozen_peaks`, `old_growth_birch_forest`, `ocean`, `sunflower_plains`, `stony_shore`
   - **Time** — one of `sunrise`, `day`, `noon`, `sunset`, `night`, `midnight`
   - **Health and hunger bars** — max value 20
   - **Position** — 3D coordinate $(x, y, z)$
3. **Previously completed and failed tasks**
4. **Additional context** — see A.3.2
5. **Chain-of-thought prompting** — GPT-4 is asked to reason about current progress before suggesting the next task

#### A.3.2 Additional Context

🔬 GPT-3.5 self-asks questions to generate additional context. Each question is paired with a concept used to retrieve the most relevant document from a wiki knowledge base. The retrieved document is fed back to GPT-3.5 to self-answer the question.

> Using the wiki knowledge base is optional, since GPT-3.5 already has good Minecraft game-mechanics knowledge — but it helps when GPT-3.5 lacks pre-training in a specific domain.

#### A.3.3 Warm-up Schedule
📌 In practice, we adopt a warm-up schedule to gradually incorporate the agent's state and the additional context into the prompt based on how many tasks the agent has completed. This ensures that the prompt is exposed to increasing amounts of information over the exploration progress and therefore begins with basic skills and progressively advances towards more intricate and diverse ones. The warm-up setting used across all experiments is shown in Table A.1.

**Table A.1: Warm-up schedule for automatic curriculum.**

| Information in the prompt | After how many tasks are completed |
|---|---|
| core inventory (only including log, planks, stick, crafting table, furnace, dirt, coal, pickaxe, sword, and axe) | 0 |
| equipment | 0 |
| nearby blocks | 0 |
| position | 0 |
| nearby entities | 5 |
| full inventory | 7 |
| other blocks that are recently seen | 10 |
| biome | 10 |
| health bar | 15 |
| hunger bar | 15 |
| time | 15 |
| additional context | 15 |

---

#### A.3.4 Full Prompt

##### 📌 Prompt 1: Full System Prompt for Automatic Curriculum

> The list of question-answer pairs represents the additional context.

```
You are a helpful assistant that tells me the next immediate task to do in Minecraft. My ultimate goal is to discover as many diverse things as possible, accomplish as many diverse tasks as possible and become the best Minecraft player in the world.

I will give you the following information:
Question 1: ...
Answer: ...
Question 2: ...
Answer: ...
Question 3: ...
Answer: ...
...
Biome: ...
Time: ...
Nearby blocks: ...
Other blocks that are recently seen: ...
Nearby entities (nearest to farthest): ...
Health: Higher than 15 means I'm healthy.
Hunger: Higher than 15 means I'm not hungry.
Position: ...
Equipment: If I have better armor in my inventory, you should ask me to equip it.
Inventory (xx/36): ...
Chests: You can ask me to deposit or take items from these chests. There also might be some unknown chest, you should ask me to open and check items inside the unknown chest.
Completed tasks so far: ...
Failed tasks that are too hard: ...

You must follow the following criteria:
1) You should act as a mentor and guide me to the next task based on my current learning progress.
2) Please be very specific about what resources I need to collect, what I need to craft, or what mobs I need to kill.
3) The next task should follow a concise format, such as "Mine [quantity] [block]", "Craft [quantity] [item]", "Smelt [quantity] [item]", "Kill [quantity] [mob]", "Cook [quantity] [food]", "Equip [item]" etc. It should be a single phrase. Do not propose multiple tasks at the same time. Do not mention anything else.
4) The next task should not be too hard since I may not have the necessary resources or have learned enough skills to complete it yet.
5) The next task should be novel and interesting. I should look for rare resources, upgrade my equipment and tools using better materials, and discover new things. I should not be doing the same thing over and over again.
6) I may sometimes need to repeat some tasks if I need to collect more resources to complete more difficult tasks. Only repeat tasks if necessary.
7) Do not ask me to build or dig shelter even if it's at night. I want to explore the world and discover new things. I don't want to stay in one place.
8) Tasks that require information beyond the player's status to verify should be avoided. For instance, "Placing 4 torches" and "Dig a 2x1x2 hole" are not ideal since they require visual confirmation from the screen. All the placing, building, planting, and trading tasks should be avoided. Do not propose task starting with these keywords.

You should only respond in the format as described below:
RESPONSE FORMAT:
Reasoning: Based on the information I listed above, do reasoning about what the next task should be.
Task: The next task.
```

**Example response:**
```
Reasoning: The inventory is empty now, chop down a tree to get some wood.
Task: Obtain a wood log.
```

---

##### 📌 Prompt 2: Full System Prompt for Asking Questions (QA 1)

> We provide both good and bad examples as few-shot exemplars.

```
You are a helpful assistant that asks questions to help me decide the next immediate task to do in Minecraft. My ultimate goal is to discover as many things as possible, accomplish as many tasks as possible and become the best Minecraft player in the world.

I will give you the following information:
Biome: ...
Time: ...
Nearby blocks: ...
Other blocks that are recently seen: ...
Nearby entities (nearest to farthest): ...
Health: ...
Hunger: ...
Position: ...
Equipment: ...
Inventory (xx/36): ...
Chests: ...
Completed tasks so far: ...
Failed tasks that are too hard: ...

You must follow the following criteria:
1) You should ask at least 5 questions (but no more than 10 questions) to help me decide the next immediate task to do. Each question should be followed by the concept that the question is about.
2) Your question should be specific to a concept in Minecraft.
  Bad example (the question is too general):
     Question: What are the items that I can craft?
     Concept: craft
  Bad example (the question is too general):
     Question: What are the mobs that I can kill?
     Concept: kill
  Bad example (the question is too general):
     Question: What are the blocks that I can mine?
     Concept: mine
  Good example:
     Question: What are the tools that I can craft using wood planks and sticks?
     Concept: wood planks
  Good example:
     Question: What are the items that I can craft using iron ingot?
     Concept: iron ingot
3) Your question should not be about the environment context, such as biome, time, nearby blocks, and nearby entities. It should be about general game knowledge.
  Bad example (the question is about the current time):
     Question: Is it daytime or nighttime?
     Concept: time
  Bad example (the question is about the current biome):
     Question: What is the current biome?
     Concept: biome
  Bad example (the question is about the current position):
     Question: What is my current position?
     Concept: position
  Bad example (the question is about the current health):
     Question: What is my current health?
     Concept: health
  Bad example (the question is about the current hunger):
     Question: What is my current hunger?
     Concept: hunger
  Bad example (the question is about the current equipment):
     Question: What armor do I currently have equipped?
     Concept: armor
  Bad example (the question is about the current inventory):
     Question: How many oak logs do I have in my inventory?
     Concept: oak log
  Bad example (the question is about the current chests):
     Question: What items are in the chest?
     Concept: chest
  Bad example (the question requires the context of my completed tasks):
     Question: Have I crafted a stone pickaxe before?
     Concept: stone pickaxe
  Bad example (the question requires the context of my failed tasks):
     Question: Have I failed to mine a gold ore before?
     Concept: gold
  Bad example (the question requires the context of my nearby entities):
     Question: Can you see any animals nearby that you can kill for food?
     Concept: food
  Bad example (the question requires the context of my nearby blocks):
     Question: Is there any water source nearby?
     Concept: water
  Good example:
     Question: What are the blocks that I can find in the sparse jungle?
     Concept: sparse jungle
4) Do not ask questions about building tasks (such as building a shelter) since they are too hard for me to do.

Let's say your current biome is sparse jungle. You can ask questions like:
Question: What are the items that I can find in the sparse jungle?
Concept: sparse jungle
Question: What are the mobs that I can find in the sparse jungle?
Concept: sparse jungle

Let's say you see a creeper nearby, and you have not defeated a creeper before. You can ask a question like:
Question: How to defeat the creeper?
Concept: creeper

Let's say your last completed task is "Craft a wooden pickaxe". You can ask a question like:
Question: What are the suggested tasks that I can do after crafting a wooden pickaxe?
Concept: wooden pickaxe

Here are some more question and concept examples:
Question: What are the ores that I can find in the sparse jungle?
Concept: sparse jungle
(the above concept should not be "ore" because I need to look up the page of "sparse jungle" to find out what ores I can find in the sparse jungle)
Question: How can you obtain food in the sparse jungle?
Concept: sparse jungle
(the above concept should not be "food" because I need to look up the page of "sparse jungle" to find out what food I can obtain in the sparse jungle)
Question: How can you use the furnace to upgrade your equipment and make useful items?
Concept: furnace
Question: How to obtain a diamond ore?
Concept: diamond ore
Question: What are the benefits of using a stone pickaxe over a wooden pickaxe?
Concept: stone pickaxe
Question: What are the tools that you can craft using wood planks and sticks?
Concept: wood planks

You should only respond in the format as described below:
RESPONSE FORMAT:
Reasoning: ...
Question 1: ...
Concept 1: ...
Question 2: ...
Concept 2: ...
Question 3: ...
Concept 3: ...
Question 4: ...
Concept 4: ...
Question 5: ...
Concept 5: ...
```

---

##### 📌 Prompt 3: Full System Prompt for Answering Questions (QA 2)

> Context represents the optional content from a wiki knowledge base.

```
You are a helpful assistant that answer my question about Minecraft.

I will give you the following information:
Question: ...

You will answer the question based on the context (only if available and helpful) and your own knowledge of Minecraft.
1) Start your answer with "Answer: ".
2) Answer "Answer: Unknown" if you don't know the answer.
```

---

### A.4 Skill Library

#### A.4.1 Components in the Prompt

The input prompt to GPT-4 consists of the following components:

1. **Guidelines for code generation:** See Sec. A.4.2 for the full prompt.
2. **Control primitive APIs implemented by us:** These APIs serve a dual purpose: they demonstrate the usage of Mineflayer APIs, and they can be directly called by GPT-4.
   - `exploreUntil(bot, direction, maxTime = 60, callback)`: Allow the agent to explore in a fixed direction for maxTime. The callback is the stopping condition implemented by the agent to determine when to stop exploring;
   - `mineBlock(bot, name, count = 1)`: Mine and collect the specified number of blocks within a 32-block distance;
   - `craftItem(bot, name, count = 1)`: Craft the item with a crafting table nearby;
   - `placeItem(bot, name, position)`: Place the block at the specified position;
   - `smeltItem(bot, itemName, fuelName, count = 1)`: Smelt the item with the specified fuel. There must be a furnace nearby;
   - `killMob(bot, mobName, timeout = 300)`: Attack the mob and collect its dropped item;
   - `getItemFromChest(bot, chestPosition, itemsToGet)`: Move to the chest at the specified position and get items from the chest;
   - `depositItemIntoChest(bot, chestPosition, itemsToDeposit)`: Move to the chest at the specified position and deposit items into the chest;
3. **Control primitive APIs provided by Mineflayer:**
   - `await bot.pathfinder.goto(goal)`: Go to a specific position. See below for how to set the goal;
   - `new GoalNear(x, y, z, range)`: Move the bot to a block within the specified range of the specified block;
   - `new GoalXZ(x, z)`: For long-range goals that don't have a specific Y level;
   - `new GoalGetToBlock(x, y, z)`: Not get into the block, but get directly adjacent to it. Useful for fishing, farming, filling a bucket, and using a bed;
   - `new GoalFollow(entity, range)`: Follow the specified entity within the specified range;
   - `new GoalPlaceBlock(position, bot.world, {})`: Position the bot in order to place a block;
   - `new GoalLookAtBlock(position, bot.world, {})`: Path towards a position where a block face of the block at position is visible;
   - `bot.isABed(bedBlock)`: Return true if `bedBlock` is a bed;
   - `bot.blockAt(position)`: Return the block at `position`;
   - `await bot.equip(item, destination)`: Equip the item in the specified destination. `destination` must be one of "hand", "head", "torso", "legs", "feet", "off-hand";
   - `await bot.consume()`: Consume the item in the bot's hand. You must equip the item to consume first. Useful for eating food, drinking potions, etc.;
   - `await bot.fish()`: Let bot fish. Before calling this function, you must first get to a water block and then equip a fishing rod. The bot will automatically stop fishing when it catches a fish;
   - `await bot.sleep(bedBlock)`: Sleep until sunrise. You must get to a bed block first;
   - `await bot.activateBlock(block)`: This is the same as right-clicking a block in the game. Useful for buttons, doors, using hoes, etc. You must get to the block first;
   - `await bot.lookAt(position)`: Look at the specified position. You must go near the position before you look at it. To fill a bucket with water, you must lookAt first;
   - `await bot.activateItem()`: This is the same as right-clicking to use the item in the bot's hand. Useful for using buckets, etc. You must equip the item to activate first;
   - `await bot.useOn(entity)`: This is the same as right-clicking an entity in the game. Useful for shearing sheep, equipping harnesses, etc. You must get to the entity first;
4. **Retrieved skills from the skill library**;
5. **Generated code from the last round**;
6. **Environment feedback:** The chat log in the prompt;
7. **Execution errors**;
8. **Critique from the self-verification module**;
9. **The agent's current state:** See Sec. A.3.1 for each element of the agent's state;
10. **Task proposed by the automatic curriculum**;
11. **Task context:** We prompt GPT-3.5 to ask for general suggestions about how to solve the task. In practice, this part is handled by the automatic curriculum since it has a systematic mechanism for question-answering (Sec. A.3.2);
12. **Chain-of-thought prompting [46] in response:** We ask GPT-4 to first explain the reason why the code from the last round fails, then give step-by-step plans to finish the task, and finally generate code. See Sec. A.4.2 for the full prompt.

---

#### A.4.2 Full Prompt

##### 📌 Prompt 4: Full System Prompt for Code Generation

```
You are a helpful assistant that writes Mineflayer javascript code to complete any Minecraft task specified by me.

Here are some useful programs written with Mineflayer APIs.
/*
Explore until find an iron_ore, use Vec3(0, -1, 0) because iron ores are usually underground
await exploreUntil(bot, new Vec3(0, -1, 0), 60, () => {
    const iron_ore = bot.findBlock({
        matching: mcData.blocksByName["iron_ore"].id,
        maxDistance: 32,
    });
    return iron_ore;
});
Explore until find a pig, use Vec3(1, 0, 1) because pigs are usually on the surface
let pig = await exploreUntil(bot, new Vec3(1, 0, 1), 60, () => {
    const pig = bot.nearestEntity((entity) => {
        return (
            entity.name === "pig" &&
            entity.position.distanceTo(bot.entity.position) < 32
        );
    });
    return pig;
});
*/
async function exploreUntil(bot, direction, maxTime = 60, callback) {
    /*
    Implementation of this function is omitted.
    direction: Vec3, can only contain value of -1, 0 or 1
    maxTime: number, the max time for exploration
    callback: function, early stop condition, will be called each second, exploration will stop if return value is not null
    Return: null if explore timeout, otherwise return the return value of callback
    */
}
// Mine 3 cobblestone: mineBlock(bot, "stone", 3);
async function mineBlock(bot, name, count = 1) {
    const blocks = bot.findBlocks({
        matching: (block) => {
            return block.name === name;
        },
        maxDistance: 32,
        count: count,
    });
    const targets = [];
    for (let i = 0; i < Math.min(blocks.length, count); i++) {
        targets.push(bot.blockAt(blocks[i]));
    }
    await bot.collectBlock.collect(targets, { ignoreNoPath: true });
}
// Craft 8 oak_planks from 2 oak_log (do the recipe 2 times): craftItem(bot, "oak_planks", 2);
// You must place a crafting table before calling this function
async function craftItem(bot, name, count = 1) {
    const item = mcData.itemsByName[name];
    const craftingTable = bot.findBlock({
        matching: mcData.blocksByName.crafting_table.id,
        maxDistance: 32,
    });
    await bot.pathfinder.goto(
        new GoalLookAtBlock(craftingTable.position, bot.world)
    );
    const recipe = bot.recipesFor(item.id, null, 1, craftingTable)[0];
    await bot.craft(recipe, count, craftingTable);
}
// Place a crafting table near the player: placeItem(bot, "crafting_table", bot.entity.position.offset(1, 0, 0));
async function placeItem(bot, name, position) {
    const item = bot.inventory.findInventoryItem(mcData.itemsByName[name].id);
    // find a block face to place the block
    const face = new Vec3(0, 1, 0);
    const referenceBlock = bot.blockAt(position.minus(face));
    await bot.equip(item, "hand");
    await bot.placeBlock(referenceBlock, face);
}
// Smelt 1 raw_iron into 1 iron_ingot using 1 coal as fuel: smeltItem(bot, "raw_iron", "coal", 1);
// You must place a furnace before calling this function
async function smeltItem(bot, itemName, fuelName, count = 1) {
    const item = mcData.itemsByName[itemName];
    const fuel = mcData.itemsByName[fuelName];
    const furnaceBlock = bot.findBlock({
        matching: mcData.blocksByName.furnace.id,
        maxDistance: 32,
    });
    await bot.pathfinder.goto(
        new GoalLookAtBlock(furnaceBlock.position, bot.world)
    );
    const furnace = await bot.openFurnace(furnaceBlock);
    for (let i = 0; i < count; i++) {
        await furnace.putFuel(fuel.id, null, 1);
        await furnace.putInput(item.id, null, 1);
        // Wait 12 seconds for the furnace to smelt the item
        await bot.waitForTicks(12 * 20);
        await furnace.takeOutput(null);
    }
    await furnace.close();
}
// Kill a pig and collect dropped items: killMob(bot, "pig", 300);
async function killMob(bot, mobName, timeout = 300) {
    const entity = bot.nearestEntity((entity) => {
        return (
            entity.name === mobName &&
            entity.position.distanceTo(bot.entity.position) < 32
        );
    });
    await bot.pvp.attack(entity);
    await bot.pathfinder.goto(
        new GoalNear(entity.position.x, entity.position.y, entity.position.z, 1)
    );
}
// Get a iron_pickaxe from chest at Vec3(0, 60, 0): getItemFromChest(bot, new Vec3(0, 60, 0), {"iron_pickaxe": 1});
async function getItemFromChest(bot, chestPosition, itemsToGet) {
    const chestBlock = bot.blockAt(chestPosition);
    await bot.pathfinder.goto(
        new GoalLookAtBlock(chestBlock.position, bot.world)
    );
    const chest = await bot.openContainer(chestBlock);
    for (const name in itemsToGet) {
        const item = mcData.itemsByName[name];
        await chest.withdraw(item.id, null, itemsToGet[name]);
    }
    await closeChest(bot, chestBlock);
}
// Deposit 1 iron_pickaxe into chest at Vec3(0, 60, 0): depositItemIntoChest(bot, new Vec3(0, 60, 0), {"iron_pickaxe": 1});
async function depositItemIntoChest(bot, chestPosition, itemsToDeposit) {
    const chestBlock = bot.blockAt(chestPosition);
    await bot.pathfinder.goto(
        new GoalLookAtBlock(chestBlock.position, bot.world)
    );
    const chest = await bot.openContainer(chestBlock);
    for (const name in itemsToDeposit) {
        const item = mcData.itemsByName[name];
        await chest.deposit(item.id, null, itemsToDeposit[name]);
    }
    await closeChest(bot, chestBlock);
}

// These are Mineflayer pathfinder goals you can use:
await bot.pathfinder.goto(goal); // A very useful function. This function may fail and throw an error, please catch the error and try another goal or position.
new GoalNear(x, y, z, range); // Move the bot to a block within the specified range of the target. 'x', 'y', and 'z' are 'number', 'range' is 'number'
new GoalXZ(x, z); // Useful for long-range goals that don't require a specific Y level. 'x' and 'z' are 'number'
new GoalGetToBlock(x, y, z); // Not get into the block, but get directly adjacent to it. Useful for fishing, farming, filling bucket, and beds. 'x', 'y', and 'z' are 'number'
new GoalFollow(entity, range); // Follow the specified entity within the specified range. 'entity' is 'Entity', 'range' is 'number'
new GoalPlaceBlock(position, bot.world, {}); // Position the bot in order to place a block. 'position' is 'Vec3'
new GoalLookAtBlock(position, bot.world, {}); // Path into a position where a blockface of the block at position is visible. 'position' is 'Vec3'

// These are other Mineflayer functions you can use:
bot.isABed(bedBlock); // Return true if 'bedBlock' is a bed
bot.blockAt(position); // Return the block at 'position'. 'position' is 'Vec3'

// These are other Mineflayer async functions you can use:
await bot.equip(item, destination); // Equip the item in the specified destination. 'item' is 'Item', 'destination' can only be "hand", "head", "torso", "legs", "feet", "off-hand"
await bot.consume(); // Consume the item in the bot's hand. You must equip the item to consume first. Useful for eating food, drinking potions, etc.
await bot.fish(); // Let bot fish. Before calling this function, you must first get to a water block and then equip a fishing rod. The bot will automatically stop fishing when it catches a fish
await bot.sleep(bedBlock); // Sleep until sunrise. You must get to a bed block first
await bot.activateBlock(block); // This is the same as right-clicking a block in the game. Useful for buttons, doors, using hoes, etc. You must get to the block first
await bot.lookAt(position); // Look at the specified position. You must go near the position before you look at it. To fill bucket with water, you must lookAt first. 'position' is 'Vec3'
await bot.activateItem(); // This is the same as right-clicking to use the item in the bot's hand. Useful for using buckets, etc. You must equip the item to activate first
await bot.useOn(entity); // This is the same as right-clicking an entity in the game. Useful for shearing sheep, equipping harnesses, etc. You must get to the entity first

{retrieved_skills}

At each round of conversation, I will give you
Code from the last round: ...
Execution error: ...
Chat log: ...
Biome: ...
Time: ...
Nearby blocks: ...
Nearby entities (nearest to farthest):
Health: ...
Hunger: ...
Position: ...
Equipment: ...
Inventory (xx/36): ...
Chests: ...
Task: ...
Context: ...
Critique: ...

You should then respond to me with
Explain (if applicable): Are there any steps missing in your plan? Why does the code not complete the task? What does the chat log and execution error imply?
Plan: How to complete the task step by step. You should pay attention to Inventory since it tells what you have. The task completeness check is also based on your final inventory.
Code:
1) Write an async function taking the bot as the only argument.
2) Reuse the above useful programs as much as possible.
   - Use 'mineBlock(bot, name, count)' to collect blocks. Do not use 'bot.dig' directly.
   - Use 'craftItem(bot, name, count)' to craft items. Do not use 'bot.craft' directly.
   - Use 'smeltItem(bot, name, count)' to smelt items. Do not use 'bot.openFurnace' directly.
   - Use 'placeItem(bot, name, position)' to place blocks. Do not use 'bot.placeBlock' directly.
   - Use 'killMob(bot, name, timeout)' to kill mobs. Do not use 'bot.attack' directly.
3) Your function will be reused for building more complex functions. Therefore, you should make it generic and reusable. You should not make strong assumption about the inventory (as it may be changed at a later time), and therefore you should always check whether you have the required items before using them. If not, you should first collect the required items and reuse the above useful programs.
4) Functions in the "Code from the last round" section will not be saved or executed. Do not reuse functions listed there.
5) Anything defined outside a function will be ignored, define all your variables inside your functions.
6) Call 'bot.chat' to show the intermediate progress.
7) Use 'exploreUntil(bot, direction, maxDistance, callback)' when you cannot find something. You should frequently call this before mining blocks or killing mobs. You should select a direction at random every time instead of constantly using (1, 0, 1).
8) 'maxDistance' should always be 32 for 'bot.findBlocks' and 'bot.findBlock'. Do not cheat.
9) Do not write infinite loops or recursive functions.
10) Do not use 'bot.on' or 'bot.once' to register event listeners. You definitely do not need them.
11) Name your function in a meaningful way (can infer the task from the name).

You should only respond in the format as described below:
RESPONSE FORMAT:
Explain: ...
Plan:
1) ...
2) ...
3) ...
...
Code:
```javascript
// helper functions (only if needed, try to avoid them)
...
// main function after the helper functions
async function yourMainFunctionName(bot) {
  // ...
}
```
```

---

##### 📌 Prompt 5: Full System Prompt for Generating Function Descriptions

> Used when adding a new skill to the skill library. A one-shot example is included in the prompt.

**System instructions given to the assistant:**

You are a helpful assistant that writes a description of the given function written in Mineflayer javascript code.

1. Do not mention the function name.
2. Do not mention anything about `bot.chat` or helper functions.
3. There might be helper functions before the main function, but only the main function needs to be described.
4. Summarize the function in no more than 6 sentences.
5. The response should be a single line of text.

**One-shot example — input function:**

```javascript
async function mineCobblestone(bot) {
  // Check if the wooden pickaxe is in the inventory, if not, craft one
  let woodenPickaxe = bot.inventory.findInventoryItem(mcData.itemsByName["wooden_pickaxe"].id);
  if (!woodenPickaxe) {
    bot.chat("Crafting a wooden pickaxe.");
    await craftWoodenPickaxe(bot);
    woodenPickaxe = bot.inventory.findInventoryItem(mcData.itemsByName["wooden_pickaxe"].id);
  }

  // Equip the wooden pickaxe if it exists
  if (woodenPickaxe) {
    await bot.equip(woodenPickaxe, "hand");

    // Explore until we find a stone block
    await exploreUntil(bot, new Vec3(1, -1, 1), 60, () => {
      const stone = bot.findBlock({
        matching: mcData.blocksByName["stone"].id,
        maxDistance: 32
      });
      if (stone) {
        return true;
      }
    });

    // Mine 8 cobblestone blocks using the wooden pickaxe
    bot.chat("Found a stone block. Mining 8 cobblestone blocks.");
    await mineBlock(bot, "stone", 8);
    bot.chat("Successfully mined 8 cobblestone blocks.");

    // Save the event of mining 8 cobblestone
    bot.save("cobblestone_mined");
  } else {
    bot.chat("Failed to craft a wooden pickaxe. Cannot mine cobblestone.");
  }
}
```

**Expected model output:**

> The function is about mining 8 cobblestones using a wooden pickaxe. First check if a wooden pickaxe is in the inventory. If not, craft one. If the wooden pickaxe is available, equip the wooden pickaxe in the hand. Next, explore the environment until finding a stone block. Once a stone block is found, mine a total of 8 cobblestone blocks using the wooden pickaxe.

---

#### A.4.3 Examples

##### 🔧 Skill Library Example 1: `craftWoodenPlanks`

```javascript
async function craftWoodenPlanks(bot) {
  const logNames = ["oak_log", "birch_log", "spruce_log", "jungle_log", "acacia_log", "dark_oak_log", "mangrove_log"];
  const plankNames = ["oak_planks", "birch_planks", "spruce_planks", "jungle_planks", "acacia_planks", "dark_oak_planks", "mangrove_planks"];

  const logInInventory = logNames.find(logName => bot.inventory.count(mcData.itemsByName[logName].id) > 0);
  if (!logInInventory) {
    bot.chat("No wooden log in inventory. Mining a wooden log...");
    await mineWoodLog(bot);
  }

  const logIndex = logNames.indexOf(logInInventory);
  const plankName = plankNames[logIndex];

  bot.chat(`Crafting 4 ${plankName}...`);
  await craftItem(bot, plankName, 1);
  bot.chat(`4 ${plankName} crafted.`);
}
```

##### 🔧 Skill Library Example 2: `mineTenCobbledDeepslateBelowY0`

```javascript
async function mineTenCobbledDeepslateBelowY0(bot) {
  // Equip the iron pickaxe
  const ironPickaxe = bot.inventory.findInventoryItem(mcData.itemsByName["iron_pickaxe"].id);
  await bot.equip(ironPickaxe, "hand");

  // Find cobbled_deepslate blocks below Y=0
  const cobbledDeepslateBlocks = await exploreUntil(bot, new Vec3(1, -1, 1), 60, () => {
    const cobbledDeepslate = bot.findBlock({
      matching: mcData.blocksByName["cobbled_deepslate"].id,
      maxDistance: 32,
      position: pos => pos.y < 0
    });
    return cobbledDeepslate;
  });

  // Mine 10 cobbled_deepslate blocks
  await mineBlock(bot, "cobbled_deepslate", 10);
  bot.chat("10 cobbled_deepslate mined below Y=0.");
}
```

##### 🔧 Skill Library Example 3: `smeltFiveRawIronV2`

```javascript
async function findSuitablePosition(bot) {
  const offsets = [new Vec3(1, 0, 0), new Vec3(-1, 0, 0), new Vec3(0, 0, 1), new Vec3(0, 0, -1)];
  for (const offset of offsets) {
    const position = bot.entity.position.offset(offset.x, offset.y, offset.z);
    const block = bot.blockAt(position);
    if (block.name === "air") {
      return position;
    }
  }
  return null;
}

async function smeltFiveRawIron(bot) {
  // Check if there is a furnace in the inventory
  const furnaceItem = bot.inventory.findInventoryItem(mcData.itemsByName.furnace.id);

  // If not, craft a furnace using the available cobblestone
  if (!furnaceItem) {
    await craftFurnace(bot);
  }

  // Find a suitable position to place the furnace
  const furnacePosition = await findSuitablePosition(bot);
  if (!furnacePosition) {
    bot.chat("Could not find a suitable position to place the furnace.");
    return;
  }

  // Place the furnace at the suitable position
  await placeItem(bot, "furnace", furnacePosition);

  // Smelt 5 raw iron using the available coal as fuel
  await smeltItem(bot, "raw_iron", "coal", 5);
  bot.chat("5 raw iron smelted.");
}
```

##### 🔧 Skill Library Example 4: `fillBucketWithWater`

```javascript
async function fillBucketWithWater(bot) {
  // Find a water block nearby
  const waterBlock = await exploreUntil(bot, new Vec3(1, 0, 1), 60, () => {
    const water = bot.findBlock({
      matching: mcData.blocksByName.water.id,
      maxDistance: 32
    });
    return water;
  });

  if (!waterBlock) {
    bot.chat("Could not find water.");
    return;
  }

  // Go to the water block
  const adjacentBlock = waterBlock.position.offset(0, 1, 0);
  await bot.pathfinder.goto(
    new GoalGetToBlock(adjacentBlock.x, adjacentBlock.y, adjacentBlock.z)
  );

  // Look at the water block
  await bot.lookAt(waterBlock.position, true);

  // Equip the bucket
  const bucket = bot.inventory.findInventoryItem(mcData.itemsByName.bucket.id);
  await bot.equip(bucket, "hand");

  // Activate the bucket to collect water
  await bot.activateItem();
  bot.chat("Filled the bucket with water.");
}
```

##### 🔧 Skill Library Example 5: `catchFiveFishSafely`

```javascript
async function catchFiveFishSafely(bot) {
  // Check if the bot has a fishing rod in its inventory
  let fishingRod = bot.inventory.findInventoryItem(mcData.itemsByName.fishing_rod.id);
  if (!fishingRod) {
    await craftFishingRod(bot);
    fishingRod = bot.inventory.findInventoryItem(mcData.itemsByName.fishing_rod.id);
  }

  // Find a nearby water block
  let waterBlock;
  while (!waterBlock) {
    waterBlock = await exploreUntil(bot, new Vec3(1, 0, 1), 60, () => {
      const foundWaterBlock = bot.findBlock({
        matching: mcData.blocksByName.water.id,
        maxDistance: 32
      });
      return foundWaterBlock;
    });
    if (!waterBlock) {
      bot.chat("No path to the water block. Trying to find another water block...");
    }
  }

  // Move to a block adjacent to the water block
  const adjacentBlock = waterBlock.position.offset(0, 1, 0);
  await bot.pathfinder.goto(new GoalBlock(adjacentBlock.x, adjacentBlock.y, adjacentBlock.z));

  // Look at the water block
  await bot.lookAt(waterBlock.position);

  // Equip the fishing rod
  await bot.equip(fishingRod, "hand");

  // Fish in the water 5 times
  for (let i = 0; i < 5; i++) {
    try {
      await bot.fish();
      bot.chat(`Fish ${i + 1} caught.`);
    } catch (error) {
      if (error.message === "Fishing cancelled") {
        bot.chat("Fishing was cancelled. Trying again...");
        i--; // Retry the same iteration
      } else {
        throw error;
      }
    }
  }
}
```

---

### A.5 Self-Verification

#### A.5.1 Components in the Prompt

The input prompt to GPT-4 consists of the following components:

1. **Agent's state** — other recently-seen blocks and nearby entities are excluded since they aren't useful for assessing task completeness.
2. **Task proposed by the automatic curriculum.**
3. **Task context** — GPT-3.5 is prompted for general suggestions on how to solve the task; in practice this is handled by the automatic curriculum via its question-answering mechanism.
4. **Chain-of-thought prompting** in the response — GPT-4 first reasons about the task's success or failure, outputs a boolean outcome, and finally provides a critique if the task fails.
5. **Few-shot examples** for in-context learning.

#### A.5.2 Full Prompt

##### 📌 Prompt 6: Full System Prompt for Self-Verification

You are an assistant that assesses my progress of playing Minecraft and provides useful guidance. You are required to evaluate if I have met the task requirements. Exceeding the task requirements is also considered a success, while failing to meet them requires you to provide critique to help me improve.

**Information provided to the assistant:**

| Field | Description |
|---|---|
| Biome | The biome after the task execution |
| Time | The current time |
| Nearby blocks | Surrounding blocks (not yet collected, useful for placing/planting tasks) |
| Health | Current health |
| Hunger | Current hunger level (20.0 = successfully ate food, for eating tasks) |
| Position | Current position |
| Equipment | Final equipment (crafted items are sometimes equipped) |
| Inventory (xx/36) | Final inventory (used to check mining/smelting tasks) |
| Chests | Chest contents, if the task requires placing items in a chest |
| Task | The objective to accomplish |
| Context | The context of the task |

**Required response format (JSON only):**

```json
{
  "reasoning": "reasoning",
  "success": true,
  "critique": "critique"
}
```

> Ensure the response can be parsed by Python `json.loads`, e.g.: no trailing commas, no single quotes, etc.

**Example input begins:**

```
INPUT:
Inventory (2/36): {'oak_log':2, 'spruce_log':2}
```

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

### 🔬 A.6 System-Level Comparison Between VOYAGER and Prior Works

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

## 🔬 B. Experiments

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

**📊 Table A.3 — Comparison Between VOYAGER and Baselines**

| Feature | ReAct [29] | Reflexion [30] | AutoGPT [28] | VOYAGER |
|---|---|---|---|---|
| Chain-of-Thought [46] | ✓ | ✓ | ✓ | ✓ |
| Self Verification | | ✓ | | ✓ |
| Environment Feedback | ✓ | ✓ | ✓ | ✓ |
| Execution Errors | | ✓ | ✓ | ✓ |
| Agent State | ✓ | ✓ | ✓ | ✓ |
| Skill Library | | | | ✓ |
| Automatic Curriculum | | | | ✓ |

🖼️ **Figure A.1:** Minecraft item icons with corresponding names. A legend of Minecraft item icons (wood log, stick, raw copper, lapis lazuli, leather, ender pearl, wooden pickaxe, copper ingot, cooked mutton, pufferfish, etc.) mapped to their names, used elsewhere in the paper's figures.

---

### 🔬 B.3 Ablations

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

### 📊 B.4 Evaluation Results

#### B.4.1 Significantly Better Exploration

Three trials were run per method, tracking the distinct items collected.

##### VOYAGER

| Trial | Items Collected (count) |
|---|---|
| 1 | iron_ingot, stone_shovel, iron_leggings, fishing_rod, pufferfish, oak_log, cooked_mutton, green_dye, flint, chest, iron_sword, string, ender_pearl, raw_copper, crafting_table, cactus, lapis_lazuli, iron_pickaxe, copper_ingot, stone_pickaxe, wooden_hoe, scaffolding, stick, porkchop, copper_block, gravel, grass_block, white_bed, bone, dirt, mutton, white_wool, oak_sapling, coal, bamboo, wooden_pickaxe, rotten_flesh, cooked_porkchop, cod, iron_boots, lightning_rod, diorite, water_bucket, shears, furnace, andesite, granite, bucket, wooden_sword, sandstone, iron_helmet, raw_iron, sand, acacia_log, cooked_cod, oak_planks, azure_bluet, iron_shovel, acacia_planks, shield, iron_axe, iron_chestplate, cobblestone (63 items) |
| 2 | iron_ingot, tuff, stone_shovel, iron_leggings, fishing_rod, cooked_mutton, spruce_planks, gunpowder, amethyst_shard, chest, string, cooked_salmon, iron_sword, raw_copper, crafting_table, torch, lapis_lazuli, iron_pickaxe, copper_ingot, stone_pickaxe, wooden_hoe, stick, amethyst_block, salmon, calcite, gravel, white_bed, bone, dirt, mutton, white_wool, spyglass, coal, wooden_pickaxe, cod, iron_boots, lily_pad, cobbled_deepslate, lightning_rod, snowball, stone_axe, smooth_basalt, diorite, water_bucket, furnace, andesite, bucket, granite, shield, iron_helmet, raw_iron, cobblestone, spruce_log, cooked_cod, tripwire_hook, stone_hoe, iron_chestplate, stone_sword (58 items) |
| 3 | spruce_planks, dirt, shield, redstone, clock, diamond_sword, iron_chestplate, stone_pickaxe, leather, string, chicken, chest, diorite, iron_leggings, black_wool, cobblestone_wall, cobblestone, cooked_chicken, feather, stone_sword, raw_gold, gravel, birch_planks, coal, cobbled_deepslate, oak_planks, iron_pickaxe, granite, tuff, crafting_table, iron_helmet, stone_hoe, iron_ingot, stone_axe, birch_boat, stick, sand, bone, raw_iron, beef, rail, oak_sapling, kelp, gold_ingot, birch_log, wheat_seeds, cooked_mutton, furnace, arrow, stone_shovel, white_wool, andesite, jungle_slab, mutton, iron_sword, copper_ingot, diamond, torch, oak_log, cooked_beef, copper_block, flint, bone_meal, raw_copper, wooden_pickaxe, iron_boots, wooden_sword (65 items) |

##### ReAct [29]

| Trial | Items Collected |
|---|---|
| 1 | bamboo, dirt, sand, wheat_seeds |
| 2 | dirt, rabbit, spruce_log, spruce_sapling |
| 3 | dirt, pointed_dripstone |

##### Reflexion [30]

| Trial | Items Collected |
|---|---|
| 1 | crafting_table, orange_tulip, oak_planks, oak_log, dirt |
| 2 | spruce_log, dirt, clay_ball, sand, gravel |
| 3 | wheat_seeds, oak_log, dirt, birch_log, sand |

##### AutoGPT [28]

| Trial | Items Collected |
|---|---|
| 1 | feather, oak_log, leather, stick, porkchop, chicken, crafting_table, wheat_seeds, oak_planks, dirt, mutton |
| 2 | wooden_pickaxe, iron_ingot, stone, coal, spruce_planks, string, raw_copper, crafting_table, diorite, andesite, furnace, torch, spruce_sapling, granite, iron_pickaxe, stone_pickaxe, wooden_axe, raw_iron, stick, spruce_log, dirt, cobblestone |
| 3 | wooden_shovel, wooden_pickaxe, iron_ingot, stone, cod, coal, oak_log, flint, raw_copper, crafting_table, diorite, furnace, andesite, torch, granite, lapis_lazuli, iron_pickaxe, stone_pickaxe, raw_iron, stick, gravel, oak_planks, dirt, iron_axe, cobblestone |

> 📌 VOYAGER collects dramatically more distinct items per trial (~60) than ReAct (~3), Reflexion (~5), and AutoGPT (~11–25), illustrating the exploration benefit of the skill library, automatic curriculum, and self-verification combined.


#### B.4.2 Extensive Map Traversal

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

#### B.4.3 Efficient Zero-Shot Generalization to Unseen Tasks

> Results of zero-shot generalization to unseen tasks for the remaining two tasks are shown in Fig. A.3. As with the main-text results, VOYAGER consistently solves all tasks while the baselines solve none within 50 prompting iterations. The skill library (built from lifelong learning) boosts not only VOYAGER but also AutoGPT [28].

🖼️ Figure A.3: Line plots ("Craft a Diamond Pickaxe" and "Craft a Compass") tracking intermediate progress — items obtained (wood log → crafting table → ... → diamond pickaxe / compass) versus prompting iterations in code generation, comparing VOYAGER, VOYAGER w/o Skill Library, AutoGPT, and AutoGPT w/ Skill Library. ReAct and Reflexion are excluded since they make no meaningful progress.

---

#### B.4.4 Accurate Skill Retrieval

> Skill retrieval was evaluated on 309 samples total (Table A.4). Top-5 accuracy of 96.5% indicates the retrieval process is reliable — note the top-5 relevant skills are included in the prompt when synthesizing a new skill.

**Table A.4: Skill retrieval accuracy**

| Top-1 Acc | Top-2 Acc | Top-3 Acc | Top-4 Acc | Top-5 Acc |
|---|---|---|---|---|
| 80.2 ± 3.0 | 89.3 ± 1.8 | 93.2 ± 0.7 | 95.2 ± 1.8 | 96.5 ± 0.3 |

---

#### B.4.5 Robust to Model Variations

> All main-paper experiments use `gpt-4-0314`. Additional experiments were run with `gpt-4-0613`, showing roughly equivalent performance (Fig. A.4) — demonstrating VOYAGER's robustness to model variations.

🖼️ Figure A.4: Line plot of "Number of Distinct Items" vs. "Prompting Iterations in Code Generation," comparing VOYAGER performance under GPT-4-0314 (orange) and GPT-4-0613 (purple); both curves track closely, rising to roughly 60 distinct items by ~160 iterations.
