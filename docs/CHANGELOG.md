# Platform Change Log

> **Title**: SPPG Companion Platform Change Log  
> **Version**: 1.0.0  
> **Status**: APPROVED  
> **Author**: Lead Software Architect  
> **Reviewer**: Enterprise Architecture Board  
> **Created**: 2026-07-31  
> **Last Updated**: 2026-07-31  
> **Next Review**: 2026-08-30  

All notable changes to the SPPG Companion Platform (`BGN-Extension`) will be documented in this file. The project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-07-31

### Milestone M07: Sprint 3B Phase 3 — Event Bus Subscriber Layer
#### Added
- `SubscriberRegistry` managing subscriber module lifecycles (`src/core/event-bus/subscribers/subscriber.registry.ts`).
- `AnalyticsSubscriber` handling UI telemetry topics (`popup.connected`, `options.opened`, `options.closed`).
- `MetricsSubscriber` observing EventBus traffic on `'**'` wildcard with $O(1)$ in-memory counter aggregation.
- `WorkspaceSubscriber` maintaining in-memory workspace cache (`workspace.changed`, `content.connected`).
- `StorageSubscriber` observing storage changes (`storage.changed`).
- `LifecycleSubscriber` tracking active window focus, tab topology, and exponential moving average navigation load durations (`browser.window.*`, `browser.tab.*`, `browser.navigation.*`).
- Feature flag gating via `subscribeEnabled` in `EventBusFacade`.

### Milestone M07.1: Sprint 3B Phase 4 — Business Execution Framework
#### Added
- `BusinessSubscriber`, `BusinessDispatcher`, `BusinessRegistry`, `BusinessHandler`, `BusinessExecutionContext`, `BusinessResult`, and `BusinessError` under `src/core/business-framework/`.
- 3-attempt exponential backoff retry engine ($100\text{ms} \rightarrow 300\text{ms} \rightarrow 900\text{ms}$) with Dead Letter Queue (DLQ) routing.
- `WorkspaceBusinessHandler` validating `workspace.*` domain topics.
- `StorageBusinessHandler` validating `storage.*` domain topics and duplicate key detection.
- Temporary runtime pipeline trace logging in development mode (`[BusinessSubscriber][Trace]`, `[BusinessDispatcher][Trace]`).

---

## [1.1.0] - 2026-07-31

### Milestone M11: Sprint D1.5 — Documentation Portal Synchronization Engine
#### Added
- `MetadataEngine` (`docs-portal/src/services/metadata-engine.ts`) scanning `/docs` Markdown files automatically.
- Dynamic reports, milestones, roadmap, and search index generation eliminating hardcoded store registries.
- Automatic discovery of newly generated Markdown reports (e.g. `Sprint 3B Phase 2 Report`).
- Documentation Portal reaches Version 1.0 Final.

### Milestone M12: Sprint 3B Phase 2 — Middleware Pipeline, Validation & Metrics
#### Added
- `MiddlewarePipeline` runner supporting `use()`, `execute()`, context parameter passing, metadata, and cancellation (`ctx.cancel()`).
- `SchemaRegistry` & `EventValidator` verifying envelope integrity and required payload schema fields.
- `PriorityDispatcher` multi-tier priority queue supporting `LOW` (0), `NORMAL` (1), `HIGH` (2), and `CRITICAL` (3) priorities.
- `MetricsCollector` tracking publish, subscribe, dispatch, dropped events, and processing latency.
- `DeadLetterQueue` (DLQ) and `ErrorHandler` resilience engine.
- Automated unit test suite `event-bus-phase2.spec.ts` (5/5 tests passed).

### Milestone M05.1: Sprint D0 — Engineering Documentation Foundation
#### Added
- Directory structure: `docs/roadmap/`, `docs/milestones/`, `docs/architecture/`, `docs/adr/`, `docs/reports/`, `docs/api/`, `docs/diagrams/`, `docs/assets/`.
- `Master-Roadmap.md`, `Master-Milestone-Index.md`, `Report-Template.md`, and milestone completion records (M00 through M06).

### Milestone M06: Sprint 3B Phase 1 — Event Bus Core Foundation
#### Added
- `BusEventEnvelope<T>` schema featuring `id`, `version: "1.0"`, `sequence`, `sessionId`, `correlationId`, `timestamp`, `topic`, `source`, `severity`, and `payload`.
- `EventCategory` enum supporting 10 domain namespaces (`system`, `lifecycle`, `workspace`, `navigation`, `storage`, `network`, `diagnostics`, `developer`, `user`, `ai`).
- Singleton `EventBusCore` engine providing `publish()`, `subscribe()`, `once()`, `unsubscribe()`, and `broadcast()`.
- Wildcard topic pattern matcher supporting exact match, single-segment wildcard (`*`), and multi-segment wildcard (`**`).
- Automated unit verification test suite `event-bus.spec.ts`.

---

## [0.5.0] - 2026-07-31

### Milestone M05: Sprint 3A Revision — Event Bus Architecture Refinement
#### Added
- Event envelope versioning requirement (`version: "1.0"`).
- Schema Registry design and `EventValidator` pipeline component position.
- Event Bus Metrics Collector specification tracking `published`, `consumed`, `failed`, `retried`, `dropped`, `queueDepth`, and latency.
- `IReplayHook` extension point definition for Sprint 10 Replay Engine.

#### Changed
- Removed Object Pooling recommendation in favor of V8 Generational Garbage Collection optimization.
- Deferred Circuit Breaker orchestration to Sprint 12 (Backend Synchronization).
- Re-classified performance target (5,000 events/sec) as a post-implementation Design Objective benchmark.

---

## [0.4.0] - 2026-07-31

### Milestone M04: Sprint 3A — Enterprise Event Bus Architecture Design
#### Added
- Software Architecture Document (SAD) for Event Bus backbone.
- Priority Dispatcher Queue (`CRITICAL`, `NORMAL`, `LOW`), Middleware Pipeline, and Dead Letter Queue (DLQ) specifications.

---

## [0.3.0] - 2026-07-31

### Milestone M03: Sprint 2.1 — Engine Completion & Enterprise Event Model
#### Added
- Complete 24 browser lifecycle event triggers.
- Enriched `ActivityEvent` model with `sequence`, `sessionId`, `correlationId`, `source`, `severity`, and `duration` (ms).
- `Logger.success()` log level and Production Silent Mode.
- Diagnostics Center 6-component suite and Health Score (0–100%) indicator (`Excellent`, `Good`, `Warning`, `Critical`).

---

## [0.2.0] - 2026-07-30

### Milestone M02: Sprint 2 — Browser Lifecycle Engine & Activity Center
#### Added
- `BrowserLifecycleService`, `TabService`, `NavigationService`, `WindowService`.
- Bounded 500-event FIFO buffer in Pinia `useActivityStore`.
- `ActivityCenterPage.vue` developer console view.

---

## [0.1.0] - 2026-07-30

### Milestone M01: Sprint 1 — Extension Foundation & Base Configuration Layer
#### Added
- Chrome Extension Manifest V3 configuration.
- `StorageService` (`chrome.storage.local` with `localStorage` fallback).
- Options and Popup UI templates with TailwindCSS styling.
- `Workspace` interface and Configuration Service layer.

---

## [0.0.0] - 2026-07-30

### Milestone M00: Project Vision & Strategy Scope
#### Added
- Platform technology stack definition (Vue 3, TypeScript, Vite, TailwindCSS, Pinia).
- Multi-sprint project execution strategy roadmap.
