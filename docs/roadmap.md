# SPPG Companion Platform Roadmap

## Sprint 5 — Release Engineering & Distribution Lifecycle

### Completed Work Packages
- ✅ **WP-6.1: CI/CD Pipeline & Build Automation**
  - Continuous Integration matrix (Type Check, Vite Build, Bundling, Asset Checks).
  - GitHub Actions workflow (`ci-cd-pipeline.yml`).
  - Automated extension packaging (`dist-release/extension.zip`).

- ✅ **WP-6.2: Production Certification & Release Management**
  - SemVer 2.0.0 Manager (`version-manager.ts`).
  - Release Channel Manager (`channel-manager.ts`: `dev`, `alpha`, `beta`, `rc`, `ga`).
  - Release Metadata Engine (`release-metadata.ts`).
  - Checksum Generator (`checksum-generator.ts`: SHA-256 & SHA-512 sidecars).
  - Release Manifest Generator (`release-manifest.ts`).
  - Certification Engine (`certification-engine.ts`: 8-point quality checklist).
  - Rollback Manager (`rollback-manager.ts`: multi-target rollback engine).

- ✅ **WP-6.3: Distribution Packaging & Store Readiness**
  - Store Readiness & Package Profile Validator (`distribution-validator.ts`).
  - Asset Verification Engine (`asset-validator.ts`: 7 PNG icon sizes, promo banners).
  - Compatibility Validator (`compatibility-validator.ts`: Chrome 102+, MV3, Edge Store).
  - Store Metadata Generator (`metadata-generator.ts`: `store-metadata.json`).
  - 10-Point Distribution Checklist (`distribution-checklist.ts`).
  - Distribution Reports (`distribution-report.ts`).

---

### Remaining Work Packages
- ⬜ **WP-6.4: Security, Signing & Supply Chain Integrity**
  - Software Bill of Materials (SBOM) generation (SPDX / CycloneDX).
  - Dependency vulnerability scanning (Audit & Snyk/Trivy).
  - Code signing and signature verification (`.crx` / Web Store key management).

- ⬜ **WP-6.5: Release Candidate & GA Launch**
  - Final Release Candidate sign-off (`v1.0.0-rc.1` to `v1.0.0`).
  - Automated Chrome Web Store API deployment.
  - Enterprise Group Policy deployment instructions.
