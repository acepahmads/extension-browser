# Architectural Decision Records (ADR) Index

> **Architecture Governance Portal**  
> **Location**: `docs/adr/README.md`  

---

## 1. Purpose of Architectural Decision Records

Architectural Decision Records (ADRs) document significant technical and architectural choices made during the evolution of the **SPPG Companion Platform**. Each ADR captures the context, decision options, trade-offs, and consequences of key architectural choices to ensure long-term maintainability and alignment across sprints.

---

## 2. ADR Numbering Convention & Format

ADRs are stored in this directory (`docs/adr/`) following the strict naming format:

`ADR-XXXX-short-descriptive-title.md`

### Standard ADR Structure
- **Title**: `ADR-XXXX: Title of Decision`
- **Status**: `PROPOSED` | `ACCEPTED` | `REJECTED` | `DEPRECATED` | `SUPERSEDED`
- **Context**: Problem statement, constraints, and driving architectural requirements.
- **Decision**: The selected architectural approach or pattern.
- **Consequences**: Positive, negative, and neutral impacts of the decision.
- **Compliance**: How future sprints must implement and verify the decision.

---

## 3. ADR Index Registry

| ADR ID | Decision Title | Status | Sprint | Date | Superseded By |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **ADR-0001** | Chrome MV3 Extension Architecture & Technology Stack | `ACCEPTED` | Sprint 1 | 2026-07-30 | — |
| **ADR-0002** | Browser Lifecycle & Enterprise Activity Telemetry Model | `ACCEPTED` | Sprint 2.1 | 2026-07-31 | — |
| **ADR-0003** | Decoupled Hybrid Topic-Based Event Bus Architecture | `ACCEPTED` | Sprint 3A | 2026-07-31 | — |
| **ADR-0004** | V8 Generational Memory Strategy Over Object Pooling | `ACCEPTED` | Sprint 3A Rev | 2026-07-31 | — |

---

## 4. ADR Creation & Contribution Workflow

1. **Identify Decision Needs**: When a sprint requires architectural choices impacting multiple components or future roadmap milestones, draft a new ADR.
2. **Assign Next Sequence Number**: Assign the next sequential ID (`ADR-0005`, `ADR-0006`, etc.).
3. **Submit for Architectural Review**: Review decision trade-offs with the Lead Architect before locking.
4. **Update ADR Index**: Append the accepted record to this index table.
