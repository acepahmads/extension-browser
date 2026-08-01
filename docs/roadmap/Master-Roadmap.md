# Master Product & Engineering Roadmap
## SPPG Companion Platform

> **Title**: SPPG Companion Master Roadmap  
> **Version**: v0.5.0  
> **Status**: BASELINE  
> **Subtitle**: Production Hardening Complete  
> **Git Baseline**: v0.5.0  
> **Author**: Lead Software Architect  
> **Reviewer**: Enterprise Architecture Board  
> **Created**: 2026-07-31  
> **Last Updated**: 2026-08-02  

---

## 1. Overview & Strategy

The **SPPG Companion Platform** roadmap outlines a phased execution strategy to evolve the browser extension from a base configuration preview into an enterprise-grade developer companion equipped with real-time network interception, discovery automation, traffic replay, and AI telemetry analysis.

---

## 2. Sprint Roadmap Breakdown

### M00: Project Vision & Platform Scope
- **Objective**: Establish the core product vision, technology stack, and architectural guidelines.
- **Deliverables**: Technology stack selection (Vue 3, TypeScript, Vite, TailwindCSS, Pinia), Manifest V3 setup.
- **Status**: `COMPLETED` (100%)

---

### Sprint 1: Extension Foundation & Base Configuration Layer
- **Objective**: Build Chrome Extension Manifest V3 core structure, build pipeline, UI layout, and storage adapter.
- **Deliverables**: Manifest V3, Storage Adapter (`chrome.storage.local` + `localStorage` fallback), Options/Popup UI frame.
- **Status**: `COMPLETED` (100%)

---

### Sprint 2: Browser Lifecycle Engine & Activity Center
- **Objective**: Monitor browser events in real-time and provide a developer activity console.
- **Deliverables**: `BrowserLifecycleService`, `TabService`, `NavigationService`, `WindowService`, `ActivityStore`, Activity Center UI.
- **Status**: `COMPLETED` (100%)

---

### Sprint 2.1: Engine Completion & Enterprise Event Model Refinement
- **Objective**: Achieve 100% lifecycle event coverage and refine the event payload schema without structural refactoring.
- **Deliverables**: 24 complete lifecycle events, `sequence`, `sessionId`, `correlationId`, `source`, `severity`, `duration`, Logger success/silent modes, Diagnostics Center 6-component suite, Health Score (0-100%).
- **Status**: `COMPLETED` (100%)

---

### Sprint 3A: Enterprise Event Bus Architecture Design & Revision
- **Objective**: Design a high-performance, decoupled event bus architecture to serve as the communication backbone.
- **Deliverables**: Software Architecture Document (SAD), Revision Addendum, Event Envelope v1.0 design, Topic Taxonomy, Schema Registry design, Validator design, Replay Hook design.
- **Status**: `COMPLETED` (100%)

---

### Sprint 3B: Business Execution Framework & Cutover
- **Objective**: Implement Event Bus Core (Phase 1), Pipeline/Metrics (Phase 2), Subscriber Layer (Phase 3), and Business Execution Framework (Phase 4).
- **Deliverables**: `EventBusCore`, `SubscriberRegistry`, `BusinessDispatcher`, `BusinessRegistry`, domain handlers (`Workspace`, `Storage`, `Lifecycle`), Shadow Validation, Business-Only Cutover.
- **Status**: `COMPLETED` (100%)

---

### Sprint 4 (Phase 5): Production Hardening Suite
- **Badge**: `BASELINE`
- **Subtitle**: Production Hardening Complete
- **Git Baseline**: `v0.5.0`
- **Phase Completion**: `100%` (4 / 4 Completed)
- **Status**: `BASELINE`
- **Work Packages**:
  - ✅ **WP-5.1**: Performance Benchmark Framework (`src/core/performance/`) — `COMPLETED` (100%)
  - ✅ **WP-5.2**: Reliability & Fault Tolerance Framework (`src/core/reliability/`) — `COMPLETED` (100%)
  - ✅ **WP-5.3**: Observability & Metrics Platform (`src/core/observability/`) — `COMPLETED` (100%)
  - ✅ **WP-5.4**: Production Integration Layer & Runtime Wiring (`src/core/integration/`) — `COMPLETED` (100%)

---

### Sprint 5 (Phase 6): Release Engineering & CI/CD Pipeline
- **Status**: `PLANNED`
- **Phase Completion**: `0%` (0 / 5 Completed)
- **Work Packages**:
  - 📋 **WP-6.1**: Recovery & Resilience Hooks (Automated recovery & worker restart resilience) — `PLANNED` (0%)
  - 📋 **WP-6.2**: Production Build Certification (Artifact signing & release verification) — `PLANNED` (0%)
  - 📋 **WP-6.3**: CI/CD Build Matrix Automation — `PLANNED` (0%)
  - 📋 **WP-6.4**: End-to-End Automated Regression Suite — `PLANNED` (0%)
  - 📋 **WP-6.5**: MV3 Extension Release Packaging & Web Store Submission — `PLANNED` (0%)

---

### Sprint 6: Storage Engine & Persistence Adapter
- **Objective**: Provide high-capacity persistent event storage and historical log querying.
- **Deliverables**: IndexedDB adapter, high-performance query service, cache eviction policies.
- **Status**: `PLANNED` (0%)

---

### Sprint 7: Developer Console & Inspection Suite
- **Objective**: Build an advanced developer console for network inspection, lifecycle filtering, and telemetry debugging.
- **Status**: `PLANNED` (0%)

---

### Sprint 8: Discovery Engine & Auto-Telemetry
- **Objective**: Automatically discover API endpoints, route patterns, and target application behaviors.
- **Status**: `PLANNED` (0%)

---

### Sprint 9: Endpoint Registry & API Contract Catalog
- **Objective**: Maintain a centralized catalog of discovered endpoints, request parameters, and response contracts.
- **Status**: `PLANNED` (0%)

---

### Sprint 10: Mapping Engine & Schema Inspector
- **Objective**: Map frontend telemetry data models to backend API schemas visually and algorithmically.
- **Status**: `PLANNED` (0%)

---

### Sprint 11: Replay & Export Engine
- **Objective**: Capture, export (HAR/JSON), and replay session traffic for debugging and regression testing.
- **Status**: `PLANNED` (0%)

---

### Sprint 12: AI Analyzer Engine & Anomaly Detection
- **Objective**: Tap into the Event Bus wildcard stream to detect security anomalies, performance bottlenecks, and user friction patterns automatically.
- **Status**: `PLANNED` (0%)
