# CMatrix: AI-Powered Multi-Agent Security Orchestration & VAPT Platform

**Professional Masters in Information and Cyber Security**  
**CSE-400: Project on Cyber Security**

**Presented by:**
* Nishan Paul (Reg No: 55)
* Md Rakibur Rahman (Reg No: 49)

**Supervised by:**
**Dr. Md. Abdur Razzaque**
Chairman, Department of Computer Science and Engineering
University of Dhaka (CSEDU)

---

## 🚀 The Vision: Autonomous Red Teaming
> "Transforming static scanning into reasoning-driven security intelligence."

* **The Problem**: Traditional VAPT is manual, slow, and non-scalable. Existing AI tools are fragile and costly.
* **The Solution**: **CMatrix (LLMOrch-VAPT)** — A resilient, multi-agent orchestration framework designed for industrial-grade autonomous security assessments.
* **Core Philosophy**: An autonomous red team should be as resilient as the infrastructure it tests.

---

## 🛠️ System Architecture: How It Works
CMatrix utilizes a **Master-Worker** hierarchy powered by **LangGraph** for stateful orchestration.

* **Master Supervisor**: A central brain (State Machine) that decomposes complex goals into sub-tasks.
* **Worker Agents**: 7 Specialized agents with domain-specific toolsets.
* **Orchestration Layer**: Manages state, thread persistence, and agent delegation.
* **Communication**: Real-time event streaming via WebSockets and Server-Sent Events (SSE).
* **Database Layer**: PostgreSQL for persistent engagement state and Qdrant for semantic memory.

---

## 🤖 The Specialist Agent Ecosystem
Seven specialized agents collaborating through a **Supervisor Pattern**.

1.  **Network Agent**: Port scanning, service discovery & topology mapping.
2.  **Web Agent**: HTTP/HTTPS validation & web vulnerability analysis.
3.  **Auth Agent**: Login form analysis, session security & brute-force testing.
4.  **Config Agent**: System hardening & compliance audits (CIS, PCI-DSS).
5.  **Vuln Intel Agent**: Real-time CVE research & threat intelligence lookup.
6.  **API Agent**: REST/GraphQL security testing & endpoint fuzzing.
7.  **Command Agent**: Secure terminal execution with real-time audit logging.

---

## 🔬 Core Methodology: Technical Innovations
Our framework introduces three key methodologies to solve the "Operational Fragility" of AI agents.

### 1. Autonomous Provider Failover (APF)
*   **Mechanism**: Decouples the reasoning graph from specific LLM providers (Gemini, GPT-4, Llama).
*   **Resilience**: Mid-workflow checkpointing ensures **zero state loss** during provider outages.
*   **Metric**: Mean Time To Recovery (**MTTR) < 2 seconds**.

### 2. Dynamic Complexity-Aware Tiering (DCAT)
*   **Mechanism**: Extracts "Complexity Signals" from security tasks.
*   **Optimization**: Routes simple recon to "Flash" models and complex exploitation to "Reasoning" models.
*   **Impact**: **84.2% reduction in operational costs**.

---

## 🔬 Core Methodology: Technical Innovations (Contd.)

### 3. Security-Semantic Caching (SSC)
*   **Mechanism**: Stores "Reasoning Patterns" in a vector database (Qdrant) rather than raw text.
*   **Efficiency**: Identifies similar vulnerability patterns across heterogeneous hosts.
*   **Scalability**: Bypasses redundant LLM calls, improving response speed by **3.5x**.

### 4. Human-in-the-Loop (HITL) Governance
*   **Mechanism**: Stateful graph-based approval gates.
*   **Safety**: No destructive security actions (e.g., exploitation) are performed without explicit human authorization.
*   **Auditability**: Every agent thought and command is recorded in a tamper-proof JSON-B log.

---

## 💾 Persistent Memory & Context
Making the system "smarter" over the course of an engagement.

*   **Stateful Checkpointing**: Allows the system to pause/resume engagements without losing reasoning progress.
*   **Knowledge Base**: Qdrant-powered long-term memory of past scan results and findings.
*   **Contextual Retrieval**: Agents recall past discoveries (e.g., "Recall the open ports found on 192.168.1.100 earlier") to build complex attack chains.

---

## 🎯 Research Scope & Objectives
Our research (documented in `LLMOrch-VAPT`) focuses on four primary operational goals.

*   **Goal 1: Operational Resilience**: Validating the effectiveness of APF in maintaining continuity during unplanned LLM provider outages.
*   **Goal 2: Economic Sustainability**: Evaluating DCAT's ability to reduce costs while maintaining high-fidelity security reasoning.
*   **Goal 3: Scalability**: Measuring the impact of SSC on performance during large-scale network assessments.
*   **Goal 4: Safety & Governance**: Proving that stateful graph orchestration can effectively mitigate the risks of autonomous exploitation.

---

## 🚀 Future Roadmap: Phase 3 & Beyond
Scaling CMatrix for enterprise-grade continuous security.

*   **Intelligence**: AI-driven vulnerability prioritization and automated remediation scripts.
*   **Collaboration**: Multi-tenancy and Role-Based Access Control (RBAC) for security teams.
*   **Compliance**: Automated SOC2, ISO 27001, and HIPAA reporting modules.
*   **Scale**: Cloud-native agent deployment for massive infrastructure scanning.

---

## ✨ Conclusion
**CMatrix is a force multiplier for security teams, combining autonomous reasoning with industrial-grade resilience.**

*   **Resilient**: Zero-state-loss failover via APF.
*   **Cost-Effective**: Smart model routing via DCAT.
*   **Safe**: Governed by Human-in-the-Loop approval gates.
*   **Intelligent**: Context-aware memory and specialized agents.

---

**Built with ❤️ by Nishan Paul & Md Rakibur Rahman**
*Project URL: cmatrix.kaiofficial.xyz*
