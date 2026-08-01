# Master Product & Engineering Roadmap
## SPPG Companion Platform

> **Title**: SPPG Companion Master Roadmap  
> **Version**: 1.0.0  
> **Status**: APPROVED  
> **Author**: Lead Software Architect  
> **Reviewer**: Enterprise Architecture Board  
> **Created**: 2026-07-31  
> **Last Updated**: 2026-07-31  
> **Next Review**: 2026-08-30  

---

## 1. Overview & Strategy

The **SPPG Companion Platform** roadmap outlines a phased execution strategy to evolve the browser extension from a base configuration preview into an enterprise-grade developer companion equipped with real-time network interception, discovery automation, traffic replay, and AI telemetry analysis.

---

## 2. Sprint Roadmap Breakdown

### M00: Project Vision & Platform Scope
- **Objective**: Establish the core product vision, technology stack, and architectural guidelines.
- **Deliverables**: Technology stack selection (Vue 3, TypeScript, Vite, TailwindCSS, Pinia), Manifest V3 setup.
- **Dependencies**: None.
- **Status**: `COMPLETED`

---

### Sprint 1: Extension Foundation & Base Configuration Layer
- **Objective**: Build Chrome Extension Manifest V3 core structure, build pipeline, UI layout, and storage adapter.
- **Deliverables**: Manifest V3, Storage Adapter (`chrome.storage.local` + `localStorage` fallback), Options/Popup UI frame.
- **Dependencies**: M00.
- **Status**: `COMPLETED`

---

### Sprint 2: Browser Lifecycle Engine & Activity Center
- **Objective**: Monitor browser events in real-time and provide a developer activity console.
- **Deliverables**: `BrowserLifecycleService`, `TabService`, `NavigationService`, `WindowService`, `ActivityStore`, Activity Center UI.
- **Dependencies**: Sprint 1.
- **Status**: `COMPLETED`

---

### Sprint 2.1: Engine Completion & Enterprise Event Model Refinement
- **Objective**: Achieve 100% lifecycle event coverage and refine the event payload schema without structural refactoring.
- **Deliverables**: 24 complete lifecycle events, `sequence`, `sessionId`, `correlationId`, `source`, `severity`, `duration`, Logger success/silent modes, Diagnostics Center 6-component suite, Health Score (0-100%).
- **Dependencies**: Sprint 2.
- **Status**: `COMPLETED`

---

### Sprint 3A: Enterprise Event Bus Architecture Design & Revision
- **Objective**: Design a high-performance, decoupled event bus architecture to serve as the communication backbone for Sprints 4–12.
- **Deliverables**: Software Architecture Document (SAD), Revision Addendum, Event Envelope v1.0 design, Topic Taxonomy, Schema Registry design, Validator design, Replay Hook design.
- **Dependencies**: Sprint 2.1.
- **Status**: `COMPLETED`

---

### Sprint 3B: Enterprise Event Bus Implementation
- **Objective**: Implement the Event Bus in 3 distinct incremental phases.
  - **Phase 1 (Core Foundation)**: Event Envelope, `publish()`, `subscribe()`, `once()`, `unsubscribe()`, `broadcast()`, topic model. [`COMPLETED`]
  - **Phase 2 (Pipeline, Resilience & Metrics)**: Event Validator, Middlewares, Priority Dispatcher, Trie Router, Metrics Collector, Dead Letter Queue (DLQ). [`NEXT SPRINT`]
  - **Phase 3 (IPC Bridges & Integration)**: Service Worker <-> UI IPC proxies and system wiring. [`PLANNED`]
- **Dependencies**: Sprint 3A.
- **Status**: `IN PROGRESS`

---

### Sprint D0: Engineering Documentation Foundation
- **Objective**: Establish permanent engineering documentation repository layout and master registers.
- **Deliverables**: `Master-Roadmap.md`, `Master-Milestone-Index.md`, `Report-Template.md`, milestone completion records (M00 to M06).
- **Dependencies**: Sprint 3B Phase 1.
- **Status**: `COMPLETED`

---

### Sprint D0.1: Documentation Governance & Standards
- **Objective**: Establish enterprise governance standards across all repository documentation.
- **Deliverables**: `CHANGELOG.md`, `VERSION.md`, `Glossary.md`, `Coding-Standards.md`, `CONTRIBUTING.md`, `CONTEXT.md`.
- **Dependencies**: Sprint D0.
- **Status**: `COMPLETED`

---

### Sprint 4: Network Interceptor Engine
- **Objective**: Intercept XHR and Fetch HTTP traffic non-intrusively and stream network telemetry to the Event Bus.
- **Deliverables**: Network Interceptor module, Request/Response telemetry schemas, Correlation ID linking to navigation.
- **Dependencies**: Sprint 3B.
- **Status**: `PLANNED`

---

### Sprint 5: Storage Engine & Persistence Adapter
- **Objective**: Provide high-capacity persistent event storage and historical log querying.
- **Deliverables**: IndexedDB adapter, high-performance query service, cache eviction policies.
- **Dependencies**: Sprint 4.
- **Status**: `PLANNED`

---

### Sprint 6: Developer Console & Inspection Suite
- **Objective**: Build an advanced developer console for network inspection, lifecycle filtering, and telemetry debugging.
- **Deliverables**: Network Inspector UI, advanced filter panels, state inspection tools.
- **Dependencies**: Sprint 5.
- **Status**: `PLANNED`

---

### Sprint 7: Discovery Engine & Auto-Telemetry
- **Objective**: Automatically discover API endpoints, route patterns, and target application behaviors.
- **Deliverables**: Auto-discovery module, route pattern extractor.
- **Dependencies**: Sprint 6.
- **Status**: `PLANNED`

---

### Sprint 8: Endpoint Registry & API Contract Catalog
- **Objective**: Maintain a centralized catalog of discovered endpoints, request parameters, and response contracts.
- **Deliverables**: Endpoint Registry UI & Service, contract schema validator.
- **Dependencies**: Sprint 7.
- **Status**: `PLANNED`

---

### Sprint 9: Mapping Engine & Schema Inspector
- **Objective**: Map frontend telemetry data models to backend API schemas visually and algorithmically.
- **Deliverables**: Visual schema mapper, field transformation inspector.
- **Dependencies**: Sprint 8.
- **Status**: `PLANNED`

---

### Sprint 10: Replay & Export Engine
- **Objective**: Capture, export (HAR/JSON), and replay session traffic for debugging and regression testing.
- **Deliverables**: Traffic recorder, HAR Exporter, Replay Engine using Replay Hook interface.
- **Dependencies**: Sprint 9.
- **Status**: `PLANNED`

---

### Sprint 11: AI Analyzer Engine & Anomaly Detection
- **Objective**: Tap into the Event Bus wildcard stream to detect security anomalies, performance bottlenecks, and user friction patterns automatically.
- **Deliverables**: AI Telemetry Tap, Anomaly Detector, Insight Generator.
- **Dependencies**: Sprint 10.
- **Status**: `PLANNED`

---

### Sprint 12: Backend Synchronization & Enterprise Gateway
- **Objective**: Synchronize local telemetry, API catalogs, and AI insights with enterprise central management backends.
- **Deliverables**: Enterprise Gateway sync engine, Circuit Breaker fault tolerance, multi-tenant auth.
- **Dependencies**: Sprint 11.
- **Status**: `PLANNED`
