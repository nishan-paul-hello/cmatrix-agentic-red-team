⚙️ Chunk 2 of the paper

## 📊 Blog Posts Service: Code Coverage & Bug Finding

🖼️ Figure: Three side-by-side panels (Fig. 4) showing code coverage (LOC) over time/test cases (top row) and cumulative HTTP status codes received over time (bottom row) for a simple blog posts service, under three RESTler configurations:
- **Left** — RESTler ignores dependencies among request types
- **Center** — RESTler ignores dynamic feedback
- **Right** — RESTler uses both dependencies and dynamic feedback (best coverage; finds the planted `500 Internal Server Error` bug with fewest tests)

> **Key takeaway:** combining dependency-awareness with dynamic feedback yields the best code coverage and the fastest bug discovery.

---

## 🔬 Testing Common GitLab APIs with RESTler

**Setup:**
- 5-hour timeout per experiment
- Max 1,000 fuzzable primitive-type combinations per request
- GitLab service rebooted to the same initial state between experiments
- BFS search strategy (Figure 3 algorithm)
- Code coverage measured via Ruby's `Class::TracePoint` hook on GitLab's `service/lib` folder
- Baseline: 16,836 LOC executed during service boot (coverage numbers below are incremental on top of this)

### Table I: Testing Common GitLab APIs with RESTler

| API | Total Requests | Seq. Len. | Coverage Increase | Tests | seqSet Size | Dynamic Objects |
|---|---|---|---|---|---|---|
| Commits | 11 | 1 | 598 | 1 | 1 | 1 |
| | | 2 | 1108 | 7 | 5 | 10 |
| | | 3 | 1196 | 250 | 46 | 521 |
| | | 4 | 1760 | 2220 | 1341 | 6577 |
| | | 5 | 1760 | 3667 | 20679 | 12518 |
| Branches | 7 | 1 | 598 | 1 | 1 | 1 |
| | | 2 | 1089 | 8 | 6 | 11 |
| | | 3 | 1172 | 58 | 44 | 107 |
| | | 4 | 1182 | 576 | 387 | 1279 |
| | | 5 | 1185 | 3644 | 5528 | 9336 |
| Issues | 22 | 1 | 816 | 37 | 37 | 37 |
| | | 2 | 1163 | 2444 | 1839 | 4245 |
| | | 3 | 1163 | 4156 | 15658 | 8870 |
| Repos | 10 | 1 | 598 | 1 | 1 | 1 |
| | | 2 | 1117 | 97 | 65 | 206 |
| | | 3 | 1181 | 5153 | 2194 | 15472 |
| Groups | 50 | 1 | 887 | 39 | 39 | 38 |
| | | 2 | 1177 | 3508 | 3360 | 5204 |
| | | 3 | 1177 | 4817 | 79518 | 8946 |
| Projects | 48 | 1 | 934 | 42 | 41 | 38 |
| | | 2 | 1192 | 1870 | 1781 | 3343 |
| | | 3 | 1203 | 3226 | 18173 | 7374 |

### 📌 Observations

- **Longer sequences → higher coverage.** Some functionality only activates after several requests are chained (e.g., GitLab's "select a commit" requires: create project → post commit → select commit by `commit-id` + `project-id`, needing ≥3 requests).
- **Commits API** coverage rises steadily: 598 → 1,108 → 1,196 LOC for sequence lengths 1, 2, 3.
- **Branches API** keeps gaining coverage up to sequence length 5, reaching 1,185 LOC before the 5-hour cutoff.
- **Search space explosion:** for Commits alone (11 request types, ~4 renderings average), all possible sequences up to length 4 exceed **164 million** — brute force is intractable. Even with RESTler's core techniques, seqSet size (20,679) and dynamic objects (12,518) still grow quickly for sequence length 5.

---

## 🔬 Search Strategy Comparison: BFS vs. BFS-Fast vs. RandomWalk

### Table II: Comparison of BFS, BFS-Fast, and RandomWalk Over Time

*Total Requests column shows average feasible request renderings in parentheses (\*).*

| API | Total Requests (*avg renderings) | Time (hrs) | BFS Len. | BFS Coverage | BFS-Fast Len. | BFS-Fast Coverage | RandomWalk Len. (restarts) | RandomWalk Coverage | Final seqSet (BFS / BFS-Fast) |
|---|---|---|---|---|---|---|---|---|---|
| Commits | 11 (\*11) | 1 | 4 | 1202 | 7 | 1697 | 13 (16) | 1285 | — |
| | | 3 | 5 | 1760 | 9 | 1731 | 13 (35) | 1295 | — |
| | | 5 | 5 | 1760 | 12 | 1731 | 13 (56) | 1303 | 20679 / 33 |
| Branches | 7 (\*2) | 1 | 5 | 1182 | 21 | 1154 | 15 (24) | 1182 | — |
| | | 3 | 5 | 1185 | 37 | 1178 | 19 (92) | 1187 | — |
| | | 5 | 5 | 1185 | 47 | 1178 | 22 (158) | 1208 | 5528 / 11 |
| Issues | 22 (\*82) | 1 | 2 | 1150 | 2 | 1086 | 10 (1) | 770 | — |
| | | 3 | 3 | 1163 | 4 | 1551 | 10 (1) | 770 | — |
| | | 5 | 3 | 1163 | 5 | 1570 | 16 (2) | 847 | 15658 / 26 |
| Repos | 10 (\*24) | 1 | 3 | 1127 | 5 | 1141 | 10 (29) | 1195 | — |
| | | 3 | 3 | 1127 | 7 | 1141 | 13 (88) | 1231 | — |
| | | 5 | 3 | 1181 | 8 | 1161 | 13 (142) | 1231 | 2194 / 64 |
| Groups | 50 (\*2) | 1 | 2 | 961 | 6 | 1275 | 19 (41) | 1167 | — |
| | | 3 | 3 | 1177 | 11 | 1275 | 19 (120) | 1250 | — |
| | | 5 | 3 | 1177 | 14 | 1275 | 22 (186) | 1283 | 79518 / 130 |
| Projects | 48 (\*4) | 1 | 2 | 1006 | 5 | 1318 | 4 (3) | 889 | — |
| | | 3 | 2 | 1053 | 11 | 1319 | 22 (31) | 1024 | — |
| | | 5 | 3 | 1203 | 15 | 1319 | 22 (45) | 1273 | 18173 / 171 |

> Although BFS covers slightly more lines of code in some APIs, BFS-Fast and RandomWalk reach **deeper** request sequences while keeping a much **smaller seqSet**.

### 📌 Findings

- **BFS vs. BFS-Fast:**
  - BFS wins on coverage for APIs with *few* requests (Commits, Branches, Repos) since it can exhaustively cover all feasible sequences.
  - BFS-Fast scales better on APIs with *many* requests (Issues, Groups, Projects) — after 5 hours BFS is stuck at sequence length 3 for these, while BFS-Fast reaches lengths 5, 14, and 15 respectively.
  - BFS-Fast appends each request to at most one sequence per generation (rather than exploring all combinations), keeping seqSet smaller and coverage growth faster.

- **BFS vs. RandomWalk:**
  - RandomWalk doesn't guarantee full grammar coverage (appends each request to one random sequence per generation) but keeps seqSet very small.
  - RandomWalk reaches the deepest sequences overall and wins on coverage in Branches, Repos, and Groups after 5 hours.
  - **Exception — Issues API:** RandomWalk reaches sequence length 16 but only 847 LOC coverage, while BFS (length 3) achieves 1,163 LOC and BFS-Fast (length 5) achieves 1,570 LOC. Issues has a high average of feasible request renderings (82), so RandomWalk's restarts stay low (only 2 after 5 hrs), trapping the search in a narrow subspace.

> **Practical implication:** controlling seqSet size *and* maintaining search breadth both matter for coverage — but coverage is only a heuristic; the real goal is finding bugs.

---

## 🐛 Bug Bucketization

**Definition:** a *bug* = a `500` HTTP status code returned after executing a request sequence.

### Bucketization procedure
1. When a new bug is found, compute all non-empty suffixes of its (non-rendered) request sequence, starting from the smallest.
2. Check if any suffix matches a previously recorded bug-triggering sequence.
3. If matched → add to that bug's existing bucket.
4. If not → create a new bucket.

> With BFS or BFS-Fast, this scheme identifies each bug by its *shortest* triggering sequence.

### Table III: Bug Buckets Found by Each Search Strategy (after 5 hours)

| API | BFS | BFS-Fast | RandomWalk | Intersection | Union |
|---|---|---|---|---|---|
| Commits | 5 | 1 | 5 | 1 | 5 |
| Branches | 7 | 7 | 7 | 5 | 8 |
| Issues | 0 | 1 | 1 | 0 | 1 |
| Repos | 2 | 3 | 3 | 2 | 3 |
| Groups | 0 | 0 | 2 | 0 | 2 |
| Projects | 2 | 1 | 3 | 1 | 3 |
| **Total** | **16** | **13** | **21** | **9** | **22** |

### 📌 Findings

- Across all strategies combined, RESTler found **22 new unique bugs** in this experiment set.
- **RandomWalk finds the most bugs (21)** vs. BFS (16) and BFS-Fast (13) — despite *not* always achieving the best coverage.
- Notably, in **Commits** and **Issues**, RandomWalk matches or exceeds the combined bug count of BFS + BFS-Fast, even though it delivers *less* coverage in those APIs.
- **Conclusion:** coverage increase alone should not dictate search-strategy choice — different strategies can be complementary in large search spaces, since bug discovery doesn't perfectly correlate with code coverage.

---

## 🐛 New Bugs Found in GitLab

Across all fuzzing experiments, RESTler found **28 new unique bugs** in GitLab — all reproducible, disclosed, confirmed, and fixed by GitLab developers.

### Example 1 — Commits API bug
- **Trigger:** cherry-picking a commit to a branch with an **empty name**.
- **Root cause:** incomplete input validation. The Ruby layer checking branch existence calls a native C function expecting `NULL` or an existing entry; an unmatched type (empty string) raises an exception unhandled by the higher-level Ruby code → `500 Internal Server Error`.
- **Reproduction steps:**
  1. Create a project
  2. Create a new branch (in addition to default `master`)
  3. Post a valid commit with action `create` on the new branch
  4. Cherry-pick the commit to a branch with an empty-string name

### Example 2 — Branches API bug
- **Trigger:** editing a branch belonging to a **recently deleted project**.
- **Root cause:** invalid serialization of operations leads to a DB update using an invalid foreign key (the deleted project's ID) → `PG::ForeignKeyViolation` → `500 Internal Server Error`.
- **Reproduction steps:**
  1. Create a project
  2. Create a branch
  3. Delete the project
  4. Quickly edit the branch of the now-deleted project

### 📌 Common Pattern

> Most bugs follow a two-step pattern:
> 1. RESTler drives the service deep enough to reach a specific valid **state**.
> 2. While in that state, RESTler issues an additional request with an unexpected fuzzed value (e.g., empty string) or unexpected action (e.g., edit a deleted resource).

---

## ☁️ Experiences with Public Cloud Services

RESTler was also tested (preliminarily) against **three Azure services** and **one Microsoft Office365 service**, mostly resource-management and real-time data-aggregation services, using publicly available Swagger specs from Microsoft's GitHub.

- New bugs found in **all** tested services, including:
  - Mis-handled invalid inputs (wrong ID/enum value)
  - Operations executed in invalid states (e.g., updating a deleted resource)
  - Inconsistent parameter validation (valid body + incorrect metadata)
- All bugs confirmed and fixed by Microsoft.
- ⚠️ `500` errors are treated as potential server-state corruption — safer to fix proactively than risk a live incident.

### ⚠️ Challenges Unique to Public Cloud Testing

1. **Resource Quotas**
   - Production services enforce default quotas; once hit, RESTler kept retrying sequences that could no longer succeed, stalling progress.
   - **Fix:** implemented a **garbage collector (GC)** thread that monitors and periodically deletes unused dynamic objects, letting RESTler run continuously for hours/days without quota errors.

2. **Short-lived Access Tokens**
   - Public cloud services use refreshable, short-lived tokens (unlike static/long-lived tokens in self-contained deployments).
   - **Fix:** an **authentication hook** periodically runs user-provided code/scripts to refresh and inject new tokens into RESTler's token pool.

3. **Application-specific Naming Schemes**
   - Swagger specs may be incomplete or not fully REST-compliant, leading to incomplete dependency inference.
   - **Fix:** RESTler supports:
     - **Annotations** (Swagger extensions) to explicitly declare dependencies
     - **Resource-specific mutations** for custom-format resource creation (e.g., IP addresses)
   - Useful for Azure's pattern of PUT requests that create resources with user-provided names passed as URL params (also returned in the response).

---

## 📚 Related Work

- **HTTP Fuzzers** (Burp, Sulley, BooFuzz, AppSpider, Qualys WAS): capture/replay HTTP traffic and fuzz using pre-defined or user-defined rules; some now leverage Swagger specs. RESTler's originality: lightweight static analysis of Swagger specs to infer **request-type dependencies**, enabling stateful sequence generation without pre-recorded traffic.

- **Feedback-directed Test Generation:** RESTler's dynamic-feedback pruning is conceptually similar to Randoop, though search strategies and object-equality optimizations differ. Unlike Randoop's typed object-oriented approach, Swagger's dynamic objects are implicitly declared and untyped — addressed via RESTler's annotation support.

- **Model-based Testing:** BFS-Fast is inspired by model-based test generation aiming for minimal test sets with full state/transition coverage, and by grammar-coverage test generation. BFS-Fast provides full grammar coverage up to a given sequence length (not necessarily minimal test count, but manageable in practice).

- **Grammar-based Fuzzing** (Peach, SPIKE, etc.): general-purpose, but require manually constructed API-specific grammars. RESTler automatically derives its grammar from a Swagger spec, with fuzzing rules generated automatically.

- **Grammar Learning from Samples:** a complementary research direction; RESTler currently depends on a Swagger spec but could potentially be refined using representative unit tests, live traffic, or ML/static analysis for services lacking specs.

- **Whitebox Fuzzing:** combines grammar-based fuzzing with dynamic symbolic execution; RESTler is purely **blackbox** (only sees requests/responses). Possible future direction: incorporating backend log alerts (e.g., assertion violations) to better correlate bugs with request sequences.

- **Penetration Testing:** the dominant industry practice, but labor-intensive, expensive, and limited in scope/depth. Fuzzing tools like RESTler automate discovery of specific vulnerability classes and complement (not replace) pen testing.

---

## ✅ Conclusion

- RESTler is presented as **the first automatic stateful-fuzzing tool for cloud services via REST APIs**.
- Found **28 bugs in GitLab** and several bugs across four Azure/Office365 services — results deemed preliminary but encouraging.
- Open question: **how general are these results?** More services and properties need testing to characterize the security vulnerabilities hiding behind REST APIs (unlike well-studied classes like buffer overflows or XSS).
- Past pen-testing evidence of such vulnerabilities is largely anecdotal; **systematic, automated tools** like RESTler are needed to answer:
  - How many bugs can be found by fuzzing REST APIs?
  - How security-critical are they?

## 🙏 Acknowledgements

Thanks extended to William Blum, Dave Tamasi, David Molnar, the Microsoft Security Risk Detection team, Albert Greenberg, Mark Russinovich, John Walton (Microsoft Azure), and the GitLab/Microsoft developers who acknowledged and fixed the reported bugs.
