⚙️ Chunk 2 of the paper

## 📊 4.2 Schema Coverage (RQ1)

**Table 4: Coverage comparison — PrediQL vs. baselines**

| API | ZAP | Burp | EvoMaster | GraphQLer | PrediQL |
|---|---|---|---|---|---|
| UserWallet | 50.00% | 7.69% | 61.54% | 92.31% | 96.15% (+3.84%) |
| Countries | 33.33% | 50.00% | 50.00% | 50.00% | 100% (+50.00%) |
| Rick&Morty | 33.33% | 0.00% | 66.67% | 66.67% | 100% (+33.33%) |
| GraphQLZero | 93.75% | 93.75% | 71.88% | 93.75% | 100% (+6.25%) |
| EHRI | 10.53% | 0.00% | 84.21% | 94.74% | 100% (+5.26%) |
| TCGDex | 66.67% | 33.33% | 100% | 100% | 100% (+0.00%) |

$$
\text{Coverage} = \frac{\#\text{Unique Successful Responses}}{\#\text{Unique Nodes}}
$$

> Coverage measures the fraction of schema nodes returning valid, error-free data — not just HTTP 200 — giving a more accurate view of API reliability.

- PrediQL consistently attains the highest or near-highest coverage across all evaluated APIs.
- **ZAP / BurpSuite**: limited coverage — no awareness of GraphQL's hierarchical structure or query dependencies.
- **EvoMaster**: better via dynamic request generation, but falls short on complex schemas.
- **GraphQLer**: improves via schema context, but PrediQL surpasses it in nearly all cases through retrieval-augmented reasoning and adaptive query generation.
- Reported PrediQL results use its best-performing LLM configuration.

**Table 5: Coverage by LLM across GraphQL APIs**

| API | LLaMA 3.1 | Gemini 2.5 | GPT-5 Mini | DeepSeek R1 |
|---|---|---|---|---|
| UserWallet | 88.46% | 96.15% | 96.15% | 88.46% |
| Countries | 100% | 100% | 100% | 100% |
| Rick&Morty | 100% | 100% | 100% | 100% |
| GraphQLZero | 100% | 100% | 100% | 100% |
| EHRI | 78.94% | 100% | 100% | 100% |
| TCGDex | 100% | 83.33% | 100% | 100% |

- Simpler/well-structured APIs (Countries, Rick & Morty, GraphQLZero, TCGDex): all models achieve high coverage.
- Complex/noisy schemas (UserWallet, EHRI): differences emerge between models.
- **GPT-5 Mini** and **Gemini 2.5**: most stable and complete results — stronger schema understanding and query adaptation.
- **LLaMA 3.1**: comparable but occasionally misses paths.
- **DeepSeek R1**: second-most proficient on specific APIs, close behind GPT-5 Mini.
- Stronger reasoning models maintain high coverage under schema complexity.

> ✅ **Conclusion for RQ1**
> PrediQL consistently outperforms all baseline tools in schema coverage. Context-aware input inference and semantic reasoning enable more accurate, comprehensive query generation. Average improvement: **16%**, maximum: **50%**, over the second-best model.

---

## 🔬 4.3 Prompt Engineering Impact (RQ2)

Ablation study isolating the contribution of each prompt enrichment component to schema coverage and vulnerability discovery.

### Configurations

- **PrediQL-BASE** — minimal schema context + expected response format only; guides syntactically valid GraphQL queries.
- **PrediQL-AQG** — adds multi-armed bandit selection + retrieval-augmented generation for adaptive, context-aware query synthesis (essential for known-values ARM setting).
- **PrediQL-SCL** — adds an error-aware self-correction feedback loop; failed/invalid queries are logged with error messages and reinjected into subsequent prompts as corrective context.
- **PrediQL (full)** — combines AQG + retrieval augmentation + self-correction into a single closed-loop system.

**Table 6: Ablation study on prompt engineering components**

| API | | GPT-5 Mini | | | | Gemini 2.5 | | | | DeepSeek R1 | | | | LLaMA 3.1 | | |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| | BASE | SCL | AQG | PrediQL | BASE | SCL | AQG | PrediQL | BASE | SCL | AQG | PrediQL | BASE | SCL | AQG | PrediQL |
| UserWallet | 19.23% | 38.46% | 61.53% | 96.15% | 19.23% | 26.92% | 65.38% | 96.15% | 19.23% | 30.76% | 65.38% | 96.15% | 38.46% | 42.30% | 84.61% | 88.46% |
| Countries | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| Rick&Morty | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |
| GraphQLZero | 81% | 100% | 87.5% | 100% | 81% | 100% | 91% | 100% | 100% | 100% | 100% | 100% | 90% | 100% | 96.87% | 100% |
| EHRI | 100% | 100% | 100% | 100% | 74% | 74% | 100% | 100% | 52.63% | 52.63% | 84.21% | 100% | 52% | 100% | 100% | 78.94% |
| TCGDex | 100% | 100% | 100% | 100% | 83% | 83% | 83% | 83% | 100% | 100% | 100% | 100% | 100% | 100% | 100% | 100% |

- **PrediQL-BASE alone**: often limited coverage, especially on complex schemas (UserWallet, EHRI) where naive prompting fails on nested/dependent field constraints.
- **Self-correction loop (SCL)**: markedly reduces repeated schema violations, +10–25% coverage depending on model capacity.
- **Adaptive query generation (AQG)**: additional boost for APIs requiring realistic parameter inference — up to **+26%** on EHRI and **+15%** on GraphQLZero (Gemini 2.5).
- **Combined (full PrediQL)**: coverage approaches or reaches ~100% across almost all APIs and models.
- **LLaMA 3.1**: follows the same pattern but with higher variance — reduced stability in long-context reasoning.
- **GPT-5 Mini / DeepSeek R1**: less sensitive to prompt enrichment — reasoning-oriented architectures benefit more from retrieval/correction feedback than raw scale.

> ✅ **Conclusion for RQ2**
> Prompt engineering significantly enhances broader, more accurate schema coverage. Adaptive query generation + self-correction let the system adapt, learn, and refine queries over iterations — yielding a more intelligent, reliable, efficient API exploration process.

---

## 🛡️ 4.4 Vulnerability Detection (RQ3)

- GraphQLer is the only baseline with a built-in vulnerability detection module (EvoMaster, ZAP focus on coverage/fuzzing only) → serves as the primary detection baseline.
- PrediQL consistently identifies **more and a wider range** of vulnerabilities across all APIs.
- GraphQLer mainly exposes schema-level and input validation flaws.
- PrediQL, via retrieval-augmented reasoning + adaptive arm selection, detects deeper logic- and context-dependent weaknesses: **HTML injection, SSRF, OS command injection**.
- **PrediQL-Gemini** and **PrediQL-GPT-5** achieve the highest detection counts — +20–40% unique findings on complex benchmarks (UserWallet, GraphQLZero).
- Reasoning traces link each issue to its execution context (e.g., leaked variables, inconsistent authorization responses) → precise, evidence-based triaging.

**Table 7: Vulnerability detection — GraphQLer vs. PrediQL variants**

| API | GraphQLer (Vuln / Cat) | PrediQL–LLaMA 3.1 (Vuln / Cat) | PrediQL–Gemini 2.5 (Vuln / Cat) | PrediQL–GPT-5 Mini (Vuln / Cat) | PrediQL–DeepSeek R1 (Vuln / Cat) |
|---|---|---|---|---|---|
| UserWallet | 26 / 7 | 31 / 11 | 41 / 7 | 20 / 6 | 34 / 8 |
| Countries | 6 / 2 | 7 / 3 | 9 / 2 | 9 / 4 | 7 / 3 |
| Rick&Morty | 12 / 3 | 10 / 10 | 13 / 4 | 11 / 4 | 14 / 6 |
| GraphQLZero | 37 / 8 | 35 / 7 | 37 / 7 | 44 / 6 | 34 / 7 |
| EHRI | 11 / 3 | 15 / 12 | 21 / 2 | 26 / 2 | 3 / 3 |
| TCGDex | 6 / 1 | 7 / 1 | 10 / 2 | 8 / 2 | 7 / 2 |

> ✅ **Conclusion for RQ3**
> PrediQL substantially advances vulnerability discovery beyond rule-based baselines. Context-aware reasoning correlates schema structure, response semantics, and execution traces — revealing logic and injection flaws that static/signature-driven tools overlook. Adaptive, retrieval-guided analysis is essential for uncovering complex GraphQL security weaknesses.

---

## 💬 5 Discussion

**Impact of Model Size**
- Larger models (GPT-5 Mini, DeepSeek R1): higher semantic coherence and reasoning stability.
- Smaller open-source models (LLaMA 3.1): remain competitive at a fraction of the compute cost.
- Trade-off: reasoning depth vs. efficiency — with retrieval memory + adaptive prompting, lightweight models can approximate proprietary-model performance.
- Promising direction: hybrid configs — large models for seed generation/schema understanding, smaller models for iterative fuzzing — balancing throughput, coverage, cost.

**Implications Beyond GraphQL**
- Core mechanisms (adaptive arm selection, self-corrective prompting, retrieval-grounded reasoning) are not GraphQL-specific.
- Extend naturally to REST, gRPC, JSON-RPC and other structured interface testing domains.
- PrediQL shows retrieval-augmented reasoning + bandit-driven exploration can complement traditional coverage-guided and evolutionary fuzzing.
- Integrating symbolic reasoning or static program analysis into adaptive loops may bridge semantic understanding and execution-level precision.

**⚠️ Limitations**
- **Execution cost & rate limits**: LLM-guided fuzzing is computationally intensive; API rate throttling slows feedback cycles.
- **Context window constraints**: large schemas can exceed model context limits even with retrieval augmentation, causing partial prompt conditioning and missed relationships.
- **Response interpretation ambiguity**: context-aware detector flags likely vulnerabilities, but some require human validation to confirm exploitability.
- **Model bias & non-determinism**: variation across architectures/decoding strategies causes inconsistent results — motivates ensemble/calibration techniques for reproducibility.

**🚀 Future Work**
- Multi-agent design with specialized agents (query generation, evaluation, refinement) for continuous self-improvement and deeper exploit discovery.
- Domain-specialized LLMs for API/schema reasoning (analogous to text-to-SQL models) — reduce prompt overhead, improve precision/generalization.
- Hybrid systems coupling LLM reasoning with program analysis or formal verification — semantic adaptability + provable assurance.

---

## 🏁 6 Conclusion

- PrediQL demonstrates that combining retrieval, reasoning, and adaptive learning fundamentally improves GraphQL API testing.
- Integrating LLMs into the fuzzing loop transforms random exploration into guided reasoning — understanding schemas, inferring dependencies, generating purposeful queries.
- Multi-armed bandit strategy selection lets PrediQL learn which testing behaviors yield the most valuable feedback → higher coverage, more vulnerabilities uncovered than existing tools.
- Broader insight: LLMs can act as **analysts**, not just generators — connecting input, responses, and context to detect complex logic-level flaws that evade rule-based/pattern-driven scanners.
- Marks a step toward autonomous, self-improving security testing, where models learn from every execution to test smarter over time.
- Future extensions: collaborative multi-agent setups and large-scale retrieval across heterogeneous APIs.

---

## 📚 References

1. Burp Suite. https://portswigger.net/burp
2. Countries GraphQL API. https://countries.trevorblades.com/
3. DeepSeek R1 vs GPT-5 Mini (model comparison). https://aimodels.fyi/compare/deepseek-r1-vs-gpt-5-mini
4. European Holocaust Research Infrastructure (EHRI) GraphQL API. https://portal.ehri-project.eu/api/graphql
5. Gemini 2.5 Flash model. https://deepmind.google/models/gemini/flash/
6. GPT-5 Mini vs Gemini 2.5 Flash (model comparison). https://artificialanalysis.ai/models/comparisons/gpt-5-mini-vs-gemini-2-5-flash
7. GraphQL security (official guide). https://graphql.org/learn/security/
8. GraphQL vs REST API. https://aws.amazon.com/compare/the-difference-between-graphql-and-rest/
9. GraphQLZero API. https://graphqlzero.almansi.me/
10. Meta LLaMA 3.1 8B. https://huggingface.co/meta-llama/Llama-3.1-8B
11. Rick and Morty GraphQL API. https://rickandmortyapi.com/graphql
12. TCGdex GraphQL API. https://api.tcgdex.net/v2/graphql
13. UserWallet GraphQL API. https://github.com/graphql-compose/graphql-compose-examples/tree/master/examples/user-wallet
14. OWASP Zed Attack Proxy (ZAP). https://www.zaproxy.org/, 2024
15. Agrawal, S., and Goyal, N. Analysis of Thompson sampling for the multi-armed bandit problem. arXiv:1111.1797 (2011)
16. Andersson, T. REST API vs GraphQL — a literature and experimental study. DiVA portal, 2021
17. Arcuri, A., Galeotti, J. P., Marculescu, B., and Zhang, M. EvoMaster: A search-based system test generation tool. JOSS 6, 57 (2021), 2153
18. Belhadi, A., Zhang, M., and Arcuri, A. Random testing and evolutionary testing for fuzzing GraphQL APIs. ACM TWeb (2023)
19. Belhadi, Y., and Arcuri, A. EvoMaster for GraphQL: Black-box test generation for web APIs. ASE (2023), 1503–1507
20. Cavenaghi, E., et al. Non-stationary multi-armed bandit: empirical evaluation of f-discounted-sliding-window Thompson sampling. Entropy 23, 3 (2021), 380
21. Chen, C., Dolan-Gavitt, B., and Lin, Z. Elfuzz: efficient input generation via LLM-driven synthesis over fuzzer space. USENIX Security (2025)
22. Deng, Y., Xia, C. S., Peng, H., Yang, C., and Zhang, L. Large language models are zero-shot fuzzers. arXiv:2212.14834 (2022)
23. Douze, M., et al. The FAISS library
24. Doyensec. CrackQL: GraphQL security testing tool. https://github.com/doyensec/CrackQL, 2021
25. Escape. The state of GraphQL security 2024. Escape Technologies, 2024
26. Escape Technologies. GraphQL-Cop: security scanner for GraphQL APIs. https://github.com/escape-technologies/graphql-cop, 2023
27. Fastly. Exploring the security implications of GraphQL, 2022
28. Fioraldi, A., Maier, D., Eissfeldt, H., and Heuse, M. AFL++: combining incremental steps of fuzzing research. WOOT 20 (2020)
29. Forward Security. AutoGQL: auto GraphQL scanner for Burp Suite. https://github.com/FWDSEC/burp-auto-gql, 2023
30. Google. OSS-Fuzz — continuous fuzzing for open source software, 2024
31. GraphCrawler Project. GraphCrawler: automated GraphQL introspection and fuzzing tool, 2022
32. Hatfield-Dodds, Z., et al. Deriving semantics-aware fuzzers from web API schemas, 2021
33. Huang, L., Zhao, P., Chen, H., and Ma, L. Large language models based fuzzing techniques: a survey. arXiv:2402.00350 (2024)
34. Hygraph. GraphQL survey 2024
35. IBM PTC Security. Denial of service attacks with GraphQL, 2023
36. Jin, Y., et al. FuzzGPT: harnessing LLMs for effective API fuzzing. USENIX Security (2024)
37. Johnson, J., Douze, M., and Jégou, H. Billion-scale similarity search with GPUs. IEEE TBD (2019)
38. JSON-RPC Working Group. JSON-RPC 2.0 specification, 2013
39. Kesarwani, M., et al. GraphQL query generation: a large training and benchmarking dataset, 1595–1607
40. Lattimore, T., and Szepesvári, C. Bandit Algorithms. Cambridge University Press, 2020
41. Lewis, P., et al. Retrieval-augmented generation for knowledge-intensive NLP tasks. NeurIPS 33 (2020), 9459–9474
42. LLVM Project. libFuzzer — a library for coverage-guided fuzzing, 2024
43. Madaan, A., et al. Self-Refine: iterative refinement with self-feedback. NeurIPS (2023)
44. McFadden, S., Maugeri, M., Hicks, C., Mavroudis, V., and Pierazzi, F. Wendigo: deep RL for DoS query discovery in GraphQL. IEEE SPW (2024), 68–75
45. Meng, R., Duck, G. J., and Roychoudhury, A. Large language model assisted hybrid fuzzing. arXiv (2024)
46. Ouyang, L., et al. Training language models to follow instructions with human feedback. arXiv:2203.02155 (2022)
47. Perera, I., Abeyrathne, H., Malalgoda, S., and Ifthikar, A. Enhancing GraphQL security by detecting malicious queries using LLMs, sentence transformers, and CNNs. arXiv:2508.11711 (2025)
48. Reimers, N., and Gurevych, I. Sentence-BERT: sentence embeddings using Siamese BERT networks. EMNLP (2019), 3982–3992
49. TechTarget. What's next for APIs? 4 API trends for 2025 and beyond, 2024
50. Tsai, Y., Zhang, T., et al. GraphQLer: enhancing GraphQL security with context-aware API testing. arXiv:2504.13358 (2025)
51. Xia, C., et al. Fuzz4All: universal fuzzing with large language models. ICSE (2024), 1–13
52. Zhang, T., et al. DFuzz: large language models for deep API fuzzing with white-box guidance. ICSE (2025)
