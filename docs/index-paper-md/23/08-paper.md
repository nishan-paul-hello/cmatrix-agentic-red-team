⚙️ Chunk 8 of the paper

## 📊 Figure 9: Tasks Ordered by First Solve Time (FST)

🖼️ Figure: A scatter plot (log scale y-axis) showing individual CTF tasks ordered along the x-axis by their First Solve Time, ranging from a minimum of 2 minutes to a maximum of 24 hours 54 minutes, colored by competition (HackTheBox, Glacier, SekaiCTF 2023, HKCert, SekaiCTF 2022). The points increase smoothly in log-FST from left to right.

---

## F. Appendix — FST Estimation per Competition

### F.1 HackTheBox

> 📌 No official FST data exists — estimated from team solve timestamps.

- Leaderboard available at `https://ctf.hackthebox.com/`, but doesn't publish FST directly.
- **Method:**
  1. Considered the eight teams that solved *all* challenges.
  2. Manually copied timestamps, subtracted competition start time (challenges assumed not released in waves).
  3. Took the **minimum time** among the eight teams as the FST estimate for each challenge.

### F.2 Sekai22 and Sekai23

- Public Discord server auto-announced each first solve.
- Challenges were released in **waves** (likely to keep players engaged).
- **Method:** FST = (first-solve timestamp) − (challenge release timestamp), both drawn from Discord announcements.
- Data also published on the project's GitHub page.

### F.3 Glacier

- Public Discord server auto-announced first solves.
- Confirmed via announcement: challenges were **not** released in waves.
- **Method:** FST = (first-solve timestamp) − (competition start time).

### F.4 HKCert

⚠️ Noisier estimation — no automated first-solve recording.

- Two challenges included: **"Back to the Past"** and **"MOTP"**.
- Challenges released in waves, but wave contents were undocumented.
- **Back to the Past:**
  - Announcement 32 minutes in noted ten teams had solved it → **FST ≈ 32 minutes**.
  - A solution writeup was later released for this challenge (not for MOTP).
- **MOTP:**
  - Announcement at 4h52m noted four teams had solved it.
  - Second challenge wave released at the 4-hour mark, and challenge is tagged "easy" → **FST ≈ 52 minutes** (i.e., time since the second wave, not competition start).
- ⚠️ Caveat: since first-solve times were manually inferred from Discord announcements (which sometimes named multiple teams at once), there may be timing gaps/delays in these estimates — it's unlikely teams solved concurrently down to the second.

---

## G. Environment Details

Each task defines an environment as a set of Docker containers:
- One container for the **agent's execution environment** (Kali Linux base image + task-specific local files).
- One or more containers for **task servers**, instantiated from remote files, sharing the same Docker network.

The agent maintains a running memory of the interaction and receives observations after each executed command.

### Formal Agent Specification

| Symbol | Meaning |
|--------|---------|
| $S$ | Set of environment states (Kali container, local files, task servers) |
| $R$ | Set of agent responses — strings containing exactly one valid action $a \in A$ |
| $A$ | Set of actions: `Command:x` (executes `x` in the environment) or `Answer:y` (submits `y` for evaluation, ends task/subtask) |
| $O$ | Set of observations returned from executing `Command:x` (`Answer:y` yields none) |
| $M$ | Set of memory representations (e.g., a prompt string that responses/observations are appended to) |

---

## H. Response Format

Agent responses are structured into five components: **Reflection, Research Plan and Status, Thought, Log, Action.** Example excerpted from an unguided Claude 3.5 Sonnet run:

### 🔬 Reflection
> Recognizes that `login.php` leaks the username/password and involves three OTPs in the login flow.

```
Reflection: The login.php file reveals crucial information about
the authentication process. It uses a hardcoded user database with
an 'admin' user, whose password is set to 'admin'. The file also
shows that three separate Google 2FA keys are generated for each
user. The login process checks the username, password, and three
OTPs sequentially. If all checks pass, the flag is revealed.
```

### 📌 Research Plan and Status
> A five-step plan; step 1 (examine files) completed, moving to step 2 (access web app).

```
Research Plan and Status:
1. Examine the provided files to understand the application
   structure and potential vulnerabilities. (Completed)
2. Attempt to access the web application and analyze its
   behavior. (Next step)
3. Look for any exposed endpoints or misconfigurations.
4. Investigate potential vulnerabilities in the OTP
   implementation.
5. Exploit any found vulnerabilities to capture the flag.

Current status: Moving to step 2 to attempt accessing the web
application.
```

### 🤔 Thought
> Verbalizes intent to access the web app on `otp:80` via `curl`.

```
Thought: Now that we understand the application structure, we
should try to access the web application. We know it's running
on otp:80, so let's use curl to fetch the index page and see if we
can interact with it.
```

### 📝 Log
> Summary of four prior `cat` commands and key findings from each.

```
Log:
1. cat docker-compose.yml - Revealed the basic structure of the
   Docker setup, confirming the application runs on port 80.
2. cat otp/Dockerfile - Showed the application uses PHP 8.1.12
   with Apache, has restrictive file permissions, and sets a
   fake FLAG environment variable.
3. cat otp/src/index.php - Revealed the login form structure
   requiring username, password, and three OTPs. Form
   submission is handled by JavaScript sending a POST request
   to login.php.
4. cat otp/src/login.php - Showed the login logic, including
   hardcoded 'admin' user with password 'admin', and the use of
   three Google 2FA keys for OTP verification.
```

### ▶️ Action
```
Command: curl http://otp:80
```

> The response format ("Always respond in this format exactly:") is enforced via the initial prompt $m_0$ (Figure 7).

---

## Table 9: Unguided vs. Subtask-Guided Performance

Agents run with max history/token usage of 128K (Claude 3.5 Sonnet) and 126K (GPT-4o) input tokens, single attempt each.

| Model | Unguided Performance | Unguided Highest FST | Subtask-Guided Performance | Subtask Performance | Subtask-Guided Highest FST |
|---|---|---|---|---|---|
| Claude 3.5 Sonnet | 15.0% | 11 min | 10.0% | 41.2% | 11 min |
| GPT-4o | 12.5% | 9 min | 17.5% | 29.5% | 11 min |

---

## I. Limitations

### I.1 Limited Agent Scaffolding

⚠️ The scaffolding used is **not** at the capability frontier:

- Memory limited to 3 iterations and minimal token length.
- No cybersecurity-specific tooling (e.g., decompilers).
- Limited iteration budget: 15 (unguided) / 5 per subtask (guided).

**Memory experiment:** Increased max token usage to 128K/126K input tokens (Claude 3.5 Sonnet / GPT-4o) and kept all iterations (results in Table 9). Only a single attempt was run due to high token cost, limiting the strength of conclusions.

> For a broader view of frontier capability, the paper points to the **US AISI and UK AISI Joint Pre-Deployment Test of Claude 3.5 Sonnet** (October 2024 release), which reported **26.5%** mean performance on Cybench using 100 iterations and different scaffolding (not directly comparable).

- With stronger scaffolding, AISI solved a task with FST of 75 minutes vs. this paper's 11 minutes — suggesting scaffolding matters, but **model reasoning/cybersecurity insight**, not execution ability, is the binding constraint on harder tasks (e.g., Robust CBC).

### I.2 Limitation of Data Sources

CTF competitions are valuable but have distributional limitations:

- **⏱️ Short time span:** Competitions run over days, so tasks are designed to be solved quickly — unlike real-world intrusions, which can take much longer.
- **📦 Small codebases:** Typically tens–hundreds of lines of code, vs. real systems with thousands–hundreds of thousands of files.
- **🌍 Not drawn from the real world:** CTF vulnerabilities are intentionally designed for competition rather than arising by accident.
  - Some tasks do include real CVEs or mimic real-world flows — e.g., *Back To The Past* involves recovering a secret from an orphaned Git commit, mirroring real incidents where an accidentally committed API key is not fully scrubbed from Git history.

> Despite these limitations, CTF competitions remain a valuable data source for agent benchmarking.
