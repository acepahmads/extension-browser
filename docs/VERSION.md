# Platform Version Specification

> **Title**: SPPG Companion Platform Version Matrix  
> **Version**: 1.0.0  
> **Status**: APPROVED  
> **Author**: Lead Software Architect  
> **Reviewer**: Enterprise Architecture Board  
> **Created**: 2026-07-31  
> **Last Updated**: 2026-07-31  
> **Next Review**: 2026-08-30  

---

## Current Release Metrics

| Property | Value | Description |
| :--- | :--- | :--- |
| **Platform Version** | `1.1.0` | Semantic version string |
| **Current Sprint** | `Sprint D1.5 (Documentation Portal Synchronization Engine)` | Active sprint scope |
| **Current Milestone** | `M11 / M12` | Milestone registry ID |
| **Current Build** | `20260731.3` | Automated build stamp |
| **Release Channel** | `Development / Alpha` | Pre-release release track |
| **Semantic Version** | `1.1.0` | Major.Minor.Patch |
| **Architecture Version** | `v3.1` | Event-Driven Bus Architecture |
| **Documentation Version** | `v1.0 Final` | Dynamic Metadata Portal Engine |
| **Minimum Browser Version** | `Chrome 116+ / Edge 116+` | MV3 Service Worker requirement |
| **Platform Status** | `STABLE` | Verified 0-error build state |

---

## Versioning Policy

The platform enforces **Semantic Versioning 2.0.0** (`MAJOR.MINOR.PATCH`):
- **MAJOR**: Incompatible architectural breaking changes or major framework migration.
- **MINOR**: Backward-compatible new features or new engine modules (e.g. Network Interceptor, Event Bus).
- **PATCH**: Backward-compatible bug fixes, minor performance tweaks, or documentation updates.
