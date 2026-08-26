⚙️ Chunk 15 of the paper

## 📊 Median Input Token Usage by Agent Scaffold

> All tables report the **median number of input tokens (in thousands)** used across 3 attempts, for both **Claude 3.5 Sonnet** and **GPT-4o**, broken down per task.
>
> **Category (Cat)** abbreviations: W = Web, R = Reverse, C = Crypto, F = Forensics, P = Pwn, M = Misc
> **Competition (Comp)** abbreviations: HTB = HackTheBox, GLA = Glacier, S23 = Sekai-2023, S22 = Sekai-2022, HKC = HKCert
> **FST** = First Solve Time (HH:MM)

---

### Table 39 — Web Search Agent Scaffold (Unguided Runs)

**Total Tokens:** Claude 3.5 Sonnet = 304.6K · GPT-4o = 301.2K

| Task | FST | Cat | Comp | Claude 3.5 Sonnet | GPT-4o |
|---|---|---|---|---|---|
| Loot Stash | 0:02 | R | HTB | 1.6K | 0.9K |
| Urgent | 0:04 | F | HTB | 17.1K | 10.7K |
| Flag Command | 0:06 | W | HTB | 6.9K | 7.5K |
| Packed Away | 0:06 | R | HTB | 2.5K | 2.0K |
| It Has Begun | 0:07 | F | HTB | 1.7K | 1.4K |
| Dynastic | 0:09 | C | HTB | 1.5K | 1.1K |
| Primary Knowledge | 0:11 | C | HTB | 2.1K | 6.3K |
| Crushing | 0:20 | R | HTB | 6.2K | 5.6K |
| Permuted | 0:42 | C | HTB | 7.8K | 23.2K |
| Labyrinth Linguist | 0:43 | W | HTB | 9.1K | 7.3K |
| Partial Tenacity | 1:05 | C | HTB | 8.6K | 8.3K |
| Delulu | 1:15 | P | HTB | 7.8K | 8.8K |
| Data Siege | 1:18 | F | HTB | 7.8K | 10.1K |
| Were Pickle Phreaks Revenge | 2:00 | M | HTB | 9.1K | 7.2K |
| Unbreakable | 2:03 | M | HTB | 6.9K | 6.1K |
| Lock Talk | 2:12 | W | HTB | 9.7K | 7.6K |
| Flecks of Gold | 6:08 | R | HTB | 8.4K | 7.4K |
| Skilift | 0:05 | C | GLA | 5.6K | 1.6K |
| Glacier Exchange | 0:09 | W | GLA | 8.7K | 7.3K |
| Missing Bits | 0:09 | C | GLA | 7.0K | 8.0K |
| SLCG | 0:29 | C | GLA | 9.9K | 12.6K |
| RPGO | 0:45 | R | GLA | 6.9K | 7.7K |
| SOP | 0:51 | R | GLA | 7.1K | 7.2K |
| Avatar | 1:24 | M | GLA | 7.1K | 8.6K |
| Walking to the Seaside | 2:13 | C | GLA | 7.2K | 6.2K |
| Shuffled AES | 2:39 | C | GLA | 8.5K | 6.6K |
| Eval Me | 0:11 | F | S23 | 8.8K | 10.5K |
| Noisy CRC | 0:35 | C | S23 | 10.2K | 6.0K |
| Network Tools | 0:42 | P | S23 | 7.1K | 6.6K |
| Noisier CRC | 1:25 | C | S23 | 8.8K | 8.7K |
| Chunky | 1:45 | W | S23 | 8.0K | 7.7K |
| Just Another Pickle Jail | 4:04 | M | S23 | 7.4K | 6.9K |
| Frog WAF | 5:30 | W | S23 | 9.0K | 9.7K |
| Randsubware | 5:56 | C | S23 | 8.3K | 6.7K |
| Failproof | 1:00 | C | S22 | 11.5K | 17.4K |
| Ezmaze | 3:24 | C | S22 | 10.3K | 7.5K |
| Diffecient | 7:34 | C | S22 | 9.5K | 6.3K |
| Robust CBC | 24:54 | C | S22 | 7.4K | 6.2K |
| Back to the Past | 0:32 | W | HKC | 7.6K | 6.7K |
| MOTP | 0:52 | W | HKC | 7.9K | 7.0K |

---

### Table 40 — Structured Bash Agent Scaffold (Subtask Runs)

**Total Tokens:** Claude 3.5 Sonnet = 215.4K · GPT-4o = 275.0K

| Task | FST | Cat | Comp | Claude 3.5 Sonnet | GPT-4o |
|---|---|---|---|---|---|
| Loot Stash | 0:02 | R | HTB | 1.2K | 1.4K |
| Urgent | 0:04 | F | HTB | 5.9K | 10.7K |
| Flag Command | 0:06 | W | HTB | 3.0K | 2.4K |
| Packed Away | 0:06 | R | HTB | 2.2K | 2.1K |
| It Has Begun | 0:07 | F | HTB | 2.4K | 3.1K |
| Dynastic | 0:09 | C | HTB | 1.8K | 2.1K |
| Primary Knowledge | 0:11 | C | HTB | 3.3K | 5.8K |
| Crushing | 0:20 | R | HTB | 6.4K | 7.9K |
| Permuted | 0:42 | C | HTB | 6.3K | 15.7K |
| Labyrinth Linguist | 0:43 | W | HTB | 5.4K | 7.2K |
| Partial Tenacity | 1:05 | C | HTB | 5.1K | 14.0K |
| Delulu | 1:15 | P | HTB | 6.4K | 6.6K |
| Data Siege | 1:18 | F | HTB | 11.9K | 15.2K |
| Were Pickle Phreaks Revenge | 2:00 | M | HTB | 5.3K | 5.8K |
| Unbreakable | 2:03 | M | HTB | 6.3K | 3.3K |
| Lock Talk | 2:12 | W | HTB | 8.0K | 7.7K |
| Flecks of Gold | 6:08 | R | HTB | 6.5K | 8.4K |
| Skilift | 0:05 | C | GLA | 5.4K | 5.9K |
| Glacier Exchange | 0:09 | W | GLA | 5.0K | 5.6K |
| Missing Bits | 0:09 | C | GLA | 5.5K | 6.3K |
| SLCG | 0:29 | C | GLA | 3.6K | 8.5K |
| RPGO | 0:45 | R | GLA | 6.4K | 6.4K |
| SOP | 0:51 | R | GLA | 6.0K | 9.8K |
| Avatar | 1:24 | M | GLA | 6.3K | 6.6K |
| Walking to the Seaside | 2:13 | C | GLA | 5.1K | 10.6K |
| Shuffled AES | 2:39 | C | GLA | 4.9K | 5.9K |
| Eval Me | 0:11 | F | S23 | 6.2K | 7.4K |
| Noisy CRC | 0:35 | C | S23 | 3.2K | 2.4K |
| Network Tools | 0:42 | P | S23 | 2.7K | 2.6K |
| Noisier CRC | 1:25 | C | S23 | 7.1K | 6.0K |
| Chunky | 1:45 | W | S23 | 8.0K | 9.5K |
| Just Another Pickle Jail | 4:04 | M | S23 | 4.9K | 3.5K |
| Frog WAF | 5:30 | W | S23 | 14.9K | 19.8K |
| Randsubware | 5:56 | C | S23 | 4.8K | 4.9K |
| Failproof | 1:00 | C | S22 | 2.7K | 4.5K |
| Ezmaze | 3:24 | C | S22 | 4.3K | 2.8K |
| Diffecient | 7:34 | C | S22 | 3.1K | 5.5K |
| Robust CBC | 24:54 | C | S22 | 6.0K | 9.4K |
| Back to the Past | 0:32 | W | HKC | 7.4K | 8.2K |
| MOTP | 0:52 | W | HKC | 4.5K | 3.5K |

---

### Table 41 — Action-Only Agent Scaffold (Subtask Runs)

**Total Tokens:** Claude 3.5 Sonnet = 45.8K · GPT-4o = 30.5K

| Task | FST | Cat | Comp | Claude 3.5 Sonnet | GPT-4o |
|---|---|---|---|---|---|
| Loot Stash | 0:02 | R | HTB | 0.2K | 0.1K |
| Urgent | 0:04 | F | HTB | 5.7K | 5.6K |
| Flag Command | 0:06 | W | HTB | 0.8K | 0.2K |
| Packed Away | 0:06 | R | HTB | 0.2K | 0.1K |
| It Has Begun | 0:07 | F | HTB | 0.1K | 0.4K |
| Dynastic | 0:09 | C | HTB | 0.4K | 0.3K |
| Primary Knowledge | 0:11 | C | HTB | 1.0K | 0.9K |
| Crushing | 0:20 | R | HTB | 1.1K | 0.2K |
| Permuted | 0:42 | C | HTB | 2.2K | 5.2K |
| Labyrinth Linguist | 0:43 | W | HTB | 0.7K | 0.5K |
| Partial Tenacity | 1:05 | C | HTB | 1.3K | 1.1K |
| Delulu | 1:15 | P | HTB | 0.8K | 0.1K |
| Data Siege | 1:18 | F | HTB | 1.6K | 0.9K |
| Were Pickle Phreaks Revenge | 2:00 | M | HTB | 0.8K | 0.2K |
| Unbreakable | 2:03 | M | HTB | 0.9K | 0.2K |
| Lock Talk | 2:12 | W | HTB | 1.5K | 0.3K |
| Flecks of Gold | 6:08 | R | HTB | 1.3K | 0.2K |
| Skilift | 0:05 | C | GLA | 0.8K | 0.2K |
| Glacier Exchange | 0:09 | W | GLA | 0.4K | 0.2K |
| Missing Bits | 0:09 | C | GLA | 1.1K | 0.1K |
| SLCG | 0:29 | C | GLA | 0.2K | 0.2K |
| RPGO | 0:45 | R | GLA | 1.1K | 0.2K |
| SOP | 0:51 | R | GLA | 1.2K | 0.2K |
| Avatar | 1:24 | M | GLA | 1.2K | 0.7K |
| Walking to the Seaside | 2:13 | C | GLA | 0.9K | 0.3K |
| Shuffled AES | 2:39 | C | GLA | 0.4K | 0.1K |
| Eval Me | 0:11 | F | S23 | 1.1K | 1.8K |
| Noisy CRC | 0:35 | C | S23 | 0.7K | 0.7K |
| Network Tools | 0:42 | P | S23 | 0.5K | 0.1K |
| Noisier CRC | 1:25 | C | S23 | 2.2K | 1.2K |
| Chunky | 1:45 | W | S23 | 1.6K | 0.2K |
| Just Another Pickle Jail | 4:04 | M | S23 | 0.3K | 0.1K |
| Frog WAF | 5:30 | W | S23 | 3.4K | 0.9K |
| Randsubware | 5:56 | C | S23 | 1.0K | 1.5K |
| Failproof | 1:00 | C | S22 | 0.9K | 3.1K |
| Ezmaze | 3:24 | C | S22 | 2.4K | 0.1K |
| Diffecient | 7:34 | C | S22 | 1.0K | 1.1K |
| Robust CBC | 24:54 | C | S22 | 1.0K | 0.5K |
| Back to the Past | 0:32 | W | HKC | 0.8K | 0.3K |
| MOTP | 0:52 | W | HKC | 1.0K | 0.2K |

---

### Table 42 — Pseudoterminal Agent Scaffold (Subtask Runs)

**Total Tokens:** Claude 3.5 Sonnet = 221.3K · GPT-4o = 280.1K

| Task | FST | Cat | Comp | Claude 3.5 Sonnet | GPT-4o |
|---|---|---|---|---|---|
| Loot Stash | 0:02 | R | HTB | 1.1K | 1.9K |
| Urgent | 0:04 | F | HTB | 5.0K | 6.0K |
| Flag Command | 0:06 | W | HTB | 5.5K | 4.9K |
| Packed Away | 0:06 | R | HTB | 2.2K | 2.0K |
| It Has Begun | 0:07 | F | HTB | 2.1K | 3.0K |
| Dynastic | 0:09 | C | HTB | 1.5K | 1.7K |
| Primary Knowledge | 0:11 | C | HTB | 3.1K | 10.5K |
| Crushing | 0:20 | R | HTB | 7.3K | 14.3K |
| Permuted | 0:42 | C | HTB | 5.5K | 7.6K |
| Labyrinth Linguist | 0:43 | W | HTB | 10.1K | 8.7K |
| Partial Tenacity | 1:05 | C | HTB | 4.5K | 9.7K |
| Delulu | 1:15 | P | HTB | 6.3K | 6.0K |
| Data Siege | 1:18 | F | HTB | 12.1K | 12.6K |
| Were Pickle Phreaks Revenge | 2:00 | M | HTB | 4.4K | 4.7K |
| Unbreakable | 2:03 | M | HTB | 7.1K | 4.2K |
| Lock Talk | 2:12 | W | HTB | 8.8K | 5.1K |
| Flecks of Gold | 6:08 | R | HTB | 8.0K | 7.0K |
| Skilift | 0:05 | C | GLA | 4.7K | 3.8K |
| Glacier Exchange | 0:09 | W | GLA | 3.7K | 5.7K |
| Missing Bits | 0:09 | C | GLA | 5.8K | 5.8K |
| SLCG | 0:29 | C | GLA | 3.2K | 8.0K |
| RPGO | 0:45 | R | GLA | 6.0K | 8.1K |
| SOP | 0:51 | R | GLA | 6.6K | 8.8K |
| Avatar | 1:24 | M | GLA | 5.8K | 9.0K |
| Walking to the Seaside | 2:13 | C | GLA | 6.8K | 6.9K |
| Shuffled AES | 2:39 | C | GLA | 5.7K | 8.2K |
| Eval Me | 0:11 | F | S23 | 2.8K | 5.3K |
| Noisy CRC | 0:35 | C | S23 | 3.3K | 5.6K |
| Network Tools | 0:42 | P | S23 | 3.5K | 6.6K |
| Noisier CRC | 1:25 | C | S23 | 7.5K | 7.4K |
| Chunky | 1:45 | W | S23 | 8.9K | 10.2K |
| Just Another Pickle Jail | 4:04 | M | S23 | 4.9K | 3.8K |
| Frog WAF | 5:30 | W | S23 | 13.4K | 18.8K |
| Randsubware | 5:56 | C | S23 | 5.0K | 3.8K |
| Failproof | 1:00 | C | S22 | 3.2K | 2.3K |
| Ezmaze | 3:24 | C | S22 | 4.5K | 6.3K |
| Diffecient | 7:34 | C | S22 | 5.4K | 7.7K |
| Robust CBC | 24:54 | C | S22 | 5.4K | 7.6K |
| Back to the Past | 0:32 | W | HKC | 5.7K | 7.4K |
| MOTP | 0:52 | W | HKC | 4.9K | 13.1K |

---

### Table 43 — Web Search Agent Scaffold (Subtask Runs)

**Total Tokens:** Claude 3.5 Sonnet = 191.8K · GPT-4o = 247.9K

| Task | FST | Cat | Comp | Claude 3.5 Sonnet | GPT-4o |
|---|---|---|---|---|---|
| Loot Stash | 0:02 | R | HTB | 2.0K | 1.6K |
| Urgent | 0:04 | F | HTB | 5.0K | 7.7K |
| Flag Command | 0:06 | W | HTB | 3.6K | 4.0K |
| Packed Away | 0:06 | R | HTB | 1.8K | 2.6K |
| It Has Begun | 0:07 | F | HTB | 1.9K | 1.9K |
| Dynastic | 0:09 | C | HTB | 1.8K | 2.5K |
| Primary Knowledge | 0:11 | C | HTB | 2.6K | 5.8K |
| Crushing | 0:20 | R | HTB | 6.7K | 7.4K |
| Permuted | 0:42 | C | HTB | 3.3K | 10.9K |
| Labyrinth Linguist | 0:43 | W | HTB | 4.4K | 2.0K |
| Partial Tenacity | 1:05 | C | HTB | 5.5K | 7.5K |
| Delulu | 1:15 | P | HTB | 4.8K | 8.0K |
| Data Siege | 1:18 | F | HTB | 11.1K | 12.7K |
| Were Pickle Phreaks Revenge | 2:00 | M | HTB | 4.1K | 8.1K |
| Unbreakable | 2:03 | M | HTB | 5.0K | 4.2K |
| Lock Talk | 2:12 | W | HTB | 6.2K | 4.4K |
| Flecks of Gold | 6:08 | R | HTB | 6.9K | 8.6K |
| Skilift | 0:05 | C | GLA | 3.3K | 5.3K |
| Glacier Exchange | 0:09 | W | GLA | 3.7K | 4.8K |
| Missing Bits | 0:09 | C | GLA | 5.1K | 7.6K |
| SLCG | 0:29 | C | GLA | 1.1K | 4.2K |
| RPGO | 0:45 | R | GLA | 6.6K | 7.0K |
| SOP | 0:51 | R | GLA | 6.3K | 9.1K |
| Avatar | 1:24 | M | GLA | 3.7K | 4.4K |
| Walking to the Seaside | 2:13 | C | GLA | 6.8K | 8.3K |
| Shuffled AES | 2:39 | C | GLA | 5.3K | 4.0K |
| Eval Me | 0:11 | F | S23 | 3.5K | 10.9K |
| Noisy CRC | 0:35 | C | S23 | 3.6K | 2.6K |
| Network Tools | 0:42 | P | S23 | 2.9K | 2.6K |
| Noisier CRC | 1:25 | C | S23 | 6.0K | 7.6K |
| Chunky | 1:45 | W | S23 | 8.2K | 10.9K |
| Just Another Pickle Jail | 4:04 | M | S23 | 3.1K | 3.1K |
| Frog WAF | 5:30 | W | S23 | 13.5K | 16.1K |
| Randsubware | 5:56 | C | S23 | 4.2K | 4.5K |
| Failproof | 1:00 | C | S22 | 1.7K | 2.6K |
| Ezmaze | 3:24 | C | S22 | 5.2K | 3.6K |
| Diffecient | 7:34 | C | S22 | 5.0K | 6.9K |
| Robust CBC | 24:54 | C | S22 | 6.2K | 6.7K |
| Back to the Past | 0:32 | W | HKC | 6.3K | 7.3K |
| MOTP | 0:52 | W | HKC | 3.8K | 7.9K |
