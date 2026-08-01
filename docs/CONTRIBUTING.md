# Developer & Contribution Guidelines

> **Title**: SPPG Companion Repository Workflow & Contribution Guidelines  
> **Version**: 1.0.0  
> **Status**: APPROVED  
> **Author**: Lead Software Architect  
> **Reviewer**: Enterprise Engineering Team  
> **Created**: 2026-07-31  
> **Last Updated**: 2026-07-31  
> **Next Review**: 2026-08-30  

---

## 1. Repository & Branch Strategy

* **Primary Branch**: `main` (production-ready stable code).
* **Development Branch**: `develop` (integration branch for sprint features).
* **Feature Branches**: Named `feature/sprint-X.Y-short-description` (e.g. `feature/sprint-3b-event-bus`).
* **Bug Fix Branches**: Named `fix/issue-description`.

---

## 2. Sprint Workflow & Milestone Discipline

1. **Sprint Planning**: Align deliverables with [Master-Roadmap.md](file:///d:/cbi-project-src/BGN-Extension/docs/roadmap/Master-Roadmap.md).
2. **Architecture First**: If a sprint introduces new system components, draft an architecture document or ADR in `docs/adr/` before writing production code.
3. **Incremental Implementation**: Build modules modularly without introducing breaking changes to prior sprint features.
4. **Verification**: Execute `npm run build` (`vue-tsc --noEmit && vite build`) and confirm zero compiler errors.
5. **Sprint Report**: File a sprint report in `docs/reports/` using `Report-Template.md`.
6. **Milestone Index Update**: Update status in `docs/roadmap/Master-Milestone-Index.md`.

---

## 3. Code Review & Pull Request Checklist

Before submitting a Pull Request (PR):

- [ ] Code follows [Coding-Standards.md](file:///d:/cbi-project-src/BGN-Extension/docs/Coding-Standards.md).
- [ ] No `console.log` statements remain (use `Logger` service).
- [ ] TypeScript build passes cleanly (`npm run build`).
- [ ] No breaking changes to existing lifecycle events or telemetry models.
- [ ] JSDoc comments added for all public methods and interfaces.
- [ ] Documentation updated in `docs/` folder.
