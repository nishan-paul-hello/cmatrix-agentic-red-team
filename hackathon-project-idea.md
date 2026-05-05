# 🛡️ Neutral Cybersecurity Project Ideas for Infinity AI BuildFest

These ideas are developed from first principles, focusing on high-impact cybersecurity challenges within the hackathon's strategic tracks, independent of existing project names or codebases.

---

## 🏥 Idea A: MediVault AI
**Track:** Track 03 — Healthcare (HealthTech)

### 🚩 The Problem
Most hospital management systems (HMS) in Bangladesh lack robust data privacy controls, leaving sensitive patient records vulnerable to unauthorized access and ransomware.

### 🛡️ Cybersecurity Core: **Autonomous Data Privacy & Compliance Auditing**
- **Zero-Trust PHI Access:** An agentic layer that audits every database request to ensure it complies with privacy standards.
- **Anomaly Detection:** Identifies bulk data extraction or unusual access patterns (e.g., a receptionist accessing oncology records at 3 AM).
- **Automated Virtual Patching:** Identifies common vulnerabilities in the HMS and provides an AI-native "guardrail" to block exploits without requiring a full system rewrite.

---

## 🛒 Idea B: LogicShield
**Track:** Track 04 — Online Commerce (E-commerce)

### 🚩 The Problem
E-commerce platforms are frequently targeted by **Business Logic Attacks**—where attackers exploit the "rules" of the site (e.g., price manipulation, coupon abuse, or refund loops) rather than technical bugs like SQL injection.

### 🛡️ Cybersecurity Core: **Autonomous Business Logic Security**
- **Intent Analysis:** Uses AI reasoning to understand if a sequence of actions is a legitimate purchase or a malicious exploit of the checkout logic.
- **Real-time Remediation:** Detects "Impossible Transactions" (e.g., a checkout total lower than the sum of items) and blocks them at the application layer.
- **Fraud Intelligence:** Maps attacker behavior patterns to prevent recurring logic abuse across different user accounts.

---

## 🤝 Idea C: CitizenGuard
**Track:** Track 05 — Social Media / InfoTech

### 🚩 The Problem
Non-tech-savvy citizens are the primary targets of social engineering and phishing (bKash/Nagad scams) within social media community groups.

### 🛡️ Cybersecurity Core: **Predictive Threat Intelligence & Community Defense**
- **Community Threat Intel:** An AI agent that analyzes public message streams to identify emerging scam "scripts" and malicious link propagation.
- **Phishing Verification:** A simple interface where users can forward suspect messages to get a "Risk Score" and a plain-language explanation of the threat.
- **Predator Detection:** Uses NLP to flag accounts exhibiting "predatory" behavior patterns or social engineering techniques in regional languages.

---

## ✅ Conditions Check (All Ideas)
1.  **Presentable:** Each project features high-impact dashboards and real-time "Threat Visualizations" that demo well for judges.
2.  **Cybersecurity Core:** Each project addresses a fundamental security pillar: **Confidentiality** (MediVault), **Integrity** (LogicShield), or **Availability/Safety** (CitizenGuard).
3.  **Hackathon Rules:** 
    - **Localization:** All ideas emphasize support for Bangla and local business contexts.
    - **Explainability:** AI decisions are explained clearly to the end-user.
    - **AI-Native:** Uses Agentic reasoning (LangGraph/MCP) for complex decision-making.
