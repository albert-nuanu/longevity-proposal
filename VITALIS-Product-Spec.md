# VITALIS — Product Specification v0.1

> AI-Powered Digital Health Infrastructure for Human Longevity
> Last updated: February 23, 2026

---

## Table of Contents

1. [Vision & Core Thesis](#1-vision--core-thesis)
2. [System Overview](#2-system-overview)
3. [Digital Twin — Implementation](#3-digital-twin--implementation)
4. [Agent Constellation — Architecture](#4-agent-constellation--architecture)
5. [Consensus Protocol](#5-consensus-protocol)
6. [Data Ingestion Layer](#6-data-ingestion-layer)
7. [Daily Recommendation Engine](#7-daily-recommendation-engine)
8. [Mobile App — Product Spec](#8-mobile-app--product-spec)
9. [Web App — Product Spec](#9-web-app--product-spec)
10. [API & Developer Platform](#10-api--developer-platform)
11. [Security, Privacy & Compliance](#11-security-privacy--compliance)
12. [Technical Stack](#12-technical-stack)
13. [Roadmap & Milestones](#13-roadmap--milestones)

---

## 1. Vision & Core Thesis

### The Problem

Health data is fragmented, static, and reactive. A person's blood work sits in a PDF. Their sleep data lives in Oura. Their training log is in Strava. Their supplements are tracked nowhere. No system connects these signals, reasons across them, or learns over time. The result: people optimize in silos — good sleep but bad nutrition, strong cardio but chronic inflammation.

### The Thesis

**Health is a system, not a collection of metrics.** The only way to optimize a system is to have a unified model of its state, specialized reasoning about each subsystem, and a coordination layer that resolves trade-offs across subsystems.

### The Product

A **Lightweight Digital Twin** (unified health state) + **Agentic AI Constellation** (specialized reasoning) that gives every user:

- A living, versioned health document that evolves with every new data point
- A team of AI health specialists — each with deep domain expertise and a distinct voice
- A daily action plan produced through multi-agent consensus, not generic advice
- Full transparency: every recommendation is traceable to biomarker evidence and agent reasoning

### Core Principles

| Principle | Meaning |
|---|---|
| **Twin = Source of Truth** | All health state lives in the Twin. Agents are stateless. |
| **Event-Sourced** | Nothing is overwritten. Every measurement, recommendation, and decision is an immutable event. |
| **Agent Autonomy + Coordination** | Agents reason independently but must reach consensus before acting. |
| **User Sovereignty** | The user owns their Twin. They can export, delete, or migrate it at any time. |
| **Explain Everything** | Every recommendation links to the biomarker evidence and reasoning chain that produced it. |
| **Start Simple, Compound Over Time** | Value increases with each data point. The Twin gets smarter, not just bigger. |

---

## 2. System Overview

### Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                     │
│  Mobile App (iOS/Android) │ Web App │ API │ Notifications   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION LAYER                       │
│  🧠 Orchestrator Agent                                      │
│  Consensus Engine │ Conflict Resolution │ Daily Scheduler    │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                   AGENT MESSAGE BUS (async)                  │
│  NATS JetStream / Redis Streams                              │
│  Channels: proposals │ challenges │ negotiations │ commits   │
└──┬──────┬──────┬──────┬──────┬──────────────────────────────┘
   │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼
  🔥     🌙     🥬     💪     ⏳
 META   RECV   NUTR   FITN   LONG
   │      │      │      │      │
   └──────┴──────┴──────┴──────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  DIGITAL TWIN (per user)                     │
│  Git-versioned │ Markdown files │ Semantic search (QMD)      │
│  ┌──────────┐ ┌──────────────┐ ┌──────────────────────────┐ │
│  │ Identity │ │ Event Stream │ │ Computed State            │ │
│  └──────────┘ └──────────────┘ └──────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Agent Memory (reasoning, consensus, outcomes)        │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATA INGESTION LAYER                      │
│  Wearable APIs │ Lab OCR │ Manual Entry │ FHIR Import       │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow (Single Cycle)

1. **Ingest** — New data arrives (wearable sync, lab upload, self-report)
2. **Event** — Data is written as an immutable event to the Twin's event stream
3. **Observe** — Relevant agents are notified and read the new event in context
4. **Propose** — Agents generate proposals (score updates, recommendations, alerts)
5. **Consensus** — Orchestrator runs the consensus protocol across all proposals
6. **Commit** — Approved changes are committed to the Twin (new computed state, recommendations)
7. **Surface** — User-facing outputs are generated (notifications, briefing updates, alerts)

---

## 3. Digital Twin — Implementation

### 3.1 Core Concept: Git-Versioned Health State

The Digital Twin is implemented as a **Git repository per user**. Every change to a person's health state is a Git commit. This gives us:

- **Full version history** — time-travel to any point in the user's health journey
- **Branching** — run "what-if" simulations on a branch without affecting the main state
- **Diffing** — see exactly what changed between any two points in time
- **Audit trail** — every commit has an author (which agent or data source), timestamp, and message
- **Export** — the user can clone their Twin at any time (full data portability)

### 3.2 Folder Structure

Each user's Twin is a Git repository with the following structure:

```
twin/
├── identity/
│   ├── profile.md                 # Demographics, height, sex, ethnicity
│   ├── genetics.md                # Key SNPs, ancestry, predispositions
│   ├── goals.md                   # User-set health objectives, ranked
│   └── constraints.md             # Allergies, injuries, meds, diet restrictions
│
├── events/
│   ├── biomarkers/
│   │   ├── 2026-01-15_blood-panel.md      # Full blood work event
│   │   ├── 2026-01-20_cgm-weekly.md       # CGM weekly summary
│   │   ├── 2026-02-01_epigenetic-age.md   # TruDiagnostic result
│   │   └── ...
│   ├── wearables/
│   │   ├── 2026-02-22_daily-oura.md       # Daily Oura dump
│   │   ├── 2026-02-22_daily-whoop.md      # Daily Whoop dump
│   │   └── ...
│   ├── interventions/
│   │   ├── 2026-01-10_started-mg-glycinate.md
│   │   ├── 2026-02-01_started-zone2-protocol.md
│   │   └── ...
│   └── self-reports/
│       ├── 2026-02-22_energy-rating.md
│       ├── 2026-02-22_mood-check.md
│       └── ...
│
├── state/
│   ├── snapshot.md                # Current biomarker values (materialized)
│   ├── scores.md                  # Per-agent domain scores (0-100)
│   ├── biological-age.md          # Composite biological age estimate
│   ├── trends.md                  # Per-biomarker trend vectors
│   └── active-protocols.md        # Currently running interventions
│
├── agents/
│   ├── metabolic/
│   │   ├── latest-assessment.md   # Most recent domain assessment
│   │   ├── reasoning-log.md       # Append-only reasoning history
│   │   └── proposals.md           # Current pending proposals
│   ├── recovery/
│   │   ├── latest-assessment.md
│   │   ├── reasoning-log.md
│   │   └── proposals.md
│   ├── nutrition/
│   │   ├── latest-assessment.md
│   │   ├── reasoning-log.md
│   │   └── proposals.md
│   ├── fitness/
│   │   ├── latest-assessment.md
│   │   ├── reasoning-log.md
│   │   └── proposals.md
│   ├── longevity/
│   │   ├── latest-assessment.md
│   │   ├── reasoning-log.md
│   │   └── proposals.md
│   └── orchestrator/
│       ├── consensus-log.md       # Full conflict/resolution history
│       ├── daily-plans/
│       │   ├── 2026-02-22.md
│       │   ├── 2026-02-23.md
│       │   └── ...
│       └── weekly-reviews/
│           ├── 2026-W08.md
│           └── ...
│
├── recommendations/
│   ├── active.md                  # Currently active recommendations
│   ├── completed.md               # Past recommendations + outcomes
│   └── rejected.md                # User-rejected recommendations + reasons
│
└── meta/
    ├── schema-registry.md         # Biomarker definitions, units, optimal ranges
    ├── data-sources.md            # Connected devices, labs, import history
    └── preferences.md             # Notification settings, agent preferences
```

### 3.3 Markdown File Format

Every file in the Twin follows a consistent markdown structure with YAML frontmatter for machine-readable metadata and human-readable body content.

#### Example: Biomarker Event

```markdown
---
id: evt_20260115_blood_panel_001
type: biomarker_event
source: quest_diagnostics
date: 2026-01-15
confidence: 0.98
tags: [blood-panel, quarterly, comprehensive]
claimed_by: [metabolic, nutrition, longevity, fitness]
---

# Blood Panel — January 15, 2026

## Metabolic Markers
| Marker | Value | Unit | Optimal Range | Status |
|--------|-------|------|---------------|--------|
| Glucose (fasting) | 92 | mg/dL | 72–85 | ⚠ above optimal |
| HbA1c | 5.2 | % | 4.5–5.2 | ✅ optimal |
| Insulin (fasting) | 6.8 | µIU/mL | 2–6 | ⚠ slightly elevated |
| HOMA-IR | 1.54 | — | <1.0 | ⚠ elevated |
| Triglycerides | 78 | mg/dL | <75 | ⚠ borderline |
| ApoB | 82 | mg/dL | <70 | ⚠ above optimal |
| LDL-p | 1050 | nmol/L | <1000 | ⚠ above optimal |

## Inflammation & Immune
| Marker | Value | Unit | Optimal Range | Status |
|--------|-------|------|---------------|--------|
| hs-CRP | 0.8 | mg/L | <0.5 | ⚠ above optimal |
| Homocysteine | 9.2 | µmol/L | <7 | ⚠ elevated |
| Ferritin | 28 | ng/mL | 40–100 | ⚠ below optimal |
| Vitamin D | 48 | ng/mL | 50–80 | ⚠ borderline |

## Hormonal
| Marker | Value | Unit | Optimal Range | Status |
|--------|-------|------|---------------|--------|
| Total Testosterone | 620 | ng/dL | 600–900 | ✅ low-optimal |
| Free Testosterone | 14.2 | pg/mL | 15–25 | ⚠ below optimal |
| TSH | 2.1 | mIU/L | 0.5–2.5 | ✅ optimal |
| Cortisol (AM) | 18.5 | µg/dL | 10–18 | ⚠ borderline high |

## Raw Data
Source PDF archived at: `events/biomarkers/raw/2026-01-15_quest.pdf`
```

#### Example: Agent Assessment

```markdown
---
id: assess_metabolic_20260115
agent: metabolic
date: 2026-01-15
trigger: evt_20260115_blood_panel_001
domain_score: 62
previous_score: 68
trend: declining
confidence: 0.85
---

# Metabolic Assessment — January 15, 2026

## Score: 62/100 (↓ from 68)

### Key Findings

Fasting glucose and insulin are both trending up, pushing HOMA-IR to 1.54.
This indicates early insulin resistance is developing. ApoB at 82 confirms
the lipid pattern — this is a metabolic syndrome precursor pattern.

### Root Cause Analysis

1. **Primary driver**: Post-dinner glucose spikes (CGM data shows avg 
   +48 mg/dL in the 8-10pm window over the past 30 days)
2. **Contributing factor**: Late eating window — 65% of caloric intake 
   occurs after 6pm (from nutrition agent's food log analysis)
3. **Possible factor**: Cortisol is borderline high, which drives 
   glucose independently of diet

### Proposals

1. **[PRIORITY: 8/10]** Shift eating window earlier — last meal by 7pm
   - Evidence: CGM spikes correlate with meals after 7:30pm
   - Expected impact: HOMA-IR reduction of 0.2–0.4 within 6 weeks
   - Conflicts with: Nutrition (may reduce total nutrient intake window)

2. **[PRIORITY: 6/10]** Add 20-min post-dinner walk
   - Evidence: Days with post-meal movement show 30% lower glucose peaks
   - Expected impact: Immediate glucose spike reduction
   - Conflicts with: None

3. **[PRIORITY: 5/10]** Consider berberine 500mg before largest meal
   - Evidence: Meta-analysis shows 15-20% fasting glucose reduction
   - Expected impact: Glucose and HbA1c improvement in 8-12 weeks
   - Conflicts with: Nutrition (gut microbiome impact needs monitoring)
```

#### Example: Daily Plan

```markdown
---
id: plan_20260223
date: 2026-02-23
orchestrator_version: 0.3.1
consensus_round: 2
twin_score: 78
conflicts_resolved: 1
---

# Daily Plan — Monday, February 23, 2026

## Morning Pulse
- **Twin Score**: 78/100
- **Recovery**: 82% (good — HRV 58ms, RHR 52bpm)
- **Sleep**: 7.4h (6.1h effective — 82% efficiency)
- **Alert**: None

## Today's 3 Priorities

### 1. 💪 30-minute Zone 2 walk after lunch
**Source**: Fitness Agent (priority 7/10)
**Why**: VO2max estimate has been flat for 3 weeks at 42.1 ml/kg/min. 
Aerobic base needs consistent Zone 2 stimulus. Recovery score is green — 
training load is safe to add today.
**Target HR**: 118–132 bpm (Zone 2 for your profile)
**Consensus**: Recovery approved. No conflicts.

### 2. 🥬 Add pumpkin seeds (30g) to dinner
**Source**: Nutrition Agent (priority 6/10)
**Why**: Ferritin dropped from 35 to 28 ng/mL over 3 months. Below optimal 
threshold of 40. Dietary iron via pumpkin seeds preferred over supplement — 
your gut inflammation markers (hs-CRP 0.8) suggest supplement absorption 
would be suboptimal. 30g pumpkin seeds provides ~4.2mg iron + magnesium bonus.
**Consensus**: Metabolic approved (no meal timing conflict at dinner).

### 3. 🌙 Blue light cutoff by 9:30pm
**Source**: Recovery Agent (priority 7/10)
**Why**: Sleep onset latency averaged 34 minutes this week (target: <20). 
Oura data shows the 3 nights with earliest screen-off had 12-minute faster 
onset. This is the highest-leverage sleep intervention available right now.
**Consensus**: No conflicts. Longevity agent endorsed — sleep quality is 
currently the #1 driver of your biological age improvement.

## Conflict Resolution Log
**Resolved**: Metabolic proposed 16:8 fasting starting today. Recovery 
challenged — cortisol is borderline (18.5 µg/dL) and extended fasting 
would add stress. Metabolic counter-proposed 14:10. Recovery accepted 
with condition: monitor HRV for 7 days. If HRV drops >10%, revert.
**Decision**: 14:10 approved on trial basis.

## Carry-Forward
- Yesterday's pumpkin seed recommendation was not followed (user skipped). 
  Re-prioritized today.
- Zone 2 streak: 3/4 days this week. One more day hits weekly target.
```

### 3.4 Git Versioning Strategy

#### Commit Types

| Prefix | Meaning | Author | Example |
|--------|---------|--------|---------|
| `data:` | New data ingested | System | `data: oura daily sync 2026-02-23` |
| `event:` | Biomarker event recorded | System / User | `event: blood panel uploaded` |
| `assess:` | Agent assessment updated | Agent name | `assess: metabolic score updated 68→62` |
| `plan:` | Daily plan generated | Orchestrator | `plan: daily briefing 2026-02-23` |
| `consensus:` | Consensus resolved | Orchestrator | `consensus: fasting protocol conflict resolved` |
| `user:` | User action | User | `user: marked recommendation as completed` |
| `protocol:` | Intervention started/stopped | Agent / User | `protocol: started zone2 training block` |
| `state:` | Computed state updated | System | `state: snapshot materialized after blood panel` |

#### Branching Strategy

```
main                 ← The canonical Twin state
  │
  ├── simulation/fasting-18-6     ← "What if I did 18:6 fasting?"
  │     Agent runs projections on this branch
  │     User reviews simulated outcomes
  │     Merge or discard
  │
  ├── simulation/drop-supplement-x  ← "What if I stopped taking X?"
  │
  └── archive/2025-Q4              ← Quarterly snapshots for long-term comparison
```

#### Commit Frequency

| Trigger | Frequency | Files Changed |
|---------|-----------|---------------|
| Wearable daily sync | 1x/day | `events/wearables/`, `state/snapshot.md` |
| Self-report | On-demand | `events/self-reports/` |
| Blood panel upload | ~4x/year | `events/biomarkers/`, `state/`, `agents/*/latest-assessment.md` |
| Daily plan generation | 1x/day | `agents/orchestrator/daily-plans/`, `recommendations/active.md` |
| Agent assessment | After data events | `agents/[name]/latest-assessment.md` |
| Consensus round | 1x/day + on-demand | `agents/orchestrator/consensus-log.md` |
| User feedback | On-demand | `recommendations/`, `agents/*/reasoning-log.md` |

### 3.5 Semantic Search with QMD (Queryable Markdown)

Every markdown file in the Twin is indexed for semantic search. This enables agents (and users) to ask natural-language questions against the full Twin history.

#### Indexing Pipeline

```
MD file committed → Extract YAML frontmatter (structured metadata)
                  → Extract body text (unstructured content)
                  → Generate embedding (text-embedding-3-small or local model)
                  → Store in vector index with metadata filters
```

#### Index Structure

```
Vector Store (per user Twin):
├── Metadata fields (filterable):
│   ├── type: biomarker_event | assessment | plan | intervention | ...
│   ├── agent: metabolic | recovery | nutrition | fitness | longevity
│   ├── date: ISO date
│   ├── tags: [array of tags]
│   ├── domain_score: number (if applicable)
│   └── source: quest | oura | whoop | manual | ...
│
└── Vector embedding of full document content
```

#### Query Examples

| Natural Language Query | Metadata Filter | Purpose |
|---|---|---|
| "What happened to my ferritin over the last year?" | `type=biomarker_event`, `tags contains ferritin` | Biomarker trend analysis |
| "Why did Recovery recommend against fasting?" | `agent=recovery`, `type=assessment` | Agent reasoning audit |
| "Show me all conflicts between Metabolic and Recovery" | `type=consensus` | Conflict pattern analysis |
| "What interventions improved my sleep onset?" | `type=intervention`, `tags contains sleep` | Protocol effectiveness |
| "What was my biological age 6 months ago?" | `type=assessment`, `agent=longevity` | Longevity tracking |

#### Agent Query Access

Each agent has a `query_twin(query, filters)` tool that:

1. Converts the natural language query to an embedding
2. Applies metadata filters to narrow the search space
3. Returns top-K relevant markdown documents with context
4. Agent uses the retrieved documents as context for its reasoning

This is essentially **RAG (Retrieval-Augmented Generation) over the user's personal health history**.

### 3.6 Computed State Materialization

The `state/` folder contains derived views that are recomputed after each significant event. These are never the source of truth — they're convenience materializations.

#### Materialization Triggers

| File | Recomputed When | Logic |
|------|----------------|-------|
| `snapshot.md` | After any biomarker event | Latest value per marker from event stream |
| `scores.md` | After any agent assessment | Aggregate of all agent domain scores |
| `biological-age.md` | After longevity agent assessment | Composite from aging clock data + agent scores |
| `trends.md` | After any biomarker event | Per-marker: direction (↑↓→), velocity, confidence |
| `active-protocols.md` | After any intervention event | Filter interventions where `stopped` is null |

---

## 4. Agent Constellation — Architecture

### 4.1 Agent Design Principles

Every agent follows the same structural pattern from the foundational AI agent architecture (Cell Reports Medicine, 2025): **Plan → Act → Reflect → Remember**.

```
┌────────────────────────────────────────────────────┐
│                   AGENT LIFECYCLE                    │
│                                                      │
│  ┌──────┐    ┌─────┐    ┌─────────┐    ┌────────┐  │
│  │ PLAN │ →  │ ACT │ →  │ REFLECT │ →  │REMEMBER│  │
│  └──────┘    └─────┘    └─────────┘    └────────┘  │
│     │           │           │              │        │
│  Read Twin   Generate   Evaluate       Write to     │
│  + Context   Proposals  Outcomes       Agent Memory  │
│                                                      │
└────────────────────────────────────────────────────┘
```

- **Plan**: Read relevant Twin state, identify what changed, determine what needs attention
- **Act**: Generate proposals (score updates, recommendations, alerts)
- **Reflect**: After user follows/ignores recommendation, evaluate outcome against prediction
- **Remember**: Write reasoning chain and outcome to the Twin's agent memory layer

### 4.2 Agent Roster

#### 🔥 Metabolic Agent

| Attribute | Detail |
|-----------|--------|
| **Domain** | Blood sugar, insulin sensitivity, lipids, thyroid, energy metabolism |
| **Reads from Twin** | `events/biomarkers/` (glucose, HbA1c, insulin, lipids, thyroid), `events/wearables/` (CGM data), `events/self-reports/` (energy ratings), `agents/nutrition/latest-assessment.md` |
| **Writes to Twin** | `agents/metabolic/latest-assessment.md`, `agents/metabolic/reasoning-log.md`, proposes to `state/scores.md` |
| **Voice** | Direct, numbers-driven. Speaks in cause→effect chains. Quantifies everything. |
| **Update triggers** | CGM daily sync, blood panel upload, meal timing logs |
| **Key metrics** | HOMA-IR, glucose variability (CV%), ApoB, TG/HDL ratio, fasting insulin |
| **Known tensions** | Nutrition (meal timing vs. nutrient density), Recovery (fasting stress vs. cortisol) |

#### 🌙 Recovery Agent

| Attribute | Detail |
|-----------|--------|
| **Domain** | Sleep architecture, HRV, stress response, cortisol, autonomic balance |
| **Reads from Twin** | `events/wearables/` (sleep stages, HRV, RHR), `events/biomarkers/` (cortisol, DHEA), `events/self-reports/` (energy, stress), `agents/fitness/latest-assessment.md` |
| **Writes to Twin** | `agents/recovery/latest-assessment.md`, `agents/recovery/reasoning-log.md` |
| **Voice** | Calm, protective. The system's brake. Prioritizes rest and recovery. |
| **Update triggers** | Daily wearable sync (primary), cortisol lab results, subjective stress reports |
| **Key metrics** | HRV (rMSSD), sleep onset latency, deep sleep %, REM %, RHR trend, cortisol:DHEA ratio |
| **Known tensions** | Fitness (training load vs. recovery debt), Metabolic (fasting duration vs. cortisol) |
| **Special role** | **Safety override** — Recovery agent can veto any proposal that would worsen recovery when HRV is below the user's baseline by >15% |

#### 🥬 Nutrition Agent

| Attribute | Detail |
|-----------|--------|
| **Domain** | Micronutrients, gut health, diet composition, supplementation, anti-inflammation |
| **Reads from Twin** | `events/biomarkers/` (ferritin, B12, D3, Mg, Zn, folate, hs-CRP, homocysteine), `events/self-reports/` (food logs), `identity/genetics.md` (SNPs like MTHFR, VDR), `identity/constraints.md` (allergies, diet restrictions) |
| **Writes to Twin** | `agents/nutrition/latest-assessment.md`, `agents/nutrition/reasoning-log.md`, proposes to `events/interventions/` |
| **Voice** | Thorough, educational. Explains the "why" behind every recommendation. |
| **Update triggers** | Blood panel uploads (nutrient markers), food log entries, supplement changes |
| **Key metrics** | Ferritin, vitamin D, B12, folate, Mg RBC, Zn, omega-3 index, hs-CRP, homocysteine |
| **Known tensions** | Metabolic (meal timing vs. nutrient absorption windows), Fitness (protein timing vs. gut load) |

#### 💪 Fitness Agent

| Attribute | Detail |
|-----------|--------|
| **Domain** | Exercise programming, strength, cardiovascular fitness, mobility, body composition |
| **Reads from Twin** | `events/wearables/` (steps, HR zones, training sessions), `events/biomarkers/` (testosterone, IGF-1, CK), `state/snapshot.md` (body composition), `agents/recovery/latest-assessment.md` |
| **Writes to Twin** | `agents/fitness/latest-assessment.md`, `agents/fitness/reasoning-log.md` |
| **Voice** | Motivating but data-honest. Celebrates progress, flags gaps objectively. |
| **Update triggers** | Daily activity sync, body composition updates, performance lab results |
| **Key metrics** | VO2max estimate, training load (acute:chronic ratio), grip strength, Zone 2 hours/week, lean mass trend |
| **Known tensions** | Recovery (training stimulus vs. recovery capacity), Nutrition (caloric deficit vs. performance) |

#### ⏳ Longevity Agent

| Attribute | Detail |
|-----------|--------|
| **Domain** | Biological age, aging clocks, systemic inflammation, oxidative stress, long-term trajectory |
| **Reads from Twin** | `agents/*/latest-assessment.md` (ALL agent scores), `events/biomarkers/` (epigenetic tests, inflammatory panel, telomeres), `state/scores.md`, `state/trends.md` |
| **Writes to Twin** | `agents/longevity/latest-assessment.md`, `state/biological-age.md` |
| **Voice** | Big-picture, strategic. The "advisor to the board." Thinks in years, not days. |
| **Update triggers** | Epigenetic age tests (quarterly), monthly computed score from other agents |
| **Key metrics** | Biological age delta, pace of aging (DunedinPACE), GrimAge, hs-CRP trend, all-cause mortality risk estimate |
| **Known tensions** | None directly — synthesizes all others. Has **veto power** over short-term optimizations that pose long-term risks. |
| **Special role** | **Strategic override** — Can flag when an agent's recommendation optimizes a single metric at the expense of systemic health |

#### 🧠 Orchestrator Agent

| Attribute | Detail |
|-----------|--------|
| **Domain** | Consensus coordination, conflict resolution, daily planning, user communication |
| **Reads from Twin** | Everything — full Twin access for context |
| **Writes to Twin** | `agents/orchestrator/consensus-log.md`, `agents/orchestrator/daily-plans/`, `recommendations/active.md`, `state/scores.md` (final twin score) |
| **Voice** | Concise, prioritizing. Never overwhelming. Translates complexity into clarity. |
| **Update triggers** | After every consensus round, daily plan generation |
| **Role** | NOT a domain expert. Does not generate health recommendations. Only coordinates, resolves, and presents. |

### 4.3 Agent Handoff Protocol

Agents don't directly communicate. All coordination happens through the **message bus** and the **Twin state**. However, there are defined handoff patterns:

#### Handoff Types

| Type | Description | Example |
|------|-------------|---------|
| **Referral** | Agent suggests user talk to another agent | Nutrition says: "This looks like a cortisol issue — Recovery has more context" |
| **Data Request** | Agent needs data owned by another agent's domain | Fitness asks: "What was the protein intake timing this week?" → reads Nutrition's food log analysis |
| **Challenge** | Agent objects to another agent's proposal | Recovery challenges Fitness's training volume increase |
| **Endorsement** | Agent supports another agent's proposal | Longevity endorses Recovery's sleep protocol |
| **Escalation** | Agent flags an issue to the Orchestrator that requires user input | Metabolic flags: "Conflicting glucose data from CGM and lab — user needs to verify" |

#### Handoff Message Format

```yaml
handoff:
  id: hoff_20260223_001
  from: nutrition
  to: recovery
  type: referral
  context: "User asked about persistent fatigue despite good nutrition. 
            All nutrient levels are in optimal range. Suspect sleep quality 
            or HRV issue."
  twin_refs:
    - agents/nutrition/latest-assessment.md
    - events/biomarkers/2026-01-15_blood-panel.md
  user_visible: true
  user_message: "I've checked your nutrition — everything looks solid. 
                 Let me bring in your Recovery specialist to look at 
                 your sleep and stress data."
```

### 4.4 Agent System Prompts (Structure)

Each agent runs as an LLM call with a structured system prompt. The prompt template:

```
You are the {AGENT_NAME} Agent in the Vitalis health platform.

## Your Domain
{DOMAIN_DESCRIPTION}

## Your Voice
{PERSONALITY_DESCRIPTION}

## Your Rules
1. You ONLY make recommendations within your domain.
2. You ALWAYS cite specific biomarker evidence from the Twin.
3. You NEVER contradict established medical consensus.
4. If a question falls outside your domain, you REFER to the appropriate agent.
5. Every recommendation must include: expected impact, evidence, confidence level, and potential conflicts with other agents.
6. You are aware of the user's goals (from identity/goals.md) and constraints (from identity/constraints.md).

## Current Twin Context
{RELEVANT_TWIN_FILES_INJECTED_HERE}

## Recent Consensus History
{LAST_3_CONSENSUS_ROUNDS}

## Your Task
{SPECIFIC_TASK: assess | propose | challenge | respond_to_user}
```

---

## 5. Consensus Protocol

### 5.1 The 6-Step Cycle

```
OBSERVE → PROPOSE → CHALLENGE → NEGOTIATE → RESOLVE → COMMIT
```

| Step | Who | What | Duration |
|------|-----|------|----------|
| 1. Observe | All domain agents | Read latest Twin state independently | Parallel, ~5s |
| 2. Propose | All domain agents | Submit 1-3 proposals with evidence | Parallel, ~10s |
| 3. Challenge | All domain agents | Review others' proposals, flag conflicts | Parallel, ~10s |
| 4. Negotiate | Conflicting agents | Exchange evidence, propose compromises (max 2 rounds) | Sequential, ~15s |
| 5. Resolve | Orchestrator + Longevity | Final decisions using resolution rules | ~5s |
| 6. Commit | System | Write to Twin, update state, queue user-facing outputs | ~3s |

**Total cycle time**: ~45-60 seconds

### 5.2 Resolution Rules (Priority Order)

1. **Safety First** — Recovery agent's medical/safety concerns always win. If HRV is critically low or cortisol is dangerously high, no other agent can override.
2. **Longevity Veto** — The Longevity agent can veto any proposal that trades long-term health for short-term optimization.
3. **Goal Alignment** — When safety is not at stake, the user's stated goals (from `identity/goals.md`) break ties.
4. **Evidence Strength** — Biomarker-backed proposals beat heuristic-based ones. Recent data beats old data.
5. **Historical Success** — If a similar recommendation worked before (from `recommendations/completed.md`), it gets a boost.
6. **User Preference** — If the user has consistently ignored a type of recommendation, deprioritize it (but don't stop suggesting if clinically important).

### 5.3 Conflict Categories

| Category | Example | Resolution Pattern |
|----------|---------|-------------------|
| **Timing** | Metabolic wants fasting, Recovery wants eating before bed for sleep | Compromise on window duration |
| **Intensity** | Fitness wants to increase load, Recovery says not ready | Modify intensity, not frequency |
| **Priority** | Nutrition wants supplement, Metabolic wants dietary change for same marker | User preference + evidence comparison |
| **Risk** | Agent A's recommendation could worsen Agent B's domain metric | Longevity agent adjudicates based on systemic impact |

---

## 6. Data Ingestion Layer

### 6.1 Supported Data Sources (MVP)

| Source | Type | Frequency | Integration Method |
|--------|------|-----------|-------------------|
| **Oura Ring** | Sleep, HRV, activity, temperature | Daily auto-sync | OAuth2 API |
| **Apple Health** | Steps, HR, workouts, sleep | Daily auto-sync | HealthKit |
| **Whoop** | Strain, recovery, sleep | Daily auto-sync | OAuth2 API |
| **CGM (Levels/Dexcom)** | Continuous glucose | Real-time / hourly | API / Bluetooth |
| **Blood work (upload)** | Lab results | Manual, ~4x/year | Photo OCR + manual confirm |
| **Blood work (API)** | Lab results | Auto, ~4x/year | Quest/Labcorp API (future) |
| **Epigenetic tests** | Biological age | Manual, ~2x/year | CSV/PDF upload |
| **Food logs** | Meals, macros, timing | Manual / photo | Photo AI + manual |
| **Self-reports** | Energy, mood, symptoms | Manual, daily | In-app quick entries |
| **FHIR import** | EHR data | Manual, on-demand | FHIR R4 Patient bundle |

### 6.2 Ingestion Pipeline

```
Raw Input (photo, PDF, API response, HealthKit data)
    │
    ▼
┌──────────────────────┐
│ Normalization Engine  │  Convert to internal schema
│ - Unit conversion     │  (mg/dL, nmol/L, etc.)
│ - Source tagging      │  
│ - Confidence scoring  │  (OCR = 0.85, API = 0.99)
│ - Deduplication       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Schema Validation     │  Check against schema-registry.md
│ - Known marker?       │  
│ - Value in sane range?│  (glucose 500 → flag for review)
│ - Units match?        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Event Creation        │  Create markdown event file
│ - Generate event ID   │  
│ - Write to events/    │
│ - Git commit          │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Agent Notification    │  Notify relevant agents
│ - Route by marker     │  (glucose → Metabolic)
│   domain mapping      │  (ferritin → Nutrition)
│ - Trigger assessment  │
└──────────────────────┘
```

### 6.3 Lab OCR Processing

For photo/PDF uploads of blood work:

1. **Image preprocessing** — deskew, contrast enhancement, crop
2. **OCR extraction** — extract text using vision model (GPT-4o / Claude vision)
3. **Structured parsing** — LLM extracts marker/value/unit triples
4. **Validation** — cross-check against known marker names and sane ranges
5. **User confirmation** — present extracted values for user to verify/correct
6. **Event creation** — once confirmed, create biomarker event and commit to Twin

---

## 7. Daily Recommendation Engine

### 7.1 Pipeline Schedule

| Time | Stage | Description |
|------|-------|-------------|
| 02:00 | INGEST | Finalize previous day's wearable data. Close any pending data events. |
| 02:15 | OBSERVE | All 5 domain agents read Twin independently. Compute updated domain scores. |
| 02:30 | PROPOSE | Each agent submits up to 3 proposals to the message bus. |
| 02:45 | CONSENSUS | Orchestrator runs the 6-step consensus protocol. |
| 03:00 | SYNTHESIZE | Top 3 actions selected from approved proposals. |
| 03:15 | GENERATE | Morning briefing markdown generated and committed to Twin. |
| 03:30 | COMMIT | State materialization. Briefing queued for push notification. |
| ~wake | DELIVER | Push notification triggers. User opens app. |

### 7.2 Recommendation Scoring

Each proposal is scored on a weighted composite:

```
final_score = (
    impact_score × 0.30        # Expected biomarker improvement
  + urgency_score × 0.25       # How time-sensitive is this?
  + evidence_score × 0.20      # Strength of supporting data
  + goal_alignment × 0.15      # Alignment with user's stated goals
  + adherence_likelihood × 0.10 # Based on user's history of following similar recs
)
```

### 7.3 Anti-Overwhelm Rules

- **Max 3 new recommendations per day** (the Orchestrator enforces this hard cap)
- **Max 1 recommendation per agent** in any single briefing (prevents one agent dominating)
- **Carry-forward rule** — if a user ignores a recommendation for 3 days, escalate it once, then deprioritize (unless it's a safety concern)
- **Novelty requirement** — at least 1 of the 3 daily recommendations must be different from yesterday's
- **Difficulty gradient** — if user adherence is below 50%, simplify recommendations (smaller asks)

---

## 8. Mobile App — Product Spec

### 8.1 Platform

- **iOS** (SwiftUI, iOS 16+) — primary
- **Android** (Kotlin, Jetpack Compose) — secondary launch
- React Native considered and rejected — native needed for HealthKit/Health Connect depth

### 8.2 Core Screens

#### Home / Morning Briefing

The primary screen. Designed for a 30-second morning check-in.

```
┌────────────────────────────────┐
│  Good morning ☀️               │
│  Monday, Feb 23                │
│                                │
│  ┌────────────────────────┐   │
│  │  TWIN SCORE    78      │   │
│  │  Recovery 82%  │  ↑3   │   │
│  │  Sleep 7.4h    │  →    │   │
│  └────────────────────────┘   │
│                                │
│  Today's Focus                 │
│                                │
│  ┌────────────────────────┐   │
│  │ 💪 Zone 2 walk, 30min  │   │
│  │    after lunch          │   │
│  │    via Fitness · tap why│   │
│  │                    [ ]  │   │
│  ├────────────────────────┤   │
│  │ 🥬 Pumpkin seeds at    │   │
│  │    dinner (30g)         │   │
│  │    via Nutrition · why  │   │
│  │                    [ ]  │   │
│  ├────────────────────────┤   │
│  │ 🌙 Screens off 9:30pm  │   │
│  │    via Recovery · why   │   │
│  │                    [ ]  │   │
│  └────────────────────────┘   │
│                                │
│  ──────────────────────────   │
│  Conflict resolved today:      │
│  Fasting 14:10 (not 18:6)     │
│  Recovery > Metabolic · detail │
│                                │
│  [🔥] [🌙] [🥬] [💪] [⏳]     │
│          Agent Bar              │
└────────────────────────────────┘
```

#### Agent Chat

Tap any agent emoji to open a domain-scoped conversation.

```
┌────────────────────────────────┐
│  ← 🔥 Metabolic Agent          │
│  ─────────────────────────────  │
│                                 │
│  Your metabolic score is 62,    │
│  down from 68 last month.       │
│  Main driver: HOMA-IR moved     │
│  from 1.2 to 1.54.              │
│                                 │
│  [User]: Why is my glucose      │
│  still high if I'm eating       │
│  better?                         │
│                                 │
│  Looking at your CGM data,      │
│  your daytime glucose is         │
│  actually improved — avg 94      │
│  vs. 101 last month. The         │
│  issue is your evening window:   │
│  meals after 7:30pm show a 48    │
│  mg/dL average spike vs. 28      │
│  for earlier meals. Your body    │
│  processes glucose less           │
│  efficiently later in the day.   │
│                                 │
│  Want me to show the CGM         │
│  overlay? Or should I bring      │
│  in Nutrition to look at what    │
│  you're eating in that window?   │
│                                 │
│  [Show CGM] [Ask Nutrition]      │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Message Metabolic...      │  │
│  └───────────────────────────┘  │
└────────────────────────────────┘
```

#### Lab Upload

```
┌────────────────────────────────┐
│  ← Upload Blood Work            │
│  ─────────────────────────────  │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │    📷  Take Photo         │  │
│  │    📄  Upload PDF         │  │
│  │    ✏️  Enter Manually     │  │
│  │                           │  │
│  └───────────────────────────┘  │
│                                 │
│  After upload:                  │
│                                 │
│  We found 32 markers.           │
│  Please verify:                 │
│                                 │
│  Glucose (fasting)  92 mg/dL ✓  │
│  HbA1c              5.2%    ✓  │
│  Insulin             6.8    ✓  │
│  [... scrollable list ...]     │
│                                 │
│  Agents processing:             │
│  🔥 claiming 8 markers...      │
│  🥬 claiming 12 markers...     │
│  ⏳ claiming 6 markers...      │
│  💪 claiming 4 markers...      │
│  🌙 claiming 2 markers...      │
│                                 │
│  [Confirm & Process]            │
└────────────────────────────────┘
```

#### Twin Dashboard (Deep Dive)

```
┌────────────────────────────────┐
│  ← Your Twin                    │
│  ─────────────────────────────  │
│                                 │
│  Biological Age: 34.2 (chrono: 37)
│  Pace of Aging: 0.91 years/year │
│  Twin Score: 78/100             │
│                                 │
│  System Scores                  │
│  ┌────────────────────────┐    │
│  │ 🔥 Metabolic     62 ▼ │    │
│  │ 🌙 Recovery      85 ▲ │    │
│  │ 🥬 Nutrition     71 → │    │
│  │ 💪 Fitness       78 ▲ │    │
│  │ ⏳ Longevity     82 ▲ │    │
│  └────────────────────────┘    │
│                                 │
│  Active Protocols (3)           │
│  · Zone 2 block (week 3/8)     │
│  · 14:10 fasting (trial, day 2)│
│  · Mg glycinate 400mg/night    │
│                                 │
│  [View Full Timeline]           │
│  [Export My Twin]               │
└────────────────────────────────┘
```

### 8.3 Interaction Patterns

| Interaction | Screen | Frequency |
|-------------|--------|-----------|
| Morning check-in | Home / Briefing | Daily |
| Mark recommendation done/skip | Home | Daily |
| Quick self-report (energy, mood) | Home (swipe up) | Daily |
| Chat with specific agent | Agent Chat | 2-3x/week |
| Upload lab results | Lab Upload | ~4x/year |
| Review weekly summary | Weekly Review (push Sunday) | Weekly |
| Deep dive into Twin | Twin Dashboard | Monthly |
| Export data | Settings | On-demand |

### 8.4 Notification Strategy

| Notification | Timing | Content |
|--------------|--------|---------|
| Morning briefing ready | User's typical wake time | "Your daily plan is ready. Twin score: 78" |
| Recommendation reminder | Contextual (e.g., 12:30pm for "walk after lunch") | "Time for your Zone 2 walk! 💪 30 min, HR 118-132" |
| Evening wind-down | 30 min before target screen-off time | "🌙 Recovery says screens off at 9:30 tonight" |
| Weekly review ready | Sunday 7pm | "Your week in review — 3 out of 4 Zone 2 sessions hit" |
| New lab results processed | After lab upload processing completes | "Your blood panel is analyzed. 3 agents have updates" |
| Alert (rare) | Immediate | "⚠ HRV dropped 22% — Recovery agent flagged this" |

---

## 9. Web App — Product Spec

### 9.1 Purpose

The web app serves a different role than the mobile app. Mobile is for daily interaction; **web is for exploration, deep analysis, and Twin management**.

### 9.2 Web-Only Features

| Feature | Description |
|---------|-------------|
| **Twin Explorer** | Full file-browser view of the Twin's Git structure. View any file, any commit, any diff. |
| **Timeline View** | Horizontal timeline of all events, color-coded by type. Zoom from years to days. |
| **Biomarker Charts** | Interactive charts for any biomarker over time, with agent annotation overlays. |
| **Consensus Viewer** | Visual replay of any consensus round — see which agents proposed what, who challenged whom, and how the Orchestrator resolved it. |
| **Simulation Lab** | Create "what-if" branches on the Twin. Ask agents: "What would happen if I started rapamycin?" or "What if I doubled my Zone 2?" |
| **Protocol Builder** | Design and schedule multi-week intervention protocols with agent input. |
| **Report Generator** | Generate shareable PDF reports for clinicians (FHIR-compatible export included). |
| **Data Import/Export** | Bulk import from other platforms (InsideTracker, Function Health). Full Twin export as Git repo or JSON bundle. |
| **Schema Editor** | Add custom biomarker definitions to the Twin's schema registry. |

### 9.3 Web App Architecture

- **Framework**: Next.js 14+ (App Router)
- **Rendering**: SSR for authenticated pages, ISR for public content
- **State**: Zustand (lightweight, no Redux overhead)
- **Charts**: D3.js for biomarker timelines (custom, not chart library)
- **Real-time**: WebSocket for live consensus replay and agent chat
- **Auth**: Clerk or Auth0 (social login + magic link)
- **Design system**: Custom (dark theme, monospace-forward, data-dense)

### 9.4 Key Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Dashboard | Twin score, agent scores, today's plan, alerts |
| `/briefing` | Morning Briefing | Same as mobile Home, optimized for desktop |
| `/agents/:name` | Agent Chat | Full-page agent conversation with Twin context sidebar |
| `/twin` | Twin Explorer | File browser + Git log + diff viewer |
| `/twin/timeline` | Event Timeline | All events on a zoomable horizontal timeline |
| `/twin/biomarkers/:id` | Biomarker Detail | Single biomarker chart + trend + agent annotations |
| `/twin/protocols` | Protocol Manager | Active + past protocols, effectiveness scores |
| `/consensus` | Consensus Log | Browsable history of all consensus rounds |
| `/consensus/:id` | Consensus Detail | Visual replay of a specific round |
| `/simulate` | Simulation Lab | Branch creation, what-if scenarios |
| `/upload` | Data Import | Lab upload, bulk import, FHIR import |
| `/export` | Data Export | Full Twin download, clinical report generation |
| `/settings` | Settings | Profile, connected devices, notification prefs, agent tuning |

---

## 10. API & Developer Platform

### 10.1 API Design

RESTful + WebSocket. All endpoints require authentication. The API is the same backend serving both mobile and web apps.

#### Core Endpoints

```
# Twin State
GET    /api/twin/snapshot              # Current computed state
GET    /api/twin/scores                # All agent scores
GET    /api/twin/biological-age        # Biological age + trend
GET    /api/twin/trends                # All biomarker trends
GET    /api/twin/protocols             # Active interventions

# Twin History
GET    /api/twin/events                # Paginated event stream
GET    /api/twin/events/:id            # Single event detail
GET    /api/twin/commits               # Git commit log
GET    /api/twin/diff/:sha1/:sha2      # Diff between two states

# Twin Files (raw access)
GET    /api/twin/files/:path           # Read any Twin file
GET    /api/twin/search?q=...          # Semantic search across Twin

# Agents
GET    /api/agents                     # List all agents + current scores
GET    /api/agents/:name/assessment    # Latest assessment
GET    /api/agents/:name/proposals     # Current pending proposals
POST   /api/agents/:name/chat         # Send message to agent
GET    /api/agents/:name/reasoning     # Reasoning history

# Consensus
GET    /api/consensus/latest           # Most recent consensus round
GET    /api/consensus/history          # Paginated consensus history
GET    /api/consensus/:id              # Full consensus round detail

# Recommendations
GET    /api/recommendations/today      # Today's daily plan
GET    /api/recommendations/active     # All active recommendations
POST   /api/recommendations/:id/done   # Mark as completed
POST   /api/recommendations/:id/skip   # Mark as skipped with reason
POST   /api/recommendations/:id/feedback  # Rate recommendation

# Data Ingestion
POST   /api/ingest/lab-photo           # Upload lab result photo
POST   /api/ingest/lab-pdf             # Upload lab result PDF
POST   /api/ingest/manual              # Manual biomarker entry
POST   /api/ingest/fhir               # FHIR bundle import
GET    /api/ingest/status/:id          # Check processing status

# Export
GET    /api/export/twin                # Full Twin as .tar.gz (Git repo)
GET    /api/export/fhir                # Twin as FHIR Patient bundle
GET    /api/export/report/:type        # Generate clinical PDF report
```

#### WebSocket Channels

```
ws://api/ws/briefing       # Live morning briefing generation
ws://api/ws/consensus      # Real-time consensus round updates
ws://api/ws/agent/:name    # Streaming agent chat responses
ws://api/ws/ingest/:id     # Live lab processing status
```

### 10.2 FHIR Compatibility Layer

While the internal data model is Git + Markdown, the API includes a FHIR translation layer:

| Internal | FHIR Resource | Notes |
|----------|---------------|-------|
| `identity/profile.md` | Patient | Demographics mapping |
| `events/biomarkers/*` | Observation | Each marker = one Observation |
| `events/biomarkers/*` (grouped) | DiagnosticReport | Full blood panel = DiagnosticReport |
| `events/interventions/*` | MedicationStatement / CarePlan | Supplements, protocols |
| `recommendations/active.md` | Goal + CarePlan | AI recommendations as care goals |
| `state/snapshot.md` | Bundle of latest Observations | Convenience bundle |

---

## 11. Security, Privacy & Compliance

### 11.1 Data Ownership

- The user **owns** their Twin. Period.
- Full export available at any time (Git repo clone)
- Account deletion = Twin deletion (with 30-day grace period)
- No data is shared with third parties without explicit consent

### 11.2 Encryption

| Layer | Method |
|-------|--------|
| In transit | TLS 1.3 everywhere |
| At rest | AES-256 for all Twin repositories |
| Per-file | Age encryption on sensitive files (genetics, raw labs) |
| Backups | Encrypted, geographically redundant |

### 11.3 Access Control

- Twin access is single-user by default
- Optional: share read-only access with a clinician (time-limited, revocable)
- Optional: share anonymized data with research pools (opt-in, granular)
- Agent access is scoped — each agent can only read Twin files relevant to its domain

### 11.4 Compliance Targets

| Standard | Status | Notes |
|----------|--------|-------|
| GDPR | Required (Day 1) | Right to export, right to deletion, data minimization |
| HIPAA | Phase 2 | Required before clinician sharing or US health data integration |
| SOC 2 Type II | Phase 2 | Required before enterprise/clinic partnerships |
| ISO 27001 | Phase 3 | Nice-to-have for credibility |

### 11.5 AI Safety Guardrails

- Agents **never** diagnose. They interpret biomarkers against published reference ranges.
- Every recommendation includes a confidence level and links to source evidence.
- Hard-coded escalation: if any biomarker is in a clinically dangerous range, the system alerts the user to consult a physician immediately. Agents will not attempt to manage it.
- Agent outputs are logged and auditable. The reasoning chain for every recommendation is preserved in the Twin.
- No medical claims in any user-facing copy. The product is a wellness and optimization tool, not a medical device.

---

## 12. Technical Stack

### 12.1 Backend

| Component | Technology | Rationale |
|-----------|------------|-----------|
| API Server | **Hono** (Bun runtime) | Lightweight, fast, TypeScript-native |
| Twin Storage | **Git (libgit2)** + **Postgres** (metadata index) | Git for versioning, Postgres for fast queries |
| Vector Search (QMD) | **Qdrant** (self-hosted) | Open-source, performant, metadata filtering |
| Message Bus | **NATS JetStream** | Lightweight, persistent, perfect for agent messaging |
| Agent Runtime | **LLM API calls** (Claude / GPT) with structured output | Agents are prompt chains, not fine-tuned models (for now) |
| Embedding Model | **text-embedding-3-small** or **nomic-embed-text** (local) | For QMD semantic search |
| Background Jobs | **BullMQ** (Redis-backed) | Daily pipeline, lab processing, agent assessments |
| File Storage | **S3-compatible** (MinIO on Hetzner / R2) | Raw lab PDFs, photos, exports |

### 12.2 Frontend

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Web App | **Next.js 14** (App Router) | SSR + API routes + excellent DX |
| Mobile (iOS) | **SwiftUI** | HealthKit depth, native performance |
| Mobile (Android) | **Jetpack Compose** | Health Connect depth, native performance |
| Design System | **Custom** (Tailwind CSS base) | Dark theme, data-dense, monospace-forward |
| Charts | **D3.js** | Custom biomarker visualizations |
| Real-time | **Socket.io** or **Hono WebSocket** | Agent chat streaming, live updates |

### 12.3 Infrastructure

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Hosting | **Hetzner dedicated** (your existing infra) | Cost-effective, EU-based (GDPR), full control |
| Container Orchestration | **Docker Compose** → **K3s** at scale | Start simple, migrate when needed |
| CI/CD | **GitHub Actions** | Standard, free for open-source |
| Monitoring | **Grafana + Prometheus** | Self-hosted observability |
| Logging | **Loki** | Pairs with Grafana, lightweight |

### 12.4 Self-Hosted LLM Option

For maximum privacy, the agent runtime can use local models:

| Use Case | Model | Hardware |
|----------|-------|----------|
| Agent reasoning | **Llama 3.1 70B** (quantized) or **Mistral Large** | 2x A100 or 4x A6000 |
| Embeddings | **nomic-embed-text** | CPU-only, minimal |
| Lab OCR | **Llama 3.2 Vision 11B** | 1x A100 |
| Structured extraction | **Llama 3.1 8B** (fine-tuned for JSON) | 1x A6000 |

This keeps all health data on-premise. No external API calls needed.

---

## 13. Roadmap & Milestones

### Phase 1 — Foundation (Months 1-3)

**Goal**: Core Twin + single-agent reasoning. Prove the data model.

- [ ] Git-based Twin repository structure
- [ ] Markdown file schemas for all document types
- [ ] Event ingestion pipeline (manual entry + Oura API)
- [ ] QMD semantic search indexing
- [ ] Single "General Health" agent (all domains combined)
- [ ] Basic web dashboard (Twin viewer + agent chat)
- [ ] Lab upload with OCR (photo → structured data)

**Exit criteria**: A user can upload blood work, sync Oura, chat with an AI agent that references their Twin, and see a daily recommendation.

### Phase 2 — Agent Constellation (Months 3-5)

**Goal**: Split into specialized agents. Build consensus protocol.

- [ ] Split general agent into 5 domain agents + Orchestrator
- [ ] NATS message bus for agent communication
- [ ] Consensus protocol implementation (6-step cycle)
- [ ] Morning Briefing pipeline (daily automated run)
- [ ] Agent handoff protocol
- [ ] Mobile app (iOS) — Home screen + Agent Chat + Lab Upload
- [ ] Apple Health / HealthKit integration
- [ ] Conflict resolution logging and replay

**Exit criteria**: The system produces daily 3-priority briefings through multi-agent consensus, resolves at least one real conflict per week, and the user can chat with individual specialists.

### Phase 3 — Intelligence (Months 5-8)

**Goal**: Close the feedback loop. Make agents learn from outcomes.

- [ ] Recommendation tracking (done/skipped/outcome)
- [ ] Agent reflection cycle (evaluate past recommendations against biomarker changes)
- [ ] Simulation branches ("what-if" scenarios)
- [ ] Biological age computation (from multi-source aging clock data)
- [ ] Weekly review automation
- [ ] Android app
- [ ] CGM integration (Levels / Dexcom)
- [ ] Additional wearable integrations (Whoop, Garmin)

**Exit criteria**: Agents demonstrably improve their recommendations over time. Users see a measurable correlation between following recommendations and biomarker improvement.

### Phase 4 — Scale (Months 8-12)

**Goal**: B2B readiness. Clinician features. FHIR compliance.

- [ ] FHIR export layer (Patient bundles, DiagnosticReports)
- [ ] Clinician portal (read-only Twin access with patient consent)
- [ ] Clinical report generator (PDF)
- [ ] HIPAA compliance (if US market)
- [ ] Population-level insights (anonymized, opt-in)
- [ ] Longevity agent trajectory forecasting (experimental)
- [ ] API for third-party integrations
- [ ] Self-hosted LLM option for enterprise

**Exit criteria**: A longevity clinic can use the platform with their patients. FHIR data can be imported from and exported to any EHR system.

---

## Appendix A: Biomarker Schema Registry (Starter Set)

The schema registry (`meta/schema-registry.md`) defines every biomarker the system knows about. Agents reference this for optimal ranges and unit conversions.

### Metabolic Markers

| Marker | Unit | Standard Range | Optimal Range | Agent |
|--------|------|----------------|---------------|-------|
| Glucose (fasting) | mg/dL | 65–99 | 72–85 | Metabolic |
| HbA1c | % | 4.0–5.6 | 4.5–5.2 | Metabolic |
| Insulin (fasting) | µIU/mL | 2.6–24.9 | 2–6 | Metabolic |
| HOMA-IR | — | <2.5 | <1.0 | Metabolic |
| Triglycerides | mg/dL | <150 | <75 | Metabolic |
| ApoB | mg/dL | <130 | <70 | Metabolic |
| LDL-p | nmol/L | <1300 | <1000 | Metabolic |
| Total Cholesterol | mg/dL | <200 | context-dependent | Metabolic |
| HDL | mg/dL | >40 | >55 | Metabolic |
| TSH | mIU/L | 0.4–4.0 | 0.5–2.5 | Metabolic |
| Free T3 | pg/mL | 2.0–4.4 | 3.0–4.0 | Metabolic |
| Free T4 | ng/dL | 0.8–1.8 | 1.1–1.5 | Metabolic |

### Inflammation & Immune

| Marker | Unit | Standard Range | Optimal Range | Agent |
|--------|------|----------------|---------------|-------|
| hs-CRP | mg/L | <3.0 | <0.5 | Nutrition / Longevity |
| Homocysteine | µmol/L | <15 | <7 | Nutrition |
| ESR | mm/hr | 0–22 | <10 | Longevity |
| IL-6 | pg/mL | <7 | <2 | Longevity |
| TNF-alpha | pg/mL | <8.1 | <4 | Longevity |
| WBC | 10^3/µL | 4.5–11.0 | 4.5–7.0 | Longevity |

### Nutrients

| Marker | Unit | Standard Range | Optimal Range | Agent |
|--------|------|----------------|---------------|-------|
| Ferritin | ng/mL | 12–150 (F), 12–300 (M) | 40–100 | Nutrition |
| Vitamin D (25-OH) | ng/mL | 30–100 | 50–80 | Nutrition |
| Vitamin B12 | pg/mL | 200–900 | 500–800 | Nutrition |
| Folate | ng/mL | >3.0 | >15 | Nutrition |
| Magnesium (RBC) | mg/dL | 4.2–6.8 | 5.5–6.5 | Nutrition |
| Zinc | µg/dL | 60–120 | 90–110 | Nutrition |
| Omega-3 Index | % | >4% | 8–12% | Nutrition |

### Hormonal

| Marker | Unit | Standard Range | Optimal Range | Agent |
|--------|------|----------------|---------------|-------|
| Total Testosterone | ng/dL | 264–916 (M) | 600–900 (M) | Fitness |
| Free Testosterone | pg/mL | 8.7–25.1 (M) | 15–25 (M) | Fitness |
| SHBG | nmol/L | 10–57 (M) | 20–40 (M) | Fitness |
| DHEA-S | µg/dL | 80–560 | 200–400 | Recovery |
| Cortisol (AM) | µg/dL | 6.2–19.4 | 10–18 | Recovery |
| IGF-1 | ng/mL | 100–350 | 150–250 | Fitness / Longevity |

### Longevity Specific

| Marker | Unit | Standard Range | Optimal Range | Agent |
|--------|------|----------------|---------------|-------|
| Biological Age (epigenetic) | years | — | < chronological age | Longevity |
| DunedinPACE | years/year | — | <0.90 | Longevity |
| GrimAge acceleration | years | — | <0 | Longevity |
| Telomere length | kb | age-dependent | top quartile for age | Longevity |
| GlycanAge | years | — | < chronological age | Longevity |
| 8-OHdG (oxidative stress) | ng/mL | — | <8 | Longevity |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **Twin** | The Digital Twin — a user's complete, versioned health state stored as a Git repository |
| **Twin Score** | Composite health score (0–100) computed by the Orchestrator from all agent domain scores |
| **Agent** | A specialized AI reasoner focused on one health domain |
| **Orchestrator** | The coordination agent that manages consensus and produces the daily plan |
| **Consensus** | The process by which agents negotiate and agree on recommendations |
| **Event** | An immutable record of a health measurement, action, or decision |
| **Proposal** | A recommendation submitted by an agent for consensus review |
| **Protocol** | A multi-week intervention plan (e.g., "8-week Zone 2 training block") |
| **QMD** | Queryable Markdown — semantic search across the Twin's markdown files |
| **Briefing** | The daily morning plan delivered to the user (3 priorities) |
| **Handoff** | When one agent refers the user or a question to another agent |
| **Veto** | Recovery (safety) or Longevity (strategic) overriding another agent's proposal |

---

*This is a living document. Version 0.1. Last updated February 23, 2026.*
