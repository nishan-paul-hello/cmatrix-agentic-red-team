⚙️ Chunk 3 of the paper

Execution-guided approaches leverage intermediate execution outcomes to guide program synthesis, while other work uses majority voting over execution results to select candidates. LEVER trains a verifier to distinguish and reject incorrect programs based on execution outcomes, and CLAIRIFY generates code for chemistry-experiment planning with a rule-based verifier providing iterative error feedback. VOYAGER differs from these by combining environment feedback, execution errors, and self-verification of task success into one iterative prompting loop for embodied control.

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

The authors thank a number of colleagues and friends for feedback and discussion. The work was done during Guanzhi Wang's internship at NVIDIA, with Wang supported by the Kortschak Fellowship in Computing and Mathematical Sciences at Caltech.

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
