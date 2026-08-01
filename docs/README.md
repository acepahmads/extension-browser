# SPPG Companion Platform — Engineering Documentation Portal

> **Title**: SPPG Companion Engineering Documentation Gateway  
> **Version**: 1.0.0  
> **Status**: APPROVED  
> **Author**: Lead Software Architect  
> **Reviewer**: Enterprise Architecture Board  
> **Created**: 2026-07-31  
> **Last Updated**: 2026-07-31  
> **Next Review**: 2026-08-30  

---

## 1. Project Overview

The **SPPG Companion** (`BGN-Extension`) is an enterprise-grade Chrome extension built on **Manifest V3** with Vue 3, TypeScript, Pinia, and Vite. It serves as a real-time developer companion, telemetry observer, and event bus backbone for monitoring, workspace matching, diagnostic analysis, and future AI-driven insights across enterprise web applications.

---

## 2. Documentation Directory Structure

```
docs/
├── README.md                      # Documentation Home & Gateway (This file)
├── CONTEXT.md                     # Real-Time Project Execution Context
├── CHANGELOG.md                   # Semantic Version Change Log
├── VERSION.md                     # Platform Release Version Matrix
├── Glossary.md                    # Platform Terminology & Concept Definitions
├── Coding-Standards.md            # TypeScript, Vue 3, & SOLID Guidelines
├── CONTRIBUTING.md                # Repository Workflow & Contribution Policy
├── roadmap/
│   ├── Master-Roadmap.md          # Comprehensive Sprint & Feature Roadmap
│   └── Master-Milestone-Index.md  # Executive Milestone Dashboard & Progress Index
├── milestones/                    # Sprint & Milestone Completion Documents
│   ├── M00-Project-Vision.md
│   ├── M01-Sprint1-Foundation.md
│   ├── M02-Sprint2-Browser-Lifecycle.md
│   ├── M03-Sprint2.1-Engine-Completion.md
│   ├── M04-Sprint3A-Architecture.md
│   ├── M05-Sprint3A-Revision.md
│   └── M06-Sprint3B-Phase1.md
├── architecture/                  # Software Architecture Documents (SAD)
├── adr/
│   └── README.md                  # Architecture Decision Record (ADR) Index & Policy
├── reports/
│   └── Report-Template.md         # Standardized Sprint Completion Report Template
├── api/                           # Public APIs & Schema Documentation
├── diagrams/                      # System Architecture & Flow Diagrams
└── assets/                        # Visual Media, Screenshots, & Artifacts
```

---

## 3. Quick Navigation Links

| Section | Document Link | Description |
| :--- | :--- | :--- |
| **Active Context** | [CONTEXT.md](file:///d:/cbi-project-src/BGN-Extension/docs/CONTEXT.md) | Real-time project execution state & active focus |
| **Change Log** | [CHANGELOG.md](file:///d:/cbi-project-src/BGN-Extension/docs/CHANGELOG.md) | Release history and sprint change logs |
| **Version Matrix** | [VERSION.md](file:///d:/cbi-project-src/BGN-Extension/docs/VERSION.md) | Platform semantic versioning metrics |
| **Glossary** | [Glossary.md](file:///d:/cbi-project-src/BGN-Extension/docs/Glossary.md) | Platform domain terms and concept definitions |
| **Coding Standards** | [Coding-Standards.md](file:///d:/cbi-project-src/BGN-Extension/docs/Coding-Standards.md) | TypeScript, Vue 3, SOLID, and logging rules |
| **Contributing** | [CONTRIBUTING.md](file:///d:/cbi-project-src/BGN-Extension/docs/CONTRIBUTING.md) | Git workflow, PR checklist, and contribution rules |
| **Master Roadmap** | [Master-Roadmap.md](file:///d:/cbi-project-src/BGN-Extension/docs/roadmap/Master-Roadmap.md) | Full 12-Sprint project strategy and feature delivery timeline |
| **Milestone Index** | [Master-Milestone-Index.md](file:///d:/cbi-project-src/BGN-Extension/docs/roadmap/Master-Milestone-Index.md) | Executive status dashboard for all platform milestones |
| **Milestones** | [Milestones Index](file:///d:/cbi-project-src/BGN-Extension/docs/milestones/) | Sprint completion records from M00 to current milestone |
| **ADR Index** | [ADR Gateway](file:///d:/cbi-project-src/BGN-Extension/docs/adr/README.md) | Architectural Decision Records & governance guidelines |
| **Report Template** | [Report-Template.md](file:///d:/cbi-project-src/BGN-Extension/docs/reports/Report-Template.md) | Reusable sprint completion report template |

---

## 4. Platform Architecture Evolution

The platform follows an **Event-Driven Micro-Kernel Extension Architecture**:

```
Foundation (Sprint 1)
   ↓
Browser Lifecycle Engine & Activity Center (Sprint 2)
   ↓
Activity Engine Completion & Event Model Refinement (Sprint 2.1)
   ↓
Workspace Engine & Resolver (Sprint 2.1)
   ↓
Enterprise Event Bus Architecture (Sprint 3A & 3B)  <-- CURRENT
   ↓
Network Interceptor Engine (Sprint 4)
   ↓
Storage Engine & Persistence Adapter (Sprint 5)
   ↓
Traffic Replay & Export Engine (Sprint 10)
   ↓
AI Analyzer Engine (Sprint 11)
   ↓
Backend Synchronization & Enterprise Gateway (Sprint 12)
```

---

## 5. Contribution & Documentation Workflow

To maintain documentation integrity across sprints:
1. **Never delete historical milestone records**: All documents in `docs/milestones/` are permanent.
2. **Reuse Report Templates**: Use [Report-Template.md](file:///d:/cbi-project-src/BGN-Extension/docs/reports/Report-Template.md) when generating new sprint reports.
3. **Log Architectural Decisions**: Register structural or technical design changes in `docs/adr/` following the ADR numbering convention.
4. **Update Master Milestone Index**: Append sprint status updates to `docs/roadmap/Master-Milestone-Index.md` upon completion.
