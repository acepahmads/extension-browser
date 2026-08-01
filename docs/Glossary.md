# Platform Architecture Glossary

> **Title**: SPPG Companion Architectural Terminology Glossary  
> **Version**: 1.0.0  
> **Status**: APPROVED  
> **Author**: Principal Software Architect  
> **Reviewer**: Enterprise Architecture Board  
> **Created**: 2026-07-31  
> **Last Updated**: 2026-07-31  
> **Next Review**: 2026-08-30  

---

## Terminology Definitions

### W
* **Workspace**: A target web application domain configuration (e.g. BGN Simulator, SIPGN Portal) matched by URL patterns to contextualize telemetry events.

### A
* **Activity**: A recorded telemetry event representing user, browser, or system actions within the platform.
* **AI Analyzer Engine**: Future module (Sprint 11) tapping into the Event Bus stream to perform dynamic pattern matching and security anomaly detection.

### L
* **Lifecycle**: The lifecycle state transitions of the browser, extension background worker, windows, tabs, and navigation streams.

### S
* **Session**: A continuous execution period of the browser session identified by a unique `sessionId` (`SESSION-YYYYMMDD-XXX`). Resets on browser restart.
* **Storage Engine**: Enterprise persistence layer (Sprint 5) leveraging IndexedDB and `chrome.storage.local`.

### C
* **Correlation ID**: A tracking identifier (`CID-XXXXXX`) linking related user/navigation events across multiple asynchronous execution steps.

### E
* **Envelope**: The standard outer metadata wrapper (`BusEventEnvelope<T>`) enclosing event ID, version (`"1.0"`), sequence, session ID, correlation ID, timestamp, topic, source, severity, and payload.

### T
* **Topic**: A hierarchical dot-notation address (e.g. `system.lifecycle.started`) defining the channel for event routing.

### P
* **Publisher**: An entity or service that emits event envelopes onto the Event Bus.
* **Priority Queue**: Multi-tier execution queue (`CRITICAL`, `NORMAL`, `LOW`) preventing low-priority background tasks from delaying UI execution.

### M
* **Middleware**: Interceptor functions executed sequentially in the Event Bus processing pipeline before events reach subscriber handlers.

### D
* **Dispatcher**: Core component responsible for resolving topic subscribers and queuing handler execution.
* **Diagnostics**: Telemetry evaluation suite testing Chrome APIs, storage, workspace resolver, and IPC IPC health.
* **Dead Letter Queue (DLQ)**: Fault-tolerant storage buffer for unhandled or repeatedly failing event payloads.
* **Developer Console**: Developer UI for real-time activity stream inspection and diagnostics testing.

### R
* **Replay Engine**: Future traffic recording and HAR replay module (Sprint 10) tapping into the Event Bus via `IReplayHook`.

### H
* **Health Score**: A composite metric (0–100%) indicating overall browser extension system integrity, categorized into `Excellent`, `Good`, `Warning`, and `Critical`.

### N
* **Network Interceptor**: Future module (Sprint 4) capturing XHR and Fetch HTTP requests/responses non-intrusively.

### T
* **Trie Router**: A Radix/Trie matching data structure used for high-performance $O(K)$ wildcard topic resolution (`workspace.*`, `**`).
